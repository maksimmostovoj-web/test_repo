const COLORS = {
  passed: '#22c55e',
  failed: '#ef4444',
  broken: '#eab308',
  skipped: '#94a3b8',
  unknown: '#a855f7'
}

export function buildChartUrl(stats) {
  const { total, passed, failed, broken, skipped, unknown } = stats
  const counts = [passed, failed, broken, skipped, unknown]
  const names = ['passed', 'failed', 'broken', 'skipped', 'unknown']
  const colors = names.map((k) => COLORS[k])
  const pct = (n) => (total > 0 ? Math.round((n / total) * 100) : 0)

  const data = counts.map(pct)
  const legendLabels = names.map((name, i) => `${counts[i]} ${name}`)

  const chartConfig = {
    type: 'doughnut',
    data: {
      labels: legendLabels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderWidth: 0
        }
      ]
    },
    options: {
      cutout: '65%',
      layout: { padding: 12 },
      plugins: {
        legend: {
          display: true,
          position: 'right',
          labels: {
            usePointStyle: true,
            padding: 10,
            font: { size: 12 }
          }
        },
        doughnutlabel: {
          labels: [
            { text: String(total), font: { size: 24 }, color: '#1e293b' },
            { text: 'Total scenarios', font: { size: 11 }, color: '#64748b' }
          ]
        },
        datalabels: {
          display: true,
          color: '#1e293b',
          font: { size: 11, weight: 'bold' }
        },
        tickFormat: {
          suffix: '%',
          applyToDataLabels: true
        }
      }
    }
  }

  const encoded = encodeURIComponent(JSON.stringify(chartConfig))
  return `https://quickchart.io/chart?c=${encoded}&width=320&height=320`
}
