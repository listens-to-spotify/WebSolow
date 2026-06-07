import { useRef, useCallback, useEffect } from 'react'
import { type TrajectoryPoint } from '../../../utils/solowCore'
import { GrowthChartConfig } from './ChartConfig'
import { useChart } from './useChart'
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { InlineMath } from '../../../utils/katex'

const latexMap: Record<number, string> = {
	0: 'r(t)',
	1: 'g_w(t)',
}

interface LegendItem {
	index: number
	color: string
}

const legendItems: LegendItem[] = [
	{ index: 0, color: 'rgba(239, 68, 68, 0.5)' },
	{ index: 1, color: 'rgba(245, 158, 11, 0.5)' },
]

export function GrowthChartNode({ trajectoryRef, version }: {
	trajectoryRef: { readonly current: TrajectoryPoint[] | null }
	version: number
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const chartRef = useChart(canvasRef, GrowthChartConfig)

	const updateChart = useCallback(() => {
		const chart = chartRef.current
		const trajectory = trajectoryRef.current
		if (!chart || !trajectory || trajectory.length === 0) return

		const step = 1
		const rData: { x: number; y: number }[] = []
		const gwData: { x: number; y: number }[] = []

		for (let i = 0; i < trajectory.length; i += step) {
			rData.push({ x: trajectory[i].t, y: trajectory[i].r })
			gwData.push({ x: trajectory[i].t, y: trajectory[i].gw })
		}

		chart.data.datasets[0].data = rData
		chart.data.datasets[1].data = gwData

		const tMax = trajectory[trajectory.length - 1].t
		const tMin = Math.max(0, tMax - 300)
		chart.options.scales!.x!.min = tMin
		chart.options.scales!.x!.max = tMax

		chart.update('none')
	}, [chartRef, trajectoryRef])

	useEffect(() => { updateChart() }, [version, updateChart])


	return (
		<div className="flex flex-col justify-center items-center h-full">
			<div className="p-2 w-full">
				<div className="aspect-[3/2]">
					<canvas ref={canvasRef}></canvas>
				</div>
			</div>
			{trajectoryRef.current && trajectoryRef.current.length > 0 && (
				<div className="flex flex-wrap justify-center gap-3">
					{legendItems.map(item => (
						<a className="text-xs flex items-center" key={item.index}>
							<TfiLayoutLineSolid color={item.color} className="min-w-8 min-h-8 mr-2" />
							<InlineMath math={latexMap[item.index]} />
						</a>
					))}
				</div>
			)}
		</div>
	)
}
