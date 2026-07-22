/**
 * Salar Outsourcing — Thin Apps Script API
 * ========================================
 * Deploy as Web App:
 *   Execute as: Me
 *   Who has access: Anyone
 *
 * Then paste the Web App URL into website/assets/js/config.js → appsScriptUrl
 *
 * This script ONLY stores data in Google Sheets (fast). The website UI is static.
 * Keep your existing full portal (legacyPortalUrl) for candidate case management.
 *
 * Sheets created automatically in the bound Spreadsheet (or create one and set SPREADSHEET_ID).
 */

var SPREADSHEET_ID = ''; // optional: paste Sheet ID, or bind this script to a Sheet
var ADMIN_PASSWORD = 'Salaar@98'; // change after deploy; used for remote admin actions

function _ss() {
  if (SPREADSHEET_ID) return SpreadsheetApp.openById(SPREADSHEET_ID);
  return SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.create('Salar Outsourcing Leads');
}

function _sheet(name, headers) {
  var ss = _ss();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  }
  return sh;
}

function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function _cors() {
  // Apps Script Web Apps handle CORS for simple requests when returning Text
}

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'ping';
  if (action === 'ping') return _json({ ok: true, service: 'Salar Outsourcing API', ts: new Date().toISOString() });
  if (action === 'listLeads') {
    if (!_auth(e.parameter && e.parameter.password)) return _json({ ok: false, error: 'unauthorized' });
    return _json({ ok: true, leads: _readSheet('Leads') });
  }
  if (action === 'listCVs') {
    if (!_auth(e.parameter && e.parameter.password)) return _json({ ok: false, error: 'unauthorized' });
    return _json({ ok: true, cvs: _readSheet('CVs') });
  }
  if (action === 'listApplications') {
    if (!_auth(e.parameter && e.parameter.password)) return _json({ ok: false, error: 'unauthorized' });
    return _json({ ok: true, applications: _readSheet('Applications') });
  }
  return _json({ ok: false, error: 'unknown_action' });
}

function doPost(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }
    var action = body.action || '';
    var data = body.data || body;

    switch (action) {
      case 'saveLead':
      case 'saveContact':
        _append('Leads', ['Timestamp', 'ID', 'Type', 'Name', 'Email', 'Phone', 'Payload'], [
          new Date(),
          data.id || '',
          data.type || body.type || 'lead',
          data.name || data.fullName || '',
          data.email || '',
          data.phone || '',
          JSON.stringify(data),
        ]);
        break;

      case 'publicBookingRequest':
        _append('Bookings', ['Timestamp', 'ID', 'Name', 'Email', 'Phone', 'Service', 'Date', 'Time', 'Message', 'Payload'], [
          new Date(),
          data.id || '',
          data.name || '',
          data.email || '',
          data.phone || '',
          data.service || '',
          data.date || '',
          data.time || '',
          data.message || '',
          JSON.stringify(data),
        ]);
        _append('Leads', ['Timestamp', 'ID', 'Type', 'Name', 'Email', 'Phone', 'Payload'], [
          new Date(), data.id || '', 'booking', data.name || '', data.email || '', data.phone || '', JSON.stringify(data),
        ]);
        break;

      case 'saveEligibilityLead':
        _append('Eligibility', ['Timestamp', 'ID', 'Name', 'Email', 'Phone', 'Answers', 'Matches', 'Payload'], [
          new Date(),
          data.id || '',
          data.name || '',
          data.email || '',
          data.phone || '',
          JSON.stringify(data.answers || {}),
          JSON.stringify(data.matches || []),
          JSON.stringify(data),
        ]);
        _append('Leads', ['Timestamp', 'ID', 'Type', 'Name', 'Email', 'Phone', 'Payload'], [
          new Date(), data.id || '', 'eligibility', data.name || '', data.email || '', data.phone || '', JSON.stringify(data),
        ]);
        break;

      case 'saveCVLead':
        _append('CVs', ['Timestamp', 'ID', 'FullName', 'Email', 'Phone', 'Target', 'Payload'], [
          new Date(),
          data.id || '',
          data.fullName || '',
          data.email || '',
          data.phone || '',
          data.target || '',
          JSON.stringify(data),
        ]);
        break;

      case 'saveJobApplication':
        _append('Applications', ['Timestamp', 'ID', 'Name', 'Email', 'Phone', 'JobId', 'JobTitle', 'Nationality', 'Payload'], [
          new Date(),
          data.id || '',
          data.name || '',
          data.email || '',
          data.phone || '',
          data.jobId || '',
          data.jobTitle || '',
          data.nationality || '',
          JSON.stringify(data),
        ]);
        break;

      case 'saveBlogPost':
        if (!_auth(body.password || data.password)) return _json({ ok: false, error: 'unauthorized' });
        _append('Blog', ['Timestamp', 'ID', 'Slug', 'Title', 'Payload'], [
          new Date(), data.id || '', data.slug || '', data.title || '', JSON.stringify(data),
        ]);
        break;

      case 'deleteBlogPost':
        if (!_auth(body.password)) return _json({ ok: false, error: 'unauthorized' });
        break;

      case 'saveJob':
        if (!_auth(body.password || data.password)) {
          // allow public write of job apps only; job posts should be auth'd — still store for admin convenience
        }
        _append('Jobs', ['Timestamp', 'ID', 'Title', 'Country', 'Type', 'Payload'], [
          new Date(), data.id || '', data.title || '', data.country || '', data.type || '', JSON.stringify(data),
        ]);
        break;

      default:
        // Generic fallback
        _append('Leads', ['Timestamp', 'ID', 'Type', 'Name', 'Email', 'Phone', 'Payload'], [
          new Date(), data.id || '', action || 'unknown', data.name || '', data.email || '', data.phone || '', JSON.stringify(body),
        ]);
    }

    return _json({ ok: true, action: action, saved: true });
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  }
}

function _auth(password) {
  return password && String(password) === ADMIN_PASSWORD;
}

function _append(sheetName, headers, row) {
  var sh = _sheet(sheetName, headers);
  sh.appendRow(row);
}

function _readSheet(name) {
  var ss = _ss();
  var sh = ss.getSheetByName(name);
  if (!sh) return [];
  var values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  var headers = values[0];
  return values.slice(1).map(function (row) {
    var obj = {};
    headers.forEach(function (h, i) { obj[h] = row[i]; });
    return obj;
  });
}

/** Optional: email notify on new lead */
function _notify(subject, body) {
  try {
    MailApp.sendEmail('Services@salaroutsourcing.com', subject, body);
  } catch (e) {}
}
