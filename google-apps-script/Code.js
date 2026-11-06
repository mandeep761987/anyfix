/* =========================================================
   ANYFIX PRICE LIST API
   Google Apps Script - Complete Replacement
   ========================================================= */

const SPREADSHEET_ID = '1dPwwua-nMDjW-5ajiaa4zQcKATuqWg0Vezxk3q50vmU';
const PRICE_LIST_SHEET = 'PRICE_LIST';


/* =========================================================
   COLUMN MAP - PRICE_LIST A:N
   =========================================================

   A = Brand
   B = Model
   C = Services
   D = Issue
   E = Sub Issue
   F = Issue Answer
   G = Part Grade
   H = Specification / Difference
   I = Price
   J = Warranty
   K = Repair Time
   L = Active
   M = Booking Fee
   N = Part Cost
   ========================================================= */


/* =========================================================
   GET API
   ========================================================= */

function doGet(e) {
  try {
    const action = String(e?.parameter?.action || '').trim();

    switch (action) {

      case 'getCatalog':
        return getCatalog();

      case 'getBrands':
        return getBrands();

      case 'getModels':
        return getModels(e);

      case 'getServices':
        return getServices(e);

      case 'getIssues':
        return getIssues(e);

      case 'getSubIssues':
        return getSubIssues(e);

      case 'getIssueAnswers':
        return getIssueAnswers(e);

      case 'getPartGrades':
        return getPartGrades(e);

      case 'getRepairOption':
        return getRepairOption(e);

      case 'getBookingStatus':
        return anyfixGetBookingStatus(e);

      default:
        return jsonResponse({
          success: true,
          message: 'ANYFIX API is running.'
        });
    }

  } catch (error) {
    return jsonResponse({
      success: false,
      message: error.message
    });
  }
}


/* =========================================================
   POST API
   Supports JSON body from website
   ========================================================= */

function doPost(e) {

  try {

    const body = JSON.parse(
      e.postData.contents || '{}'
    );


    // -----------------------------------------
    // CREATE BOOKING
    // -----------------------------------------

    if (
      body.action === 'createBooking'
    ) {

      return createBooking(body);
    }


    // -----------------------------------------
    // EXISTING API ACTIONS
    // -----------------------------------------

    if (
      body.action === 'getCatalog'
    ) {

      return getCatalog();
    }


    if (
      body.action === 'getBrands'
    ) {

      return getBrands();
    }


    if (
      body.action === 'getModels'
    ) {

      return getModels({
        parameter: body
      });
    }


    if (
      body.action === 'getServices'
    ) {

      return getServices({
        parameter: body
      });
    }


    if (
      body.action === 'getIssues'
    ) {

      return getIssues({
        parameter: body
      });
    }


    if (
      body.action === 'getSubIssues'
    ) {

      return getSubIssues({
        parameter: body
      });
    }


    if (
      body.action === 'getIssueAnswers'
    ) {

      return getIssueAnswers({
        parameter: body
      });
    }


    if (
      body.action === 'getPartGrades'
    ) {

      return getPartGrades({
        parameter: body
      });
    }


    if (
      body.action === 'getRepairOption'
    ) {

      return getRepairOption({
        parameter: body
      });
    }


    if (body.action === 'getBookingStatus') {
      return anyfixGetBookingStatus(body.bookingId);
    }


    // -----------------------------------------
    // INVALID ACTION
    // -----------------------------------------

    return jsonResponse({

      success: false,

      message:
        'Invalid POST action'
    });

  } catch (error) {

    return jsonResponse({

      success: false,

      message:
        error.message
    });
  }
}


/* =========================================================
   PRICE LIST
   ========================================================= */

function getPriceListRows() {

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(PRICE_LIST_SHEET);

  if (!sheet) {
    throw new Error('PRICE_LIST sheet not found');
  }

  const values = sheet.getDataRange().getValues();

  if (values.length < 2) {
    return [];
  }

  /*
    IMPORTANT:
    Active is column L = index 11
  */

  return values
    .slice(1)
    .filter(row => isActive(row));
}


/* =========================================================
   ACTIVE LOGIC
   ========================================================= */

function isActive(row) {

  return String(row[11] || '')
    .trim()
    .toLowerCase() === 'yes';
}


