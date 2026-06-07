import { useRef, useCallback, useEffect } from 'react'
import { Chart } from 'chart.js'

export function useChart(canvasRef: React.RefObject<HTMLCanvasElement | null>, config: any) {
	const chartRef = useRef<Chart | null>(null)

	const initChart = useCallback(() => {
		if (!canvasRef.current) return
		chartRef.current = new Chart(canvasRef.current, config)
	}, [canvasRef, config])

	useEffect(() => {
		initChart()
		return () => {
			chartRef.current?.destroy()
			chartRef.current = null
		}
	}, [initChart])

	return chartRef
}
