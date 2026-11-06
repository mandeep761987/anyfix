/**
 * ANYFIX — Booking Backend V2 (Booking.gs)
 * Production-ready Apps Script implementation for Booking Creation & Status Tracking.
 *
 * Source of Truth:
 * - PRICE_LIST (Read-only): Brand, Model, Service, Part Grade, Price, Warranty, Repair Time
 * - BOOKINGS (Write-only): Exact 14-column layout (A to N)
 * - BOOKING_STATUS: Timeline logs for every booking status change
 */

/**
 * 1. Sequential Booking ID Generation from BOOKINGS Sheet
 * Format: AFX-YYYYMMDD-0001
 * Source of Truth: BOOKINGS sheet Column A.
 *
 * Rules:
 * - Same day -> increment sequence.
 * - New day -> reset to 0001.
 * - Format: AFX-YYYYMMDD-XXXX (4-digit padded)
 */
function generateSequentialBookingId(sheet, dateKey) {
  var prefix = 'AFX-' + dateKey + '-';
  var lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return prefix + '0001';
  }

  // Column A contains all Booking IDs (from row 2 to lastRow)
  var idValues = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  var maxSeq = 0;

  for (var i = idValues.length - 1; i >= 0; i--) {
    var rawId = String(idValues[i][0] || '').trim();
    if (rawId.indexOf(prefix) === 0) {
      var seqPart = rawId.substring(prefix.length);
      var parsed = parseInt(seqPart, 10);
      if (!isNaN(parsed) && parsed > maxSeq) {
        maxSeq = parsed;
      }
    }
  }

  var nextSeq = maxSeq + 1;
  var seqStr = ('0000' + nextSeq).slice(-4);
  return prefix + seqStr;
}

/**
 * 2. Fetch repair option details (price, warranty, repairTime) from PRICE_LIST
 */
function verifyRepairInPriceList(rows, columnMap, brand, model, service, partGrade) {
  var normBrand = normalize(brand);
  var normModel = normalize(model);
  var normService = normalize(service);
  var normGrade = normalize(partGrade);

  if (rows && rows.length > 0 && columnMap) {
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var activeVal = normalize(r[columnMap.active]);
      var isActive = activeVal === 'yes' || activeVal === 'true' || activeVal === '1';
      if (!isActive) continue;

      if (
        normalize(r[columnMap.brand]) === normBrand &&
        normalize(r[columnMap.model]) === normModel &&
        normalize(r[columnMap.service]) === normService &&
        normalize(r[columnMap.partGrade]) === normGrade
      ) {
        return {
          found: true,
          price: Number(r[columnMap.price]) || 0,
          warranty: String(r[columnMap.warranty] || '6 Months').trim(),
          repairTime: String(r[columnMap.repairTime] || '30 mins').trim()
        };
      }
    }
  }

  return { found: false };
}

/**
 * 3. createBookingAction()
 * Executes the complete booking creation pipeline:
 * 1. Validate form fields.
 * 2. Verify repair option against PRICE_LIST.
 * 3. Acquire script lock for atomic concurrency.
 * 4. Open BOOKINGS sheet (create headers if missing).
 * 5. Generate next sequential ID from Column A.
 * 6. Append row with exact columns A through N.
 * 7. Append timeline entry to BOOKING_STATUS.
 * 8. Return exact booking ID and quote data to frontend.
 */
