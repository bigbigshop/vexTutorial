---
sidebar_position: 99
title: PID模擬器
---

import PIDSimulation from '@site/src/pages/pidSim';

# PID Simulator

呢度係 PID Simulator 嘅互動式示範。
<br/>它可以幫助你理解 PID 控制理論，並且可以讓你自己調整 PID 參數，以達到最佳的控制效果。

### PID 控制器公式

PID 控制器是一種廣泛使用的回饋控制演算法，它根據誤差訊號的比例、積分和微分來調整輸出。

**比例項 (Proportional Term, P):**
$P = K_p \cdot e(t)$
其中 $K_p$ 是比例增益，而 $e(t)$ 是當前誤差（目標值與測量值之差）。

**積分項 (Integral Term, I):**
$I = K_i \int e(t) dt$
其中 $K_i$ 是積分增益，$\int e(t) dt$ 是誤差的累積和。積分項用於消除穩態誤差。

**微分項 (Derivative Term, D):**
$D = K_d \frac{de(t)}{dt}$
其中 $K_d$ 是微分增益，$\frac{de(t)}{dt}$ 是誤差的變化率。微分項用於預測誤差的趨勢，減少過衝。

**總合 PID 輸出:**
$u(t) = K_p e(t) + K_i \int e(t) dt + K_d \frac{de(t)}{dt}$
其中 $u(t)$ 是控制器的輸出，用於調整系統的行為。

<PIDSimulation />