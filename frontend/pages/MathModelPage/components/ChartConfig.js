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

export const PhaseExampleChartEqConfig = {
    type: 'line',
    data: {
        datasets: [
            { label: 'y = k^α', data: [], borderColor: 'rgba(59, 130, 246, 0.5)', fill: false, pointRadius: 0 },
            { label: 's·f(k)', data: [], borderColor: 'rgba(34, 197, 94, 0.5)', fill: "+1", pointRadius: 0 },
            { label: '(δ + n + g)·k', data: [], borderColor: 'rgba(239, 68, 68, 0.5)', fill: false, pointRadius: 0 },
            { label: 'k*', data: [], borderColor: 'rgba(239, 68, 68, 0.5)', borderDash: [5, 5], fill: false, pointRadius: 0 },
            { label: 'k\'', data: [], borderColor: 'rgba(255, 140, 0, 0.5)', borderDash: [5, 5], fill: false, pointRadius: 0},
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

export const DynamicExampleChartEqConfig = {
    type: 'line',
    data: {
        datasets: [
            { label: 'k', data: [], borderColor: 'rgba(59, 130, 246, 0.5)', fill: false, pointRadius: 0 },
            { label: 'y', data: [], borderColor: 'rgba(34, 197, 94, 0.5)', fill: false, pointRadius: 0 },
            { label: 'c', data: [], borderColor: 'rgba(239, 68, 68, 0.5)', fill: false, pointRadius: 0 },
            { label: 't_0', data: [], borderColor: 'rgba(138, 138, 138, 0.5)', borderDash: [5, 5], fill: false, pointRadius: 0},
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
                }
            },
            y: {
                title: {
                    display: false,
                    text: 'k, y, c'
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
                text: 'Динамика показателей'
            },
            legend: false
        }
    }
}

export const GrowthExampleChartEqConfig = {
    type: 'line',
    data: {
        datasets: [
            { label: 'r', data: [], borderColor: 'rgba(59, 130, 246, 0.5)', fill: false, pointRadius: 0 },
            { label: 'gw', data: [], borderColor: 'rgba(34, 197, 94, 0.5)', fill: false, pointRadius: 0 },
            { label: 'gy', data: [], borderColor: 'rgba(239, 68, 68, 0.5)', fill: false, pointRadius: 0 },
            { label: 't_0', data: [], borderColor: 'rgba(138, 138, 138, 0.5)', borderDash: [5, 5], fill: false, pointRadius: 0},
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
                }
            },
            y: {
                title: {
                    display: false,
                    text: 'r, gw, gy'
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
                text: 'Процентная ставка и темпы роста'
            },
            legend: false
        }
    }
}

export const PhaseExampleChartNeqConfig = {
    type: 'line',
    data: {
        datasets: [
            { label: 'y = k^α', data: [], borderColor: 'rgba(59, 130, 246, 0.5)', fill: false, pointRadius: 0 },
            { label: 'sf(k)', data: [], borderColor: 'rgba(138, 138, 138, 0.5)', fill: false, borderDash: [5, 5], pointRadius: 0 },
            { label: '(δ + n + g)·k', data: [], borderColor: 'rgba(239, 68, 68, 0.5)', fill: false, pointRadius: 0 },
            { label: 'sf(k) старый', data: [], borderColor: 'rgba(34, 197, 94, 0.5)', fill: false, pointRadius: 0},
            { label: 'k*', data: [], borderColor: 'rgba(239, 68, 68, 0.5)', fill: false, borderDash: [5, 5], pointRadius: 0},
            { label: 'k* старый', data: [], borderColor: 'rgba(138, 138, 138, 0.5)', fill: false, borderDash: [5, 5], pointRadius: 0},
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

export const DynamicExampleChartNeqConfig = {
    type: 'line',
    data: {
        datasets: [
            { label: 'k', data: [], borderColor: 'rgba(59, 130, 246, 0.5)', fill: false, pointRadius: 0 },
            { label: 'y', data: [], borderColor: 'rgba(34, 197, 94, 0.5)', fill: false, pointRadius: 0 },
            { label: 'c', data: [], borderColor: 'rgba(239, 68, 68, 0.5)', fill: false, pointRadius: 0 },
            { label: 't_0', data: [], borderColor: 'rgba(138, 138, 138, 0.5)', borderDash: [5, 5], fill: false, pointRadius: 0},
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
                }
            },
            y: {
                title: {
                    display: false,
                    text: 'k, y, c'
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
                text: 'Динамика показателей'
            },
            legend: false
        }
    }
}

export const GrowthExampleChartNeqConfig = {
    type: 'line',
    data: {
        datasets: [
            { label: 'r', data: [], borderColor: 'rgba(59, 130, 246, 0.5)', fill: false, pointRadius: 0 },
            { label: 'gw', data: [], borderColor: 'rgba(34, 197, 94, 0.5)', fill: false, pointRadius: 0 },
            { label: 'gy', data: [], borderColor: 'rgba(239, 68, 68, 0.5)', fill: false, pointRadius: 0 },
            { label: 't_0', data: [], borderColor: 'rgba(138, 138, 138, 0.5)', borderDash: [5, 5], fill: false, pointRadius: 0},
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
                }
            },
            y: {
                title: {
                    display: false,
                    text: 'r, gw, gy'
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
                text: 'Процентная ставка и темпы роста'
            },
            legend: false
        }
    }
}