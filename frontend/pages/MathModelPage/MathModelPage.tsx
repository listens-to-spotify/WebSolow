import { MainLayout, Latex, Inline } from "../../components/Wrapper/Wrappers";
import 'katex/dist/katex.min.css';
import { FaWikipediaW } from "react-icons/fa";

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
                

                <div className="min-w-3xl space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold text-blue-400 mb-4">
                            Основные предпосылки модели
                        </h2>

                        <p>Уравнения, свойственные закрытой экономике без государственного сектора:</p>

                        <Latex text="S = I = sY, \quad Y = C + I" />

                        <p className="mt-4">
                            Производственная функция{" "}
                            <Inline text="Y(K,L,A) = Y(K,AL)" />, где:
                        </p>

                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li><Inline text="K" /> — капитал</li>
                            <li><Inline text="L" /> — труд</li>
                            <li><Inline text="A" /> — уровень технологий</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-blue-400 mb-4">
                            Свойства производственной функции
                        </h2>

                        <p>Постоянная отдача от масштаба:</p>

                        <Latex text="Y(aK,aAL)=aY(K,AL)" />

                        <p className="mt-4">
                            Предельный продукт факторов положителен и убывает:
                        </p>

                        <Latex text="\frac{\partial Y}{\partial K}>0,\quad \frac{\partial Y}{\partial L}>0,\quad \frac{\partial^2Y}{\partial K^2}<0,\quad \frac{\partial^2Y}{\partial L^2}<0" />
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-blue-400 mb-4">
                            Условия Инады
                        </h2>

                        <Latex text="\lim_{K\to0}\frac{\partial Y}{\partial K}=+\infty,\quad \lim_{K\to\infty}\frac{\partial Y}{\partial K}=0" />

                        <p className="mt-4">
                            Для производства необходим каждый фактор:
                        </p>

                        <Latex text="Y(K,0)=Y(0,AL)=0" />
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-blue-400 mb-4">
                            Динамика факторов производства
                        </h2>

                        <p>Рост населения:</p>

                        <Latex text="L(t)=L_0 e^{nt}" />

                        <p className="mt-4">Рост технологий:</p>

                        <Latex text="A(t)=A_0 e^{gt}" />

                        <ul className="list-disc ml-6 mt-4 space-y-1">
                            <li><Inline text="\delta" /> — норма выбытия капитала</li>
                            <li><Inline text="s" /> — норма сбережений</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-blue-400 mb-4">
                            Основная система уравнений
                        </h2>

                        <Latex text="\begin{cases} L(t)=L_0e^{nt} \\ A(t)=A_0e^{gt} \\ Y(t)=F(K(t),A(t)L(t)) \\ I(t)=sY(t) \\ C(t)=(1-s)Y(t) \\ \dot K=sY-\delta K \end{cases}" />
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-blue-400 mb-4">
                            Используемая производственная функция
                        </h2>

                        <p>Функция Кобба-Дугласа:</p>

                        <Latex text="Y(K,AL)=K^{\alpha}(AL)^{1-\alpha}" />
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-blue-400 mb-4">
                            Переход к интенсивной форме
                        </h2>

                        <Latex text="k=\frac{K}{AL},\quad y=\frac{Y}{AL}=f(k)" />
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-blue-400 mb-4">
                            Основное уравнение динамики
                        </h2>

                        <Latex text="\dot{k}=sf(k)-(\delta+n+g)k" />

                        <p className="mt-4">Для функции Кобба-Дугласа:</p>

                        <Latex text="\dot{k}=sk^{\alpha}-(\delta+n+g)k" />
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-blue-400 mb-4">
                            Стационарное состояние
                        </h2>

                        <Latex text="sf(k^*)=(\delta+n+g)k^*" />

                        <Latex text="k^*=\left(\frac{s}{\delta+n+g}\right)^{\frac{1}{1-\alpha}}" />

                        <Latex text="y^*=(k^*)^{\alpha}" />
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-blue-400 mb-4">
                            Золотое правило накопления
                        </h2>

                        <Latex text="c=f(k)-(\delta+n+g)k" />

                        <Latex text="f'(k_{GR})=\delta+n+g" />

                        <Latex text="s_{GR}=\alpha" />
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-blue-400 mb-4">
                            Процентная ставка
                        </h2>

                        <Latex text="r=f'(k)-\delta" />

                        <Latex text="r=\alpha k^{\alpha-1}-\delta" />

                        <p className="mt-4">
                            В точке золотого правила:
                        </p>

                        <Latex text="r=n+g" />
                    </section>

                </div>
            </div>
        </MainLayout>
    )
}

export default MathModelPage;