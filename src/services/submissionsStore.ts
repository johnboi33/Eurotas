import { EarlyAccessFormData, SurveyFormData, RoleType, ProduceType, ChallengeType } from '../types';

export interface StoredEarlyAccess extends EarlyAccessFormData {
  id: string;
  submittedAt: string;
  syncedToGoogleSheets: boolean;
  syncedAt?: string;
}

export interface StoredSurvey extends SurveyFormData {
  id: string;
  submittedAt: string;
  syncedToGoogleSheets: boolean;
  syncedAt?: string;
}

const STORAGE_KEY_EARLY_ACCESS = 'farmlink_early_access_submissions_v1';
const STORAGE_KEY_SURVEYS = 'farmlink_survey_submissions_v1';
const STORAGE_KEY_SHEET_ID = 'farmlink_google_sheet_id_v1';

// Initial realistic seed data so admin monitoring is instantly meaningful
const INITIAL_EARLY_ACCESS: StoredEarlyAccess[] = [
  {
    id: 'EA-0101',
    fullName: 'Mallam Ibrahim Musa',
    whatsappNumber: '+234 803 452 8819',
    role: 'Farmer',
    cityOrState: 'Kura LGA, Kano State',
    mainProduce: 'Tomatoes',
    biggestChallenge: 'Produce Spoilage / Post-Harvest Losses',
    wouldLikeEarlyAccess: 'Yes',
    submittedAt: '2026-11-10T14:22:00.000Z',
    syncedToGoogleSheets: false,
  },
  {
    id: 'EA-0102',
    fullName: 'Mrs. Grace Adeleke',
    whatsappNumber: '+234 812 770 3341',
    role: 'Aggregator/Trader',
    cityOrState: 'Mile 12 Market, Lagos',
    mainProduce: 'Peppers (Rodo / Tatase / Bawa)',
    biggestChallenge: 'Finding Reliable Buyers',
    wouldLikeEarlyAccess: 'Yes',
    submittedAt: '2026-11-10T17:45:00.000Z',
    syncedToGoogleSheets: false,
  },
  {
    id: 'EA-0103',
    fullName: 'Captain Danladi Sani',
    whatsappNumber: '+234 802 991 4455',
    role: 'Transporter',
    cityOrState: 'Jos North, Plateau State',
    mainProduce: 'Tomatoes',
    biggestChallenge: 'Transport Delays & Breakdowns',
    wouldLikeEarlyAccess: 'Yes',
    submittedAt: '2026-11-11T08:15:00.000Z',
    syncedToGoogleSheets: false,
  },
  {
    id: 'EA-0104',
    fullName: 'Chief Emeka Okafor',
    whatsappNumber: '+234 805 332 9901',
    role: 'Buyer/Wholesaler',
    cityOrState: 'Oyingbo Market, Lagos',
    mainProduce: 'Onions',
    biggestChallenge: 'Late or Unclear Payments',
    wouldLikeEarlyAccess: 'Yes',
    submittedAt: '2026-11-11T11:30:00.000Z',
    syncedToGoogleSheets: false,
  },
  {
    id: 'EA-0105',
    fullName: 'Dr. Fatima Balarabe',
    whatsappNumber: '+234 809 112 5588',
    role: 'Processor',
    cityOrState: 'Kaduna South, Kaduna State',
    mainProduce: 'Tomatoes',
    biggestChallenge: 'Finding Reliable Buyers',
    wouldLikeEarlyAccess: 'Yes',
    submittedAt: '2026-11-11T16:04:00.000Z',
    syncedToGoogleSheets: false,
  },
];

const INITIAL_SURVEYS: StoredSurvey[] = [
  {
    id: 'SUR-0201',
    roleDescription: 'Produce Aggregator / Local Buying Agent',
    produceTypes: ['Tomatoes', 'Peppers (Scotch Bonnet / Rodo)'],
    cityOrState: 'Jos, Plateau State',
    biggestChallenge: 'Produce spoilage / heat delay in transit',
    estimatedLoss: '25% – 40% of harvest lost',
    currentTools: ['Phone calls & SMS', 'Physical middlemen at market'],
    preferredPayment: 'Escrow holding (funds locked safely before truck leaves)',
    launchInterest: 'Definitely yes — ready to test immediately',
    mustHaveFeature: 'Guaranteed refrigerated truck slots departing Jos by 4pm daily',
    fullName: 'Suleiman Yakubu',
    whatsappNumber: '+234 806 881 2233',
    email: 'suleiman.yakubu@gmail.com',
    submittedAt: '2026-11-10T15:30:00.000Z',
    syncedToGoogleSheets: false,
  },
  {
    id: 'SUR-0202',
    roleDescription: 'Market Wholesaler / Retail Trader (e.g. Mile 12, Bodija)',
    produceTypes: ['Peppers (Tatase / Bell Pepper)', 'Tomatoes'],
    cityOrState: 'Mile 12, Lagos State',
    biggestChallenge: 'Damage to crates / dispute over quantity at arrival',
    estimatedLoss: '10% – 25%',
    currentTools: ['WhatsApp groups', 'Paper notebooks & handwritten receipts'],
    preferredPayment: 'Direct bank transfer upon verified delivery',
    launchInterest: 'Definitely yes — ready to test immediately',
    mustHaveFeature: 'Photo-verified crate count before dispatch from farm',
    fullName: 'Alhaja Kudirat Bello',
    whatsappNumber: '+234 802 344 7789',
    email: 'bello.produce@yahoo.com',
    submittedAt: '2026-11-11T09:40:00.000Z',
    syncedToGoogleSheets: false,
  },
];

