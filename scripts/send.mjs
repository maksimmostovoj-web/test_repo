import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join, resolve } from 'path'
import { buildChartUrl } from './chart.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const REPORT_PATH = resolve(
  ROOT,
  process.argv[2] || 'allure-report/widgets/summary.json'
)

function loadReport(path) {
  if (!existsSync(path)) throw new Error(`Report file not found: ${path}`)
  return JSON.parse(readFileSync(path, 'utf8'))
}

function getConfig() {
  const token = process.env.TELEGRAM_TOKEN
  const chat = process.env.TELEGRAM_CHAT
  if (!token || !chat)
    throw new Error(
      'Set TELEGRAM_TOKEN and TELEGRAM_CHAT environment variables.'
    )
  return { token, chat }
}

function getStats(report) {
  const stats = report.statistic ?? report.stats ?? {}
  const total = stats.total ?? 0
  const failed = stats.failed ?? 0
  const broken = stats.broken ?? 0
  const skipped = stats.skipped ?? 0
  const unknown = stats.unknown ?? 0
  const passed =
    stats.passed ?? Math.max(0, total - failed - broken - skipped - unknown)
  return { total, passed, failed, broken, skipped, unknown }
}

function formatDuration(ms) {
  if (ms == null || ms < 0) return '00:00:00.000'
  const totalSec = ms / 1000
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const secInt = Math.floor(s)
  const millis = Math.round((s - secInt) * 1000)
  const secPart = `${String(secInt).padStart(2, '0')}.${String(millis).padStart(3, '0')}`
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${secPart}`
}

function buildMessage(report, stats) {
  const { name, reportName } = report
  const { total, passed, failed, broken, skipped, unknown } = stats
  const duration = report.time?.duration || report.duration || 0
  const project =
    process.env.PROJECT_NAME ?? name ?? reportName ?? 'Test Report'
  const environment = process.env.TEST_ENV ?? 'staging'
  const comment = process.env.TEST_COMMENT ?? ''
  const reportLink = process.env.REPORT_LINK ?? ''
  const pct = (n) => (total > 0 ? ((n / total) * 100).toFixed(1) : '0')

  const lines = [`*${project}*`, '', 'Results:', `Environment: ${environment}`]
  if (comment) lines.push(`Comment: ${comment}`)
  lines.push(
    `Duration: ${formatDuration(duration)}`,
    `Total: ${total}`,
    `Passed: ${passed} (${pct(passed)} %)`,
    `Failed: ${failed} (${pct(failed)} %)`,
    `Skipped: ${skipped}`
  )
  if (broken > 0) lines.push(`Broken: ${broken}`)
  if (unknown > 0) lines.push(`Unknown: ${unknown}`)
  if (reportLink) lines.push(`[Report](${reportLink})`)
  return lines.join('\n')
}

async function sendToTelegram(token, chatId, imageUrl, text) {
  const url = `https://api.telegram.org/bot${token}/sendPhoto`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      photo: imageUrl,
      caption: text,
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    })
  })
  if (!res.ok) throw new Error(`Telegram API error ${res.status}`)
  const data = await res.json()
  if (!data.ok) throw new Error(`Telegram error: ${data.description}`)
  return data
}

async function main() {
  const report = loadReport(REPORT_PATH)
  const { token, chat } = getConfig()
  const stats = getStats(report)
  const chartUrl = buildChartUrl(stats)
  const message = buildMessage(report, stats)
  console.log("MESSAGE:", message);
  console.log('Sending notification to Telegram...')
  await sendToTelegram(token, chat, chartUrl, message)
  console.log('Notification sent successfully!')
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