function createBookingAction(payload) {
  var startTime = new Date().getTime();

  if (!payload || typeof payload !== 'object') {
    return {
      success: false,
      error: 'Required booking information is missing.'
    };
  }

  // Extract fields (supports both nested format and flat format)
  var customerName = String(
    (payload.customer && payload.customer.name) ||
    payload.customerName ||
    ''
  ).trim();

  var phone = String(
    (payload.customer && payload.customer.phone) ||
    payload.phone ||
    ''
  ).trim();

  var brand = String(
    (payload.device && payload.device.brand) ||
    payload.brand ||
    ''
  ).trim();

  var model = String(
    (payload.device && payload.device.model) ||
    payload.model ||
    ''
  ).trim();

  var service = String(
    (payload.repair && payload.repair.service) ||
    payload.service ||
    ''
  ).trim();

  var partGrade = String(
    (payload.repair && payload.repair.partGrade) ||
    payload.partGrade ||
    ''
  ).trim();

  var doorstepAddress = String(
    payload.formattedAddress ||
    payload.address ||
    ''
  ).trim();

  var landmark = String(payload.landmark || '').trim();
  var preferredDate = String(payload.preferredDate || '').trim();
  var preferredTime = String(
    payload.preferredTime ||
    payload.timeSlot ||
    ''
  ).trim();

  var notes = String(
    payload.notes ||
    payload.additionalNotes ||
    ''
  ).trim();

  // Strict Validation
  if (
    !customerName ||
    !phone ||
    !brand ||
    !model ||
    !service ||
    !partGrade ||
    !doorstepAddress ||
    !preferredDate ||
    !preferredTime
  ) {
    return {
      success: false,
      error: 'Required booking information is missing.'
    };
  }

  // Verify repair combination in PRICE_LIST
  var sheetData = getSheetDataSnapshot(SHEET_NAME);
  if (!sheetData.success) {
    return {
      success: false,
      error: 'Unable to access PRICE_LIST database.'
    };
  }

  var option = verifyRepairInPriceList(sheetData.rows, sheetData.columnMap, brand, model, service, partGrade);
  if (!option.found) {
    return {
      success: false,
      error: 'Selected repair option is no longer available in PRICE_LIST.'
    };
  }

  var price = option.price;
  var warranty = option.warranty || '6 Months';
  var repairTime = option.repairTime || '30 mins';

  // Acquire Lock to prevent race condition duplicate IDs
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (lockErr) {
    return {
      success: false,
      error: 'Server is currently busy generating booking sequence. Please try again.'
    };
  }

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // Open or create BOOKINGS sheet
    var bookingsSheet = ss.getSheetByName('BOOKINGS');
    if (!bookingsSheet) {
      bookingsSheet = ss.insertSheet('BOOKINGS');
      bookingsSheet.appendRow([
        'Booking ID',
        'Created At',
        'Brand',
        'Model',
        'Service',
        'Part Grade',
        'Customer Name',
        'Mobile Number',
        'Doorstep Address',
        'Landmark',
        'Preferred Date',
        'Time Slot',
        'Additional Notes',
        'Status'
      ]);
    }

    // Generate dateKey: YYYYMMDD
    var now = new Date();
    var yyyy = String(now.getFullYear());
    var mm = ('0' + (now.getMonth() + 1)).slice(-2);
    var dd = ('0' + now.getDate()).slice(-2);
    var dateKey = yyyy + mm + dd;

    var bookingId = generateSequentialBookingId(bookingsSheet, dateKey);
    var nowIso = now.toISOString();
    var status = 'PENDING';

    // Append exactly columns A through N
    bookingsSheet.appendRow([
      bookingId,        // A: Booking ID
      nowIso,           // B: Created At
      brand,            // C: Brand
      model,            // D: Model
      service,          // E: Service
      partGrade,        // F: Part Grade
      customerName,     // G: Customer Name
      phone,            // H: Mobile Number
      doorstepAddress,  // I: Doorstep Address
      landmark,         // J: Landmark
      preferredDate,    // K: Preferred Date
      preferredTime,    // L: Time Slot
      notes,            // M: Additional Notes
      status            // N: Status (PENDING)
    ]);

    // Append to BOOKING_STATUS timeline
    var statusSheet = ss.getSheetByName('BOOKING_STATUS');
    if (!statusSheet) {
      statusSheet = ss.insertSheet('BOOKING_STATUS');
      statusSheet.appendRow([
        'Booking ID',
        'Status',
        'Timestamp',
        'Updated By',
        'Note'
      ]);
    }
    statusSheet.appendRow([
      bookingId,
      status,
      nowIso,
      'SYSTEM',
      'Booking created'
    ]);

    // Lightweight debug logging
    var durationMs = new Date().getTime() - startTime;
    console.log(
      '[ANYFIX BOOKING]\n' +
      'Booking ID: ' + bookingId + '\n' +
      'Customer: ' + customerName + '\n' +
      'Brand: ' + brand + '\n' +
      'Model: ' + model + '\n' +
      'Status: ' + status + '\n' +
      'Saved: SUCCESS\n' +
      'Execution Time: ' + durationMs + 'ms'
    );

    return {
      success: true,
      bookingId: bookingId,
      data: {
        bookingId: bookingId,
        price: price,
        warranty: warranty,
        repairTime: repairTime,
        status: status
      }
    };
  } catch (err) {
    console.error('[ANYFIX CREATE BOOKING ERROR]', err);
    return {
      success: false,
      error: 'Failed to create booking: ' + (err.message || err)
    };
  } finally {
    lock.releaseLock();
  }
}
