import { MainLayout, Latex, Inline } from "../../components/Wrapper/Wrappers";
import 'katex/dist/katex.min.css';
import { FaWikipediaW } from "react-icons/fa";
import { HoverCard } from "../../components/Hovers/HoverCard";

import { PhaseExampleChart } from "./components/PhaseExampleChart";
import { PhaseExampleChartEq } from "./components/PhaseExampleChartEq";
import { DynamicExampleChartEq } from "./components/DynamicExampleChartEq";
import { GrowthExampleChartEq } from "./components/GrowthExampleChartEq";
import { PhaseExampleChartNeq } from "./components/PhaseExampleChartNeq";
import { DynamicExampleChartNeq } from "./components/DynamicExampleChartNeq";
import { GrowthExampleChartNeq } from "./components/GrowthExampleChartNeq";


function MathModelPage() {
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
                

                <div className="min-w-3xl max-w-5xl space-y-4">
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
                    
                    <PhaseExampleChart />

                    <p>Свойства, которые следуют из стационарного состояния:</p>

                    <div className="space-y-2 ml-6">
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
                        <li>
                            При отклонении от ТСР (например <Inline text="k < k^*" />), экономика с убывающим темпом возвращается в равновесие (<Inline text="k" /> растет до <Inline text="k^*" />).
                        </li>
                    </div>

                    <h2 className="text-2xl font-bold text-blue-400 mb-4">
                        Процентная ставка и темпы роста
                    </h2>

                    <p>Заметим, что <Inline text="f'(k) = MPK" /> — предельный продукт капитала. Иначе говоря — доход владельца за единицу капитала. Учитывая амортизацию, получаем:</p>

                    <Latex text="r = f'(k)-\delta" />

                    <Latex text="r=\alpha k^{\alpha-1}-\delta" />
                    
                    <p>
                        Найдем темпы роста <Inline text="Y" />, <Inline text="K" /> и <HoverCard
                            text={<Inline text="w"/>}
                            card={<Latex text="w = \frac{Y}{L}" />}
                        />:
                    </p>

                    <Latex text="\begin{aligned}
                        Y &= y \cdot A \cdot L \\
                        \log Y &= \log y + \log A + \log L \\
                        (\log Y)'_t &= (\log y)'_t + (\log A)'_t + (\log L)'_t \\
                        \frac{\dot Y}{Y} &= 
                                        \underbrace{\frac{\dot y}{y}}_0 +
                                        \underbrace{\frac{\dot A}{A}}_g +
                                        \underbrace{\frac{\dot L}{L}}_n \\
                        g_Y = \frac{\dot Y}{Y} &= g + n


                    \end{aligned}" />

                    <p>
                        <HoverCard 
                            text="Аналогично"
                            card={
                                <Latex text="\begin{aligned}
                                    K &= k \cdot A \cdot L \\
                                    \log K &= \log k + \log A + \log L \\
                                    (\log K)'_t &= (\log k)'_t + (\log A)'_t + (\log L)'_t \\
                                    \frac{\dot K}{K} &= 
                                                    \underbrace{\frac{\dot k}{k}}_0 +
                                                    \underbrace{\frac{\dot A}{A}}_g +
                                                    \underbrace{\frac{\dot L}{L}}_n \\
                                    g_K = \frac{\dot K}{K} &= g + n
                                \end{aligned}"
                                />
                            }
                        /> для <Inline text="K" /> {" "} : <Inline text="g_K = g + n" />. 
                    </p>

                    <Latex text="\begin{aligned}
                        w &= y \cdot A \\
                        \log w &= \log y + \log A \\
                        (\log w)'_t &= (\log y)'_t + (\log A)'_t \\
                        \frac{\dot w}{w} &= 
                                        \underbrace{\frac{\dot y}{y}}_0 +
                                        \underbrace{\frac{\dot A}{A}}_g \\
                        g_w = \frac{\dot w}{w} &= g
                    \end{aligned}" />
                    
                    <h2 className="text-2xl font-bold text-blue-400 mb-4">
                        Динамика показателей при шоках
                    </h2>

                    <p>Шоки можно разделить на два типа:</p>
                    
                    <div className="space-y-2 ml-6">
                        <li>
                            Не меняющие ТСР (<Inline text="k^*" /> остается прежним). Это дискретное изменение абсолютных или удельных показателей, таких как <Inline text="K,\ A,\ L, \ k"/>.
                       </li>
                        <li>
                            Меняющие ТСР (<Inline text="k^*" /> меняется). Это дискретное изменение параметров модели <Inline text="s,\ n,\ g,\ \delta"/>, приводящее к движению графиков на фазовом портрете.
                        </li>
                    </div>

                    <h3 className="text-xl font-bold text-blue-400 mb-4">
                        Шоки не меняющие ТСР
                    </h3>

                    <p>
                        Пусть в момент <Inline text="t_0 = 50" /> произошел шок, который привел к дискретному уменьшению капиталовооруженности с уровня <Inline text="k^*" /> до <Inline text="k'" />. Так как ТСР не поменялась, все показатели вернутся к стационарному состоянию.
                    </p>

                    <PhaseExampleChartEq />

                    <div className="flex justify-center items-center mb-8">
                        <div className="w-1/2">
                            <DynamicExampleChartEq />
                        </div>  
                        <div className="w-1/2">
                            <GrowthExampleChartEq />
                        </div>
                    </div>

                    <p>
                        Характер выпуклости у каждого из графика динамики (возвращение к исходному уровню с убывающим темпом) объясняется
                        <HoverCard
                            text="свойством"
                            card={<p>
                                При отклонении от ТСР (например <Inline text="k < k^*" />), экономика с убывающим темпом возвращается в равновесие (<Inline text="k" /> растет до <Inline text="k^*" />).
                            </p>}
                        />, следующим из ТСР.
                    </p>
                    
                    <h3 className="text-xl font-bold text-blue-400 mb-4">
                        Шоки меняющие ТСР
                    </h3>
                    
                    <p>
                        Пусть в момент <Inline text="t_0 = 50" /> произошел шок сбережений, который привел уменьшению нормы сбережений с уровня <Inline text="s=0.3" /> до <Inline text="s=0.2" />. Так поменялся параметр модели, прямая <Inline text="sf(k)" /> сдвигается вниз для каждого <Inline text="k" /> в 1.5 раза. ТСР меняется, и как следствие меняются значения <Inline text="k^*, \ y^*, \ c^*"/>, процентная ставка и равновесные темпы роста.
                    </p>

                    <PhaseExampleChartNeq />

                    <div className="flex justify-center items-center mb-8">
                        <div className="w-1/2">
                            <DynamicExampleChartNeq />
                        </div>  
                        <div className="w-1/2">
                            <GrowthExampleChartNeq />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default MathModelPage;