import 'server-only'

type AppendArgs = {
name: string
email: string
message: string
status: 'email_sent' | 'email_failed' | 'logged_only'
ip?: string
ua?: string
referer?: string
}

function getPrivateKey() {
const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_B64
if (b64) {
try { return Buffer.from(b64, 'base64').toString('utf8') } catch { /* noop */ }
}
const k = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || ''
return k.replace(/\\n/g, '\n')
}

export async function appendContactRow(a: AppendArgs): Promise<{ ok: boolean }> {
const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
const sheetName = process.env.GOOGLE_SHEETS_TAB_NAME || 'Contact'
const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
const privateKey = getPrivateKey()
if (!spreadsheetId || !clientEmail || !privateKey) return { ok: false }

try {
const { google } = await import('googleapis')
const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
})
const sheets = google.sheets({ version: 'v4', auth })
const values = [[
    new Date().toISOString(),
    a.name,
    a.email,
    a.message,
    a.status,
    a.ip || '',
    a.ua || '',
    a.referer || ''
]]

await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values }
})
return { ok: true }
} catch {
return { ok: false }
}
}
