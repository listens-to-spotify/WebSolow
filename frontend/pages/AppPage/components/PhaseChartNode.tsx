import { useRef, useCallback, useEffect } from 'react'
import { SolowModel } from '../../../utils/solowCore'
import { PhaseChartConfig } from './ChartConfig'
import { useChart } from './useChart'
import { TfiLayoutLineSolid, TfiLineDashed } from "react-icons/tfi";
import { InlineMath } from 'react-katex';

const latexMap: Record<number, string> = {
	0: 'y = k^{\\alpha}',
	1: 's f(k)',
	2: '(\\delta + n + g) k',
	3: 'k^*_{\\text{old}}',
	4: 'k^*_{\\text{new}}',
	5: 'y_{\\text{old}}',
	6: 's_{\\text{old}} f(k)',
	7: '(\\delta + n + g)_{\\text{old}} k',
}

interface LegendItem {
	index: number
	color: string
	dashed: boolean
}

const allLegendItems: LegendItem[] = [
	{ index: 0, color: 'rgba(59, 130, 246, 0.5)', dashed: false },
	{ index: 1, color: 'rgba(34, 197, 94, 0.5)', dashed: false },
	{ index: 2, color: 'rgba(239, 68, 68, 0.5)', dashed: false },
	{ index: 3, color: 'rgba(156, 163, 175, 0.5)', dashed: true },
	{ index: 4, color: 'rgba(239, 68, 68, 0.5)', dashed: true },
	{ index: 5, color: 'rgba(156, 163, 175, 0.5)', dashed: true },
	{ index: 6, color: 'rgba(156, 163, 175, 0.5)', dashed: true },
	{ index: 7, color: 'rgba(156, 163, 175, 0.5)', dashed: true },
]

function visibleItems(isShocked: boolean, param: string | null): LegendItem[] {
	return allLegendItems.filter(item => {
		if (item.index <= 2) return true
		if (item.index === 4) return true
		if (item.index === 3) return isShocked
		if (item.index === 5) return isShocked && param === 'alpha'
		if (item.index === 6) return isShocked && param === 's'
		if (item.index === 7) return isShocked && ['delta', 'n', 'g'].includes(param ?? '')
		return false
	})
}

export function PhaseChartNode({ modelRef, baseModelRef, shockParamRef, version }: {
	modelRef: { readonly current: SolowModel | null }
	baseModelRef: { readonly current: SolowModel | null }
	shockParamRef: { readonly current: string | null }
	version: number
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const chartRef = useChart(canvasRef, PhaseChartConfig)

	const updateChart = useCallback(() => {
		const chart = chartRef.current
		const model = modelRef.current
		const baseModel = baseModelRef.current
		if (!chart || !model || !baseModel) return

		const kMax = Math.max(5, model.kStar * 2, baseModel.kStar * 2)

		chart.data.datasets[0].data = model.productionFunctionData(0, kMax)
		chart.data.datasets[1].data = model.sYLine(0, kMax)
		chart.data.datasets[2].data = model.amortizationLine(0, kMax)

		const isShocked = baseModel.s !== model.s || baseModel.delta !== model.delta ||
		                  baseModel.n !== model.n || baseModel.g !== model.g ||
		                  baseModel.alpha !== model.alpha

		if (isShocked) {
			chart.data.datasets[3].data = [{ x: baseModel.kStar, y: 0 }, { x: baseModel.kStar, y: baseModel.y(baseModel.kStar) }]
			chart.data.datasets[3].hidden = false
			chart.data.datasets[4].data = [{ x: model.kStar, y: 0 }, { x: model.kStar, y: model.y(model.kStar) }]
			chart.data.datasets[4].hidden = false

			const param = shockParamRef.current
			chart.data.datasets[5].hidden = param !== 'alpha'
			chart.data.datasets[6].hidden = param !== 's'
			chart.data.datasets[7].hidden = !['delta', 'n', 'g'].includes(param ?? '')

			chart.data.datasets[5].data = param === 'alpha' ? baseModel.productionFunctionData(0, kMax) : []
			chart.data.datasets[6].data = param === 's' ? baseModel.sYLine(0, kMax) : []
			chart.data.datasets[7].data = ['delta', 'n', 'g'].includes(param ?? '') ? baseModel.amortizationLine(0, kMax) : []
		} else {
			chart.data.datasets[3].hidden = true
			chart.data.datasets[4].data = [{ x: model.kStar, y: 0 }, { x: model.kStar, y: model.y(model.kStar) }]
			chart.data.datasets[4].hidden = false
			chart.data.datasets[5].hidden = true
			chart.data.datasets[6].hidden = true
			chart.data.datasets[7].hidden = true
		}

		chart.options.scales!.x!.max = kMax
		chart.options.scales!.y!.max = Math.pow(kMax, model.alpha)
		chart.update('none')
	}, [chartRef, modelRef, baseModelRef, shockParamRef])

	useEffect(() => {
		updateChart()
	}, [version, updateChart])

	const model = modelRef.current
	const baseModel = baseModelRef.current

	const isShocked = model !== null && baseModel !== null && (
		baseModel.s !== model.s || baseModel.delta !== model.delta ||
		baseModel.n !== model.n || baseModel.g !== model.g ||
		baseModel.alpha !== model.alpha
	)
	
	const param = shockParamRef.current
	const items = visibleItems(isShocked, param)

	return (
		<div className="flex flex-col justify-center items-center">
			<div className="p-2 aspect-[2/1] w-full">
				<canvas ref={canvasRef}></canvas>
			</div>
			<div className="flex flex-wrap justify-center gap-4">
				{items.map(item => (
					<a className="text-xs flex items-center" key={item.index}>
						{item.dashed ? (
							<TfiLineDashed color={item.color} className="min-w-8 min-h-8 mr-2" />
						) : (
							<TfiLayoutLineSolid color={item.color} className="min-w-8 min-h-8 mr-2" />
						)}
						<InlineMath math={latexMap[item.index]} />
					</a>
				))}
			</div>
		</div>
	)
}