/* =========================================================
   HELPERS
   ========================================================= */

function clean(value) {
  return String(value ?? '').trim();
}


function lower(value) {
  return clean(value).toLowerCase();
}


function same(a, b) {
  return lower(a) === lower(b);
}


function unique(values) {

  const seen = new Set();
  const result = [];

  values.forEach(value => {

    const cleaned = clean(value);

    if (!cleaned) return;

    const key = cleaned.toLowerCase();

    if (!seen.has(key)) {
      seen.add(key);
      result.push(cleaned);
    }
  });

  return result;
}


/* =========================================================
   QUESTION = ANSWER PARSER
   =========================================================

   Example:

   Is the display and touch working normally?
   =
   Display shows black spots or colored patches

   Result:

   question = Is the display and touch working normally?
   answer  = Display shows black spots or colored patches

   Original Sheet value is NOT changed.
   ========================================================= */

function parseQuestionAnswer(value) {

  const text = clean(value);

  if (!text) {
    return {
      question: '',
      answer: ''
    };
  }

  const equalIndex = text.indexOf('=');

  if (equalIndex === -1) {

    return {
      question: '',
      answer: text
    };
  }

  const question = text
    .substring(0, equalIndex)
    .trim();

  const answer = text
    .substring(equalIndex + 1)
    .trim();

  return {
    question: question,
    answer: answer
  };
}


/* =========================================================
   GET QUESTION FROM ROW
   =========================================================

   E = Sub Issue
   F = Issue Answer

   We support Question = Answer in either column.

   Priority:
   1. E if E contains "="
   2. F if F contains "="
   ========================================================= */

function getQuestionAnswerFromRow(row) {

  const subIssueRaw = clean(row[4]);
  const issueAnswerRaw = clean(row[5]);

  const subIssueParsed = parseQuestionAnswer(subIssueRaw);
  const issueAnswerParsed = parseQuestionAnswer(issueAnswerRaw);

  if (subIssueRaw.includes('=')) {

    return {
      source: 'subIssue',
      question: subIssueParsed.question,
      answer: subIssueParsed.answer
    };
  }

  if (issueAnswerRaw.includes('=')) {

    return {
      source: 'issueAnswer',
      question: issueAnswerParsed.question,
      answer: issueAnswerParsed.answer
    };
  }

  return {
    source: '',
    question: '',
    answer: ''
  };
}


/* =========================================================
   GET NORMAL SUB ISSUE
   ========================================================= */

function getNormalSubIssue(row) {

  const value = clean(row[4]);

  if (!value) {
    return '';
  }

  if (value.includes('=')) {

    return parseQuestionAnswer(value).answer;
  }

  return value;
}


/* =========================================================
   GET NORMAL ISSUE ANSWER
   ========================================================= */

function getNormalIssueAnswer(row) {

  const value = clean(row[5]);

  if (!value) {
    return '';
  }

  if (value.includes('=')) {

    return parseQuestionAnswer(value).answer;
  }

  return value;
}


/* =========================================================
   COMPLETE CATALOG
   ========================================================= */

function getCatalog() {

  try {

    const rows = getPriceListRows();

    const catalog = rows.map(row => {

      const qa = getQuestionAnswerFromRow(row);

      return {

        brand: clean(row[0]),
        model: clean(row[1]),
        service: clean(row[2]),
        issue: clean(row[3]),

        subIssue: getNormalSubIssue(row),

        issueAnswer: getNormalIssueAnswer(row),

        question: qa.question,
        answer: qa.answer,

        partGrade: clean(row[6]),

        specification: clean(row[7]),

        price: row[8],

        warranty: clean(row[9]),

        repairTime: clean(row[10]),

        active: clean(row[11]),

        bookingFee: row[12],

        partCost: row[13]
      };
    });

    return jsonResponse({
      success: true,
      data: catalog
    });

  } catch (error) {

    return jsonResponse({
      success: false,
      message: error.message
    });
  }
}


/* =========================================================
   BRANDS
   ========================================================= */

function getBrands() {

  try {

    const rows = getPriceListRows();

    const brands = unique(
      rows.map(row => row[0])
    );

    return jsonResponse({
      success: true,
      data: brands
    });

  } catch (error) {

    return jsonResponse({
      success: false,
      message: error.message
    });
  }
}


