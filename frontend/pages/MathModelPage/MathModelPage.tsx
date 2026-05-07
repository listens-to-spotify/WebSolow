import { MainLayout, Latex, Inline } from "../../components/Wrapper/Wrappers";
import { useRef, useEffect, useCallback } from 'react'
import { SolowModel, type TrajectoryPoint } from '../../utils/solowCore'
import { Chart } from 'chart.js'
import 'katex/dist/katex.min.css';
import { FaWikipediaW } from "react-icons/fa";
import { HoverCard } from "../../components/Hovers/HoverCard";
import { PhaseExampleChartConfig } from "./ChartConfig.js"
import { InlineMath } from 'react-katex';

import { TfiLineDashed } from "react-icons/tfi";
import { TfiLayoutLineSolid } from "react-icons/tfi";

function MathModelPage() {

    const params = {
        s: 0.3,
        delta: 0.05,
        n: 0.02,
        g: 0.05,
        alpha: 0.5,
        k0: 0.5
    }

    const trajectoryRef = useRef<TrajectoryPoint[]>([])
    const modelRef = useRef(new SolowModel(params))
    const phaseChartRef = useRef<Chart>(null)
    const phaseCanvas = useRef<HTMLCanvasElement>(null)

    const initPhaseChart = useCallback(() => {
        if (!phaseCanvas.current) return
        phaseChartRef.current = new Chart(phaseCanvas.current, PhaseExampleChartConfig)
        // handleStart()
    }, [])

    const updatePhaseChart = useCallback(() => {
        const chart = phaseChartRef.current
        if (!chart) return

        const model = modelRef.current
		const kMax = Math.max(5, model.kStar * 2, model.kStar * 2)

		chart.data.datasets[0].data = model.productionFunctionData(0, kMax)
		chart.data.datasets[1].data = model.sYLine(0, kMax)
		chart.data.datasets[2].data = model.amortizationLine(0, kMax)
        chart.data.datasets[3].data = [{x : model.kStar, y: 0}, {x: model.kStar, y: params.s * model.y(model.kStar)}, {x: model.kStar, y: model.y(model.kStar)}]

        chart.options.scales!.x!.max = kMax
		chart.options.scales!.y!.max = Math.pow(kMax, model.alpha)
		chart.update('none')
    }, [])

    useEffect(() => {
        initPhaseChart()
        updatePhaseChart()

        return () => {
            phaseChartRef.current?.destroy()
        }
    }, [])

    return (
        <MainLayout>
            <div className="flex flex-col items-center mb-10">

                <div className="min-w-3xl mx-auto flex items-center justify-center space-x-5 p-10 border-b-4 border-blue-300 mb-10">
                    <h1 className="text-3xl font-bold text-blue-400">
                        Математическая модель
                    </h1>
                    <a href="https://ru.wikipedia.org/wiki/%D0%9C%D0%BE%D0%B4%D0%B5%D0%BB%D1%8C_%D0%A1%D0%BE%D0%BB%D0%BE%D1%83" target="_blank">
                        <FaWikipediaW className="min-h-10 min-w-10 text-blue-400 transition-transform hover:scale-105" />
                    </a>
                </div>
                

                <div className="min-w-3xl max-w-3xl space-y-4">
                    <p className="mb-4">
                        <text className="font-bold">Модель Солоу</text> — модель экзогенного экономического роста, основанная на экзогенной норме сбережений (<Inline text="s" />) и неоклассической производственной функции.
                    </p>

                    <h2 className="text-2xl font-bold text-blue-400 mb-4">
                        Базовые предпосылки модели
                    </h2>

                    <p>В модели рассматривается закрытая экономика без государственного сектора, поэтому выпуск тратится на потребление (<Inline text="C" />) и сбережения (<Inline text="S" />), равные инвестициям (<Inline text="I" />):</p>

                    <Latex text="Y = C + I, \quad I = S = sY" />

                    <p className="mt-4">
                        Производственная функция {" "}
                        <HoverCard
                            text={<Inline text="Y = F(K, L, A)" />}
                            card={
                                <div className="ml-6 space-y-2">
                                <li><Inline text="K" /> — капитал</li>
                                <li><Inline text="L" /> — труд</li>
                                <li><Inline text="A" /> — уровень технологий</li>
                            </div>
                            }
                        />
                        {" "}
                        удовлетворяет неоклассическим предпоссылкам:
                    </p>

                    <div className="ml-6 space-y-2 mb-4">
                        <li>
                            <HoverCard
                                text="Технологический прогресс увеличивает производительность труда"
                                card={
                                    <Latex text="F(K, L, A) = F(K, AL)" />
                                }
                            />
                        </li>
                        <li>
                            <HoverCard
                                text="Постоянная отдача от масштаба"
                                card={
                                    <Latex text="F(aK, aAL) = aF(K, AL)" />
                                }
                            />
                        </li>
                        <li>
                            <HoverCard 
                                text="Предельный продукт факторов положителен и убывает"
                                card={
                                    <Latex text="\frac{\partial F}{\partial K} > 0, \quad \frac{\partial F}{\partial L} > 0,\quad \frac{\partial^2 F}{\partial K^2} < 0,\quad \frac{\partial^2 F}{\partial L^2} < 0" />
                                }
                            />
                        </li>
                        <li>
                            <HoverCard 
                                text="Условия Инады"
                                card={
                                    <div className="space-y-2">
                                        <Latex text="\lim_{K \to 0} \frac{\partial F}{\partial K} = +\infty, \quad \lim_{K \to \infty} \frac{\partial F}{\partial K} = 0" />
                                        <Latex text="\lim_{L \to 0} \frac{\partial F}{\partial L} = +\infty, \quad \lim_{L \to \infty} \frac{\partial F}{\partial L} = 0" />
                                    </div>
                                    
                                }
                            />
                        </li>
                        <li>
                            <HoverCard 
                                text="Для произвоства необходим каждый фактор"
                                card={
                                    <Latex text="F(K, 0) = F(0, AL) = 0" />
                                }
                            />
                        </li>
                    </div>

                    <h2 className="text-2xl font-bold text-blue-400 mb-4">
                        Динамика факторов производства
                    </h2>

                    <p>
                        Население, равное трудовым ресурсам <Inline text="L" />, растет с темпом <HoverCard
                            text={<Inline text="n" />}
                            card={<Latex text="n = \frac{\dot L}{L}" />}
                        />.
                    </p>
                    <p>
                        Технологии <Inline text="A" /> растут с темпом <HoverCard
                            text={<Inline text="g" />}
                            card={<Latex text="g = \frac{\dot A}{A}"/>}
                        />.
                    </p> 
                    <p>
                    Капитал <Inline text="K" /> растет на величину инвестиций <Inline text="sY" /> и изнашивается на величину {" "}
                        <HoverCard
                            text={<Inline text="\delta K" />}
                            card={
                                <li className="ml-6">
                                    <Inline text="\delta"/> — норма выбытия капитала 
                                </li>
                            }
                        />
                        .
                    </p>

                    <h2 className="text-2xl font-bold text-blue-400 mb-4">
                        Основная система уравнений
                    </h2>

                    <Latex 
                        text="\begin{cases}
                            Y(t) = F(K(t), A(t)L(t)) \\
                            L(t) = L_0 e^{nt} \\
                            A(t) = A_0 e^{gt} \\
                            K(0) = K_0 \\
                            \dot K = sY - \delta K \\
                        \end{cases}"
                    />

                    <p>
                        Наиболее часто используемой проиводственной функцией является <a className="underline underline-offset-4 text-blue-400" href="https://ru.wikipedia.org/wiki/%D0%A4%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D1%8F_%D0%9A%D0%BE%D0%B1%D0%B1%D0%B0_%E2%80%94_%D0%94%D1%83%D0%B3%D0%BB%D0%B0%D1%81%D0%B0">
                            функция Кобба-Дугласа
                        </a>:
                    </p>

                    <Latex text="F(K, AL) = K^{\alpha}(AL)^{1 - \alpha}" />

                    <h2 className="text-2xl font-bold text-blue-400 mb-4">
                        Решение модели
                    </h2>

                    <p>
                        Для поиска решения используются удельные показатели:
                        <div className="space-y-2 ml-6 mt-4">
                            <li>
                                Капиталовооруженность на единицу эффективного труда <Inline text="k" />
                            </li>
                            <li>
                                Выпуск на единицу эффективного труда <Inline text="y" />
                            </li>
                            <li>
                                Потребление на единицу эффективного труда <Inline text="c" />
                            </li>
                        </div>
                    </p>

                    <Latex text="k = \frac{K}{AL}, \quad y = \frac{Y}{AL}, \quad c = \frac{C}{AL}" />
                    
                    <p>
                        Тогда используя свойство постоянной отдачи от масштаба, производственную функцию можно записать в следующем виде:
                    </p>

                    <Latex text="y = \frac{Y}{AL} = \frac{F(K, AL)}{AL} = F\left(\frac{K}{AL}, \frac{AL}{AL}\right) = F(k, 1) = k^\alpha := f(k)"/>
                    
                    <p>
                        Уравнение капитала <Inline text="\dot K = sY - \delta K" /> можно записать в следующем виде:
                    </p>

                    <Latex text="\begin{aligned}
                        \dot k &= \dot{\left(\frac{K}{AL}\right)} = 
                        \frac{\dot K \cdot AL - \dot{(AL)} \cdot K}{(AL)^2} = \\
                        &= \frac{\dot K}{AL} - \frac{K(\dot A L + A \dot L)}{(AL)^2} =
                        \frac{sY - \delta K}{AL} - \frac{K}{AL}\left(\frac{\dot L}{L} + \frac{\dot A}{A}\right) = \\
                        &= s \cdot \frac{Y}{AL} - \frac{K}{AL}\left(
                            n + g + \delta
                        \right)
                        = sf(k) - (n + g + \delta)k
                    \end{aligned}" />
                    

                    <h2 className="text-2xl font-bold text-blue-400 mb-4">
                        Стационарное состояние
                    </h2>

                    <p>
                       Траектория сбалансированного роста (ТСР) — состояние модели, в котором капиталовооруженность <Inline text="k" /> остается постоянной. 
                    </p>

                    <Latex text="\dot k = sk^\alpha - (n + g + \delta)k = 0" />

                    <p>
                        Аналитическим решением данного уравнения является точка:
                    </p>

                    <Latex text="k^* = \left(\frac{s}{n + g + \delta}\right)^{\frac{1}{1 - \alpha}}" />

                    <p>Нахождение стационарного состояния можно представить в графическом виде, изобразив уравнение в фазовой плоскости.</p>
                    
                    <div className="flex justify-center items-center">
                        <div className="p-2 aspect-[3/2] w-4/5">
                            <canvas ref={phaseCanvas}></canvas>
                        </div>  
                        <div className="w-1/5">
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
                        </div>
                    </div>
                    

                    <p>Некоторые из свойств стационарного состояния:</p>

                    <div className="space-y-2 ml-6">
                        <li>
                            <HoverCard
                                text={<div>
                                    Валовые показатели <Inline text="K" />, <Inline text="C" /> и <Inline text="Y" /> растут с одинаковым постоянным темпом роста
                                </div>}
                                card={
                                    <Latex text="\frac{\dot K}{K} = \frac{\dot C}{C} = \frac{\dot Y}{Y} = g + n" />
                                }
                            />
                        </li>
                        <li>
                            <HoverCard
                                text={<div>
                                    Удельные показатели <Inline text="k" />, <Inline text="c" /> и <Inline text="y" /> имеют нулевой темп прироста
                                </div>}
                                card={
                                    <Latex text="\frac{\dot k}{k} = \frac{\dot c}{c} = \frac{\dot y}{y} = 0" />
                                }
                            />
                        </li>
                    </div>
                    

                    <h2 className="text-2xl font-bold text-blue-400 mb-4">
                        Золотое правило накопления
                    </h2>

                    <Latex text="c=f(k)-(\delta+n+g)k" />

                    <Latex text="f'(k_{GR})=\delta+n+g" />

                    <Latex text="s_{GR}=\alpha" />

                    <h2 className="text-2xl font-bold text-blue-400 mb-4">
                        Процентная ставка
                    </h2>

                    <Latex text="r=f'(k)-\delta" />

                    <Latex text="r=\alpha k^{\alpha-1}-\delta" />

                    <p className="mt-4">
                        В точке золотого правила:
                    </p>

                    <Latex text="r=n+g" />

                </div>
            </div>
        </MainLayout>
    )
}

export default MathModelPage;