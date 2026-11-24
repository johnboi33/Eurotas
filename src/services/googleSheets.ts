import {
  StoredEarlyAccess,
  StoredSurvey,
  getStoredEarlyAccessSubmissions,
  getStoredSurveys,
  getSiteActivity,
  markEarlyAccessSynced,
  markSurveysSynced,
  getSavedSpreadsheetId,
  setSavedSpreadsheetId,
} from './submissionsStore';

export interface SyncResult {
  success: boolean;
  spreadsheetId: string;
  spreadsheetUrl: string;
  earlyAccessCount: number;
  surveyCount: number;
  activityCount: number;
  error?: string;
}

const SYNCED_ACTIVITY_KEY = 'farmlink_synced_activity_ids_v1';

const getSyncedActivityIds = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(SYNCED_ACTIVITY_KEY) || '[]');
  } catch {
    return [];
  }
};

const addSyncedActivityIds = (ids: string[]) => {
  const existing = new Set(getSyncedActivityIds());
  ids.forEach((id) => existing.add(id));
  localStorage.setItem(SYNCED_ACTIVITY_KEY, JSON.stringify(Array.from(existing).slice(-500)));
};

export const resetSyncedActivityIds = () => {
  localStorage.removeItem(SYNCED_ACTIVITY_KEY);
};

const EARLY_ACCESS_HEADERS = [
  'Submission ID',
  'Date & Time (UTC)',
  'Full Name',
  'WhatsApp Number',
  'Role',
  'City / State',
  'Main Produce',
  'Biggest Challenge',
  'Early Access Choice',
];

const SURVEY_HEADERS = [
  'Survey ID',
  'Date & Time (UTC)',
  'Respondent Name',
  'WhatsApp Number',
  'Email',
  'Role Description',
  'Produce Handled',
  'State / City',
  'Main Challenge',
  'Estimated Loss (%)',
  'Current Tools',
  'Preferred Payment',
  'Launch Interest',
  'Must-Have Feature',
];

const ACTIVITY_HEADERS = [
  'Event ID',
  'Date & Time (UTC)',
  'Event Type',
  'Title',
  'Details',
];

/**
 * Creates a dedicated FarmLink Google Spreadsheet with three pre-formatted tabs.
 */
export const createFarmLinkSpreadsheet = async (accessToken: string): Promise<{ id: string; url: string }> => {
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: `FarmLink by Eurotas — Submissions (${new Date().toLocaleDateString('en-GB')})`,
      },
      sheets: [
        {
          properties: {
            title: 'Early Access Leads',
            gridProperties: { frozenRowCount: 1 },
          },
        },
        {
          properties: {
            title: 'Survey Responses',
            gridProperties: { frozenRowCount: 1 },
          },
        },
        {
          properties: {
            title: 'Site Activity',
            gridProperties: { frozenRowCount: 1 },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const errorData = await createRes.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Failed to create spreadsheet (${createRes.status})`);
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Write header rows to all three sheets
  await appendValuesToSheet(accessToken, spreadsheetId, 'Early Access Leads!A1:I1', [EARLY_ACCESS_HEADERS]);
  await appendValuesToSheet(accessToken, spreadsheetId, 'Survey Responses!A1:N1', [SURVEY_HEADERS]);
  await appendValuesToSheet(accessToken, spreadsheetId, 'Site Activity!A1:E1', [ACTIVITY_HEADERS]);

  // Apply Midnight Forest + Champagne Ivory header styling (best-effort)
  try {
    const sheetIds: number[] = (sheetData.sheets || []).map((s: any) => s.properties?.sheetId).filter((id: any) => typeof id === 'number');
    if (sheetIds.length > 0) {
      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: sheetIds.map((sheetId) => ({
            repeatCell: {
              range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.035, green: 0.173, blue: 0.141 },
                  textFormat: {
                    foregroundColor: { red: 1.0, green: 0.976, blue: 0.929 },
                    bold: true,
                  },
                },
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat)',
            },
          })),
        }),
      });
    }
  } catch {
    // Non-critical visual formatting
  }

  resetSyncedActivityIds();
  setSavedSpreadsheetId(spreadsheetId);
  return { id: spreadsheetId, url: spreadsheetUrl };
};

/**
 * Appends rows to a specific range in a Google Spreadsheet.
 */
export const appendValuesToSheet = async (
  accessToken: string,
  spreadsheetId: string,
  range: string,
  rows: any[][]
): Promise<void> => {
  if (rows.length === 0) return;

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
    range
  )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: rows }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Failed to append rows to sheet (${res.status})`);
  }
};

/**
 * Syncs all pending (or all if forceAll=true) early access, survey, and activity records to Google Sheets.
 */
