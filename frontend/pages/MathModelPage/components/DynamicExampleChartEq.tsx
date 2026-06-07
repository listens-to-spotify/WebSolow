import { useRef, useCallback, useEffect } from 'react'
import { SolowModel, type TrajectoryPoint } from '../../../utils/solowCore'
import { Chart } from 'chart.js'
import {
    DynamicExampleChartEqConfig,
} from "./ChartConfig.js"

import { InlineMath } from 'react-katex';
import { TfiLayoutLineSolid, TfiLineDashed} from "react-icons/tfi";

export function DynamicExampleChartEq() {
    const params = {
        s: 0.3,
        delta: 0.05,
        n: 0.02,
        g: 0.05,
        alpha: 0.5,
        k0: 6.25,
    }

    const k_shock = 4

    const modelRef = useRef(new SolowModel(params))
    const chartRef = useRef<Chart>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const trajectoryRef = useRef<TrajectoryPoint[]>([])

    const initChart = useCallback(() => {
        if (!canvasRef.current) return

        chartRef.current = new Chart(
            canvasRef.current,
            DynamicExampleChartEqConfig
        )
    }, [])

    const simulateTrajectory = useCallback(() => {
        const model = modelRef.current
        const trajectory: TrajectoryPoint[] = []
        const dt = 0.1
        const tMax = 50

        let k = params.k0
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

        k = k_shock
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

        trajectoryRef.current = trajectory
    }, [])

    const updateChart = useCallback(() => {
        const chart = chartRef.current
        if (!chart) return

        simulateTrajectory()

        const traj = trajectoryRef.current

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

        chart.options.scales!.x!.max = 150

        chart.options.scales!.y!.max =
            Math.max(
                ...traj.map(p => Math.max(p.k, p.y, p.c))
            ) * 1.1

        chart.data.datasets[3].data = [
            {x: 50, y: 0},
            {x: 50, y: chart.options.scales!.y!.max},
        ]

        chart.update('none')
    }, [])

    useEffect(() => {
        initChart();
        updateChart();

        return () => {
            chartRef.current?.destroy()
        }
    }, [])

    return (
        <div className="flex flex-col justify-center items-center h-full">
            <div className="p-2 aspect-[3/2] w-1/1">
                <canvas ref={canvasRef}></canvas>
            </div>  

            <div className='flex flex-wrap justify-center gap-4'>
                <a className="text-xs flex" color="rgba(59, 130, 246, 0.5)">
                    <TfiLayoutLineSolid
                        color="rgba(59, 130, 246, 0.5)"
                        className="min-w-5 min-h-5 mr-2"
                    />
                    <InlineMath math="k" />
                </a>
                <a className="text-xs flex" color="rgba(34, 197, 94, 0.5)">
                    <TfiLayoutLineSolid
                        color="rgba(34, 197, 94, 0.5)"
                        className="min-w-5 min-h-5 mr-2"
                    />
                    <InlineMath math="y" />
                </a>
                <a className="text-xs flex" color="rgba(239, 68, 68, 0.5)">
                    <TfiLayoutLineSolid
                        color="rgba(239, 68, 68, 0.5)"
                        className="min-w-5 min-h-5 mr-2"
                    />
                    <InlineMath math="c" />
                </a>
                <a className="text-xs flex" color='rgba(138, 138, 138, 0.5)'>
                    <TfiLineDashed
                        color="rgba(138, 138, 138, 0.5)"
                        className="min-w-5 min-h-5 mr-2"
                    />
                    <InlineMath math="t_0" />
                </a>

            </div>
        </div>
    )
}