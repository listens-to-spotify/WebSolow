export const PhaseExampleChartConfig = {
    type: 'line',
    data: {
        datasets: [
            { label: 'y = k^α', data: [], borderColor: 'rgba(59, 130, 246, 0.5)', fill: false, pointRadius: 0 },
            { label: 's·f(k)', data: [], borderColor: 'rgba(34, 197, 94, 0.5)', fill: "+1", pointRadius: 0 },
            { label: '(δ + n + g)·k', data: [], borderColor: 'rgba(239, 68, 68, 0.5)', fill: false, pointRadius: 0 },
            { label: 'k*', data: [], borderColor: 'rgba(239, 68, 68, 0.5)', borderDash: [5, 5], fill: false, pointRadius: 0 },
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'linear',
                title: {
                    display: true,
                    text: 'k'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'y'
                }
            }
        },
        interaction: {
            intersect: false
        },
        plugins: {
            title: {
                color: "oklch(0.546 0.245 262.881)",
                display: true,
                text: 'Фазовый портрет'
            },
            legend: false
        }
    }
}