export const syncSubmissionsToGoogleSheets = async (
  accessToken: string,
  targetSpreadsheetId?: string,
  forceAll = false
): Promise<SyncResult> => {
  let spreadsheetId = targetSpreadsheetId || getSavedSpreadsheetId();

  // If no spreadsheet exists yet, create one
  if (!spreadsheetId) {
    const created = await createFarmLinkSpreadsheet(accessToken);
    spreadsheetId = created.id;
  }

  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Fetch pending early access
  const allEarlyAccess = getStoredEarlyAccessSubmissions();
  const pendingEarlyAccess = forceAll
    ? allEarlyAccess
    : allEarlyAccess.filter((item) => !item.syncedToGoogleSheets);

  // Fetch pending surveys
  const allSurveys = getStoredSurveys();
  const pendingSurveys = forceAll
    ? allSurveys
    : allSurveys.filter((item) => !item.syncedToGoogleSheets);

  // Fetch pending activity
  const syncedActivitySet = new Set(forceAll ? [] : getSyncedActivityIds());
  const pendingActivity = getSiteActivity().filter((act) => !syncedActivitySet.has(act.id));

  let syncedEarlyAccessCount = 0;
  let syncedSurveyCount = 0;
  let syncedActivityCount = 0;

  // Append Early Access
  if (pendingEarlyAccess.length > 0) {
    const rows = pendingEarlyAccess.map((ea) => [
      ea.id,
      new Date(ea.submittedAt).toLocaleString('en-GB'),
      ea.fullName,
      ea.whatsappNumber,
      ea.role,
      ea.cityOrState,
      ea.mainProduce,
      ea.biggestChallenge,
      ea.wouldLikeEarlyAccess,
    ]);

    await appendValuesToSheet(accessToken, spreadsheetId, 'Early Access Leads!A:I', rows);
    markEarlyAccessSynced(pendingEarlyAccess.map((item) => item.id));
    syncedEarlyAccessCount = pendingEarlyAccess.length;
  }

  // Append Surveys
  if (pendingSurveys.length > 0) {
    const rows = pendingSurveys.map((s) => [
      s.id,
      new Date(s.submittedAt).toLocaleString('en-GB'),
      s.fullName,
      s.whatsappNumber,
      s.email || 'N/A',
      s.roleDescription,
      s.produceTypes.join(', '),
      s.cityOrState,
      s.biggestChallenge,
      s.estimatedLoss,
      s.currentTools.join(', '),
      s.preferredPayment,
      s.launchInterest,
      s.mustHaveFeature,
    ]);

    await appendValuesToSheet(accessToken, spreadsheetId, 'Survey Responses!A:N', rows);
    markSurveysSynced(pendingSurveys.map((item) => item.id));
    syncedSurveyCount = pendingSurveys.length;
  }

  // Append Site Activity (best-effort; skips cleanly on older 2-tab spreadsheets)
  if (pendingActivity.length > 0) {
    try {
      const rows = pendingActivity.map((act) => [
        act.id,
        new Date(act.timestamp).toLocaleString('en-GB'),
        act.type,
        act.title,
        act.details,
      ]);
      await appendValuesToSheet(accessToken, spreadsheetId, 'Site Activity!A:E', rows);
      addSyncedActivityIds(pendingActivity.map((act) => act.id));
      syncedActivityCount = pendingActivity.length;
    } catch {
      // Older spreadsheets created before the 3rd tab was added won't block main lead/survey sync
    }
  }

  return {
    success: true,
    spreadsheetId,
    spreadsheetUrl,
    earlyAccessCount: syncedEarlyAccessCount,
    surveyCount: syncedSurveyCount,
    activityCount: syncedActivityCount,
  };
};

/**
 * Attempts real-time append of a single new submission if token & sheet exist.
 */
export const tryAutoSyncSubmission = async (
  accessToken: string | null,
  type: 'early_access' | 'survey',
  record: StoredEarlyAccess | StoredSurvey
) => {
  if (!accessToken) return;
  const spreadsheetId = getSavedSpreadsheetId();
  if (!spreadsheetId) return;

  try {
    if (type === 'early_access') {
      const ea = record as StoredEarlyAccess;
      const row = [
        ea.id,
        new Date(ea.submittedAt).toLocaleString('en-GB'),
        ea.fullName,
        ea.whatsappNumber,
        ea.role,
        ea.cityOrState,
        ea.mainProduce,
        ea.biggestChallenge,
        ea.wouldLikeEarlyAccess,
      ];
      await appendValuesToSheet(accessToken, spreadsheetId, 'Early Access Leads!A:I', [row]);
      markEarlyAccessSynced([ea.id]);
    } else {
      const s = record as StoredSurvey;
      const row = [
        s.id,
        new Date(s.submittedAt).toLocaleString('en-GB'),
        s.fullName,
        s.whatsappNumber,
        s.email || 'N/A',
        s.roleDescription,
        s.produceTypes.join(', '),
        s.cityOrState,
        s.biggestChallenge,
        s.estimatedLoss,
        s.currentTools.join(', '),
        s.preferredPayment,
        s.launchInterest,
        s.mustHaveFeature,
      ];
      await appendValuesToSheet(accessToken, spreadsheetId, 'Survey Responses!A:N', [row]);
      markSurveysSynced([s.id]);
    }
  } catch (err) {
    console.warn('Real-time Google Sheet append skipped or deferred:', err);
  }
};
