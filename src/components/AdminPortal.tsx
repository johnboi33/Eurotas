import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Search,
  Download,
  Users,
  ClipboardList,
  AlertCircle,
  ArrowLeft,
  MessageCircle,
  MapPin,
  Sparkles,
  LogOut,
  ShieldCheck,
  Database,
  Lock,
  Eye,
  EyeOff,
  Activity,
  Trash2,
} from 'lucide-react';
import {
  getStoredEarlyAccessSubmissions,
  getStoredSurveys,
  StoredEarlyAccess,
  StoredSurvey,
  getSavedSpreadsheetId,
  setSavedSpreadsheetId,
  getSiteActivity,
  clearSiteActivity,
  SiteActivityEvent,
} from '../services/submissionsStore';
import {
  syncSubmissionsToGoogleSheets,
  createFarmLinkSpreadsheet,
  SyncResult,
} from '../services/googleSheets';
import { downloadAllSubmissionsWorkbook } from '../services/spreadsheetExport';
import {
  initAuth,
  googleSignIn,
  getAccessToken,
  logout,
  setCachedAccessToken,
} from '../services/googleAuth';
import { User } from 'firebase/auth';

interface AdminPortalProps {
  onClose: () => void;
}

const ADMIN_SESSION_KEY = 'eurotas_admin_authenticated_v1';
const ADMIN_USERNAME = 'Emperor';
const ADMIN_PASSWORD = 'Emperor33prof';

