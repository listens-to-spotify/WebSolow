class SolowModel {
    constructor(params) {
        this.s = params.s ?? 0.3;
        this.delta = params.delta ?? 0.05;
        this.n = params.n ?? 0.02;
        this.g = params.g ?? 0.01;
        this.alpha = params.alpha ?? 0.5;
        this.k0 = params.k0 ?? 0.5;
        this.tMax = params.tMax ?? 100;
        this.dt = params.dt ?? 0.1;
    }

    get kStar() {
        const beta = this.s / (this.delta + this.n + this.g);
        return Math.pow(beta, 1 / (1 - this.alpha));
    }

    get yStar() {
        return Math.pow(this.kStar, this.alpha);
    }

    y(k) {
        return Math.pow(Math.max(0, k), this.alpha);
    }

    sY(k) {
        return this.s * this.y(k);
    }

    breakEven(k) {
        return (this.delta + this.n + this.g) * k;
    }

    c(k) {
        return (1 - this.s) * this.y(k);
    }

    dkdt(k) {
        return this.sY(k) - this.breakEven(k);
    }

    gk(k) {
        if (k <= 0) return 0;
        return this.dkdt(k) / k;
    }

    gy(k) {
        return 1 + this.g;
    }

    gw(k) {
        return 1 + this.g + this.alpha * this.gk(k);
    }

    r(k) {
        if (k <= 0) return 0;
        return this.alpha * Math.pow(k, this.alpha - 1) - this.delta;
    }

    productionFunctionData(kMin = 0, kMax = 5, points = 100) {
        const data = [];
        const step = (kMax - kMin) / points;
        for (let k = kMin; k <= kMax; k += step) {
            data.push({ x: k, y: this.y(k) });
        }
        return data;
    }

    breakEvenLine(kMin = 0, kMax = 5, points = 100) {
        const data = [];
        const step = (kMax - kMin) / points;
        for (let k = kMin; k <= kMax; k += step) {
            data.push({ x: k, y: this.breakEven(k) });
        }
        return data;
    }

    sYLine(kMin = 0, kMax = 5, points = 100) {
        const data = [];
        const step = (kMax - kMin) / points;
        for (let k = kMin; k <= kMax; k += step) {
            data.push({ x: k, y: this.sY(k) });
        }
        return data;
    }

    simulateRK4() {
        const trajectory = [];
        let k = this.k0;
        const steps = Math.floor(this.tMax / this.dt);

        for (let i = 0; i <= steps; i++) {
            const t = i * this.dt;
            trajectory.push({
                t: t,
                k: k,
                y: this.y(k),
                c: this.c(k),
                investment: this.sY(k),
                breakEven: this.breakEven(k),
                dkdt: this.dkdt(k),
                gw: this.gw(k),
                gy: this.gy(k),
                r: this.r(k)
            });

            const k1 = this.dkdt(k);
            const k2 = this.dkdt(k + 0.5 * this.dt * k1);
            const k3 = this.dkdt(k + 0.5 * this.dt * k2);
            const k4 = this.dkdt(k + this.dt * k3);

            k = k + (this.dt / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
            k = Math.max(0, k);
        }

        return trajectory;
    }

    simulateEuler(steps = 500) {
        const trajectory = [];
        const dt = this.tMax / steps;
        let k = this.k0;

        for (let i = 0; i <= steps; i++) {
            const t = i * dt;
            trajectory.push({
                t: t,
                k: k,
                y: this.y(k),
                c: this.c(k),
                investment: this.sY(k),
                breakEven: this.breakEven(k),
                dkdt: this.dkdt(k),
                gw: this.gw(k),
                gy: this.gy(k),
                r: this.r(k)
            });

            k = k + dt * this.dkdt(k);
            k = Math.max(0, k);
        }

        return trajectory;
    }
}


// future features
class ScenarioManager {
    constructor() {
        this.scenarios = {
            baseline: {
                name: 'Базовый сценарий',
                s: 0.3, delta: 0.05, n: 0.02,             g: 0.05, alpha: 0.5, k0: 0.5
            },
            highSavings: {
                name: 'Высокая норма сбережений',
                s: 0.5, delta: 0.05, n: 0.02,             g: 0.05, alpha: 0.5, k0: 0.5
            },
            lowSavings: {
                name: 'Низкая норма сбережений',
                s: 0.15, delta: 0.05, n: 0.02,             g: 0.05, alpha: 0.5, k0: 0.5
            },
            highPopulation: {
                name: 'Быстрый рост населения',
                s: 0.3, delta: 0.05, n: 0.05,             g: 0.05, alpha: 0.5, k0: 0.5
            }
        };
    }

    getScenario(name) {
        return this.scenarios[name] || this.scenarios.baseline;
    }

    getScenarioNames() {
        return Object.keys(this.scenarios);
    }

    createModel(scenarioName) {
        const params = this.getScenario(scenarioName);
        return new SolowModel(params);
    }
}
