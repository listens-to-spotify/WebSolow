import { useState, useRef, useEffect, useCallback } from 'react'
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler } from 'chart.js'
import { SolowModel, type TrajectoryPoint } from '../../utils/solowCore'
import { MainLayout } from '../../components/Wrapper/Wrappers'

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler)

function AppPage() {
	const [params, setParams] = useState({ s: 0.3, delta: 0.05, n: 0.02, g: 0.05, alpha: 0.5, k0: 0.5 })
	const [baseParams, setBaseParams] = useState({ s: 0.3, delta: 0.05, n: 0.02, g: 0.05, alpha: 0.5, k0: 0.5 })
	const [shockApplied, setShockApplied] = useState(false)
	const [shockParams, setShockParams] = useState({ param: 's', value: '0.3' })
	const [shockCounter, setShockCounter] = useState(0)

	const modelRef = useRef(new SolowModel(params))
	const baseModelRef = useRef(new SolowModel(params))
	const trajectoryRef = useRef<TrajectoryPoint[]>([])

	const phaseChartRef = useRef<Chart | null>(null)
	const dynChartRef = useRef<Chart | null>(null)
	const growthChartRef = useRef<Chart | null>(null)

	const phaseCanvas = useRef<HTMLCanvasElement>(null)
	const dynCanvas = useRef<HTMLCanvasElement>(null)
	const growthCanvas = useRef<HTMLCanvasElement>(null)

	const updateModel = useCallback((newParams: Partial<typeof params>) => {
		const updated = { ...params, ...newParams }
		setParams(updated)

		modelRef.current = new SolowModel(updated)
		baseModelRef.current = new SolowModel(baseParams)
	}, [params, baseParams])

	const initPhaseChart = useCallback(() => {
		if (!phaseCanvas.current) return
		phaseChartRef.current = new Chart(phaseCanvas.current, {
			type: 'line',
			data: {
				datasets: [
					{ label: 'y = k^α', data: [], borderColor: 'rgb(59, 130, 246)', fill: false, pointRadius: 0 },
					{ label: 's·f(k)', data: [], borderColor: 'rgb(34, 197, 94)', fill: false, pointRadius: 0 },
					{ label: '(δ+n+g)·k', data: [], borderColor: 'rgb(239, 68, 68)', fill: false, pointRadius: 0 },
					{ label: 'k* (старый)', data: [], borderColor: 'rgb(156, 163, 175)', borderDash: [5, 5], fill: false, pointRadius: 0, hidden: true },
					{ label: 'k* (новый)', data: [], borderColor: 'rgb(239, 68, 68)', borderDash: [5, 5], fill: false, pointRadius: 0, hidden: true }
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: { type: 'linear', title: { display: true, text: 'k' } },
					y: { title: { display: true, text: 'y' } }
				},
				plugins: { title: { display: true, text: 'Фазовый портрет' } }
			}
		})
	}, [])

	const updatePhaseChart = useCallback(() => {
		const chart = phaseChartRef.current
		if (!chart) return

		const model = modelRef.current
		const baseModel = baseModelRef.current
		const kMax = Math.max(5, model.kStar * 2, baseModel.kStar * 2)

		chart.data.datasets[0].data = baseModel.productionFunctionData(0, kMax)
		chart.data.datasets[1].data = model.sYLine(0, kMax)
		chart.data.datasets[2].data = model.breakEvenLine(0, kMax)

		if (shockApplied) {
			chart.data.datasets[3].data = [{ x: baseModel.kStar, y: 0 }, { x: baseModel.kStar, y: baseModel.y(baseModel.kStar) }]
			chart.data.datasets[3].hidden = false
			chart.data.datasets[4].data = [{ x: model.kStar, y: 0 }, { x: model.kStar, y: model.y(model.kStar) }]
			chart.data.datasets[4].hidden = false
		} else {
			chart.data.datasets[3].hidden = true
			chart.data.datasets[4].data = [{ x: model.kStar, y: 0 }, { x: model.kStar, y: model.y(model.kStar) }]
			chart.data.datasets[4].hidden = false
		}

		chart.options.scales!.x!.max = kMax
		chart.options.scales!.y!.max = Math.pow(kMax, model.alpha)
		chart.update('none')
	}, [shockApplied])

	const initDynamicsChart = useCallback(() => {
		if (!dynCanvas.current) return
		dynChartRef.current = new Chart(dynCanvas.current, {
			type: 'line',
			data: {
				datasets: [
					{ label: 'k(t)', data: [], borderColor: 'rgb(59, 130, 246)', fill: false, pointRadius: 0, tension: 0.1 },
					{ label: 'y(t)', data: [], borderColor: 'rgb(34, 197, 94)', fill: false, pointRadius: 0, tension: 0.1 },
					{ label: 'c(t)', data: [], borderColor: 'rgb(168, 85, 247)', fill: false, pointRadius: 0, tension: 0.1 }
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: { type: 'linear', title: { display: true, text: 't' } },
					y: { title: { display: true, text: 'value' }, min: 0 }
				},
				plugins: { title: { display: true, text: 'Динамика показателей' } }
			}
		})
	}, [])

	const updateDynamicsChart = useCallback(() => {
		const chart = dynChartRef.current
		if (!chart || trajectoryRef.current.length === 0) return

		const traj = trajectoryRef.current
		const step = Math.max(1, Math.floor(traj.length / 100))

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

		const maxY = Math.max(modelRef.current.kStar, modelRef.current.yStar, modelRef.current.c(modelRef.current.kStar)) * 1.3
		chart.options.scales!.y!.max = maxY

		const tMax = traj[traj.length - 1].t
		const tMin = Math.max(0, tMax - 300)
		chart.options.scales!.x!.min = tMin
		chart.options.scales!.x!.max = tMax

		chart.update('none')
	}, [])

	const initGrowthChart = useCallback(() => {
		if (!growthCanvas.current) return

		growthChartRef.current = new Chart(growthCanvas.current, {
			type: 'line',
			data: {
				datasets: [
					{ label: 'r(t)', data: [], borderColor: 'rgb(239, 68, 68)', fill: false, pointRadius: 0, tension: 0.1 },
					{ label: 'gw(t)', data: [], borderColor: 'rgb(245, 158, 11)', fill: false, pointRadius: 0, tension: 0.1 }
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: { type: 'linear', title: { display: true, text: 't' } },
					y: { title: { display: true, text: 'rate' }, min: -0.1, max: 0.4 }
				},
				plugins: { title: { display: true, text: 'Темпы роста' } }
			}
		})
	}, [])

	const updateGrowthChart = useCallback(() => {
		const chart = growthChartRef.current
		if (!chart || trajectoryRef.current.length === 0) return

		const traj = trajectoryRef.current
		const step = Math.max(1, Math.floor(traj.length / 100))

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

	const simulateWithShock = useCallback(() => {
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

	const handleStart = () => {
		const model = modelRef.current
		const trajectory = model.simulateEuler(500)
		trajectoryRef.current = trajectory
		updateDynamicsChart()
		updateGrowthChart()
		updatePhaseChart()
	}

	const handleReset = () => {
		const defaultParams = { s: 0.3, delta: 0.05, n: 0.02, g: 0.05, alpha: 0.5, k0: 0.5 }
		setParams(defaultParams)
		setBaseParams(defaultParams)
		const model = new SolowModel(defaultParams)
		modelRef.current = model
		baseModelRef.current = new SolowModel(defaultParams)
		setShockApplied(false)
		setShockParams({ param: 's', value: '0.3' })
		setShockCounter(0)
		trajectoryRef.current = []
		updatePhaseChart()
	}

	const handleApplyShock = () => {
		const shockValue = parseFloat(shockParams.value)
		if (isNaN(shockValue)) return

		if (trajectoryRef.current.length === 0) {
			handleStart()
		}

		const param = shockParams.param
		setBaseParams({ ...params })
		baseModelRef.current = new SolowModel(params)

		if (['s', 'delta', 'n', 'g', 'alpha'].includes(param)) {
			const newParams = { ...params, [param]: shockValue }
			setParams(newParams)
			modelRef.current = new SolowModel(newParams)
		}

		setShockApplied(true)
		simulateWithShock()
		updateDynamicsChart()
		updateGrowthChart()
		updatePhaseChart()
	}

	useEffect(() => {
		initPhaseChart()
		initDynamicsChart()
		initGrowthChart()
		updatePhaseChart()

		return () => {
			phaseChartRef.current?.destroy()
			dynChartRef.current?.destroy()
			growthChartRef.current?.destroy()
		}
	}, [])

	const kStar = modelRef.current.kStar
	const yStar = modelRef.current.yStar

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
										className="text-sm min-h-10 mb-4 bg-blue-300 hover:bg-blue-600 text-white font-bold rounded-md transition-transform hover:scale-105">
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
												setShockParams({ param, value: String(params[param as keyof typeof params]) })
											}}
											className="text-xs w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300"
										>
											<option value="s">s (норма сбережений)</option>
											<option value="delta">δ (амортизация)</option>
											<option value="n">n (население)</option>
											<option value="g">g (тех. прогресс)</option>
											<option value="alpha">α (коэффициент)</option>
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

export default AppPage
/*
return (
		<MainLayout>
				<div className='grid grid-cols-2 mt-2 px-2 space-x-4 space-y-4 mt-4'>
					<div className="bg-gray-100 p-4 rounded-lg">
						<h2 className="text-xl font-bold mb-4 text-blue-400 text-center">
							Параметры модели
						</h2>

						<div className='grid grid-cols-2 space-x-4 p-2'>
							<div className='grid grid-rows-6 px-10 py-4 bg-gray-200 rounded-lg'>
								{[
									{ key: 's', label: 'Норма сбережений (s)', min: 0.1, max: 0.9, step: 0.1 },
									{ key: 'delta', label: 'Норма амортизации (δ)', min: 0.01, max: 0.5, step: 0.01 },
									{ key: 'n', label: 'Рост населения (n)', min: 0, max: 0.5, step: 0.01 },
									{ key: 'g', label: 'Тех. прогресс (g)', min: 0, max: 0.5, step: 0.01 },
									{ key: 'alpha', label: 'Коэффициент (α)', min: 0.1, max: 0.9, step: 0.1 }
								].map(({ key, label, min, max, step }) => (
									<div key={key} className="p-2">
										<label className="block text-sm font-medium text-center">
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
									<label className="block text-sm font-medium text-center">
										Начальный капитал (k₀)
									</label>
									<input
										type="number"
										step="0.1"
										value={params.k0}
										onChange={(e) => updateModel({ k0: parseFloat(e.target.value) || 0.5 })}
										className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
									/>
								</div>
							</div>

							<div className='bg-gray-200 rounded-lg px-10 py-4'>
								<div className="grid grid-rows-3 mt-4 space-y-2">
									<button onClick={handleStart}
										className="max-h-20 py-2 bg-blue-300 hover:bg-blue-600 text-white font-bold rounded-md transition-transform hover:scale-105">
										Запустить
									</button>
									<button onClick={handleReset}
										className="max-h-20 mb-4 bg-gray-400 hover:bg-gray-600 text-white font-bold rounded-md transition-transform hover:scale-105">
										Сбросить
									</button>
									<div className="text-center py-4">
										<p className='text-xl mb-1'>Значения на ТСР</p>
										<p className="text-xl p-2">k* = <span className="font-bold text-blue-600">{kStar.toFixed(2)}</span></p>
										<p className="text-xl p-2">y* = <span className="font-bold text-blue-600">{yStar.toFixed(2)}</span></p>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<div className="bg-gray-100 rounded-lg px-4 py-4 text-center mb-4">
						<h2 className="text-xl font-bold mb-4 text-red-600">Шоковые сценарии</h2>

						<div className="mb-3">
							<label className="block text-sm font-medium text-gray-700 mb-1">Параметр</label>
							<select
								value={shockParams.param}
								onChange={(e) => {
									const param = e.target.value
									setShockParams({ param, value: String(params[param as keyof typeof params]) })
								}}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
							>
								<option value="s">s (норма сбережений)</option>
								<option value="delta">δ (амортизация)</option>
								<option value="n">n (население)</option>
								<option value="g">g (тех. прогресс)</option>
								<option value="alpha">α (коэффициент)</option>
							</select>
						</div>

						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700 mb-1">Новое значение</label>
							<input
								type="number"
								step="0.01"
								value={shockParams.value}
								onChange={(e) => setShockParams({ ...shockParams, value: e.target.value })}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
							/>
						</div>

						<div className="space-y-2">
							<button onClick={handleApplyShock}
								className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md">
								Применить шок
							</button>
						</div>

						{shockApplied && (
							<div className="mt-4 p-3 bg-red-50 rounded-md">
								<p className="text-sm font-medium text-red-800">Шок применен!</p>
								<p className="text-xs text-gray-600">k* старый: {baseModelRef.current.kStar.toFixed(4)}</p>
								<p className="text-xs text-gray-600">k* новый: {modelRef.current.kStar.toFixed(4)}</p>
							</div>
						)}
					</div>
				</div>
				
				<div className='bg-gray-100 rounded-lg ml-2 mr-2 mb-8 '>
					<div className="p-4">
						<div className="w-full aspect-[2/1]"><canvas ref={phaseCanvas}></canvas></div>
					</div>

					<div className="grid grid-cols-2 space-y-4">
						<div className="p-4">
							<div className="aspect-[3/2]"><canvas ref={dynCanvas}></canvas></div>
						</div>
						<div className="p-4">
							<div className="aspect-[3/2]"><canvas ref={growthCanvas}></canvas></div>
						</div>
					</div>
				</div>5173
		</MainLayout>
	)*/