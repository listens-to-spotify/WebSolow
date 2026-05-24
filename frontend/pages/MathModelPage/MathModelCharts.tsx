import { useRef, useCallback } from 'react'
import { SolowModel, type TrajectoryPoint } from '../../utils/solowCore'
import { Chart } from 'chart.js'
import { PhaseExampleChartConfig,
         PhaseExampleChartEqConfig,
         DynamicExampleChartEqConfig,
         GrowthExampleChartEqConfig
        } from "./ChartConfig.js"

export class PhaseExampleChart {
    public params;
    public modelRef;
    public phaseChartRef;
    public phaseCanvas;

    public constructor() {
        this.params = {
            s: 0.3,
            delta: 0.05,
            n: 0.02,
            g: 0.05,
            alpha: 0.5,
            k0: 0.5
        }

        this.modelRef = useRef(new SolowModel(this.params))
        this.phaseChartRef = useRef<Chart>(null)
        this.phaseCanvas = useRef<HTMLCanvasElement>(null)
    }

    public initPhaseChart = useCallback(() => {
        if (!this.phaseCanvas.current) return
        this.phaseChartRef.current = new Chart(this.phaseCanvas.current, PhaseExampleChartConfig)
    }, [])

    public updatePhaseChart = useCallback(() => {
        const chart = this.phaseChartRef.current
        if (!chart) return

        const model = this.modelRef.current
        const kMax = Math.max(5, model.kStar * 2, model.kStar * 2)

        chart.data.datasets[0].data = model.productionFunctionData(0, kMax)
        chart.data.datasets[1].data = model.sYLine(0, kMax)
        chart.data.datasets[2].data = model.amortizationLine(0, kMax)
        chart.data.datasets[3].data = [{x : model.kStar, y: 0}, {x: model.kStar, y: this.params.s * model.y(model.kStar)}, {x: model.kStar, y: model.y(model.kStar)}]

        chart.options.scales!.x!.max = kMax
        chart.options.scales!.y!.max = Math.pow(kMax, model.alpha)
        chart.update('none')
    }, [])
}

export class PhaseExampleChartEq {
    public params;
    public modelRef;
    public phaseChartRef;
    public phaseCanvas;

    public constructor() {
        this.params = {
            s: 0.3,
            delta: 0.05,
            n: 0.02,
            g: 0.05,
            alpha: 0.5,
            k0: 0.5,
            k_shock: 4,
        }

        this.modelRef = useRef(new SolowModel(this.params))
        this.phaseChartRef = useRef<Chart>(null)
        this.phaseCanvas = useRef<HTMLCanvasElement>(null)
    }

    public initPhaseChart = useCallback(() => {
        if (!this.phaseCanvas.current) return
        this.phaseChartRef.current = new Chart(this.phaseCanvas.current, PhaseExampleChartEqConfig)
    }, [])

    public updatePhaseChart = useCallback(() => {
        const chart = this.phaseChartRef.current
        if (!chart) return

        const model = this.modelRef.current
        const kMax = Math.max(5, model.kStar * 2, model.kStar * 2)

        chart.data.datasets[0].data = model.productionFunctionData(0, kMax)
        chart.data.datasets[1].data = model.sYLine(0, kMax)
        chart.data.datasets[2].data = model.amortizationLine(0, kMax)
        chart.data.datasets[3].data = [{x : model.kStar, y: 0}, {x: model.kStar, y: this.params.s * model.y(model.kStar)}, {x: model.kStar, y: model.y(model.kStar)}]
        chart.data.datasets[4].data = [{x: this.params.k_shock, y: 0}, {x: this.params.k_shock, y: model.y(this.params.k_shock)}]

        chart.options.scales!.x!.max = kMax
        chart.options.scales!.y!.max = Math.pow(kMax, model.alpha)
        chart.update('none')
    }, [])
}

export class DynamicExampleChartEq {
    public params;
    public modelRef;

    public trajectoryRef;

    public chartRef;
    public canvas;

    public constructor() {
        this.params = {
            s: 0.3,
            delta: 0.05,
            n: 0.02,
            g: 0.05,
            alpha: 0.5,
            k0: 6.25,
            k_shock: 4,
        }

        this.modelRef = {
            current: new SolowModel(this.params)
        }

        this.trajectoryRef = {
            current: []
        }

        this.chartRef = {
            current: null
        }

        this.canvas = {
            current: null
        }
    }

    public initDynamicsChart = () => {
        if (!this.canvas.current) return

        this.chartRef.current = new Chart(
            this.canvas.current,
            DynamicExampleChartEqConfig
        )
    }

