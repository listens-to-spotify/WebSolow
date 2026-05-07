export const PhaseChartConfig = {
    type: 'line',
    data: {
        datasets: [
            { label: 'y = k^α', data: [], borderColor: 'rgba(59, 130, 246, 0.5)', fill: false, pointRadius: 0 },
            { label: 's·f(k)', data: [], borderColor: 'rgba(34, 197, 94, 0.5)', fill: false, pointRadius: 0 },
            { label: '(δ+n+g)·k', data: [], borderColor: 'rgba(239, 68, 68, 0.5)', fill: false, pointRadius: 0 },
            { label: 'k* (старый)', data: [], borderColor: 'rgba(156, 163, 175, 0.5)', borderDash: [5, 5], fill: false, pointRadius: 0, hidden: true },
            { label: 'k* (новый)', data: [], borderColor: 'rgba(239, 68, 68, 0.5)', borderDash: [5, 5], fill: false, pointRadius: 0, hidden: true },
            { label: 'y = k^α (старая)', data: [], borderColor: 'rgba(156, 163, 175, 0.5)', borderDash: [5, 5], fill: false, pointRadius: 0, hidden: true },
            { label: 's·f(k) (старая)', data: [], borderColor: 'rgba(156, 163, 175, 0.5)', borderDash: [5, 5], fill: false, pointRadius: 0, hidden: true },
            { label: '(δ+n+g)·k (старая)', data: [], borderColor: 'rgba(156, 163, 175, 0.5)', borderDash: [5, 5], fill: false, pointRadius: 0, hidden: true }
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
            legend: {
                position: 'right',
                labels: {
                    usePointStyle: true
                }
            }
        }
    }
}

export const DynamicChartConfig = {
    type: 'line',
    data: {
        datasets: [
            { label: 'k(t)', data: [], borderColor: 'rgba(59, 130, 246, 0.5)', fill: false, pointRadius: 0, tension: 0.1 },
            { label: 'y(t)', data: [], borderColor: 'rgba(34, 197, 94, 0.5)', fill: false, pointRadius: 0, tension: 0.1 },
            { label: 'c(t)', data: [], borderColor: 'rgba(168, 85, 247, 0.5)', fill: false, pointRadius: 0, tension: 0.1 }
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
                    text: 't',
                } 
            },
            y: {
                title: {
                    display: true,
                    text: 'k, c, y',
                },
                min: 0 
            }
        },
        interaction: {
            intersect: false
        },
        plugins: {
            title: {
                color: "oklch(0.546 0.245 262.881)",
                display: true,
                text: 'Динамика показателей'
            },
            legend: {
                position: 'right',
                labels: {
                    usePointStyle: true
                }
            }
        }
    }
}

export const GrowthChartConfig = {
    type: 'line',
    data: {
        datasets: [
            { label: 'r(t)', data: [], borderColor: 'rgba(239, 68, 68, 0.5)', fill: false, pointRadius: 0, tension: 0.1 },
            { label: 'gw(t)', data: [], borderColor: 'rgba(245, 158, 11, 0.5)', fill: false, pointRadius: 0, tension: 0.1 }
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
                    text: 't' 
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'r, gw'
                }, 
                min: -0.1, 
                max: 0.4
            }
        },
        interaction: {
            intersect: false
        },
        plugins: {
            title: {
                color: "oklch(0.546 0.245 262.881)",
                display: true,
                text: 'Темпы роста'
            },
            legend: {
                position: 'right',
                labels: {
                    usePointStyle: true
                }
            },
        }
    }
}