/* =========================================================
   MODELS
   ========================================================= */

function getModels(e) {

  try {

    const brand = clean(e.parameter.brand);

    if (!brand) {

      return jsonResponse({
        success: false,
        message: 'Brand is required'
      });
    }

    const rows = getPriceListRows();

    const models = unique(
      rows
        .filter(row =>
          same(row[0], brand)
        )
        .map(row => row[1])
    );

    return jsonResponse({
      success: true,
      data: models
    });

  } catch (error) {

    return jsonResponse({
      success: false,
      message: error.message
    });
  }
}


/* =========================================================
   SERVICES
   ========================================================= */

function getServices(e) {

  try {

    const brand = clean(e.parameter.brand);
    const model = clean(e.parameter.model);

    if (!brand || !model) {

      return jsonResponse({
        success: false,
        message: 'Brand and Model are required'
      });
    }

    const rows = getPriceListRows();

    const services = unique(
      rows
        .filter(row =>
          same(row[0], brand) &&
          same(row[1], model)
        )
        .map(row => row[2])
    );

    return jsonResponse({
      success: true,
      data: services
    });

  } catch (error) {

    return jsonResponse({
      success: false,
      message: error.message
    });
  }
}


/* =========================================================
   ISSUES
   ========================================================= */

function getIssues(e) {

  try {

    const brand = clean(e.parameter.brand);
    const model = clean(e.parameter.model);
    const service = clean(e.parameter.service);

    if (!brand || !model || !service) {

      return jsonResponse({
        success: false,
        message: 'Brand, Model and Service are required'
      });
    }

    const rows = getPriceListRows();

    const issues = unique(
      rows
        .filter(row =>
          same(row[0], brand) &&
          same(row[1], model) &&
          same(row[2], service)
        )
        .map(row => row[3])
    );

    return jsonResponse({
      success: true,
      data: issues
    });

  } catch (error) {

    return jsonResponse({
      success: false,
      message: error.message
    });
  }
}


/* =========================================================
   SUB ISSUES / QUESTIONS
   ========================================================= */

function getSubIssues(e) {

  try {

    const brand = clean(e.parameter.brand);
    const model = clean(e.parameter.model);
    const service = clean(e.parameter.service);
    const issue = clean(e.parameter.issue);

    if (!brand || !model || !service || !issue) {

      return jsonResponse({
        success: false,
        message: 'Brand, Model, Service and Issue are required'
      });
    }

    const rows = getPriceListRows();

    const matchingRows = rows.filter(row =>
      same(row[0], brand) &&
      same(row[1], model) &&
      same(row[2], service) &&
      same(row[3], issue)
    );


    /*
      CASE 1:
      E contains Question = Answer

      Example:
      Is display working? = Touch is working

      Website receives:
      question
      answer options
    */

    const questionAnswers = [];

    matchingRows.forEach(row => {

      const qa = getQuestionAnswerFromRow(row);

      if (qa.question && qa.answer) {

        questionAnswers.push({
          question: qa.question,
          answer: qa.answer,
          value: qa.answer
        });
      }
    });


    if (questionAnswers.length > 0) {

      const questionList = unique(
        questionAnswers.map(item => item.question)
      );

      const answerList = unique(
        questionAnswers.map(item => item.answer)
      );

      return jsonResponse({

        success: true,

        data: answerList,

        question: questionList.length === 1
          ? questionList[0]
          : questionList,

        answers: questionAnswers

      });
    }


    /*
      CASE 2:
      Normal E Sub Issue values
    */

    const subIssues = unique(
      matchingRows.map(row =>
        getNormalSubIssue(row)
      )
    );

    return jsonResponse({

      success: true,

      data: subIssues,

      question: '',

      answers: []

    });

  } catch (error) {

    return jsonResponse({
      success: false,
      message: error.message
    });
  }
}


/* =========================================================
   ISSUE ANSWERS
   ========================================================= */

