import { useState, useRef, useEffect, useCallback } from 'react'
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler } from 'chart.js'
import { SolowModel, type TrajectoryPoint } from '../../utils/solowCore'
import { MainLayout } from '../../components/Wrapper/Wrappers'
import { PhaseChartConfig, DynamicChartConfig, GrowthChartConfig } from './ChartConfig.js'

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler)

function AppPage() {
	/* =================== SETTERS & GETTERS =================== */
	const [params, setParams] = useState({ s: 0.3, delta: 0.05, n: 0.02, g: 0.05, alpha: 0.5, k0: 0.5 })
	const [baseParams, setBaseParams] = useState({ s: 0.3, delta: 0.05, n: 0.02, g: 0.05, alpha: 0.5, k0: 0.5 })
	const [shockApplied, setShockApplied] = useState(false)
	const [shockParams, setShockParams] = useState({ param: 's', value: '0.3' })
	const shockParamRef = useRef('s')
	const [shockCounter, setShockCounter] = useState(0)

	/* =================== CORE MODEL =================== */
	const modelRef = useRef(new SolowModel(params))
	const baseModelRef = useRef(new SolowModel(params))
	const trajectoryRef = useRef<TrajectoryPoint[]>([])

	/* =================== CHART REFS =================== */
	const phaseChartRef = useRef<Chart>(null)
	const dynChartRef = useRef<Chart>(null)
	const growthChartRef = useRef<Chart>(null)

	/* =================== CANVAS REFS =================== */
	const phaseCanvas = useRef<HTMLCanvasElement>(null)
	const dynCanvas = useRef<HTMLCanvasElement>(null)
	const growthCanvas = useRef<HTMLCanvasElement>(null)

	/* =================== INITIALIZERS =================== */
	const initPhaseChart = useCallback(() => {
		if (!phaseCanvas.current) return
		phaseChartRef.current = new Chart(phaseCanvas.current, PhaseChartConfig)
	}, [])

	const initGrowthChart = useCallback(() => {
		if (!growthCanvas.current) return

		growthChartRef.current = new Chart(growthCanvas.current, GrowthChartConfig)
	}, [])

	const initDynamicsChart = useCallback(() => {
		if (!dynCanvas.current) return
		dynChartRef.current = new Chart(dynCanvas.current, DynamicChartConfig)
	}, [])

	/* =================== UPDATERS =================== */
	const updateModel = useCallback((newParams: Partial<typeof params>) => {
		const updated = { ...params, ...newParams }
		setParams(updated)

		modelRef.current = new SolowModel(updated)
		baseModelRef.current = new SolowModel(baseParams)
	}, [params, baseParams])

	const updatePhaseChart = useCallback(() => {
		const chart = phaseChartRef.current
		if (!chart) return

		const model = modelRef.current
		const baseModel = baseModelRef.current
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
			chart.data.datasets[7].hidden = !['delta', 'n', 'g'].includes(param)

			chart.data.datasets[5].data = param === 'alpha' ? baseModel.productionFunctionData(0, kMax) : []
			chart.data.datasets[6].data = param === 's' ? baseModel.sYLine(0, kMax) : []
			chart.data.datasets[7].data = ['delta', 'n', 'g'].includes(param) ? baseModel.amortizationLine(0, kMax) : []
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
	}, [])

	const updateDynamicsChart = useCallback(() => {
		const chart = dynChartRef.current
		if (!chart || trajectoryRef.current.length === 0) return

		const traj = trajectoryRef.current
		const step = 1

		const kData: { x: number, y: number }[] = []
		const yData: { x: number, y: number }[] = []
		const cData: { x: number, y: number }[] = []

		for (let i = 0; i < traj.length; i += step) {
			kData.push({ x: traj[i].t, y: traj[i].k })
			yData.push({ x: traj[i].t, y: traj[i].y })
			cData.push({ x: traj[i].t, y: traj[i].c })
		}

		chart.data.datasets[0].data = kData
		chart.data.datasets[1].data = yData
		chart.data.datasets[2].data = cData

		const maxY = Math.max(
			modelRef.current.kStar,
			modelRef.current.yStar,
			modelRef.current.c(modelRef.current.kStar),
			Math.max(...trajectoryRef.current.slice(-2000).map(o => o.k))
		) * 1.3
		chart.options.scales!.y!.max = maxY

		const tMax = traj[traj.length - 1].t
		const tMin = Math.max(0, tMax - 300)
		chart.options.scales!.x!.min = tMin
		chart.options.scales!.x!.max = tMax

		chart.update('none')
	}, [])

	const updateGrowthChart = useCallback(() => {
		const chart = growthChartRef.current
		if (!chart || trajectoryRef.current.length === 0) return

		const traj = trajectoryRef.current
		const step = 1

		const rData: { x: number, y: number }[] = []
		const gwData: { x: number, y: number }[] = []

		for (let i = 0; i < traj.length; i += step) {
			rData.push({ x: traj[i].t, y: traj[i].r })
			gwData.push({ x: traj[i].t, y: traj[i].gw })
		}

		chart.data.datasets[0].data = rData
		chart.data.datasets[1].data = gwData

		const tMax = traj[traj.length - 1].t
		const tMin = Math.max(0, tMax - 300)
		chart.options.scales!.x!.min = tMin
		chart.options.scales!.x!.max = tMax

		chart.update('none')
	}, [])

	/* =================== SIMULATIONS =================== */
	const simulateWithShock = useCallback(() => {
		// remember old traj and use it as initial for next 100 iterations
		const oldTrajectory = trajectoryRef.current
		const dt = 100 / 500
		const endPoint = oldTrajectory[oldTrajectory.length - 1]
		const t0 = endPoint.t

		const newTrajectory = oldTrajectory.map(p => ({ ...p }))

		let k = endPoint.k
		const newTMax = 100 + 100 * (shockCounter + 1)
		const simModel = modelRef.current

		for (let t = t0 + dt; t <= newTMax; t += dt) {
			newTrajectory.push(simModel.createPoint(t, k))
			k = k + dt * simModel.dkdt(k)
			k = Math.max(0, k)
		}

		trajectoryRef.current = newTrajectory
		setShockCounter(prev => prev + 1)
	}, [shockCounter])

	const simulateFromK = useCallback((kStart: number, tStart: number) => {
		// expected to be called when only k changes (no params changed)
		const dt = 100 / 500
		const traj = trajectoryRef.current

		const newTMax = 100 + 100 * (shockCounter + 1)
		const model = modelRef.current

		let k = kStart
		for (let t = tStart + dt; t <= newTMax; t += dt) {
			traj.push(model.createPoint(t, k))
			k = k + dt * model.dkdt(k)
			k = Math.max(0, k)
		}

		trajectoryRef.current = traj
		setShockCounter(prev => prev + 1)
	}, [shockCounter])

	/* =================== HANDLERS =================== */
	const handleStart = () => {
		const model = modelRef.current
		const trajectory = model.simulateTraj(500)
		trajectoryRef.current = trajectory

		// update charts with start values
		updateDynamicsChart()
		updateGrowthChart()
		updatePhaseChart()
	}

	const handleReset = () => {
		const defaultParams = { s: 0.3, delta: 0.05, n: 0.02, g: 0.05, alpha: 0.5, k0: 0.5 }

		setParams(defaultParams)
		setBaseParams(defaultParams)

		// rebuild model
		const model = new SolowModel(defaultParams)
		modelRef.current = model
		baseModelRef.current = new SolowModel(defaultParams)

		// update setters
		setShockApplied(false)
		setShockParams({ param: 's', value: '0.3' })
		setShockCounter(0)

		trajectoryRef.current = []
		updatePhaseChart()
	}

	const handleApplyShock = () => {
		const shockValue = parseFloat(shockParams.value)
		if (isNaN(shockValue) || shockValue <= 0) return

		if (trajectoryRef.current.length === 0) {
			handleStart()
		}

		const param = shockParams.param
		shockParamRef.current = param
		setBaseParams({ ...params })
		baseModelRef.current = new SolowModel(params)

		// params change
		if (['s', 'delta', 'n', 'g', 'alpha'].includes(param)) {
			const newParams = { ...params, [param]: shockValue }
			setParams(newParams)

			modelRef.current = new SolowModel(newParams)
			
			// simulate param shock
			setShockApplied(true)
			simulateWithShock()
		// discrete change
		} else if (['K', 'L', 'A'].includes(param)) {
			const traj = trajectoryRef.current
			const lastPoint = traj[traj.length - 1]
			const currentK = lastPoint ? lastPoint.k : params.k0
			let newK: number
			if (param === 'K') {
				newK = currentK * shockValue
			} else {
				newK = currentK / shockValue
			}

			const model = modelRef.current
			const t0 = lastPoint.t
			const shockPoint = model.createPoint(t0, newK)

			const newTraj = [...traj, shockPoint]
			trajectoryRef.current = newTraj
			
			// simulate discrete change
			simulateFromK(newK, t0)
			setShockApplied(true)
		}

		updateDynamicsChart()
		updateGrowthChart()
		updatePhaseChart()
	}

	/* =================== INIT HOOK =================== */
	useEffect(() => {
		initPhaseChart()
		initDynamicsChart()
		initGrowthChart()
		updatePhaseChart()
		updateDynamicsChart()
		updateGrowthChart()

		return () => {
			phaseChartRef.current?.destroy()
			dynChartRef.current?.destroy()
			growthChartRef.current?.destroy()
		}
	}, [])

	const kStar = modelRef.current.kStar
	const yStar = modelRef.current.yStar

	/* =================== HTML PAGE =================== */
	return (
		<MainLayout>
			<div className='flex space-x-4 space-y-4 mt-4'>
				<div className='w-3/8 bg-gray-100 p-4 rounded-lg'>
					<h2 className='text-xl font-bold text-blue-300 text-center mb-4'>
						Параметры модели
					</h2>
					<div className='bg-gray-200 rounded-lg'>
						<div className='flex space-x-2'>
							<div className='w-1/2 border-r-4 p-4 border-gray-100'>
								{[
									{ key: 's', label: 'Норма сбережений (s)', min: 0.1, max: 0.9, step: 0.1 },
									{ key: 'delta', label: 'Норма амортизации (δ)', min: 0.01, max: 0.5, step: 0.01 },
									{ key: 'n', label: 'Рост населения (n)', min: 0, max: 0.5, step: 0.01 },
									{ key: 'g', label: 'Тех. прогресс (g)', min: 0, max: 0.5, step: 0.01 },
									{ key: 'alpha', label: 'Коэффициент (α)', min: 0.1, max: 0.9, step: 0.1 }
								].map(({ key, label, min, max, step }) => (
									<div key={key} className="p-2">
										<label className="block text-xs font-medium">
											{label} <span className="font-bold text-blue-600 p-1">{params[key as keyof typeof params]}</span>
										</label>
										
										<input
											type="range"
											min={min} max={max} step={step}
											value={params[key as keyof typeof params]}
											onChange={(e) => updateModel({ [key]: parseFloat(e.target.value) })}
											className="h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer w-full transition-transform hover:scale-102"
										/>
									</div>
								))}

								<div className="mb-3">
									<label className="block text-xs font-medium text-center mb-1">
										Начальный капитал (k₀)
									</label>
									<input
										type="number"
										step="0.1"
										value={params.k0}
										onChange={(e) => updateModel({ k0: parseFloat(e.target.value) || 0.5 })}
										className="w-full text-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
									/>
								</div>
							</div>

							<div className='w-1/2 flex justify-center items-center'>
								<div className='flex grid grid-row-3'>
									<button onClick={handleStart}
										className="text-sm min-h-10 mb-4 bg-blue-300 hover:bg-blue-400 text-white font-bold rounded-md transition-transform hover:scale-105">
										Запустить
									</button>
									<button onClick={handleReset}
										className="text-sm min-h-10 mb-4 bg-gray-400 hover:bg-gray-600 text-white font-bold rounded-md transition-transform hover:scale-105">
										Сбросить
									</button>
									<div className="text-center py-4">
										<p className='text-sm mb-1'>Значения на ТСР</p>
										<p className="text-sm">k* = <span className="font-bold text-blue-600">{kStar.toFixed(2)}</span></p>
										<p className="text-sm">y* = <span className="font-bold text-blue-600">{yStar.toFixed(2)}</span></p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<h2 className="text-xl font-bold text-blue-300 text-center mb-4 mt-4">
						Шоковые сценарии
					</h2>
					
					<div className='bg-gray-200 rounded-lg'>
						<div className='flex justify-center items-center'>
							<div className='flex grid grid-rows-3'>
								<div className="mb-2 mt-4">
									<label className="block text-xs font-medium mb-1">Параметр</label>
										<select
											value={shockParams.param}
											onChange={(e) => {
												const param = e.target.value
												const isAggregate = ['K', 'L', 'A'].includes(param)
												setShockParams({ param, value: isAggregate ? '1' : String(params[param as keyof typeof params]) })
											}}
											className="text-xs w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
										>
											<option value="s">s (норма сбережений)</option>
											<option value="delta">δ (амортизация)</option>
											<option value="n">n (население)</option>
											<option value="g">g (тех. прогресс)</option>
											<option value="alpha">α (коэффициент)</option>
											<option value="K">K (капитал, × раз)</option>
											<option value="A">A (технология, × раз)</option>
											<option value="L">L (труд, × раз)</option>
										</select>
								</div>

								<div className="">
									<label className="text-xs block font-medium mb-1">Новое значение</label>
									<input
										type="number"
										step="0.01"
										value={shockParams.value}
										onChange={(e) => setShockParams({ ...shockParams, value: e.target.value })}
										className="text-xs w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
									/>
								</div>

								<div className="space-y-2">
									<button onClick={handleApplyShock}
										className="w-full py-2 text-sm bg-red-400 hover:bg-red-600 transition-transform hover:scale-105 text-white font-bold rounded-md">
										Применить шок
									</button>
								</div>
							</div>
						</div>
					</div>			
				</div>

				<div className='w-5/8 bg-gray-100 p-4 mb-4 rounded-lg'>
					{/* Графики */}
					<div className='bg-gray-100 rounded-lg ml-2 mr-2 mb-8'>
						<div className="p-2">
							<div className="w-full aspect-[2/1]"><canvas ref={phaseCanvas}></canvas></div>
						</div>

						<div className="grid grid-cols-2 space-y-4">
							<div className="p-2">
								<div className="aspect-[3/2]"><canvas ref={dynCanvas}></canvas></div>
							</div>
							<div className="p-2">
								<div className="aspect-[3/2]"><canvas ref={growthCanvas}></canvas></div>
							</div>
						</div>
					</div>
				</div>
			</div>
				
				
		</MainLayout>
	)
}

export default AppPage;