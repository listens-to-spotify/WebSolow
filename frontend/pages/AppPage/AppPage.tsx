import { useState, useRef, useCallback } from 'react'
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler } from 'chart.js'
import { SolowModel, type TrajectoryPoint } from '../../utils/solowCore'
import { MainLayout } from '../../components/Wrapper/Wrappers'
import { PhaseChartNode } from './components/PhaseChartNode'
import { DynamicsChartNode } from './components/DynamicsChartNode'
import { GrowthChartNode } from './components/GrowthChartNode'
import 'katex/dist/katex.min.css'
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';


Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler)

const defaultParams = { s: 0.3, delta: 0.05, n: 0.02, g: 0.05, alpha: 0.5, k0: 0.5 }

function AppPage() {
	const [params, setParams] = useState(defaultParams);
	const [shockParams, setShockParams] = useState({ param: 's', value: '0.3' });
	const [shockCounter, setShockCounter] = useState(0);
	const [updateVersion, setUpdateVersion] = useState(0);

	const modelRef = useRef(new SolowModel(params))
	const baseModelRef = useRef(new SolowModel(params))
	const trajectoryRef = useRef<TrajectoryPoint[]>([])
	const shockParamRef = useRef('s')

	const updateModel = useCallback((newParams: Partial<typeof params>) => {
		setParams(prev => {
			const updated = { ...prev, ...newParams }
			modelRef.current = new SolowModel(updated)
			return updated
		})
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

	const simulateFromK = useCallback((kStart: number, tStart: number) => {
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

	const handleStart = useCallback(() => {
		const model = modelRef.current
		const trajectory = model.simulateTraj(500)
		trajectoryRef.current = trajectory
		setUpdateVersion(prev => prev + 1)
	}, [])

	const handleReset = useCallback(() => {
		setParams(defaultParams)

		modelRef.current = new SolowModel(defaultParams)
		baseModelRef.current = new SolowModel(defaultParams)

		setShockParams({ param: 's', value: '0.3' })
		setShockCounter(0)
		trajectoryRef.current = []
		setUpdateVersion(prev => prev + 1)
	}, [])

	const handleApplyShock = useCallback(() => {
		const shockValue = parseFloat(shockParams.value)
		if (isNaN(shockValue) || shockValue <= 0) return

		if (trajectoryRef.current.length === 0) handleStart()

		const param = shockParams.param
		shockParamRef.current = param
		baseModelRef.current = new SolowModel(params)

		if (['s', 'delta', 'n', 'g', 'alpha'].includes(param)) {
			const newParams = { ...params, [param]: shockValue }
			setParams(newParams)

			modelRef.current = new SolowModel(newParams)
			simulateWithShock()
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

			simulateFromK(newK, t0)
		}

		setUpdateVersion(prev => prev + 1)
	}, [shockParams, params, handleStart, simulateWithShock, simulateFromK])

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
										className="text-sm min-h-10 mb-4 bg-blue-300 hover:bg-blue-400 text-white font-bold rounded-md transition-transform hover:scale-105">
										Запустить
									</button>
									<button onClick={handleReset}
										className="text-sm min-h-10 mb-4 bg-gray-400 hover:bg-gray-600 text-white font-bold rounded-md transition-transform hover:scale-105">
										Сбросить
									</button>
									<div className="text-center py-4">

										<p className='text-xl mb-2 text-blue-600 font-bold'>Значения на ТСР</p>
										<p className="text-sm"><InlineMath math="k^* = " /> <span className="font-bold text-blue-600">{kStar.toFixed(2)}</span></p>
										<p className="text-sm"><InlineMath math="y^* = " /> <span className="font-bold text-blue-600">{yStar.toFixed(2)}</span></p>
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
					<div className='bg-gray-100 rounded-lg ml-2 mr-2 mb-8'>
						<PhaseChartNode
							modelRef={modelRef}
							baseModelRef={baseModelRef}
							shockParamRef={shockParamRef}
							version={updateVersion}
						/>

						<div className="grid grid-cols-2 space-y-4">
							<DynamicsChartNode
								modelRef={modelRef}
								trajectoryRef={trajectoryRef}
								version={updateVersion}
							/>
							<GrowthChartNode
								trajectoryRef={trajectoryRef}
								version={updateVersion}
							/>
						</div>
					</div>
				</div>
			</div>
		</MainLayout>
	)
}

export default AppPage