function getIssueAnswers(e) {

  try {

    const brand = clean(e.parameter.brand);
    const model = clean(e.parameter.model);
    const service = clean(e.parameter.service);
    const issue = clean(e.parameter.issue);
    const subIssue = clean(e.parameter.subIssue);

    if (!brand || !model || !service || !issue) {

      return jsonResponse({
        success: false,
        message: 'Brand, Model, Service and Issue are required'
      });
    }

    const rows = getPriceListRows();


    const matchingRows = rows.filter(row => {

      if (
        !same(row[0], brand) ||
        !same(row[1], model) ||
        !same(row[2], service) ||
        !same(row[3], issue)
      ) {
        return false;
      }


      /*
        If Sub Issue was selected,
        match against the parsed E value.
      */

      if (subIssue) {

        const actualSubIssue = getNormalSubIssue(row);

        if (!same(actualSubIssue, subIssue)) {
          return false;
        }
      }

      return true;
    });


    const answerObjects = [];

    matchingRows.forEach(row => {

      const qa = getQuestionAnswerFromRow(row);

      /*
        If F contains Question = Answer
      */

      if (qa.source === 'issueAnswer') {

        answerObjects.push({

          question: qa.question,

          answer: qa.answer,

          value: qa.answer
        });

        return;
      }


      /*
        Normal F value
      */

      const answer = getNormalIssueAnswer(row);

      if (answer) {

        answerObjects.push({

          question: '',

          answer: answer,

          value: answer
        });
      }
    });


    const answers = unique(
      answerObjects.map(item => item.answer)
    );


    const questions = unique(
      answerObjects
        .map(item => item.question)
        .filter(Boolean)
    );


    return jsonResponse({

      success: true,

      data: answers,

      question: questions.length === 1
        ? questions[0]
        : questions,

      answers: answerObjects

    });

  } catch (error) {

    return jsonResponse({
      success: false,
      message: error.message
    });
  }
}


/* =========================================================
   PART GRADES
   ========================================================= */

function getPartGrades(e) {

  try {

    const brand = clean(e.parameter.brand);
    const model = clean(e.parameter.model);
    const service = clean(e.parameter.service);
    const issue = clean(e.parameter.issue);
    const subIssue = clean(e.parameter.subIssue);
    const issueAnswer = clean(e.parameter.issueAnswer);


    if (!brand || !model || !service) {

      return jsonResponse({
        success: false,
        message: 'Brand, Model and Service are required'
      });
    }


    const rows = getPriceListRows();


    const options = rows
      .filter(row => {

        /*
          Brand + Model + Service
        */

        if (
          !same(row[0], brand) ||
          !same(row[1], model) ||
          !same(row[2], service)
        ) {
          return false;
        }


        /*
          Issue
        */

        if (
          issue &&
          !same(row[3], issue)
        ) {
          return false;
        }


        /*
          Sub Issue
        */

        if (subIssue) {

          const actualSubIssue =
            getNormalSubIssue(row);

          if (!same(actualSubIssue, subIssue)) {
            return false;
          }
        }


        /*
          Issue Answer
        */

        if (issueAnswer) {

          const actualIssueAnswer =
            getNormalIssueAnswer(row);

          /*
            If row F has Question = Answer,
            compare only the ANSWER part.
          */

          if (!same(actualIssueAnswer, issueAnswer)) {
            return false;
          }


          /*
            If E itself contains Question = Answer,
            and the selected answer is the E answer,
            also allow exact matching.
          */

          const qa = getQuestionAnswerFromRow(row);

          if (
            qa.source === 'subIssue' &&
            !same(qa.answer, issueAnswer) &&
            !same(actualIssueAnswer, issueAnswer)
          ) {
            return false;
          }
        }


        return true;
      })
      .map(row => {

        const qa = getQuestionAnswerFromRow(row);

        return {

          brand: clean(row[0]),
          model: clean(row[1]),
          service: clean(row[2]),
          issue: clean(row[3]),

          subIssue: getNormalSubIssue(row),

          issueAnswer: getNormalIssueAnswer(row),

          question: qa.question,
          answer: qa.answer,

          partGrade: clean(row[6]),

          specification: clean(row[7]),

          price: row[8],

          warranty: clean(row[9]),

          repairTime: clean(row[10]),

          active: clean(row[11]),

          bookingFee: row[12],

          partCost: row[13]
        };
      });


    /*
      Remove exact duplicate repair options.
    */

    const uniqueOptions = [];

    const seen = new Set();


    options.forEach(option => {

      const key = [

        option.partGrade,
        option.specification,
        option.price,
        option.warranty,
        option.repairTime,
        option.bookingFee,
        option.partCost

      ]
        .join('|')
        .toLowerCase();


      if (!seen.has(key)) {

        seen.add(key);

        uniqueOptions.push(option);
      }
    });


    return jsonResponse({

      success: true,

      data: uniqueOptions

    });

  } catch (error) {

    return jsonResponse({

      success: false,

      message: error.message

    });
  }
}


