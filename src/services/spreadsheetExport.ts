import { StoredEarlyAccess, StoredSurvey, SiteActivityEvent } from './submissionsStore';

const escapeXml = (value: string | number | boolean | undefined | null): string => {
  const str = value === undefined || value === null ? '' : String(value);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const buildWorksheetXml = (name: string, headers: string[], rows: (string | number | boolean)[][]): string => {
  const headerRowXml =
    '<Row ss:StyleID="Header">' +
    headers.map((h) => `<Cell><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`).join('') +
    '</Row>';

  const dataRowsXml = rows
    .map(
      (row) =>
        '<Row>' +
        row
          .map((cell) => {
            const type = typeof cell === 'number' ? 'Number' : 'String';
            return `<Cell><Data ss:Type="${type}">${escapeXml(cell)}</Data></Cell>`;
          })
          .join('') +
        '</Row>'
    )
    .join('');

  return `<Worksheet ss:Name="${escapeXml(name)}"><Table>${headerRowXml}${dataRowsXml}</Table></Worksheet>`;
};

/**
 * Generates and downloads a multi-tab Excel-compatible (.xls) workbook
 * containing all Early Access Leads, Survey Responses, and Site Activity.
 */
export const downloadAllSubmissionsWorkbook = (
  earlyAccess: StoredEarlyAccess[],
  surveys: StoredSurvey[],
  activity: SiteActivityEvent[]
) => {
  const eaHeaders = [
    'Submission ID',
    'Date & Time (UTC)',
    'Full Name',
    'WhatsApp Number',
    'Role',
    'City / State',
    'Main Produce',
    'Biggest Challenge',
    'Early Access Choice',
    'Synced to Google Sheets',
  ];

  const eaRows = earlyAccess.map((ea) => [
    ea.id,
    new Date(ea.submittedAt).toLocaleString('en-GB'),
    ea.fullName,
    ea.whatsappNumber,
    ea.role,
    ea.cityOrState,
    ea.mainProduce,
    ea.biggestChallenge,
    ea.wouldLikeEarlyAccess,
    ea.syncedToGoogleSheets ? 'Yes' : 'No',
  ]);

  const surveyHeaders = [
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
    'Synced to Google Sheets',
  ];

  const surveyRows = surveys.map((s) => [
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
    s.syncedToGoogleSheets ? 'Yes' : 'No',
  ]);

  const activityHeaders = ['Event ID', 'Date & Time (UTC)', 'Type', 'Title', 'Details'];
  const activityRows = activity.map((act) => [
    act.id,
    new Date(act.timestamp).toLocaleString('en-GB'),
    act.type,
    act.title,
    act.details,
  ]);

  const workbookXml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="Header">
      <Font ss:Bold="1" ss:Color="#FFF9ED" />
      <Interior ss:Color="#092C24" ss:Pattern="Solid" />
    </Style>
  </Styles>
  ${buildWorksheetXml('Early Access Leads', eaHeaders, eaRows)}
  ${buildWorksheetXml('Survey Responses', surveyHeaders, surveyRows)}
  ${buildWorksheetXml('Site Activity', activityHeaders, activityRows)}
</Workbook>`;

  const blob = new Blob([workbookXml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `FarmLink_by_Eurotas_All_Submissions_${new Date().toISOString().slice(0, 10)}.xls`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
