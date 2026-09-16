import 'server-only'
import { neutralizeSpreadsheetCell } from '@/lib/contact/format'

type AppendArgs = {
  name: string
  email: string
  message: string
  status: 'email_sent' | 'email_failed'
}

export type SheetAppendResult =
  | { ok: true }
  | { ok: false; reason: 'not_configured' | 'failed' }

function getPrivateKey() {
  const base64Key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_B64
  if (base64Key) {
    try {
      return Buffer.from(base64Key, 'base64').toString('utf8')
    } catch {
      return ''
    }
  }

  return (process.env.GOOGLE_SERVICE_ACCOUNT_KEY ?? '').replace(/\\n/g, '\n')
}

export async function appendContactRow(args: AppendArgs): Promise<SheetAppendResult> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
  const sheetName = process.env.GOOGLE_SHEETS_TAB_NAME || 'Contact'
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = getPrivateKey()

  if (!spreadsheetId || !clientEmail || !privateKey) {
    return { ok: false, reason: 'not_configured' }
  }

  try {
    const { google } = await import('googleapis')
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    })
    const sheets = google.sheets({ version: 'v4', auth })
    const safeSheetName = sheetName.replace(/'/g, "''")
    const values = [[
      new Date().toISOString(),
      neutralizeSpreadsheetCell(args.name),
      neutralizeSpreadsheetCell(args.email),
      neutralizeSpreadsheetCell(args.message),
      args.status
    ]]

    await Promise.race([
      sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `'${safeSheetName}'!A1`,
        valueInputOption: 'RAW',
        requestBody: { values }
      }),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('sheets_timeout')), 5000)
      })
    ])

    return { ok: true }
  } catch {
    return { ok: false, reason: 'failed' }
  }
}