/* =========================================================
   EXACT REPAIR OPTION
   ========================================================= */

function getRepairOption(e) {

  try {

    const brand = clean(e.parameter.brand);
    const model = clean(e.parameter.model);
    const service = clean(e.parameter.service);
    const issue = clean(e.parameter.issue);
    const subIssue = clean(e.parameter.subIssue);
    const issueAnswer = clean(e.parameter.issueAnswer);
    const partGrade = clean(e.parameter.partGrade);


    if (!brand || !model || !service || !partGrade) {

      return jsonResponse({

        success: false,

        message:
          'Brand, Model, Service and Part Grade are required'

      });
    }


    const rows = getPriceListRows();


    const match = rows.find(row => {


      /*
        Brand + Model + Service + Part Grade
      */

      if (
        !same(row[0], brand) ||
        !same(row[1], model) ||
        !same(row[2], service) ||
        !same(row[6], partGrade)
      ) {
        return false;
      }


      /*
        Issue
      */

      if (
        issue &&
        !same(row[3], issue)
      ) {
        return false;
      }


      /*
        Sub Issue
      */

      if (subIssue) {

        const actualSubIssue =
          getNormalSubIssue(row);

        if (!same(actualSubIssue, subIssue)) {
          return false;
        }
      }


      /*
        Issue Answer
      */

      if (issueAnswer) {

        const actualAnswer =
          getNormalIssueAnswer(row);

        const qa =
          getQuestionAnswerFromRow(row);

        const answerMatches =
          same(actualAnswer, issueAnswer) ||
          same(qa.answer, issueAnswer);

        if (!answerMatches) {
          return false;
        }
      }


      return true;
    });


    if (!match) {

      return jsonResponse({

        success: false,

        message: 'Repair option not found'

      });
    }


    const qa =
      getQuestionAnswerFromRow(match);


    return jsonResponse({

      success: true,

      data: {

        brand: clean(match[0]),
        model: clean(match[1]),
        service: clean(match[2]),
        issue: clean(match[3]),

        subIssue:
          getNormalSubIssue(match),

        issueAnswer:
          getNormalIssueAnswer(match),

        question:
          qa.question,

        answer:
          qa.answer,

        partGrade:
          clean(match[6]),

        specification:
          clean(match[7]),

        price:
          match[8],

        warranty:
          clean(match[9]),

        repairTime:
          clean(match[10]),

        active:
          clean(match[11]),

        bookingFee:
          match[12],

        partCost:
          match[13]

      }

    });

  } catch (error) {

    return jsonResponse({

      success: false,

      message: error.message

    });
  }
}


/* =========================================================
   JSON RESPONSE
   ========================================================= */

function jsonResponse(data) {

  return ContentService

    .createTextOutput(
      JSON.stringify(data)
    )

    .setMimeType(
      ContentService.MimeType.JSON
    );
}



/* =========================================================
   CREATE BOOKING
   Writes real booking into BOOKINGS sheet (A:Y)
   ========================================================= */

