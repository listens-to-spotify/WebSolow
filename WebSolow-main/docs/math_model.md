## Математическая модель

Модель включает в себя следующие предпосылки:

- Уравнения, свойственные закрытой экономике без гос.сектора:
$$
S = I = sY, \quad Y = C + I.
$$
- Производственная функция $Y(K, L, E) = Y(K, LE)$, где $K$, $L$ и $E$ - капитал, труд и параметр технологического прогресса соответственно.
- Постоянная отдача от масштаба:
$$
Y(aK, aLE) = aY(K, LE).
$$
- Предельный продукт факторов производства положительный и убывает:
$$
\frac{\partial Y}{\partial K}, \frac{\partial Y}{\partial L} > 0, \quad \frac{\partial^2 Y}{\partial K^2}, \frac{\partial^2 Y}{\partial L^2} < 0.
$$
- Производственная функция удовлетворяет условиям Инады:
$$
\lim_{K\to 0} \frac{\partial Y}{\partial K} = \lim_{L\to 0} \frac{\partial Y}{\partial L} = +\infty, \quad \lim_{K\to +\infty} \frac{\partial Y}{\partial K} = \lim_{L\to +\infty} \frac{\partial Y}{\partial L} = 0.
$$
- Для производства необходим каждый фактор:
$$
Y(K, 0) = Y(0, LE) = 0.
$$
- Население, равное трудовым ресурсам, растет с темпом $n$: $L_t = L_0e^{nt}$.
- Технологический прогресс растет с темпом $g$: $E_t = E_0e^{gt}$.
- Норма выбытия капитала $\delta$. Норма сбережений $s$. 

#### Основые уравнения
$$
\left\{
    \begin{array}{l}
        L(t) = L_0e^{nt}, \\
        E(t) = E_0e^{gt}, \\
        Y(t) = F(K(t), E(t)L(t)), \\
        I(t) = sY(t), \\
        C(t) = (1 - s)Y(t), \\
        \frac{\partial K}{\partial t} = I(t) - \delta K(t);
    \end{array}
\right.
$$

#### Начальные условия модели:
$$
\left\{
    \begin{array}{l}
        K(0) = K_0 > 0, \\
        L(0) = L_0 > 0, \\
        E(0) = E_0 > 0, \\
        Y(0) = F(K_0, E_0L_0); \\
    \end{array}
\right.
$$
