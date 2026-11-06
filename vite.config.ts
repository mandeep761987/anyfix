import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { execSync } from 'child_process';

const SPREADSHEET_ID = '1dPwwua-nMDjW-5ajiaa4zQcKATuqWg0Vezxk3q50vmU';

const GOOGLE_SCRIPT_TARGET =
  'https://script.google.com/macros/s/AKfycbz2MJBkXWqUgKbq0dnMeiG1hviQAfcjnMzjtjvs-9Vlrp2gexV2-uZPESBlR8hxBgpIRg/exec';
const GOOGLE_SCRIPT_FALLBACK =
  'https://script.google.com/macros/s/AKfycbz2MJBkXWqUgKbq0dnMeiG1hviQAfcjnMzjtjvs-9Vlrp2gexV2-uZPESBlR8hxBgpIRg/exec';

function escapeGsheetsCell(val: any): string {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ')
    .trim();
}

function appendBookingToGoogleSheet(payload: any) {
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const todayKey = `${yyyy}${mm}${dd}`;
  const prefix = `AFX-${todayKey}-`;

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
  } catch (err: any) {
    console.warn('[SHEET SYNC] Failed to read sequence from sheet:', err?.message);
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
  const issue =
    repair.issue ||
    payload.issue ||
    (Array.isArray(payload.cartItems)
      ? payload.cartItems.map((c: any) => c.selectedAnswer || c.service).join(' | ')
      : '') ||
    service;
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

  execSync(`gsheets mutate append ${SPREADSHEET_ID} "BOOKINGS" "${escapedRow}"`, {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  console.log(`[SHEET SYNC] Successfully appended booking ${orderId} to Google Sheet BOOKINGS tab.`);

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
  } catch (statusErr: any) {
    console.warn('[SHEET SYNC] Non-critical warning appending to BOOKING_STATUS:', statusErr?.message);
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

function gasProxyPlugin(): Plugin {
  const handler = async (req: any, res: any) => {
    try {
      const getTargetUrl = (targetBase: string) => {
        const targetUrl = new URL(targetBase);
        if (req.url) {
          const parsed = new URL(req.url, 'http://localhost');
          parsed.searchParams.forEach((val, key) => {
            targetUrl.searchParams.set(key, val);
          });
        }
        return targetUrl;
      };

      const fetchOptions: RequestInit = {
        method: req.method || 'GET',
        redirect: 'follow',
      };

      if (req.method === 'POST') {
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
        }
        const postData = Buffer.concat(chunks).toString('utf-8');
        fetchOptions.body = postData;
        fetchOptions.headers = { 'Content-Type': 'text/plain;charset=utf-8' };

        let parsedPayload: any = null;
        try {
          parsedPayload = JSON.parse(postData);
        } catch {}

        // When customer submits a booking, append directly into the Google Sheet BOOKINGS tab
        if (parsedPayload && parsedPayload.action === 'createBooking') {
          try {
            const syncResult = appendBookingToGoogleSheet(parsedPayload);
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.statusCode = 200;
            res.end(JSON.stringify(syncResult));
            return;
          } catch (syncErr: any) {
            console.error('[VITE PROXY] Failed to directly append to Google Sheet:', syncErr);
          }
        }
      }

      let upstream = await fetch(getTargetUrl(GOOGLE_SCRIPT_TARGET).toString(), fetchOptions);
      let text = await upstream.text();

      // If primary returns 404 / file does not exist, failover to verified endpoint
      if (text.includes('file you have requested does not exist') || text.includes('Page not found')) {
        const fallbackUpstream = await fetch(getTargetUrl(GOOGLE_SCRIPT_FALLBACK).toString(), fetchOptions);
        text = await fallbackUpstream.text();
      }

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.statusCode = 200;
      res.end(text);
    } catch (err: any) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          success: false,
          message: err?.message || 'Proxy request failed',
        })
      );
    }
  };

  return {
    name: 'gas-api-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlStr = req.url || '';
        if (urlStr.startsWith('/api/gas')) {
          await handler(req, res);
          return;
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlStr = req.url || '';
        if (urlStr.startsWith('/api/gas')) {
          await handler(req, res);
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), gasProxyPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
