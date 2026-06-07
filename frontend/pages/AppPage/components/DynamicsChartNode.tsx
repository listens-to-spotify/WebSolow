import { useRef, useCallback, useEffect } from 'react'
import { SolowModel, type TrajectoryPoint } from '../../../utils/solowCore'
import { DynamicChartConfig } from './ChartConfig'
import { useChart } from './useChart'
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { InlineMath } from 'react-katex';

const latexMap: Record<number, string> = {
	0: 'k(t)',
	1: 'y(t)',
	2: 'c(t)',
}

interface LegendItem {
	index: number
	color: string
}

const legendItems: LegendItem[] = [
	{ index: 0, color: 'rgba(59, 130, 246, 0.5)' },
	{ index: 1, color: 'rgba(34, 197, 94, 0.5)' },
	{ index: 2, color: 'rgba(168, 85, 247, 0.5)' },
]

export function DynamicsChartNode({ modelRef, trajectoryRef, version }: {
	modelRef: { readonly current: SolowModel | null }
	trajectoryRef: { readonly current: TrajectoryPoint[] | null }
	version: number
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const chartRef = useChart(canvasRef, DynamicChartConfig)

	const updateChart = useCallback(() => {
		const chart = chartRef.current
		const trajectory = trajectoryRef.current
		if (!chart || !trajectory || trajectory.length === 0) return

		const step = 1
		const kData: { x: number; y: number }[] = []
		const yData: { x: number; y: number }[] = []
		const cData: { x: number; y: number }[] = []

		for (let i = 0; i < trajectory.length; i += step) {
			kData.push({ x: trajectory[i].t, y: trajectory[i].k })
			yData.push({ x: trajectory[i].t, y: trajectory[i].y })
			cData.push({ x: trajectory[i].t, y: trajectory[i].c })
		}

		chart.data.datasets[0].data = kData
		chart.data.datasets[1].data = yData
		chart.data.datasets[2].data = cData

		const model = modelRef.current
		if (model) {
			const maxY = Math.max(
				model.kStar,
				model.yStar,
				model.c(model.kStar),
				Math.max(...trajectory.slice(-2000).map(o => o.k))
			) * 1.3
			chart.options.scales!.y!.max = maxY
		}

		const tMax = trajectory[trajectory.length - 1].t
		const tMin = Math.max(0, tMax - 300)
		chart.options.scales!.x!.min = tMin
		chart.options.scales!.x!.max = tMax

		chart.update('none')
	}, [chartRef, modelRef, trajectoryRef])

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