    public simulateTrajectory() {
        const model = this.modelRef.current

        const trajectory: TrajectoryPoint[] = []

        const dt = 0.1
        const tMax = 50

        let k = this.params.k0

        for (let t = 0; t <= tMax; t += dt) {

            trajectory.push({
                t,
                k,
                y: model.y(k),
                c: model.c(k),
                investment: model.sY(k),
                amortization: model.amortization(k),
                dkdt: model.dkdt(k),
                gw: model.gw(k),
                gy: model.gy(k),
                r: model.r(k)
            })

            k = k + dt * model.dkdt(k)

            k = Math.max(0, k)
        }

        k = this.params.k_shock

        for (let t = tMax + 1; t <= tMax + 100; t += dt) {

            trajectory.push({
                t,
                k,
                y: model.y(k),
                c: model.c(k),
                investment: model.sY(k),
                amortization: model.amortization(k),
                dkdt: model.dkdt(k),
                gw: model.gw(k),
                gy: model.gy(k),
                r: model.r(k)
            })

            k = k + dt * model.dkdt(k)

            k = Math.max(0, k)
        }

        this.trajectoryRef.current = trajectory
    }

    public updateDynamicsChart = () => {
        const chart = this.chartRef.current
        if (!chart) return

        this.simulateTrajectory()

        const traj = this.trajectoryRef.current

        const kData: { x: number, y: number }[] = []
        const yData: { x: number, y: number }[] = []
        const cData: { x: number, y: number }[] = []

        for (let i = 0; i < traj.length; i++) {
            kData.push({
                x: traj[i].t,
                y: traj[i].k
            })

            yData.push({
                x: traj[i].t,
                y: traj[i].y
            })

            cData.push({
                x: traj[i].t,
                y: traj[i].c
            })
        }

        chart.data.datasets[0].data = kData
        chart.data.datasets[1].data = yData
        chart.data.datasets[2].data = cData

        chart.options.scales.x.max = 150

        chart.options.scales.y.max =
            Math.max(
                ...traj.map(p => Math.max(p.k, p.y, p.c))
            ) * 1.1

        chart.data.datasets[3].data = [
            {x: 50, y: 0},
            {x: 50, y: chart.options.scales.y.max},
        ]

        chart.update('none')
    }
}

export class GrowthExampleChartEq {
    public params;
    public modelRef;

    public trajectoryRef;

    public chartRef;
    public canvas;

    public constructor() {
        this.params = {
            s: 0.3,
            delta: 0.05,
            n: 0.02,
            g: 0.05,
            alpha: 0.5,
            k0: 6.25,
            k_shock: 4,
        }

        this.modelRef = {
            current: new SolowModel(this.params)
        }

        this.trajectoryRef = {
            current: []
        }

        this.chartRef = {
            current: null
        }

        this.canvas = {
            current: null
        }
    }

    public initGrowthChart = () => {
        if (!this.canvas.current) return

        this.chartRef.current = new Chart(
            this.canvas.current,
            GrowthExampleChartEqConfig
        )
    }

    public simulateTrajectory() {
        const model = this.modelRef.current

        const trajectory: TrajectoryPoint[] = []

        const dt = 0.1
        const tMax = 50

        let k = this.params.k0

        for (let t = 0; t <= tMax; t += dt) {

            trajectory.push({
                t,
                k,
                y: model.y(k),
                c: model.c(k),
                investment: model.sY(k),
                amortization: model.amortization(k),
                dkdt: model.dkdt(k),
                gw: model.gw(k),
                gy: model.gy(k),
                r: model.r(k)
            })

            k = k + dt * model.dkdt(k)

            k = Math.max(0, k)
        }

        k = this.params.k_shock

        for (let t = tMax + 1; t <= tMax + 100; t += dt) {

            trajectory.push({
                t,
                k,
                y: model.y(k),
                c: model.c(k),
                investment: model.sY(k),
                amortization: model.amortization(k),
                dkdt: model.dkdt(k),
                gw: model.gw(k),
                gy: model.gy(k),
                r: model.r(k)
            })

            k = k + dt * model.dkdt(k)

            k = Math.max(0, k)
        }

        this.trajectoryRef.current = trajectory
    }

    public updateGrowthChart = () => {
        const chart = this.chartRef.current
        if (!chart) return

        this.simulateTrajectory()

        const traj = this.trajectoryRef.current

        const rData: { x: number, y: number }[] = []
        const gwData: { x: number, y: number }[] = []
        const gyData: { x: number, y: number }[] = []

        for (let i = 0; i < traj.length; i++) {
            rData.push({
                x: traj[i].t,
                y: traj[i].r
            })

            gwData.push({
                x: traj[i].t,
                y: traj[i].gw
            })

            gyData.push({
                x: traj[i].t,
                y: traj[i].gy
            })
        }

        chart.data.datasets[0].data = rData
        chart.data.datasets[1].data = gwData
        chart.data.datasets[2].data = gyData

        chart.options.scales.x.max = 150

        chart.options.scales.y.min = 0
        chart.options.scales.y.max =
            Math.max(
                ...traj.map(p => Math.max(p.r, p.gw, p.gy))
            ) * 1.1

        chart.data.datasets[3].data = [
            {x: 50, y: 0},
            {x: 50, y: chart.options.scales.y.max},
        ]

        chart.update('none')
    }
}