import { useRef, useCallback, useEffect } from 'react'
import { SolowModel, type TrajectoryPoint } from '../../../utils/solowCore'
import { Chart } from 'chart.js'
import {
    PhaseExampleChartNeqConfig,
} from "./ChartConfig.js"

import { InlineMath } from 'react-katex';
import { TfiLineDashed } from "react-icons/tfi";
import { TfiLayoutLineSolid } from "react-icons/tfi";

export function PhaseExampleChartNeq() {
    const params = {
        s: 0.3,
        delta: 0.05,
        n: 0.02,
        g: 0.05,
        alpha: 0.5,
        k0: 0.5,
    }

    const s_shock = 0.2

    const modelRef = useRef(new SolowModel(params))
    const chartRef = useRef<Chart>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const initChart = useCallback(() => {
        if (!canvasRef.current) return

        chartRef.current = new Chart(
            canvasRef.current,
            PhaseExampleChartNeqConfig
        )
    }, [])

    const updateChart = useCallback(() => {
        const chart = chartRef.current
        if (!chart) return

        const model = modelRef.current
        const kMax = Math.max(5, model.kStar * 2, model.kStar * 2)

        chart.data.datasets[0].data = model.productionFunctionData(0, kMax)
        chart.data.datasets[1].data = model.sYLine(0, kMax)
        chart.data.datasets[2].data = model.amortizationLine(0, kMax)
        chart.data.datasets[3].data = (model.productionFunctionData(0, kMax)).map(p => ({x: p.x, y: p.y * s_shock}))
        chart.data.datasets[5].data = [{x: model.kStar, y: 0}, {x: model.kStar, y: model.y(model.kStar)}]
    
        model.s = s_shock
        chart.data.datasets[4].data = [{x: model.kStar, y: 0}, {x: model.kStar, y: model.y(model.kStar)}]

        chart.options.scales!.x!.max = kMax
        chart.options.scales!.y!.max = Math.pow(kMax, model.alpha)
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
        <div className="flex flex-col justify-center items-center">
            <div className="p-2 aspect-[4/2] w-full">
                <canvas ref={canvasRef}></canvas>
            </div>  
            <div className="flex flex-wrap gap-10">
                <a className="text-xs flex" color="rgba(59, 130, 246, 0.5)">
                    <TfiLayoutLineSolid
                        color="rgba(59, 130, 246, 0.5)"
                        className="min-w-5 min-h-5 mr-2"
                    />
                    <InlineMath math="y = f(k) = k^\alpha" />
                </a>
                <a className="text-xs flex" color="rgba(34, 197, 94, 0.5)">
                    <TfiLayoutLineSolid
                        color="rgba(34, 197, 94, 0.5)"
                        className="min-w-5 min-h-5 mr-2"
                    />
                    <InlineMath math="s = s f(k)" />
                </a>
                <a className="text-xs flex" color="rgba(34, 197, 94, 0.5)">
                    <TfiLineDashed
                        color='rgba(138, 138, 138, 0.5)'
                        className="min-w-5 min-h-5 mr-2"
                    />
                    <InlineMath math="s = s f(k) \ старый" />
                </a>
                <a className="text-xs flex" color="rgba(239, 68, 68, 0.5)">
                    <TfiLayoutLineSolid
                        color="rgba(239, 68, 68, 0.5)"
                        className="min-w-5 min-h-5 mr-2"
                    />
                    <InlineMath math="(n + g + \delta) k" />
                </a>
                <a className="text-xs flex" color="rgba(239, 68, 68, 0.5)">
                    <TfiLineDashed
                        color="rgba(239, 68, 68, 0.5)"
                        className="min-w-5 min-h-5 mr-2"
                    />
                    <InlineMath math="k^*" />
                </a>
                <a className="text-xs flex" color="rgba(239, 68, 68, 0.5)">
                    <TfiLineDashed
                        color='rgba(138, 138, 138, 0.5)'
                        className="min-w-5 min-h-5 mr-2"
                    />
                    <InlineMath math="k^* \ старый" />
                </a>
            </div>
        </div>
    )
}