export const AdminPortal: React.FC<AdminPortalProps> = ({ onClose }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  });
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Data states
  const [earlyAccessList, setEarlyAccessList] = useState<StoredEarlyAccess[]>([]);
  const [surveyList, setSurveyList] = useState<StoredSurvey[]>([]);
  const [activityList, setActivityList] = useState<SiteActivityEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'earlyAccess' | 'surveys' | 'activity'>('earlyAccess');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Sheets sync states
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(getSavedSpreadsheetId());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Selected survey for detail modal
  const [viewingSurvey, setViewingSurvey] = useState<StoredSurvey | null>(null);

  const loadData = () => {
    setEarlyAccessList(getStoredEarlyAccessSubmissions());
    setSurveyList(getStoredSurveys());
    setActivityList(getSiteActivity());
    setSpreadsheetId(getSavedSpreadsheetId());
  };

  useEffect(() => {
    if (!isAdminAuthenticated) return;
    loadData();

    const handleNewSubmission = () => loadData();
    const handleSyncUpdated = () => loadData();
    const handleActivityUpdated = () => loadData();

    window.addEventListener('farmlink:new_submission', handleNewSubmission);
    window.addEventListener('farmlink:sync_updated', handleSyncUpdated);
    window.addEventListener('farmlink:activity_updated', handleActivityUpdated);

    const unsubscribe = initAuth(
      (user, cachedToken) => {
        setCurrentUser(user);
        setToken(cachedToken);
      },
      () => {}
    );

    getAccessToken().then((t) => {
      if (t) setToken(t);
    });

    return () => {
      window.removeEventListener('farmlink:new_submission', handleNewSubmission);
      window.removeEventListener('farmlink:sync_updated', handleSyncUpdated);
      window.removeEventListener('farmlink:activity_updated', handleActivityUpdated);
      if (unsubscribe) unsubscribe();
    };
  }, [isAdminAuthenticated]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername.trim() === ADMIN_USERNAME && loginPassword === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setIsAdminAuthenticated(true);
      setLoginError(null);
      setLoginPassword('');
    } else {
      setLoginError('Invalid username or password. Please check your admin credentials.');
    }
  };

  const handleAdminLock = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdminAuthenticated(false);
    setLoginUsername('');
    setLoginPassword('');
    setLoginError(null);
  };

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setToken(res.accessToken);
        setCachedAccessToken(res.accessToken);
      }
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setAuthError(err?.message || 'Failed to sign in with Google');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    setToken(null);
  };

  const ensureGoogleToken = async (): Promise<string | null> => {
    if (token) return token;
    setIsSigningIn(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setToken(res.accessToken);
        setCachedAccessToken(res.accessToken);
        return res.accessToken;
      }
      return null;
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setAuthError(err?.message || 'Failed to sign in with Google');
      return null;
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSyncToSheets = async () => {
    const activeToken = await ensureGoogleToken();
    if (!activeToken) {
      setSyncStatus('Google sign-in is required to sync directly to Google Sheets.');
      return;
    }

    setIsSyncing(true);
    setSyncStatus('Connecting to Google Sheets API...');
    try {
      const result: SyncResult = await syncSubmissionsToGoogleSheets(
        activeToken,
        spreadsheetId || undefined
      );
      setSpreadsheetId(result.spreadsheetId);
      loadData();
      setSyncStatus(
        `Synced ${result.earlyAccessCount} Early Access lead(s), ${result.surveyCount} Survey response(s), and ${result.activityCount} site activity event(s).`
      );
    } catch (err: any) {
      console.error('Sync error:', err);
      setSyncStatus(`Sync failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreateNewSheet = async () => {
    const activeToken = await ensureGoogleToken();
    if (!activeToken) {
      setSyncStatus('Google sign-in is required to create your Google Spreadsheet.');
      return;
    }
    setIsSyncing(true);
    setSyncStatus('Creating your formatted 3-tab Google Spreadsheet...');
    try {
      const created = await createFarmLinkSpreadsheet(activeToken);
      setSpreadsheetId(created.id);
      setSavedSpreadsheetId(created.id);
      setSyncStatus('Google Sheet created! Populating all Early Access, Survey & Activity records...');
      const result = await syncSubmissionsToGoogleSheets(activeToken, created.id, true);
      loadData();
      setSyncStatus(
        `Spreadsheet created and populated with ${result.earlyAccessCount} Early Access lead(s), ${result.surveyCount} Survey response(s), and ${result.activityCount} activity event(s).`
      );
    } catch (err: any) {
      console.error('Create sheet error:', err);
      setSyncStatus(`Failed to create spreadsheet: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadWorkbook = () => {
    downloadAllSubmissionsWorkbook(earlyAccessList, surveyList, activityList);
    setSyncStatus(
      `Downloaded multi-tab Excel workbook with ${earlyAccessList.length} Early Access lead(s), ${surveyList.length} Survey response(s), and ${activityList.length} activity event(s).`
    );
  };

  const exportEarlyAccessCSV = () => {
    const headers = [
      'ID',
      'Date',
      'Full Name',
      'WhatsApp Number',
      'Role',
      'City / State',
      'Main Produce',
      'Biggest Challenge',
      'Early Access Choice',
      'Synced To Sheets',
    ];
    const rows = earlyAccessList.map((ea) => [
      ea.id,
      new Date(ea.submittedAt).toLocaleString('en-GB'),
      `"${ea.fullName.replace(/"/g, '""')}"`,
      `"${ea.whatsappNumber}"`,
      ea.role,
      `"${ea.cityOrState.replace(/"/g, '""')}"`,
      ea.mainProduce,
      `"${ea.biggestChallenge}"`,
      ea.wouldLikeEarlyAccess,
      ea.syncedToGoogleSheets ? 'Yes' : 'No',
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `farmlink_early_access_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSurveysCSV = () => {
    const headers = [
      'ID',
      'Date',
      'Name',
      'WhatsApp',
      'Email',
      'Role',
      'Produce',
      'Location',
      'Challenge',
      'Loss (%)',
      'Tools',
      'Payment',
      'Interest',
      'Feature',
    ];
    const rows = surveyList.map((s) => [
      s.id,
      new Date(s.submittedAt).toLocaleString('en-GB'),
      `"${s.fullName.replace(/"/g, '""')}"`,
      `"${s.whatsappNumber}"`,
      `"${s.email || ''}"`,
      `"${s.roleDescription}"`,
      `"${s.produceTypes.join('; ')}"`,
      `"${s.cityOrState.replace(/"/g, '""')}"`,
      `"${s.biggestChallenge}"`,
      `"${s.estimatedLoss}"`,
      `"${s.currentTools.join('; ')}"`,
      `"${s.preferredPayment}"`,
      `"${s.launchInterest}"`,
      `"${s.mustHaveFeature.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `farmlink_surveys_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalSubmissions = earlyAccessList.length + surveyList.length;
  const syncedEarlyAccessCount = earlyAccessList.filter((i) => i.syncedToGoogleSheets).length;
  const syncedSurveyCount = surveyList.filter((i) => i.syncedToGoogleSheets).length;
  const totalSynced = syncedEarlyAccessCount + syncedSurveyCount;
  const syncPercentage = totalSubmissions > 0 ? Math.round((totalSynced / totalSubmissions) * 100) : 0;

  const filteredEarlyAccess = earlyAccessList.filter((item) => {
    const matchesSearch =
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cityOrState.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.whatsappNumber.includes(searchTerm) ||
      item.mainProduce.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || item.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredSurveys = surveyList.filter((item) => {
    return (
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cityOrState.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.whatsappNumber.includes(searchTerm) ||
      item.produceTypes.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const filteredActivity = activityList.filter((item) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.details.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q)
    );
  });

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#092C24] text-[#FFF9ED] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10 space-y-6">
          {/* Brand Lockup */}
          <div className="flex flex-col items-center text-center space-y-3">
            <picture className="h-16 w-auto flex items-center justify-center">
              <source srcSet="/assets/eurotas-logo.webp" type="image/webp" />
              <img
                src="/assets/eurotas-logo.png"
                alt="Eurotas logo"
                width={360}
                height={239}
                loading="eager"
                decoding="async"
                className="h-16 w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              />
            </picture>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                Restricted Owner Access
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#FFF9ED] mt-1">
                FarmLink Admin Monitor
              </h1>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white text-[#202522] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D4AF37]/45">
            <form onSubmit={handleAdminLogin} className="space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#092C24]/10">
                <div className="w-9 h-9 rounded-xl bg-[#092C24] text-[#D4AF37] flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#092C24]">Sign in to continue</h2>
                  <p className="text-[11px] text-[#202522]/65">
                    Enter your administrator username and password.
                  </p>
                </div>
              </div>

              {loginError && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="admin-username"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#092C24] mb-1.5"
                >
                  Username
                </label>
                <input
                  id="admin-username"
                  type="text"
                  required
                  autoComplete="username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full px-4 py-3 rounded-xl border border-[#092C24]/20 text-[#202522] text-sm focus:outline-none focus:ring-2 focus:ring-[#075B3D] bg-[#FFF9ED]/40 focus:bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#092C24] mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full pl-4 pr-11 py-3 rounded-xl border border-[#092C24]/20 text-[#202522] text-sm focus:outline-none focus:ring-2 focus:ring-[#075B3D] bg-[#FFF9ED]/40 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#202522]/55 hover:text-[#092C24] rounded-lg"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 text-sm font-semibold text-[#092C24] bg-golden-radiance hover:brightness-105 active:brightness-95 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In to Admin Monitor</span>
              </button>
            </form>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#FFF9ED]/75 hover:text-[#FFD700] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Campaign Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9ED] text-[#202522] pb-20">
      {/* Top Admin Navbar */}
      <header className="bg-[#092C24] text-[#FFF9ED] border-b border-[#D4AF37]/30 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#FFF9ED] bg-[#075B3D] hover:bg-[#075B3D]/85 px-3.5 py-2 rounded-lg border border-[#D4AF37]/35 transition-colors whitespace-nowrap"
              >
                <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
                <span>Return to Site</span>
              </button>
              <div className="h-6 w-px bg-[#D4AF37]/25 hidden sm:block" />
              <picture className="h-10 w-auto shrink-0 hidden sm:flex items-center">
                <source srcSet="/assets/eurotas-logo.webp" type="image/webp" />
                <img
                  src="/assets/eurotas-logo.png"
                  alt="Eurotas logo"
                  width={360}
                  height={239}
                  loading="eager"
                  decoding="async"
                  className="h-10 w-auto object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
                />
              </picture>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-lg text-[#FFF9ED] tracking-tight">
                    FarmLink Admin Monitor
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37] hidden md:inline">
                    · Eurotas Systems
                  </span>
                </div>
                <div className="text-[11px] text-[#FFF9ED]/70">
                  Google Sheets Integration &amp; Submissions Ledger
                </div>
              </div>
            </div>

            {/* Auth status & controls */}
            <div className="flex items-center gap-2.5 shrink-0">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div className="text-right hidden md:block">
                    <div className="text-xs font-semibold text-[#FFF9ED]">{currentUser.displayName || 'Google Sheets Linked'}</div>
                    <div className="text-[10px] text-[#D4AF37]">{currentUser.email}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-[#FFF9ED]/75 hover:text-[#FFD700] hover:bg-[#075B3D]/50 rounded-lg transition-colors"
                    title="Disconnect Google Account"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isSigningIn}
                  className="inline-flex items-center gap-2 bg-white text-[#202522] hover:bg-[#FFF9ED] font-semibold text-xs px-3 py-2 rounded-lg shadow-sm border border-[#D4AF37]/40 transition-colors whitespace-nowrap"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="hidden sm:inline">{isSigningIn ? 'Connecting...' : 'Connect Google Sheets'}</span>
                  <span className="sm:hidden">{isSigningIn ? '...' : 'Sheets'}</span>
                </button>
              )}

              <button
                onClick={handleAdminLock}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] bg-[#092C24] hover:bg-[#075B3D] px-3 py-2 rounded-lg border border-[#D4AF37]/40 transition-colors whitespace-nowrap"
                title="Lock Admin Session"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Google Sheets Connection Card */}
        <div className="bg-white rounded-2xl border border-[#D4AF37]/40 p-6 shadow-xs">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#092C24] border border-[#D4AF37]/50 text-[#D4AF37] flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-xl font-semibold text-[#092C24] tracking-tight">
                    Google Sheets Live Storage
                  </h2>
                  {spreadsheetId ? (
                    <span className="text-[11px] font-semibold text-[#075B3D] inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#075B3D]" />
                      Spreadsheet Linked
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-[#8A6414]">
                      · Sheet Not Created Yet
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-[#202522]/75 mt-1 max-w-2xl">
                  Every early-access lead and survey response is captured locally and synced directly to your
                  dedicated Google Sheet in Google Drive.
                </p>
                {spreadsheetId && (
                  <div className="mt-2 text-xs text-[#202522]/65 font-mono flex items-center gap-1.5">
                    <span>Sheet ID:</span>
                    <span className="bg-[#FFF9ED] px-2 py-0.5 rounded border border-[#092C24]/10 text-[#092C24]">
                      {spreadsheetId}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Sync Controls */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              <button
                onClick={handleDownloadWorkbook}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FFF9ED] hover:bg-[#092C24]/5 text-[#092C24] text-xs font-semibold transition-colors border border-[#092C24]/20"
                title="Download all Early Access, Surveys, and Activity in one multi-tab Excel file"
              >
                <Download className="w-3.5 h-3.5 text-[#075B3D]" />
                <span>Download All (.xls)</span>
              </button>

              {spreadsheetId ? (
                <>
                  <a
                    href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FFF9ED] hover:bg-[#092C24]/5 text-[#092C24] text-xs font-semibold transition-colors border border-[#092C24]/15"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#075B3D]" />
                    <span>Open Google Sheet</span>
                  </a>

                  <button
                    onClick={handleSyncToSheets}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#075B3D] hover:bg-[#092C24] text-[#FFF9ED] text-xs font-semibold transition-all shadow-xs border border-[#D4AF37]/30 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#D4AF37] ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Pending'}</span>
                  </button>

                  <button
                    onClick={handleCreateNewSheet}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#FFF9ED] text-[#8A6414] text-xs font-semibold transition-colors border border-[#D4AF37]/40 disabled:opacity-50"
                    title="Create a fresh 3-tab Google Spreadsheet with all submissions"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>New Sheet</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleCreateNewSheet}
                  disabled={isSyncing}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-golden-radiance hover:brightness-105 text-[#092C24] text-xs font-semibold transition-all shadow-xs disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSyncing ? 'Creating...' : 'Create Google Spreadsheet'}</span>
                </button>
              )}
            </div>
          </div>

          {syncStatus && (
            <div className="mt-4 p-3 rounded-xl bg-[#FFF9ED] border border-[#D4AF37]/40 text-[#092C24] text-xs font-medium flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <span>{syncStatus}</span>
                {spreadsheetId && (
                  <a
                    href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#075B3D] font-bold underline hover:text-[#092C24]"
                  >
                    <span>Open Spreadsheet</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <button onClick={() => setSyncStatus(null)} className="text-[#075B3D] font-semibold hover:underline">
                Dismiss
              </button>
            </div>
          )}

          {authError && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#092C24]/12 shadow-xs">
            <div className="flex items-center justify-between text-[#202522]/65 text-xs font-semibold">
              <span>Total Submissions</span>
              <Users className="w-4 h-4 text-[#075B3D]" />
            </div>
            <div className="text-3xl font-bold text-[#092C24] mt-2 tabular-nums">
              {totalSubmissions}
            </div>
            <div className="text-[11px] text-[#202522]/60 mt-1">Across all forms on page</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#092C24]/12 shadow-xs">
            <div className="flex items-center justify-between text-[#202522]/65 text-xs font-semibold">
              <span>Early Access Leads</span>
              <ShieldCheck className="w-4 h-4 text-[#075B3D]" />
            </div>
            <div className="text-3xl font-bold text-[#092C24] mt-2 tabular-nums">
              {earlyAccessList.length}
            </div>
            <div className="text-[11px] text-[#075B3D] font-medium mt-1 tabular-nums">
              {syncedEarlyAccessCount} synced to Google Sheets
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#092C24]/12 shadow-xs">
            <div className="flex items-center justify-between text-[#202522]/65 text-xs font-semibold">
              <span>Survey Responses</span>
              <ClipboardList className="w-4 h-4 text-[#8A6414]" />
            </div>
            <div className="text-3xl font-bold text-[#092C24] mt-2 tabular-nums">
              {surveyList.length}
            </div>
            <div className="text-[11px] text-[#8A6414] font-medium mt-1 tabular-nums">
              {syncedSurveyCount} synced to Google Sheets
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#092C24]/12 shadow-xs">
            <div className="flex items-center justify-between text-[#202522]/65 text-xs font-semibold">
              <span>Google Sheets Sync Rate</span>
              <Database className="w-4 h-4 text-[#075B3D]" />
            </div>
            <div className="text-3xl font-bold text-[#092C24] mt-2 tabular-nums">
              {syncPercentage}%
            </div>
            <div className="w-full bg-[#FFF9ED] h-1.5 rounded-full mt-2 overflow-hidden border border-[#092C24]/10">
              <div
                className="bg-[#075B3D] h-full rounded-full transition-all duration-300"
                style={{ width: `${syncPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabbed Submissions Table */}
        <div className="bg-white rounded-2xl border border-[#092C24]/12 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-[#092C24]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('earlyAccess')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'earlyAccess'
                    ? 'bg-[#092C24] text-[#FFF9ED] border border-[#D4AF37]/40'
                    : 'text-[#202522]/75 hover:bg-[#FFF9ED]'
                }`}
              >
                Early Access Leads ({earlyAccessList.length})
              </button>
              <button
                onClick={() => setActiveTab('surveys')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'surveys'
                    ? 'bg-[#092C24] text-[#FFF9ED] border border-[#D4AF37]/40'
                    : 'text-[#202522]/75 hover:bg-[#FFF9ED]'
                }`}
              >
                Survey Responses ({surveyList.length})
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-1.5 ${
                  activeTab === 'activity'
                    ? 'bg-[#092C24] text-[#FFF9ED] border border-[#D4AF37]/40'
                    : 'text-[#202522]/75 hover:bg-[#FFF9ED]'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Site Activity ({activityList.length})</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-[#202522]/45 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={activeTab === 'activity' ? 'Search activity...' : 'Search name, phone, city...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#092C24]/20 bg-[#FFF9ED]/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#075B3D]"
                />
              </div>

              {activeTab === 'earlyAccess' && (
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-[#092C24]/20 bg-[#FFF9ED]/40 font-medium text-[#202522] focus:outline-none"
                >
                  <option value="ALL">All Roles</option>
                  <option value="Farmer">Farmers</option>
                  <option value="Aggregator/Trader">Aggregators</option>
                  <option value="Transporter">Transporters</option>
                  <option value="Buyer/Wholesaler">Buyers</option>
                  <option value="Processor">Processors</option>
                </select>
              )}

              {activeTab === 'activity' ? (
                <button
                  onClick={() => {
                    clearSiteActivity();
                    loadData();
                  }}
                  disabled={activityList.length === 0}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#092C24] bg-[#FFF9ED] hover:bg-[#092C24]/5 rounded-xl border border-[#092C24]/15 transition-colors disabled:opacity-40"
                  title="Clear Activity History"
                >
                  <Trash2 className="w-3.5 h-3.5 text-[#075B3D]" />
                  <span>Clear Log</span>
                </button>
              ) : (
                <button
                  onClick={activeTab === 'earlyAccess' ? exportEarlyAccessCSV : exportSurveysCSV}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#092C24] bg-[#FFF9ED] hover:bg-[#092C24]/5 rounded-xl border border-[#092C24]/15 transition-colors"
                  title="Download CSV"
                >
                  <Download className="w-3.5 h-3.5 text-[#075B3D]" />
                  <span>Export CSV</span>
                </button>
              )}
            </div>
          </div>

          {/* TAB 1: EARLY ACCESS TABLE */}
          {activeTab === 'earlyAccess' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#202522]">
                <thead className="bg-[#FFF9ED] text-[11px] font-semibold uppercase tracking-wider text-[#092C24]/70 border-b border-[#092C24]/10">
                  <tr>
                    <th className="py-3.5 px-4">Lead</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Produce</th>
                    <th className="py-3.5 px-4">Biggest Challenge</th>
                    <th className="py-3.5 px-4">WhatsApp Contact</th>
                    <th className="py-3.5 px-4">Google Sheet</th>
                    <th className="py-3.5 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#092C24]/10">
                  {filteredEarlyAccess.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-[#202522]/60 text-xs">
                        No submissions match your search query.
                      </td>
                    </tr>
                  ) : (
                    filteredEarlyAccess.map((item) => (
                      <tr key={item.id} className="hover:bg-[#FFF9ED]/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-[#092C24] text-xs">{item.fullName}</div>
                          <div className="text-[10px] text-[#202522]/50 font-mono">{item.id}</div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#075B3D]">
                          {item.role}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1 text-[#202522]">
                            <MapPin className="w-3 h-3 text-[#075B3D] shrink-0" />
                            <span className="truncate max-w-[140px]">{item.cityOrState}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#092C24]">
                          {item.mainProduce}
                        </td>
                        <td className="py-3.5 px-4 text-[#202522]/75 max-w-[180px] truncate" title={item.biggestChallenge}>
                          {item.biggestChallenge}
                        </td>
                        <td className="py-3.5 px-4">
                          <a
                            href={`https://wa.me/${item.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                              item.fullName
                            )}%2C%20following%20up%20on%20your%20FarmLink%20Early%20Access%20registration.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#075B3D] bg-[#FFF9ED] hover:bg-[#075B3D]/10 px-2.5 py-1 rounded-md border border-[#092C24]/15 transition-colors tabular-nums"
                          >
                            <MessageCircle className="w-3 h-3 text-[#075B3D]" />
                            <span>{item.whatsappNumber}</span>
                          </a>
                        </td>
                        <td className="py-3.5 px-4">
                          {item.syncedToGoogleSheets ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#075B3D]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Synced
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-[#8A6414]">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-[11px] text-[#202522]/65 font-mono tabular-nums whitespace-nowrap">
                          {new Date(item.submittedAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: SURVEYS TABLE */}
          {activeTab === 'surveys' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#202522]">
                <thead className="bg-[#FFF9ED] text-[11px] font-semibold uppercase tracking-wider text-[#092C24]/70 border-b border-[#092C24]/10">
                  <tr>
                    <th className="py-3.5 px-4">Respondent</th>
                    <th className="py-3.5 px-4">Role Description</th>
                    <th className="py-3.5 px-4">Produce</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Est. Loss</th>
                    <th className="py-3.5 px-4">Must-Have Feature</th>
                    <th className="py-3.5 px-4">Google Sheet</th>
                    <th className="py-3.5 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#092C24]/10">
                  {filteredSurveys.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-[#202522]/60 text-xs">
                        No survey responses found.
                      </td>
                    </tr>
                  ) : (
                    filteredSurveys.map((item) => (
                      <tr key={item.id} className="hover:bg-[#FFF9ED]/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-[#092C24]">{item.fullName}</div>
                          <div className="text-[10px] text-[#202522]/60 font-mono tabular-nums">{item.whatsappNumber}</div>
                        </td>
                        <td className="py-3.5 px-4 max-w-[160px] truncate" title={item.roleDescription}>
                          {item.roleDescription}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#075B3D]">
                          {item.produceTypes.join(', ')}
                        </td>
                        <td className="py-3.5 px-4 text-[#092C24]">{item.cityOrState}</td>
                        <td className="py-3.5 px-4 font-semibold text-rose-700">
                          {item.estimatedLoss}
                        </td>
                        <td className="py-3.5 px-4 max-w-[200px] truncate text-[#202522]/75" title={item.mustHaveFeature}>
                          {item.mustHaveFeature}
                        </td>
                        <td className="py-3.5 px-4">
                          {item.syncedToGoogleSheets ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#075B3D]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Synced
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-[#8A6414]">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => setViewingSurvey(item)}
                            className="px-3 py-1 text-[11px] font-semibold text-[#FFF9ED] bg-[#075B3D] hover:bg-[#092C24] rounded-md transition-colors"
                          >
                            View All 10
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: SITE ACTIVITY LOG */}
          {activeTab === 'activity' && (
            <div className="divide-y divide-[#092C24]/10">
              {filteredActivity.length === 0 ? (
                <div className="py-12 text-center text-[#202522]/60 text-xs">
                  No site activity recorded yet. Visits, role selections, form submissions, and sheet syncs appear here automatically.
                </div>
              ) : (
                filteredActivity.map((event) => (
                  <div
                    key={event.id}
                    className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#FFF9ED]/50 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#092C24]/5 text-[#075B3D] border border-[#092C24]/10">
                          {event.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-semibold text-[#092C24]">{event.title}</span>
                      </div>
                      <p className="text-xs text-[#202522]/75">{event.details}</p>
                    </div>
                    <div className="text-[11px] font-mono text-[#202522]/60 tabular-nums whitespace-nowrap">
                      {new Date(event.timestamp).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Survey Detail Modal */}
      {viewingSurvey && (
        <div className="fixed inset-0 z-50 bg-[#092C24]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#D4AF37]/40 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-[#092C24]/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#202522]/55">{viewingSurvey.id}</span>
                <h3 className="font-display text-xl font-bold text-[#092C24]">Survey Response Details</h3>
              </div>
              <button
                onClick={() => setViewingSurvey(null)}
                className="w-8 h-8 rounded-full bg-[#FFF9ED] text-[#092C24] hover:bg-[#092C24]/10 flex items-center justify-center text-sm font-bold border border-[#092C24]/15"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#FFF9ED] p-4 rounded-xl border border-[#D4AF37]/35">
                <span className="font-semibold text-[#075B3D] uppercase tracking-wider text-[10px] block mb-1">
                  Respondent Information
                </span>
                <div className="text-sm font-bold text-[#092C24]">{viewingSurvey.fullName}</div>
                <div className="text-[#202522]/80 mt-0.5">WhatsApp: {viewingSurvey.whatsappNumber}</div>
                {viewingSurvey.email && <div className="text-[#202522]/80">Email: {viewingSurvey.email}</div>}
                <div className="text-[#202522]/80">Location: {viewingSurvey.cityOrState}</div>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-[#092C24]/10">
                  <strong className="text-[#092C24] block mb-0.5">1. Role Description:</strong>
                  <span className="text-[#202522]/80">{viewingSurvey.roleDescription}</span>
                </div>
                <div className="p-3 rounded-lg border border-[#092C24]/10">
                  <strong className="text-[#092C24] block mb-0.5">2. Produce Handled:</strong>
                  <span className="text-[#075B3D] font-semibold">{viewingSurvey.produceTypes.join(', ')}</span>
                </div>
                <div className="p-3 rounded-lg border border-[#092C24]/10">
                  <strong className="text-[#092C24] block mb-0.5">4. Biggest Produce Challenge:</strong>
                  <span className="text-[#202522]/80">{viewingSurvey.biggestChallenge}</span>
                </div>
                <div className="p-3 rounded-lg border border-[#092C24]/10">
                  <strong className="text-[#092C24] block mb-0.5">5. Estimated Produce Loss:</strong>
                  <span className="text-rose-700 font-bold">{viewingSurvey.estimatedLoss}</span>
                </div>
                <div className="p-3 rounded-lg border border-[#092C24]/10">
                  <strong className="text-[#092C24] block mb-0.5">6. Current Tools Used:</strong>
                  <span className="text-[#202522]/80">{viewingSurvey.currentTools.join(', ')}</span>
                </div>
                <div className="p-3 rounded-lg border border-[#092C24]/10">
                  <strong className="text-[#092C24] block mb-0.5">7. Preferred Payment Method:</strong>
                  <span className="text-[#202522]/80">{viewingSurvey.preferredPayment}</span>
                </div>
                <div className="p-3 rounded-lg border border-[#092C24]/10">
                  <strong className="text-[#092C24] block mb-0.5">8. Interest in FarmLink Launch:</strong>
                  <span className="text-[#075B3D] font-semibold">{viewingSurvey.launchInterest}</span>
                </div>
                <div className="p-3 rounded-lg border border-[#092C24]/10">
                  <strong className="text-[#092C24] block mb-0.5">9. Must-Have Feature for Immediate Use:</strong>
                  <span className="text-[#092C24] font-medium">{viewingSurvey.mustHaveFeature}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#092C24]/10 flex justify-end">
              <button
                onClick={() => setViewingSurvey(null)}
                className="px-5 py-2.5 bg-[#092C24] text-[#FFF9ED] rounded-xl text-xs font-semibold border border-[#D4AF37]/30"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
