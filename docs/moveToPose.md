---
sidebar_position: 100
title: moveToPose 模擬器
description: 互動式 moveToPose 模擬器，幫助你理解 moveToPose 控制理論，並調整參數以達到最佳控制效果
keywords: [moveToPose 模擬器, moveToPose Simulator, 控制理論, VEX 參數調整, moveToPose 教學, 互動式模擬, 機械人控制]
---

import MoveToPoseSimulation from '@site/src/pages/moveToPoseSim';

# moveToPose Simulator

呢度係 moveToPose Simulator 嘅互動式示範。
<br/>它可以幫助你理解 moveToPose 控制理論，並且可以讓你自己調整 moveToPose 參數，以達到最佳的控制效果。

### moveToPose

moveToPose 是一種基於 PID 控制器的定位演算法，用於將機器人移動到指定的座標和角度。

**位置誤差計算:**
moveToPose 計算機器人當前位置與目標位置之間的誤差，包括 X 座標、Y 座標和航向角（Heading）。

**X 軸 PID 控制器:**
$P_x = K_{p_x} \cdot e_x(t)$
其中 $K_{p_x}$ 是 X 軸比例增益，而 $e_x(t)$ 是 X 座標誤差。

**Y 軸 PID 控制器:**
$P_y = K_{p_y} \cdot e_y(t)$
其中 $K_{p_y}$ 是 Y 軸比例增益，而 $e_y(t)$ 是 Y 座標誤差。

**航向角 PID 控制器:**
$P_\theta = K_{p_\theta} \cdot e_\theta(t)$
其中 $K_{p_\theta}$ 是航向角比例增益，而 $e_\theta(t)$ 是航向角誤差。

**總合輸出:**
moveToPose 演算法會根據三個 PID 控制器的輸出，計算出機器人的線速度和角速度，以實現精確的定位。

**應用於 VEX 機器人:**
在 VEX V5 比賽中，moveToPose 可用於自動移動到特定位置進行得分、拾取物品或執行其他自動化任務。

<div className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800">
             <div className="flex items-center gap-2 text-slate-200 mb-3">
                <h3 className="text-sm font-bold uppercase tracking-widest">物理邏輯解釋 (Behavior Guide)</h3>
             </div>
             <div className="grid grid-cols-2 gap-8 text-[11px] leading-relaxed text-slate-400">
                <div className="space-y-2">
                   <p><strong className="text-blue-300">Horizontal Drift:</strong> 此數值決定了轉彎時的「慣性保留」。在實際 VEX 比賽中，較大的 Drift 能讓機器人在到達目標點前就順著弧度切入，節省對準時間。</p>
                   <p><strong className="text-blue-300">Min Speed & Exit:</strong> 若設置了 `minSpeed`，機器人不會在目標點完全停止，而是以該速度穿過 `earlyExitRange`，這對於串接多段自動化路徑至關重要。</p>
                </div>
                <div className="space-y-2">
                   <p><strong className="text-blue-300">Lead Coeff:</strong> 這是 `moveToPose` 的核心。它決定了虛擬「胡蘿蔔點」的距離。Lead 越大，過彎曲線越圓滑；Lead 越小，機器人越傾向於先對準再直行。</p>
                   <p><strong className="text-blue-300">Target θ:</strong> 與單純的 `moveToPoint` 不同，這個指令會確保機器人在結束動作時，精確地面向你設定的方向。</p>
                </div>
             </div>
          </div>

<MoveToPoseSimulation />
