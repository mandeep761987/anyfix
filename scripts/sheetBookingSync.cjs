const { execSync } = require('child_process');

const SPREADSHEET_ID = '1dPwwua-nMDjW-5ajiaa4zQcKATuqWg0Vezxk3q50vmU';

function escapeGsheetsCell(val) {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ')
    .trim();
}

/**
 * Appends a booking to the BOOKINGS tab in Google Sheet 1dPwwua-nMDjW-5ajiaa4zQcKATuqWg0Vezxk3q50vmU.
 * Follows the exact 25-column structure (A through Y) matching Code.gs.
 */
function appendBookingToSheet(payload) {
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const todayKey = `${yyyy}${mm}${dd}`;
  const prefix = `AFX-${todayKey}-`;

  // 1. Determine next sequence ID from sheet
  let nextSeq = 1;
  try {
    const rawIds = execSync(`gsheets readonly read ${SPREADSHEET_ID} "BOOKINGS!A2:A"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });

    const lines = rawIds.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const todayNums = lines
      .filter((id) => id.startsWith(prefix))
      .map((id) => parseInt(id.substring(prefix.length), 10))
      .filter((n) => !isNaN(n));

    if (todayNums.length > 0) {
      nextSeq = Math.max(...todayNums) + 1;
    }
  } catch (err) {
    console.warn('[SHEET SYNC] Failed to read sequence from sheet:', err.message);
  }

  const orderId = payload.bookingId && payload.bookingId.startsWith(prefix)
    ? payload.bookingId
    : `${prefix}${String(nextSeq).padStart(4, '0')}`;

  const formattedDate = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  const customer = payload.customer || {};
  const device = payload.device || {};
  const repair = payload.repair || {};

  const customerName = customer.name || payload.customerName || '';
  const mobileNumber = customer.phone || payload.phone || payload.mobileNumber || '';
  const email = customer.email || payload.email || '';

  const brand = device.brand || payload.brand || '';
  const model = device.model || payload.model || '';

  const service = repair.service || payload.service || '';
  const issue = repair.issue || payload.issue || (Array.isArray(payload.cartItems) ? payload.cartItems.map((c) => c.selectedAnswer || c.service).join(' | ') : '') || service;
  const subIssue = repair.subIssue || payload.subIssue || '';
  const issueAnswer = repair.issueAnswer || payload.issueAnswer || '';
  const partGrade = repair.partGrade || payload.partGrade || 'Standard';

  const price = payload.price || 0;
  const warranty = payload.warranty || 'Up to 6 Months Warranty';
  const repairTime = payload.repairTime || '30-45 Mins';

  const address = payload.formattedAddress || payload.address || payload.doorstepAddress || '';
  const landmark = payload.landmark || '';
  const preferredDate = payload.preferredDate || '';
  const preferredTime = payload.preferredTime || payload.timeSlot || '';
  const notes = payload.notes || payload.additionalNotes || '';

  // Exact 25-column order: A through Y in BOOKINGS sheet
  const rowCols = [
    orderId,              // A: Order ID
    formattedDate,        // B: Created At
    brand,                // C: Brand
    model,                // D: Model
    service,              // E: Service
    issue,                // F: Issue
    subIssue,             // G: Sub Issue
    issueAnswer,          // H: Issue Answer
    partGrade,            // I: Part Grade
    String(price),        // J: Price
    warranty,             // K: Warranty
    repairTime,           // L: Repair Time
    customerName,         // M: Customer Name
    mobileNumber,         // N: Mobile Number
    email,                // O: Email
    address,              // P: Doorstep Address
    landmark,             // Q: Landmark
    preferredDate,        // R: Preferred Date
    preferredTime,        // S: Preferred Time
    notes,                // T: Additional Notes
    '',                   // U: Customer Paid Amount
    '',                   // V: Payment Status
    'NEW',                // W: Booking Status
    '',                   // X: Technician
    '',                   // Y: Technician Note
  ];

  const escapedRow = rowCols.map(escapeGsheetsCell).join(',');

  try {
    execSync(`gsheets mutate append ${SPREADSHEET_ID} "BOOKINGS" "${escapedRow}"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    console.log(`[SHEET SYNC] Successfully appended booking ${orderId} to Google Sheet BOOKINGS tab.`);
  } catch (appendErr) {
    console.error(`[SHEET SYNC] Error appending to BOOKINGS tab:`, appendErr.message);
    throw appendErr;
  }

  // Also append timeline record to BOOKING_STATUS
  try {
    const statusRowCols = [
      orderId,
      'NEW',
      formattedDate,
      'WEBSITE',
      'Booking submitted by customer',
      'NEW',
    ];
    const escapedStatusRow = statusRowCols.map(escapeGsheetsCell).join(',');
    execSync(`gsheets mutate append ${SPREADSHEET_ID} "BOOKING_STATUS" "${escapedStatusRow}"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
  } catch (statusErr) {
    console.warn('[SHEET SYNC] Non-critical warning appending to BOOKING_STATUS:', statusErr.message);
  }

  return {
    success: true,
    bookingId: orderId,
    orderId: orderId,
    status: 'NEW',
    message: 'Booking created successfully in Google Sheet',
    data: {
      bookingId: orderId,
      orderId: orderId,
      brand,
      model,
      service,
      partGrade,
      price,
      warranty,
      repairTime,
      status: 'NEW',
    },
  };
}

module.exports = {
  appendBookingToSheet,
  SPREADSHEET_ID,
};