function createBooking(payload) {

  const lock = LockService.getScriptLock();

  try {

    lock.waitLock(30000);

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const bookingSheet = ss.getSheetByName('BOOKINGS');

    if (!bookingSheet) {
      throw new Error('BOOKINGS sheet not found');
    }

    const customer = payload.customer || {};
    const device = payload.device || {};
    const repair = payload.repair || {};

    // Customer details
    const customerName = clean(customer.name || payload.customerName);
    const mobileNumber = clean(customer.phone || payload.phone || payload.mobileNumber);
    const email = clean(customer.email || payload.email);

    // Device details
    const brand = clean(device.brand || payload.brand);
    const model = clean(device.model || payload.model);

    // Repair details
    const service = clean(repair.service || payload.service);
    const issue = clean(repair.issue || payload.issue);
    const subIssue = clean(repair.subIssue || payload.subIssue);
    const issueAnswer = clean(repair.issueAnswer || payload.issueAnswer);
    const partGrade = clean(repair.partGrade || payload.partGrade);

    // Address and schedule
    const address = clean(payload.formattedAddress || payload.address || payload.doorstepAddress);
    const landmark = clean(payload.landmark);
    const preferredDate = clean(payload.preferredDate);
    const preferredTime = clean(payload.preferredTime || payload.timeSlot);
    const notes = clean(payload.notes || payload.additionalNotes);

    // Required field validation
    if (
      !customerName ||
      !mobileNumber ||
      !brand ||
      !model ||
      !service ||
      !address
    ) {
      throw new Error('Required booking details are missing');
    }

    // Verify exact repair option against active PRICE_LIST
    const rows = getPriceListRows();

    const matchedRow = rows.find(row => {

      if (
        !same(row[0], brand) ||
        !same(row[1], model) ||
        !same(row[2], service)
      ) {
        return false;
      }

      if (partGrade && !same(row[6], partGrade)) {
        return false;
      }

      if (issue && !same(row[3], issue)) {
        return false;
      }

      if (
        subIssue &&
        !same(getNormalSubIssue(row), subIssue)
      ) {
        return false;
      }

      if (issueAnswer) {

        const actualAnswer = getNormalIssueAnswer(row);
        const qa = getQuestionAnswerFromRow(row);

        if (
          !same(actualAnswer, issueAnswer) &&
          !same(qa.answer, issueAnswer)
        ) {
          return false;
        }
      }

      return true;
    });

    // Verified price details from PRICE_LIST or payload
    let verifiedPrice = payload.price;
    let warranty = clean(payload.warranty) || 'Up to 6 Months Warranty';
    let repairTime = clean(payload.repairTime) || '30-45 Mins';

    if (matchedRow) {
      if (matchedRow[8] !== '' && matchedRow[8] !== null) {
        verifiedPrice = matchedRow[8];
      }
      if (clean(matchedRow[9])) {
        warranty = clean(matchedRow[9]);
      }
      if (clean(matchedRow[10])) {
        repairTime = clean(matchedRow[10]);
      }
    }

    // Generate sequential Order ID
    const timezone = Session.getScriptTimeZone();
    const today = Utilities.formatDate(
      new Date(),
      timezone,
      'yyyyMMdd'
    );

    const lastRow = bookingSheet.getLastRow();
    let sequence = 1;

    if (lastRow >= 2) {

      const existingIds = bookingSheet
        .getRange(2, 1, lastRow - 1, 1)
        .getDisplayValues()
        .flat();

      const prefix = 'AFX-' + today + '-';

      const todayNumbers = existingIds
        .filter(id => id.startsWith(prefix))
        .map(id => Number(id.substring(prefix.length)))
        .filter(number => Number.isFinite(number));

      if (todayNumbers.length > 0) {
        sequence = Math.max(...todayNumbers) + 1;
      }
    }

    const orderId =
      'AFX-' + today + '-' + String(sequence).padStart(4, '0');

    const createdAt = new Date();

    // Exact 25-column BOOKINGS structure: A to Y
    const bookingRow = [

      orderId,             // A Order ID
      createdAt,           // B Created At
      brand,               // C Brand
      model,               // D Model
      service,             // E Service
      issue,               // F Issue
      subIssue,            // G Sub Issue
      issueAnswer,         // H Issue Answer
      partGrade,           // I Part Grade
      verifiedPrice,       // J Price
      warranty,            // K Warranty
      repairTime,          // L Repair Time
      customerName,        // M Customer Name
      mobileNumber,        // N Mobile Number
      email,               // O Email
      address,             // P Doorstep Address
      landmark,            // Q Landmark
      preferredDate,       // R Preferred Date
      preferredTime,       // S Preferred Time
      notes,               // T Additional Notes
      '',                  // U Customer Paid Amount
      '',                  // V Payment Status
      'NEW',               // W Booking Status (matches sheet dropdown validation)
      '',                  // X Technician
      ''                   // Y Technician Note
    ];

    if (bookingRow.length !== 25) {
      throw new Error('Internal error: BOOKINGS row must contain exactly 25 columns');
    }

    // Append one complete A:Y row; existing records are not modified.
    const newRow = bookingSheet.getLastRow() + 1;
    const targetRange = bookingSheet.getRange(newRow, 1, 1, 25);
    targetRange.setValues([bookingRow]);

    // Prevent numeric prices being displayed as dates (e.g. 299 as 1900 date).
    bookingSheet.getRange(newRow, 10).setNumberFormat('0.##'); // J Price
    bookingSheet.getRange(newRow, 11, 1, 2).setNumberFormat('@'); // K:L text

    SpreadsheetApp.flush();

    // Also update BOOKING_STATUS sheet timeline
    try {
      const statusSheet = ss.getSheetByName('BOOKING_STATUS');
      if (statusSheet) {
        statusSheet.appendRow([
          orderId,
          'NEW',
          new Date(),
          'SYSTEM',
          'Booking created',
          'NEW'
        ]);
      }
    } catch (sErr) {}

    return jsonResponse({
      success: true,
      message: 'Booking created successfully',
      orderId: orderId,
      bookingId: orderId,
      bookingStatus: 'NEW',
      status: 'NEW',
      price: verifiedPrice,
      warranty: warranty,
      repairTime: repairTime,
      data: {
        bookingId: orderId,
        orderId: orderId,
        brand: brand,
        model: model,
        service: service,
        partGrade: partGrade,
        price: verifiedPrice,
        warranty: warranty,
        repairTime: repairTime,
        status: 'NEW'
      }
    });

  } catch (error) {

    return jsonResponse({
      success: false,
      message: error.message
    });

  } finally {

    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}



/* =========================================================
   GET BOOKING STATUS
   Searches 25-column BOOKINGS sheet using Order ID
   ========================================================= */

function anyfixGetBookingStatus(input) {

  try {

    const bookingId = clean(
      typeof input === 'string'
        ? input
        : input?.parameter?.bookingId
    );

    if (!bookingId) {
      throw new Error('Booking ID is required');
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('BOOKINGS');

    if (!sheet) {
      throw new Error('BOOKINGS sheet not found');
    }

    const lastRow = sheet.getLastRow();

    if (lastRow < 2) {
      throw new Error('No bookings found');
    }

    const records = sheet
      .getRange(2, 1, lastRow - 1, 25)
      .getValues();

    const booking = records.find(row =>
      same(row[0], bookingId)
    );

    if (!booking) {
      throw new Error('Booking not found');
    }

    const timezone = Session.getScriptTimeZone();

    const createdAt = booking[1] instanceof Date
      ? Utilities.formatDate(
          booking[1],
          timezone,
          'dd MMM yyyy, hh:mm a'
        )
      : clean(booking[1]);

    return jsonResponse({

      success: true,

      data: {

        orderId: clean(booking[0]),
        createdAt: createdAt,
        brand: clean(booking[2]),
        model: clean(booking[3]),
        service: clean(booking[4]),
        issue: clean(booking[5]),
        subIssue: clean(booking[6]),
        issueAnswer: clean(booking[7]),
        partGrade: clean(booking[8]),
        price: booking[9],
        warranty: clean(booking[10]),
        repairTime: clean(booking[11]),

        customerName: clean(booking[12]),
        mobileNumber: clean(booking[13]),
        email: clean(booking[14]),
        address: clean(booking[15]),
        landmark: clean(booking[16]),
        preferredDate: clean(booking[17]),
        preferredTime: clean(booking[18]),
        additionalNotes: clean(booking[19]),

        customerPaidAmount: booking[20],
        paymentStatus: clean(booking[21]),
        bookingStatus: clean(booking[22]),
        technician: clean(booking[23]),
        technicianNote: clean(booking[24]),

        // Website tracking compatibility
        bookingId: clean(booking[0]),
        status: clean(booking[22]),
        timeSlot: clean(booking[18]),
        phone: clean(booking[13]),
        doorstepAddress: clean(booking[15]),
        quotedPrice: booking[9],
        notes: clean(booking[19])

      }

    });

  } catch (error) {

    return jsonResponse({
      success: false,
      message: error.message
    });

  }
}
