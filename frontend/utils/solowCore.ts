export class SolowModel {
  s: number;
  delta: number;
  n: number;
  g: number;
  alpha: number;
  k0: number;
  tMax: number;
  dt: number;

  constructor(params: Partial<SolowModel> = {}) {
    this.s = params.s ?? 0.3;
    this.delta = params.delta ?? 0.05;
    this.n = params.n ?? 0.02;
    this.g = params.g ?? 0.01;
    this.alpha = params.alpha ?? 0.5;
    this.k0 = params.k0 ?? 0.5;
    this.tMax = params.tMax ?? 100;
    this.dt = params.dt ?? 0.1;
  }

  get kStar(): number {
    const beta = this.s / (this.delta + this.n + this.g);
    return Math.pow(beta, 1 / (1 - this.alpha));
  }

  get yStar(): number {
    return Math.pow(this.kStar, this.alpha);
  }

  y(k: number): number {
    return Math.pow(Math.max(0, k), this.alpha);
  }

  sY(k: number): number {
    return this.s * this.y(k);
  }

  breakEven(k: number): number {
    return (this.delta + this.n + this.g) * k;
  }

  c(k: number): number {
    return (1 - this.s) * this.y(k);
  }

  dkdt(k: number): number {
    return this.sY(k) - this.breakEven(k);
  }

  gk(k: number): number {
    if (k <= 0) return 0;
    return this.dkdt(k) / k;
  }

  gy(k: number): number {
    return this.alpha * this.gk(k);
  }

  gw(k: number): number {
    return this.g + this.alpha * this.gk(k);
  }

  r(k: number): number {
    if (k <= 0) return 0;
    return this.alpha * Math.pow(k, this.alpha - 1) - this.delta;
  }

  sYLine(kMin = 0, kMax = 5, points = 100): { x: number; y: number }[] {
    const data = [];
    const step = (kMax - kMin) / points;
    for (let k = kMin; k <= kMax; k += step) {
      data.push({ x: k, y: this.sY(k) });
    }
    return data;
  }

  productionFunctionData(kMin = 0, kMax = 5, points = 100): { x: number; y: number }[] {
    const data = [];
    const step = (kMax - kMin) / points;
    for (let k = kMin; k <= kMax; k += step) {
      data.push({ x: k, y: this.y(k) });
    }
    return data;
  }

  breakEvenLine(kMin = 0, kMax = 5, points = 100): { x: number; y: number }[] {
    const data = [];
    const step = (kMax - kMin) / points;
    for (let k = kMin; k <= kMax; k += step) {
      data.push({ x: k, y: this.breakEven(k) });
    }
    return data;
  }

  simulateRK4(): TrajectoryPoint[] {
    const trajectory: TrajectoryPoint[] = [];
    let k = this.k0;
    const steps = Math.floor(this.tMax / this.dt);

    for (let i = 0; i <= steps; i++) {
      const t = i * this.dt;
      trajectory.push(this.createPoint(t, k));

      const k1 = this.dkdt(k);
      const k2 = this.dkdt(k + 0.5 * this.dt * k1);
      const k3 = this.dkdt(k + 0.5 * this.dt * k2);
      const k4 = this.dkdt(k + this.dt * k3);

      k = k + (this.dt / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
      k = Math.max(0, k);
    }

    return trajectory;
  }

  simulateEuler(steps = 500): TrajectoryPoint[] {
    const trajectory: TrajectoryPoint[] = [];
    const dt = this.tMax / steps;
    let k = this.k0;

    for (let i = 0; i <= steps; i++) {
      const t = i * dt;
      trajectory.push(this.createPoint(t, k));

      k = k + dt * this.dkdt(k);
      k = Math.max(0, k);
    }

    return trajectory;
  }

  createPoint(t: number, k: number): TrajectoryPoint {
    return {
      t,
      k,
      y: this.y(k),
      c: this.c(k),
      investment: this.sY(k),
      breakEven: this.breakEven(k),
      dkdt: this.dkdt(k),
      gw: this.gw(k),
      gy: this.gy(k),
      r: this.r(k)
    };
  }
}

export interface TrajectoryPoint {
  t: number;
  k: number;
  y: number;
  c: number;
  investment: number;
  breakEven: number;
  dkdt: number;
  gw: number;
  gy: number;
  r: number;
}

export const scenarioManager = {
  scenarios: {
    baseline: { name: 'Базовый сценарий', s: 0.3, delta: 0.05, n: 0.02, g: 0.05, alpha: 0.5, k0: 0.5 },
    highSavings: { name: 'Высокая норма сбережений', s: 0.5, delta: 0.05, n: 0.02, g: 0.05, alpha: 0.5, k0: 0.5 },
    lowSavings: { name: 'Низкая норма сбережений', s: 0.15, delta: 0.05, n: 0.02, g: 0.05, alpha: 0.5, k0: 0.5 },
    highPopulation: { name: 'Быстрый рост населения', s: 0.3, delta: 0.05, n: 0.05, g: 0.05, alpha: 0.5, k0: 0.5 }
  },
  getScenario(name: string) {
    return this.scenarios[name as keyof typeof this.scenarios] || this.scenarios.baseline;
  }
};
