import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Settings, Play, RefreshCw, Info, Activity, Navigation, Gauge, Zap, Target } from 'lucide-react';

// --- CSS 樣式 (深度優化對齊與畫布顯示) ---
const cssStyles = `
.sim-wrapper {
  --sim-bg: #f8fafc;
  --sim-card-bg: #ffffff;
  --sim-text: #334155;
  --sim-text-light: #64748b;
  --sim-border: #e2e8f0;
  --sim-accent: #2563eb;
  --sim-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

html[data-theme='dark'] .sim-wrapper {
  --sim-bg: #1b1b1d;
  --sim-card-bg: #242526;
  --sim-text: #e2e8f0;
  --sim-text-light: #94a3b8;
  --sim-border: #37383a;
  --sim-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}

.sim-wrapper {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: var(--sim-bg);
  color: var(--sim-text);
  width: 100%;
  max-width: 1000px;
  margin: 1rem auto;
  padding: 1.25rem;
  border-radius: 16px;
  border: 1px solid var(--sim-border);
  box-sizing: border-box;
}

.sim-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding: 1rem;
  background: var(--sim-card-bg);
  border-radius: 12px;
  box-shadow: var(--sim-shadow);
  border: 1px solid var(--sim-border);
}

@media (min-width: 640px) {
  .sim-header { flex-direction: row; justify-content: space-between; align-items: center; }
}

.sim-title h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  background: linear-gradient(to right, #2563eb, #4f46e5);
  -webkit-background-clip: text;
  color: transparent;
  line-height: 1.2;
}

.sim-subtitle { margin-top: 0.2rem; font-size: 0.75rem; color: var(--sim-text-light); }

.sim-action-bar {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 1.25rem;
}

.sim-btn {
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sim-btn-play { background-color: #2563eb; color: white; }
.sim-btn-play:hover { background-color: #1d4ed8; }
.sim-btn-play:disabled { background-color: #94a3b8; cursor: not-allowed; }
.sim-btn-reset { background-color: #f1f5f9; color: #475569; border: 1px solid var(--sim-border); }
html[data-theme='dark'] .sim-btn-reset { background-color: #3e4042; color: #e2e8f0; }

.sim-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}
@media (min-width: 600px) { .sim-grid { grid-template-columns: repeat(2, 1fr); } }
/* 調整為 3 欄，剛好完美容納 9 個參數卡片 */
@media (min-width: 900px) { .sim-grid { grid-template-columns: repeat(3, 1fr); } }

.sim-card {
  background: var(--sim-card-bg);
  padding: 0.75rem;
  border-radius: 10px;
  box-shadow: var(--sim-shadow);
  border-left: 4px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.sim-card.blue { border-color: #3b82f6; }
.sim-card.green { border-color: #22c55e; }
.sim-card.red { border-color: #ef4444; }

.sim-label { display: flex; justify-content: space-between; align-items: center; font-weight: 700; font-size: 0.85rem; margin-bottom: 0.25rem; }
.sim-tag { font-size: 0.65rem; padding: 1px 5px; border-radius: 3px; background: #f1f5f9; color: #64748b; }
html[data-theme='dark'] .sim-tag { background: #334155; color: #cbd5e1; }

/* 滑桿對齊修正 - 徹底解決點點不居中的問題 */
.sim-range {
  -webkit-appearance: none;
  width: 100%;
  height: 24px; /* 固定高度確保容器穩定 */
  background: transparent;
  margin: 0;
  display: block;
}
.sim-range:focus { outline: none; }

/* Webkit (Chrome, Safari, Edge) */
.sim-range::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  border: none;
}
html[data-theme='dark'] .sim-range::-webkit-slider-runnable-track { background: #4b5563; }

.sim-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: var(--sim-accent);
  cursor: pointer;
  margin-top: -6px; /* 居中計算: (track_height/2) - (thumb_height/2) = 2 - 8 = -6 */
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  border: 2px solid white;
}

/* Firefox */
.sim-range::-moz-range-track {
  width: 100%;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
}
.sim-range::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: var(--sim-accent);
  cursor: pointer;
  border: 2px solid white;
}

.sim-desc { font-size: 0.7rem; color: var(--sim-text-light); margin-top: 0.2rem; line-height: 1.2; }

.sim-canvas-container {
  background: #020617;
  border-radius: 12px;
  border: 1px solid var(--sim-border);
  box-shadow: var(--sim-shadow);
  overflow: hidden;
  position: relative;
  width: 100%;
  max-width: 500px; /* 限制寬度避免正方形在螢幕上太高 */
  margin: 0 auto;
  aspect-ratio: 1 / 1; /* 改為 1:1 正方形比例 */
}

.sim-hud {
  position: absolute;
  top: 10px; left: 10px;
  background: rgba(15, 23, 42, 0.9);
  color: #22d3ee;
  padding: 6px 12px;
  border-radius: 6px;
  font-family: ui-monospace, monospace;
  font-size: 0.7rem;
  font-weight: bold;
  z-index: 10;
  pointer-events: none;
  border: 1px solid rgba(34, 211, 238, 0.3);
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
`;

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [target, setTarget] = useState({ x: 30, y: 30, theta: 90 });
  const [params, setParams] = useState({
    forwards: true,
    horizontalDrift: 8,
    lead: 0.6,
    maxSpeed: 100,
    minSpeed: 0,
    earlyExitRange: 0,
    timeout: 4000 // 加入 timeout 參數
  });

  const [robot, setRobot] = useState({ x: 0, y: 0, theta: 0 });
  const [animProgress, setAnimProgress] = useState(0);
  const [fullPathData, setFullPathData] = useState([]);

  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const handleTargetInput = (field, value) => {
    setTarget(prev => ({ ...prev, [field]: value }));
  };

  const calculatePath = useCallback(() => {
    const tx = parseFloat(target.x) || 0;
    const ty = parseFloat(target.y) || 0;
    const tt = parseFloat(target.theta) || 0;

    let curr = { x: 0, y: 0, theta: 0 };
    let points = [{ ...curr }];
    const dt = 0.02;
    // Timeout 限制 (將 ms 轉為秒)
    const maxTime = (parseFloat(params.timeout) || 4000) / 1000;
    let time = 0;

    while (time < maxTime) {
      const dx = tx - curr.x;
      const dy = ty - curr.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const tRad = (tt * Math.PI) / 180;
      const carrotX = tx - Math.cos(tRad) * dist * params.lead;
      const carrotY = ty - Math.sin(tRad) * dist * params.lead;

      const angleToCarrot = Math.atan2(carrotY - curr.y, carrotX - curr.x);
      let robotRad = (curr.theta * Math.PI) / 180;
      const moveAngle = params.forwards ? angleToCarrot : angleToCarrot + Math.PI;
      
      let error = moveAngle - robotRad;
      while (error > Math.PI) error -= 2 * Math.PI;
      while (error < -Math.PI) error += 2 * Math.PI;

      let linear = dist * 5;
      linear = Math.min(params.maxSpeed, Math.max(params.minSpeed, linear));
      if (!params.forwards) linear = -linear;

      const turn = error * (40 + params.horizontalDrift);
      const vL = linear - turn;
      const vR = linear + turn;
      const vAvg = (vL + vR) / 2;
      const omega = (vR - vL) / 12;

      curr.x += vAvg * Math.cos(robotRad) * dt;
      curr.y += vAvg * Math.sin(robotRad) * dt;
      curr.theta += (omega * 180 / Math.PI) * dt;

      points.push({ ...curr });
      time += dt;

      if (params.minSpeed > 0 && dist < params.earlyExitRange) break;
      if (dist < 0.5 && Math.abs(error) < 0.05) break;
    }
    return points;
  }, [target, params]);

  const startSim = () => {
    if (isPlaying) return;
    const data = calculatePath();
    setFullPathData(data);
    setAnimProgress(0);
    setIsPlaying(true);
  };

  const resetSim = () => {
    setIsPlaying(false);
    setRobot({ x: 0, y: 0, theta: 0 });
    setAnimProgress(0);
    setFullPathData([]);
  };

  useEffect(() => {
    if (isPlaying && animProgress < fullPathData.length) {
      animationRef.current = requestAnimationFrame(() => {
        setRobot(fullPathData[animProgress]);
        setAnimProgress(prev => prev + 1);
      });
    } else {
      setIsPlaying(false);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, animProgress, fullPathData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    
    // --- 關鍵修復：1:1 正方形比例尺與視野 ---
    // 機器人場地是 144x144 英吋
    // 將場地完整放入 1:1 的 Canvas 中
    const fieldSizeInches = 144;
    const padding = 16; // 邊緣留白英吋 (左右各 8 吋)
    const scale = w / (fieldSizeInches + padding); 

    // 直接以中心點映射
    const toX = (val) => w / 2 + (parseFloat(val) * scale);
    const toY = (val) => h / 2 - (parseFloat(val) * scale);

    ctx.clearRect(0, 0, w, h);
    
    // 繪製場地背景 (Tiles)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(toX(-72), toY(72), 144 * scale, 144 * scale);
    
    // 背景網格 (每 24 吋一大格，共 6x6 格)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = -72; i <= 72; i += 24) {
      ctx.beginPath(); ctx.moveTo(toX(i), toY(-72)); ctx.lineTo(toX(i), toY(72)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(toX(-72), toY(i)); ctx.lineTo(toX(72), toY(i)); ctx.stroke();
    }
    
    // 繪製中心軸線 (更亮一點)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath(); ctx.moveTo(toX(0), 0); ctx.lineTo(toX(0), h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, toY(0)); ctx.lineTo(w, toY(0)); ctx.stroke();

    // 繪製場地邊界線
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(toX(-72), toY(72), 144 * scale, 144 * scale);

    // 目標點 (發光紅色)
    const tRad = (parseFloat(target.theta) * Math.PI) / 180;
    const tx = toX(target.x);
    const ty = toY(target.y);
    
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#f43f5e';
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath(); ctx.arc(tx, ty, 6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(tx, ty);
    ctx.lineTo(tx + Math.cos(tRad) * 30, ty - Math.sin(tRad) * 30); ctx.stroke();
    ctx.shadowBlur = 0;

    // 軌跡 (亮青色)
    if (fullPathData.length > 0) {
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(toX(fullPathData[0].x), toY(fullPathData[0].y));
      const end = Math.min(animProgress, fullPathData.length);
      for(let i=1; i < end; i++) {
        ctx.lineTo(toX(fullPathData[i].x), toY(fullPathData[i].y));
      }
      ctx.stroke();
    }

    // 機器人 (高亮度青色 + 發光)
    const rx = toX(robot.x);
    const ry = toY(robot.y);
    ctx.save();
    ctx.translate(rx, ry);
    ctx.rotate(-robot.theta * Math.PI / 180);
    
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#06b6d4';
    ctx.fillStyle = '#06b6d4';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    const rSizePx = 12 * scale; // 12吋機器人
    ctx.fillRect(-rSizePx/2, -rSizePx/2, rSizePx, rSizePx);
    ctx.strokeRect(-rSizePx/2, -rSizePx/2, rSizePx, rSizePx);
    
    // 指向器
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(rSizePx * 0.9, 0); ctx.stroke();
    ctx.restore();

  }, [target, robot, fullPathData, animProgress]);

  return (
    <div className="sim-wrapper">
      <style>{cssStyles}</style>
      
      <div className="sim-header">
        <div className="sim-title">
          <h2>LemLib moveToPose 模擬器</h2>
          <div className="sim-subtitle">精確控制機器人的位姿 (Pose) 與路徑曲線</div>
        </div>
      </div>

      <div className="sim-grid">
        <div className="sim-card blue">
          <div className="sim-label"><span>Target X / Y</span><span className="sim-tag">inches</span></div>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={target.x} 
              onChange={e => handleTargetInput('x', e.target.value)} 
              className="w-1/2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded text-sm outline-none border border-transparent focus:border-blue-400 font-mono" 
            />
            <input 
              type="text" 
              value={target.y} 
              onChange={e => handleTargetInput('y', e.target.value)} 
              className="w-1/2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded text-sm outline-none border border-transparent focus:border-blue-400 font-mono" 
            />
          </div>
          <div className="sim-desc">目標在場地上的座標。</div>
        </div>

        <div className="sim-card blue">
          <div className="sim-label"><span>Heading (θ)</span><span className="sim-tag">{target.theta}°</span></div>
          <input type="range" min="-180" max="180" value={target.theta} onChange={e => setTarget({...target, theta: parseInt(e.target.value)})} className="sim-range" />
          <div className="sim-desc">到達目標點後的朝向。</div>
        </div>

        <div className="sim-card blue">
          <div className="sim-label"><span>Timeout</span><span className="sim-tag">ms</span></div>
          <input 
            type="number" 
            value={params.timeout} 
            onChange={e => setParams({...params, timeout: e.target.value})} 
            className="w-full bg-slate-100 dark:bg-slate-800 p-1.5 rounded text-sm outline-none border border-transparent focus:border-blue-400 font-mono" 
          />
          <div className="sim-desc">超過此時間強制停止。</div>
        </div>

        <div className="sim-card green">
          <div className="sim-label"><span>Lead</span><span className="sim-tag">{params.lead}</span></div>
          <input type="range" min="0" max="1" step="0.1" value={params.lead} onChange={e => setParams({...params, lead: parseFloat(e.target.value)})} className="sim-range" />
          <div className="sim-desc">胡蘿蔔點係數 (0.6)。</div>
        </div>

        <div className="sim-card green">
          <div className="sim-label"><span>Drift</span><span className="sim-tag">{params.horizontalDrift}</span></div>
          <input type="range" min="0" max="20" step="1" value={params.horizontalDrift} onChange={e => setParams({...params, horizontalDrift: parseFloat(e.target.value)})} className="sim-range" />
          <div className="sim-desc">過彎漂移力道 (2-15)。</div>
        </div>

        <div className="sim-card red">
          <div className="sim-label"><span>Forwards</span><span className="sim-tag uppercase text-[10px]">{params.forwards ? "True" : "False"}</span></div>
          <button onClick={() => setParams({...params, forwards: !params.forwards})} className="w-full mt-1 bg-slate-100 dark:bg-slate-800 py-1.5 rounded text-xs font-bold transition-colors hover:bg-slate-200 dark:hover:bg-slate-700">切換方向</button>
          <div className="sim-desc">機器人前進或後退。</div>
        </div>

        <div className="sim-card red">
          <div className="sim-label"><span>Max Speed</span><span className="sim-tag">{params.maxSpeed}</span></div>
          <input type="range" min="20" max="127" step="1" value={params.maxSpeed} onChange={e => setParams({...params, maxSpeed: parseInt(e.target.value)})} className="sim-range" />
          <div className="sim-desc">最大輸出功率 (0-127)。</div>
        </div>

        <div className="sim-card">
          <div className="sim-label"><span>Min Speed</span><span className="sim-tag">{params.minSpeed}</span></div>
          <input type="range" min="0" max="127" step="1" value={params.minSpeed} onChange={e => setParams({...params, minSpeed: parseInt(e.target.value)})} className="sim-range" />
          <div className="sim-desc">最小輸出功率 (0-127)。</div>
        </div>

        <div className="sim-card">
          <div className="sim-label"><span>Early Exit</span><span className="sim-tag">inches</span></div>
          <input type="number" value={params.earlyExitRange} onChange={e => setParams({...params, earlyExitRange: parseFloat(e.target.value)||0})} className="w-full bg-slate-100 dark:bg-slate-800 p-1.5 rounded text-sm outline-none border border-transparent focus:border-blue-400" />
          <div className="sim-desc">提前結束動作的範圍。</div>
        </div>
      </div>

      <div className="sim-canvas-container">
        <div className="sim-hud">
          <div style={{ color: '#f1f5f9' }}>
            Time: {(animProgress * 0.02).toFixed(2)}s / {((parseFloat(params.timeout) || 4000) / 1000).toFixed(2)}s
          </div>
          <div>
            X:{parseFloat(robot.x).toFixed(1)} Y:{parseFloat(robot.y).toFixed(1)} | θ:{parseFloat(robot.theta).toFixed(1)}°
          </div>
        </div>
        <canvas ref={canvasRef} width={500} height={500} className="w-full h-full block" />
      </div>

      <div className="sim-action-bar">
        <button onClick={startSim} disabled={isPlaying} className="sim-btn sim-btn-play shadow-lg shadow-blue-500/20">
          <Play size={18} fill={isPlaying ? "none" : "currentColor"} /> 
          {isPlaying ? "執行中..." : "開始執行 ▶"}
        </button>
        <button onClick={resetSim} className="sim-btn sim-btn-reset shadow-sm">
          <RefreshCw size={18} /> 
          重置 ⟲
        </button>
      </div>
    </div>
  );
};

export default App;