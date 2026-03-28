class SolowController {
    constructor() {
        this.model = null;
        this.baseModel = null;
        this.trajectory = [];
        this.isRunning = false;
        this.animationFrame = null;
        this.currentStep = 0;
        this.animationSpeed = 30;
        this.charts = {};

        this.shockApplied = false;
        this.shockTime = 0;
        this.shockK1 = 1;

        this.newKStar = null;
        this.initialKStar = null;
        this.shockCounter = 0;

        this.params = {
            s: 0.3,
            delta: 0.05,
            n: 0.02,
            g: 0.05,
            alpha: 0.5,
            k0: 0.5,
            tMax: 100
        };

        this.baseParams = { ...this.params };

        this.init();
    }

    init() {
        this.bindEvents();
        this.updateModel();
        this.initCharts();
    }

    bindEvents() {
        document.getElementById('startBtn')?.addEventListener('click', () => this.start());
        document.getElementById('resetBtn')?.addEventListener('click', () => this.reset());
        document.getElementById('applyShockBtn')?.addEventListener('click', () => this.applyShock());
        document.getElementById('resetShockBtn')?.addEventListener('click', () => this.resetShock());

        const sliders = ['s', 'delta', 'n', 'g', 'alpha'];
        sliders.forEach(param => {
            const slider = document.getElementById(`${param}Slider`);
            if (slider) {
                slider.addEventListener('input', (e) => {
                    this.params[param] = parseFloat(e.target.value);
                    this.baseParams = { ...this.params };
                    this.updateValueDisplay(param, e.target.value);
                    this.updateModel();
                    this.updatePhasePortrait();
                    this.updateStatusBar();
                });
            }
        });

        const k0Input = document.getElementById('k0Input');
        if (k0Input) {
            k0Input.addEventListener('change', (e) => {
                this.params.k0 = parseFloat(e.target.value) || 0.5;
                this.updateModel();
            });
        }

        const shockParam = document.getElementById('shockParam');
        if (shockParam) {
            shockParam.addEventListener('change', (e) => {
                this.updateShockValuePlaceholder(e.target.value);
            });
        }
    }

    updateShockValuePlaceholder(param) {
        const input = document.getElementById('shockValue');
        if (input && this.params) {
            if (param === 'k0') {
                const kStarToShow = this.newKStar !== null ? this.newKStar : (this.model ? this.model.kStar : this.initialKStar);
                input.value = kStarToShow.toFixed(4);
            } else {
                input.value = this.params[param]?.toString() || '0.3';
            }
        }
    }

    updateValueDisplay(param, value) {
        const display = document.getElementById(`${param}Val`);
        if (display) {
            display.textContent = parseFloat(value).toFixed(2);
        }
    }

    updateModel() {
        this.model = new SolowModel({ ...this.params });
        this.baseModel = new SolowModel({ ...this.baseParams });
    }

    initCharts() {
        this.initPhasePortrait();
        this.initDynamicsChart();
        this.initGrowthChart();
    }

    initPhasePortrait() {
        const ctx = document.getElementById('chartPhase');
        if (!ctx) return;

        this.charts.phase = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'y = k^α',
                        data: [],
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 's·y',
                        data: [],
                        borderColor: '#2ecc71',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: '(δ+n+g)·k',
                        data: [],
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 's·y (старый)',
                        data: [],
                        borderColor: '#27ae60',
                        borderDash: [5, 5],
                        backgroundColor: 'rgba(39, 174, 96, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0,
                        hidden: true
                    },
                    {
                        label: '(δ+n+g)·k (старый)',
                        data: [],
                        borderColor: '#95a5a6',
                        borderDash: [5, 5],
                        backgroundColor: 'rgba(149, 165, 166, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0,
                        hidden: true
                    },
                    {
                        label: 'k* (старый)',
                        data: [],
                        borderColor: '#9b59b6',
                        borderDash: [5, 5],
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false
                    },
                    {
                        label: 'k* (новый)',
                        data: [],
                        borderColor: '#e74c3c',
                        borderDash: [5, 5],
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false
                    },
                    {
                        label: 'k (шок)',
                        data: [],
                        borderColor: '#f39c12',
                        borderDash: [5, 5],
                        borderWidth: 2,
                        pointRadius: 4,
                        fill: false,
                        hidden: true
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${context.parsed.y?.toFixed(4) || context.parsed.x?.toFixed(4)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'k — капитал на ед. эфф. труда'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Выпуск на ед. эфф. труда'
                        },
                        min: 0
                    }
                }
            }
        });
        this.updatePhasePortrait();
    }

    updatePhasePortrait() {
        if (!this.baseModel || !this.charts.phase) return;

        const kMax = Math.max(this.baseModel.kStar * 2, this.model.kStar * 2);
        
        const kStarNew = this.model.kStar;
        const kStarOld = (this.shockApplied && this.newKStar !== null) ? this.newKStar : this.model.kStar;
        
        this.charts.phase.data.datasets[0].data = this.baseModel.productionFunctionData(0, kMax);
        this.charts.phase.data.datasets[1].data = this.model.sYLine(0, kMax);
        this.charts.phase.data.datasets[2].data = this.model.breakEvenLine(0, kMax);
        
        this.charts.phase.data.datasets[3].data = [];
        this.charts.phase.data.datasets[4].data = [];
        this.charts.phase.data.datasets[5].data = [];
        this.charts.phase.data.datasets[6].data = [];
        this.charts.phase.data.datasets[7].data = [];
        this.charts.phase.data.datasets[3].hidden = true;
        this.charts.phase.data.datasets[4].hidden = true;
        this.charts.phase.data.datasets[5].hidden = true;
        this.charts.phase.data.datasets[6].hidden = true;
        this.charts.phase.data.datasets[7].hidden = true;
        
        if (this.shockApplied) {
            const param = document.getElementById('shockParam').value;
            
            if (param === 's') {
                this.charts.phase.data.datasets[3].data = this.baseModel.sYLine(0, kMax);
                this.charts.phase.data.datasets[3].hidden = false;
            } else if (param === 'n' || param === 'g' || param === 'delta') {
                this.charts.phase.data.datasets[4].data = this.baseModel.breakEvenLine(0, kMax);
                this.charts.phase.data.datasets[4].hidden = false;
            } else if (param === 'alpha') {
                this.charts.phase.data.datasets[0].data = this.baseModel.productionFunctionData(0, kMax);
            } else if (param === 'k0') {
                this.charts.phase.data.datasets[7].data = [
                    { x: this.shockK1, y: 0 },
                    { x: this.shockK1, y: Math.pow(kMax, this.baseModel.alpha) }
                ];
                this.charts.phase.data.datasets[7].hidden = false;
            }
            
            if (param === 'k0') {
                this.charts.phase.data.datasets[5].data = [
                    { x: kStarOld, y: 0 },
                    { x: kStarOld, y: Math.pow(kStarOld, this.baseModel.alpha) }
                ];
                this.charts.phase.data.datasets[5].hidden = false;
                this.charts.phase.data.datasets[6].data = [];
                this.charts.phase.data.datasets[6].hidden = true;
            } else {
                this.charts.phase.data.datasets[5].data = [
                    { x: kStarOld, y: 0 },
                    { x: kStarOld, y: Math.pow(kStarOld, this.baseModel.alpha) }
                ];
                this.charts.phase.data.datasets[5].hidden = false;
                
                this.charts.phase.data.datasets[6].data = [
                    { x: kStarNew, y: 0 },
                    { x: kStarNew, y: Math.pow(kStarNew, this.model.alpha) }
                ];
                this.charts.phase.data.datasets[6].hidden = false;
            }
        } else {
            this.charts.phase.data.datasets[5].data = [
                { x: kStarNew, y: 0 },
                { x: kStarNew, y: Math.pow(kStarNew, this.model.alpha) }
            ];
            this.charts.phase.data.datasets[5].hidden = false;
        }

        this.charts.phase.options.scales.x.max = kMax;
        this.charts.phase.options.scales.y.max = Math.pow(kMax, this.baseModel.alpha);
        
        this.charts.phase.update('none');
    }

    initDynamicsChart() {
        const ctx = document.getElementById('chartDynamics');
        if (!ctx) return;

        this.charts.dynamics = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'k(t)',
                        data: [],
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 'y(t)',
                        data: [],
                        borderColor: '#e67e22',
                        backgroundColor: 'rgba(230, 126, 34, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 'c(t)',
                        data: [],
                        borderColor: '#2ecc71',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 'k* (старый)',
                        data: [],
                        borderColor: '#9b59b6',
                        borderDash: [5, 5],
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false
                    },
                    {
                        label: 'k* (новый)',
                        data: [],
                        borderColor: '#e74c3c',
                        borderDash: [5, 5],
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${context.parsed.y?.toFixed(4)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'Время t'
                        },
                        min: 0
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Значение'
                        },
                        min: 0
                    }
                }
            }
        });
    }

    updateDynamicsChart(upToStep) {
        if (!this.charts.dynamics || !this.trajectory.length) return;

        const kData = [];
        const yData = [];
        const cData = [];
        const kStarOldData = [];
        const kStarNewData = [];
        
        const step = Math.max(1, Math.floor(this.trajectory.length / 100));

        const oldKStar = (this.shockApplied && this.newKStar !== null) ? this.newKStar : this.model.kStar;
        
        for (let i = 0; i <= upToStep && i < this.trajectory.length; i += step) {
            const point = this.trajectory[i];
            kData.push({ x: point.t, y: point.k });
            yData.push({ x: point.t, y: point.y });
            cData.push({ x: point.t, y: point.c });
            kStarOldData.push({ x: point.t, y: oldKStar });
            kStarNewData.push({ x: point.t, y: this.model.kStar });
        }

        this.charts.dynamics.data.datasets[0].data = kData;
        this.charts.dynamics.data.datasets[1].data = yData;
        this.charts.dynamics.data.datasets[2].data = cData;
        this.charts.dynamics.data.datasets[3].data = kStarOldData;
        this.charts.dynamics.data.datasets[4].data = kStarNewData;

        const maxK = Math.max(
            oldKStar * 1.3,
            this.model.kStar * 1.3,
            this.params.k0 * 1.3,
            this.shockK1 * 1.3,
            this.model.yStar * 1.3,
            this.model.c(this.model.kStar) * 1.3
        );
        
        let tMin, tMax;
        
        if (this.shockCounter <= 2) {
            tMin = 0;
            tMax = (this.shockCounter + 1) * 100;
        } else {
            tMin = 100 + (this.shockCounter - 3) * 100;
            tMax = 100 + this.shockCounter * 100;
        }
        
        this.charts.dynamics.options.scales.y.max = maxK;
        this.charts.dynamics.options.scales.x.min = tMin;
        this.charts.dynamics.options.scales.x.max = tMax;
        
        this.charts.dynamics.update('none');
    }

    initGrowthChart() {
        const ctx = document.getElementById('chartGrowth');
        if (!ctx) return;

        this.charts.growth = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'r — процентная ставка',
                        data: [],
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 'g_w — рост зарплаты',
                        data: [],
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 'g_YL — рост выпуска/работника',
                        data: [],
                        borderColor: '#2ecc71',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 0
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            filter: (item) => item.text !== ''
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${context.parsed.y.toFixed(4)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'Время t'
                        },
                        min: 0
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Темп роста (доли)'
                        },
                        min: 0,
                        max: 1.5
                    }
                }
            }
        });
    }

    updateGrowthChart(upToStep) {
        if (!this.charts.growth || !this.trajectory.length) return;

        const rData = [];
        const gwData = [];
        const gyData = [];
        
        const step = Math.max(1, Math.floor(this.trajectory.length / 100));

        for (let i = 0; i <= upToStep && i < this.trajectory.length; i += step) {
            const point = this.trajectory[i];
            rData.push({ x: point.t, y: point.r });
            gwData.push({ x: point.t, y: point.gw });
            gyData.push({ x: point.t, y: point.gy });
        }

        this.charts.growth.data.datasets[0].data = rData;
        this.charts.growth.data.datasets[1].data = gwData;
        this.charts.growth.data.datasets[2].data = gyData;

        let tMin, tMax;
        
        if (this.shockCounter <= 2) {
            tMin = 0;
            tMax = (this.shockCounter + 1) * 100;
        } else {
            tMin = 100 + (this.shockCounter - 3) * 100;
            tMax = 100 + this.shockCounter * 100;
        }
        
        this.charts.growth.options.scales.x.min = tMin;
        this.charts.growth.options.scales.x.max = tMax;
        this.charts.growth.options.scales.y.max = 1.5;
        this.charts.growth.options.scales.y.min = 0;
        
        this.charts.growth.update('none');
    }

    applyShock() {
        const param = document.getElementById('shockParam').value;
        const value = parseFloat(document.getElementById('shockValue').value);
        
        if (isNaN(value)) {
            alert('Введите корректное значение');
            return;
        }

        if (!this.trajectory || this.trajectory.length === 0) {
            this.trajectory = this.model.simulateEuler(500);
        }

        this.shockApplied = true;

        if (param === 'k0') {
            this.shockK1 = value;
            this.newKStar = this.model ? this.model.kStar : this.initialKStar;
        } else {
            this.baseParams = { ...this.params };
            this.params[param] = value;
            const slider = document.getElementById(`${param}Slider`);
            if (slider) {
                slider.value = value;
            }
            this.updateValueDisplay(param, value);
        }

        const oldKStar = this.model ? this.model.kStar : this.params.k0;
        this.updateModel();
        this.newKStar = oldKStar;
        
        this.simulateWithShock();
        
        this.updatePhasePortrait();
        this.updateDynamicsChart(this.trajectory.length - 1);
        this.updateGrowthChart(this.trajectory.length - 1);
        this.updateShockDisplay();
        this.hidePlaceholders();
        this.updateStatusBar();
    }

    simulateWithShock() {
        this.shockCounter++;
        
        const oldTrajectory = this.trajectory;
        const dt = 100 / 500;
        
        const param = document.getElementById('shockParam').value;
        const endPoint = oldTrajectory[oldTrajectory.length - 1];
        const t0 = endPoint.t;
        
        const newTrajectory = [];
        for (let i = 0; i < oldTrajectory.length; i++) {
            newTrajectory.push({...oldTrajectory[i]});
        }
        
        let k;
        if (param === 'k0') {
            k = this.shockK1;
            newTrajectory.push({
                t: t0,
                k: k,
                y: Math.pow(k, this.baseModel.alpha),
                c: this.baseModel.c(k),
                gw: this.baseModel.gw(k),
                gy: this.baseModel.gy(k),
                r: this.baseModel.r(k)
            });
        } else {
            k = endPoint.k;
        }
        
        const newTMax = 100 + 100 * this.shockCounter;
        
        const simModel = (param === 'k0') ? this.baseModel : this.model;
        
        for (let t = t0 + dt; t <= newTMax; t += dt) {
            newTrajectory.push({
                t: t,
                k: k,
                y: Math.pow(k, simModel.alpha),
                c: simModel.c(k),
                gw: simModel.gw(k),
                gy: simModel.gy(k),
                r: simModel.r(k)
            });
            k = k + dt * (simModel.sY(k) - simModel.breakEven(k));
            k = Math.max(0, k);
        }

        this.trajectory = newTrajectory;
        this.shockTime = t0;
    }

    updateShockDisplay() {
        const newKStarEl = document.getElementById('newKStarVal');
        const deltaKStarEl = document.getElementById('deltaKStarVal');
        
        if (newKStarEl && this.model) {
            newKStarEl.textContent = this.model.kStar.toFixed(4);
        }
        if (deltaKStarEl && this.baseModel && this.model) {
            const delta = this.model.kStar - this.baseModel.kStar;
            deltaKStarEl.textContent = (delta >= 0 ? '+' : '') + delta.toFixed(4);
        }
    }

    resetShock() {
        this.shockApplied = false;
        this.newKStar = null;
        
        this.params = { ...this.baseParams };
        
        ['s', 'delta', 'n', 'g', 'alpha'].forEach(param => {
            const slider = document.getElementById(`${param}Slider`);
            if (slider) {
                slider.value = this.params[param];
            }
            this.updateValueDisplay(param, this.params[param]);
        });
        
        document.getElementById('k0Input').value = this.params.k0;
        
        this.updateModel();
        
        this.trajectory = this.model.simulateEuler(500);
        
        this.updatePhasePortrait();
        this.clearDynamicsChart();
        
        document.getElementById('newKStarVal').textContent = '—';
        document.getElementById('deltaKStarVal').textContent = '—';
        
        this.showPlaceholders();
        this.updateStatusBar();
    }

    clearDynamicsChart() {
        if (this.charts.dynamics) {
            this.charts.dynamics.data.datasets.forEach(ds => ds.data = []);
            this.charts.dynamics.update('none');
        }
        if (this.charts.growth) {
            this.charts.growth.data.datasets.forEach(ds => ds.data = []);
            this.charts.growth.update('none');
        }
    }

    start() {
        this.shockCounter = 0;
        if (this.initialKStar === null) {
            this.initialKStar = this.model.kStar;
        }
        this.trajectory = this.model.simulateEuler(500);
        
        this.hidePlaceholders();
        this.updateDynamicsChart(this.trajectory.length - 1);
        this.updateGrowthChart(this.trajectory.length - 1);
        this.updateStatusBar();
    }

    reset() {
        this.currentStep = 0;
        
        this.params = {
            s: 0.3,
            delta: 0.05,
            n: 0.02,
            g: 0.05,
            alpha: 0.5,
            k0: 0.5,
            tMax: 100
        };
        
        this.baseParams = { ...this.params };
        this.trajectory = [];
        
        ['s', 'delta', 'n', 'g', 'alpha'].forEach(param => {
            const slider = document.getElementById(`${param}Slider`);
            if (slider) {
                slider.value = this.params[param];
            }
            this.updateValueDisplay(param, this.params[param]);
        });
        
        document.getElementById('k0Input').value = '0.5';
        
        this.shockApplied = false;
        this.shockCounter = 0;
        this.newKStar = null;
        
        document.getElementById('newKStarVal').textContent = '—';
        document.getElementById('deltaKStarVal').textContent = '—';

        if (this.charts.phase) {
            this.charts.phase.data.datasets.forEach(ds => ds.data = []);
            this.charts.phase.options.scales.x.max = 100;
            this.charts.phase.update('none');
        }
        if (this.charts.dynamics) {
            this.charts.dynamics.data.datasets.forEach(ds => ds.data = []);
            this.charts.dynamics.options.scales.x.min = 0;
            this.charts.dynamics.options.scales.x.max = 100;
            this.charts.dynamics.update('none');
        }
        if (this.charts.growth) {
            this.charts.growth.data.datasets.forEach(ds => ds.data = []);
            this.charts.growth.options.scales.x.min = 0;
            this.charts.growth.options.scales.x.max = 100;
            this.charts.growth.update('none');
        }
        
        this.showPlaceholders();
        this.updateModel();
        this.updatePhasePortrait();
        this.updateStatusBar();
    }

    hidePlaceholders() {
        document.getElementById('placeholderPhase')?.style.setProperty('display', 'none');
        document.getElementById('chartPhase').style.display = 'block';
        document.getElementById('placeholderDynamics')?.style.setProperty('display', 'none');
        document.getElementById('chartDynamics').style.display = 'block';
        document.getElementById('placeholderGrowth')?.style.setProperty('display', 'none');
        document.getElementById('chartGrowth').style.display = 'block';
    }

    showPlaceholders() {
        document.getElementById('placeholderPhase')?.style.setProperty('display', 'flex');
        document.getElementById('placeholderDynamics')?.style.setProperty('display', 'flex');
        document.getElementById('chartPhase').style.display = 'none';
        document.getElementById('chartDynamics').style.display = 'none';
        document.getElementById('placeholderGrowth')?.style.setProperty('display', 'flex');
        document.getElementById('chartGrowth').style.display = 'none';
    }

    updateStatusBar() {
        const kStarEl = document.getElementById('kStarVal');
        const yStarEl = document.getElementById('yStarVal');

        if (kStarEl && this.baseModel) {
            kStarEl.textContent = this.baseModel.kStar.toFixed(4);
        }
        if (yStarEl && this.baseModel) {
            yStarEl.textContent = this.baseModel.yStar.toFixed(4);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.solowApp = new SolowController();
});