export const getStoredEarlyAccessSubmissions = (): StoredEarlyAccess[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EARLY_ACCESS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_EARLY_ACCESS, JSON.stringify(INITIAL_EARLY_ACCESS));
      return INITIAL_EARLY_ACCESS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading early access storage:', err);
    return INITIAL_EARLY_ACCESS;
  }
};

export const getStoredSurveys = (): StoredSurvey[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SURVEYS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SURVEYS, JSON.stringify(INITIAL_SURVEYS));
      return INITIAL_SURVEYS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading survey storage:', err);
    return INITIAL_SURVEYS;
  }
};

export interface SiteActivityEvent {
  id: string;
  type: 'visit' | 'early_access' | 'survey' | 'role_interest' | 'sheet_sync';
  title: string;
  details: string;
  timestamp: string;
}

const STORAGE_KEY_ACTIVITY = 'farmlink_site_activity_v1';

export const getSiteActivity = (): SiteActivityEvent[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVITY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const logSiteActivity = (
  type: SiteActivityEvent['type'],
  title: string,
  details: string
) => {
  try {
    const current = getSiteActivity();
    const event: SiteActivityEvent = {
      id: `ACT-${Date.now().toString(36).toUpperCase()}`,
      type,
      title,
      details,
      timestamp: new Date().toISOString(),
    };
    const updated = [event, ...current].slice(0, 100);
    localStorage.setItem(STORAGE_KEY_ACTIVITY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('farmlink:activity_updated'));
  } catch (err) {
    console.error('Error logging site activity:', err);
  }
};

export const clearSiteActivity = () => {
  localStorage.removeItem(STORAGE_KEY_ACTIVITY);
  window.dispatchEvent(new CustomEvent('farmlink:activity_updated'));
};

export const saveEarlyAccessSubmission = (data: EarlyAccessFormData): StoredEarlyAccess => {
  const current = getStoredEarlyAccessSubmissions();
  const newRecord: StoredEarlyAccess = {
    ...data,
    id: `EA-${Math.floor(1000 + Math.random() * 9000)}`,
    submittedAt: new Date().toISOString(),
    syncedToGoogleSheets: false,
  };
  const updated = [newRecord, ...current];
  localStorage.setItem(STORAGE_KEY_EARLY_ACCESS, JSON.stringify(updated));
  logSiteActivity(
    'early_access',
    `New Early Access Lead (${data.role})`,
    `${data.fullName} from ${data.cityOrState} · ${data.mainProduce}`
  );
  window.dispatchEvent(new CustomEvent('farmlink:new_submission', { detail: { type: 'early_access', record: newRecord } }));
  return newRecord;
};

export const saveSurveySubmission = (data: SurveyFormData): StoredSurvey => {
  const current = getStoredSurveys();
  const newRecord: StoredSurvey = {
    ...data,
    id: `SUR-${Math.floor(1000 + Math.random() * 9000)}`,
    submittedAt: new Date().toISOString(),
    syncedToGoogleSheets: false,
  };
  const updated = [newRecord, ...current];
  localStorage.setItem(STORAGE_KEY_SURVEYS, JSON.stringify(updated));
  logSiteActivity(
    'survey',
    'New Product Survey Submitted',
    `${data.fullName} (${data.cityOrState}) · Loss tier: ${data.estimatedLoss}`
  );
  window.dispatchEvent(new CustomEvent('farmlink:new_submission', { detail: { type: 'survey', record: newRecord } }));
  return newRecord;
};

export const markEarlyAccessSynced = (ids: string[]) => {
  const current = getStoredEarlyAccessSubmissions();
  const updated = current.map((item) =>
    ids.includes(item.id)
      ? { ...item, syncedToGoogleSheets: true, syncedAt: new Date().toISOString() }
      : item
  );
  localStorage.setItem(STORAGE_KEY_EARLY_ACCESS, JSON.stringify(updated));
  logSiteActivity('sheet_sync', 'Google Sheets Synced', `${ids.length} Early Access lead(s) synced.`);
  window.dispatchEvent(new CustomEvent('farmlink:sync_updated'));
};

export const markSurveysSynced = (ids: string[]) => {
  const current = getStoredSurveys();
  const updated = current.map((item) =>
    ids.includes(item.id)
      ? { ...item, syncedToGoogleSheets: true, syncedAt: new Date().toISOString() }
      : item
  );
  localStorage.setItem(STORAGE_KEY_SURVEYS, JSON.stringify(updated));
  logSiteActivity('sheet_sync', 'Google Sheets Synced', `${ids.length} Survey response(s) synced.`);
  window.dispatchEvent(new CustomEvent('farmlink:sync_updated'));
};

export const getSavedSpreadsheetId = (): string | null => {
  return localStorage.getItem(STORAGE_KEY_SHEET_ID);
};

export const setSavedSpreadsheetId = (id: string | null) => {
  if (id) {
    localStorage.setItem(STORAGE_KEY_SHEET_ID, id);
  } else {
    localStorage.removeItem(STORAGE_KEY_SHEET_ID);
  }
};
