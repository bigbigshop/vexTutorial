import React, { useState, useEffect, useRef, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Layout from '@theme/Layout';

// --- CSS 樣式 (已調整寬度與留白) ---
const cssStyles = `
/* 變數定義 */
.pid-wrapper {
  --pid-bg: #f8fafc;
  --pid-card-bg: #ffffff;
  --pid-text: #334155;
  --pid-text-light: #64748b;
  --pid-border: #e2e8f0;
  --pid-accent: #2563eb;
  --pid-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

html[data-theme='dark'] .pid-wrapper {
  --pid-bg: #1b1b1d;
  --pid-card-bg: #242526;
  --pid-text: #e2e8f0;
  --pid-text-light: #94a3b8;
  --pid-border: #37383a;
  --pid-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}

.pid-wrapper {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--pid-bg);
  color: var(--pid-text);
  
  /* --- 關鍵修改：限制寬度與置中 --- */
  width: 100%;
  max-width: 100%;  /* 限制最大寬度，讓介面變窄 */
  margin: 2rem auto; /* 上下留白 2rem，左右自動置中 (白邊) */
  padding: 1.5rem;   /* 內部留白稍微縮小一點 */
  
  border-radius: 16px;
  border: 1px solid var(--pid-border);
  box-sizing: border-box; /* 確保 padding 不會撐大寬度 */
}

/* 標題區塊 */
.pid-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background: var(--pid-card-bg);
  border-radius: 12px;
  box-shadow: var(--pid-shadow);
  border: 1px solid var(--pid-border);
}

@media (min-width: 640px) {
  .pid-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.pid-title h2 {
  margin: 0;
  font-size: 1.25rem; /* 標題字體稍微調小 */
  font-weight: 800;
  background: linear-gradient(to right, #2563eb, #4f46e5);
  -webkit-background-clip: text;
  color: transparent;
  line-height: 1.3;
}

.pid-subtitle {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: var(--pid-text-light);
}

/* 按鈕群組 */
.pid-controls {
  display: flex;
  gap: 0.5rem;
}

.pid-btn {
  padding: 0.4rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  white-space: nowrap;
}

.pid-btn-toggle { background-color: #dcfce7; color: #15803d; }
.pid-btn-toggle.paused { background-color: #fef3c7; color: #b45309; }
.pid-btn-reset { background-color: #f1f5f9; color: #475569; }
html[data-theme='dark'] .pid-btn-reset { background-color: #3e4042; color: #e2e8f0; }

/* 參數滑桿網格 - 稍微緊湊一點 */
.pid-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}
@media (min-width: 500px) { .pid-grid { grid-template-columns: repeat(2, 1fr); } }
/* 只有在空間足夠時才變四欄，避免太擠 */
@media (min-width: 768px) { .pid-grid { grid-template-columns: repeat(4, 1fr); } }

.pid-card {
  background: var(--pid-card-bg);
  padding: 0.75rem; /* 縮小內距 */
  border-radius: 10px;
  box-shadow: var(--pid-shadow);
  border-left: 4px solid #ccc;
  display: flex;
  flex-direction: column;
}

.pid-card.green { border-color: #22c55e; }
.pid-card.orange { border-color: #f97316; }
.pid-card.red { border-color: #ef4444; }
.pid-card.blue { border-color: #3b82f6; }

.pid-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  margin-bottom: 0.25rem;
  font-size: 0.85rem;
}

.pid-tag {
  font-size: 0.65rem;
  padding: 1px 5px;
  border-radius: 3px;
  font-weight: normal;
  background: #f1f5f9;
  color: #64748b;
  margin-left: 4px;
}
html[data-theme='dark'] .pid-tag { background: #3e4042; color: #cbd5e1; }

.pid-val { font-family: monospace; font-size: 0.85rem; }

.pid-desc {
  font-size: 0.7rem;
  color: var(--pid-text-light);
  margin-top: 0.25rem;
  line-height: 1.2;
  min-height: 2.4em;
}

/* Range Input */
.pid-range {
  -webkit-appearance: none;
  width: 100%;
  background: transparent;
  margin: 0.25rem 0;
}
.pid-range:focus { outline: none; }
.pid-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 14px; width: 14px; /* 稍微縮小滑塊 */
  border-radius: 50%;
  background: currentColor;
  cursor: pointer;
  margin-top: -5px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.3);
}
.pid-range::-webkit-slider-runnable-track {
  width: 100%; height: 4px; cursor: pointer; background: #e2e8f0; border-radius: 2px;
}
html[data-theme='dark'] .pid-range::-webkit-slider-runnable-track { background: #4b5563; }

/* 畫布區域 */
.pid-canvas-container {
  background: var(--pid-card-bg);
  border-radius: 12px;
  box-shadow: var(--pid-shadow);
  border: 1px solid var(--pid-border);
  overflow: hidden;
  margin-bottom: 1.5rem;
  position: relative;
  /* 確保 Canvas 不會被拉得太高 */
  line-height: 0; 
  width:100%;
  margin: 2rem auto;
}
.pid-overlay {
  position: absolute;
  top: 8px; left: 8px;
  background: rgba(255,255,255,0.9);
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  color: #64748b;
  pointer-events: none;
  border: 1px solid #e2e8f0;
  z-index: 10;
  line-height: 1.5;
}
html[data-theme='dark'] .pid-overlay { background: rgba(30,30,30,0.9); border-color: #444; color: #ccc; }

.pid-svg {
  display: block;
  cursor: crosshair;
  background-color: var(--pid-bg);
  width: 100%;
  /* 這裡不需要 min-height，讓 viewBox 自動維持寬高比 (800:280) */
  height: auto; 
}

/* 圖表區域 */
.pid-charts {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 768px) { .pid-charts { grid-template-columns: 3fr 2fr; } } /* 左邊圖表寬一點 */

.pid-chart-box, .pid-info-box {
  background: var(--pid-card-bg);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid var(--pid-border);
  box-shadow: var(--pid-shadow);
}

.pid-graph-container {
  position: relative;
  height: 160px; /* 圖表高度稍微調低 */
  width: 100%;
  border-left: 1px solid var(--pid-border);
  border-bottom: 1px solid var(--pid-border);
  background: rgba(0,0,0,0.02);
}

.pid-info-list {
  padding-left: 1.2rem;
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--pid-text);
}
.pid-info-list li { margin-bottom: 0.4rem; }

.graph-line { vector-effect: non-scaling-stroke; }
`;

const PIDContent = () => {
  // --- 1. React State ---
  const [isPlaying, setIsPlaying] = useState(true);
  const [kp, setKp] = useState(11.0);
  const [ki, setKi] = useState(0.00325);
  const [kd, setKd] = useState(4.0);
  const [timeoutMs, setTimeoutMs] = useState(1500);
  
  // --- 2. Physics & Refs ---
  const physics = useRef({
    position: 100, target: 300, velocity: 0, integral: 0,
    lastError: 0, elapsedTime: 0, history: []
  });

  const domRefs = {
    targetGroup: useRef(null), objectGroup: useRef(null),
    arrowP: useRef(null), arrowI: useRef(null), arrowD: useRef(null), arrowTotal: useRef(null),
    pathTarget: useRef(null), pathPos: useRef(null), elapsedTimeText: useRef(null), svg: useRef(null)
  };

  const requestRef = useRef();
  const DT = 0.016; const MASS = 1.0; const FRICTION = 0.96; const MAX_HISTORY = 300;

  const resetSim = useCallback(() => {
    physics.current = {
      position: 50, target: 300, velocity: 0, integral: 0,
      lastError: 0, elapsedTime: 0, history: []
    };
    setIsPlaying(true);
    if (domRefs.elapsedTimeText.current) domRefs.elapsedTimeText.current.innerText = "0.00";
    updateVisuals(0, 0, 0, 0);
  }, []);

  const animate = useCallback(() => {
    if (isPlaying) {
      const p = physics.current;
      if (p.elapsedTime * 1000 >= timeoutMs) {
        setIsPlaying(false);
      } else {
        const error = p.target - p.position;
        const pTerm = kp * error;
        p.integral = Math.max(-1000, Math.min(1000, p.integral + error * DT));
        const iTerm = ki * p.integral;
        const dError = (error - p.lastError) / DT;
        const dTerm = kd * dError;
        const outputForce = pTerm + iTerm + dTerm;

        const acceleration = outputForce / MASS;
        p.velocity = (p.velocity + acceleration * DT) * FRICTION;
        p.position += p.velocity * DT;

        if (p.position < 0) { p.position = 0; p.velocity *= -0.5; }
        if (p.position > 800) { p.position = 800; p.velocity *= -0.5; }

        p.lastError = error;
        p.elapsedTime += DT;

        if (Math.floor(p.elapsedTime / DT) % 3 === 0) {
           p.history.push({ pos: p.position, target: p.target });
           if (p.history.length > MAX_HISTORY) p.history.shift();
        }

        updateVisuals(pTerm, iTerm, dTerm, outputForce);
        if (domRefs.elapsedTimeText.current) domRefs.elapsedTimeText.current.innerText = p.elapsedTime.toFixed(2);
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  }, [isPlaying, kp, ki, kd, timeoutMs]);

  const updateVisuals = (pTerm, iTerm, dTerm, total) => {
    const p = physics.current;
    const refs = domRefs;

    if(refs.targetGroup.current) refs.targetGroup.current.setAttribute('transform', `translate(${p.target}, 0)`);
    if(refs.objectGroup.current) refs.objectGroup.current.setAttribute('transform', `translate(${p.position}, 0)`);

    const updateArrow = (ref, val, yOffset) => {
        if (!ref.current) return;
        const scale = 2.0;
        let len = val * scale;
        const maxLen = 300;
        if (Math.abs(len) > maxLen) len = Math.sign(len) * maxLen;
        
        if (Math.abs(len) < 1) {
            ref.current.setAttribute('opacity', '0'); return;
        }
        ref.current.setAttribute('opacity', ref === refs.arrowTotal ? '1' : '0.9');
        
        const startX = p.position; const y = 140 + yOffset; const endX = startX + len;
        const line = ref.current.querySelector('line');
        const head = ref.current.querySelector('path');
        const text = ref.current.querySelector('text');
        const id = ref.current.id || ""; 

        if(line) { line.setAttribute('x1', startX); line.setAttribute('y1', y); line.setAttribute('x2', endX); line.setAttribute('y2', y); }
        if(head) {
            const dir = Math.sign(len);
            if (Math.abs(len) > 5) {
                head.setAttribute('d', `M ${endX} ${y} L ${endX - 6*dir} ${y - 6} L ${endX - 6*dir} ${y + 6} Z`);
                head.style.display = 'block';
            } else { head.style.display = 'none'; }
        }
        if(text) {
             text.setAttribute('x', startX + len / 2); text.setAttribute('y', y - 5);
             text.textContent = `${id.replace('arrow-','').toUpperCase()} (${Math.abs(val).toFixed(1)})`;
        }
    };

    updateArrow(refs.arrowP, pTerm, -40);
    updateArrow(refs.arrowI, iTerm, -60);
    updateArrow(refs.arrowD, dTerm, -80);
    updateArrow(refs.arrowTotal, total, 60);

    if (p.history.length > 1 && refs.pathTarget.current && refs.pathPos.current) {
        let dTarget = "M"; let dPos = "M";
        p.history.forEach((pt, idx) => {
            const x = (idx / (MAX_HISTORY - 1)) * 300;
            const yTarget = 100 - (pt.target / 800) * 100;
            const yPos = 100 - (pt.pos / 800) * 100;
            const prefix = idx === 0 ? '' : 'L ';
            dTarget += `${prefix}${x.toFixed(1)},${yTarget.toFixed(1)} `;
            dPos += `${prefix}${x.toFixed(1)},${yPos.toFixed(1)} `;
        });
        refs.pathTarget.current.setAttribute('d', dTarget);
        refs.pathPos.current.setAttribute('d', dPos);
    }
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  const handleCanvasMouseDown = (e) => {
    if (!domRefs.svg.current) return;
    const rect = domRefs.svg.current.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    let x = (e.clientX - rect.left) * scaleX;
    if (x < 0) x = 0; if (x > 800) x = 800;
    
    physics.current.target = x;
    physics.current.elapsedTime = 0;
    if (domRefs.elapsedTimeText.current) domRefs.elapsedTimeText.current.innerText = "0.00";
    if (!isPlaying) setIsPlaying(true);
  };

  return (
    <div className="pid-wrapper">
      <style>{cssStyles}</style>
      
      {/* 標題與按鈕 */}
      <div className="pid-header">
        <div className="pid-title">
            <h2>VEX V5RC PID 原理示範</h2>
            <div className="pid-subtitle">Proportional (比例) - Integral (積分) - Derivative (微分)</div>
            <div className="pid-subtitle">Author: Kyle</div>
        </div>
        <div className="pid-controls">
            <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`pid-btn pid-btn-toggle ${!isPlaying ? 'paused' : ''}`}
            >
                {isPlaying ? "暫停 II" : "開始 ▶"}
            </button>
            <button onClick={resetSim} className="pid-btn pid-btn-reset">
                重置 ⟲
            </button>
        </div>
      </div>

      {/* 參數控制 */}
      <div className="pid-grid">
        <div className="pid-card green">
            <div className="pid-label">
                <span style={{color:'#16a34a'}}>Kp <span className="pid-tag">比例項</span></span>
                <span className="pid-val">{kp.toFixed(2)}</span>
            </div>
            <input className="pid-range" type="range" min="0" max="50.0" step="0.01" value={kp} 
                   onChange={e => setKp(parseFloat(e.target.value))} style={{color: '#16a34a'}} />
            <div className="pid-desc">調節整體速度（距離越遠，速度越快）。</div>
        </div>
        <div className="pid-card orange">
            <div className="pid-label">
                <span style={{color:'#ea580c'}}>Ki <span className="pid-tag">積分項</span></span>
                <span className="pid-val">{ki.toFixed(5)}</span>
            </div>
            <input className="pid-range" type="range" min="0" max="0.1" step="0.001" value={ki} 
                   onChange={e => setKi(parseFloat(e.target.value))} style={{color: '#ea580c'}} />
            <div className="pid-desc">累積過去的誤差，用來消除穩態誤差。</div>
        </div>
        <div className="pid-card red">
            <div className="pid-label">
                <span style={{color:'#dc2626'}}>Kd <span className="pid-tag">微分項</span></span>
                <span className="pid-val">{kd.toFixed(1)}</span>
            </div>
            <input className="pid-range" type="range" min="0" max="50" step="0.5" value={kd} 
                   onChange={e => setKd(parseFloat(e.target.value))} style={{color: '#dc2626'}} />
            <div className="pid-desc">預測誤差變化，提供阻尼力道防止過衝。</div>
        </div>
        <div className="pid-card blue">
            <div className="pid-label">
                <span style={{color:'#2563eb'}}>Timeout <span className="pid-tag">ms</span></span>
                <span className="pid-val">{timeoutMs}</span>
            </div>
            <input className="pid-range" type="range" min="100" max="10000" step="100" value={timeoutMs} 
                   onChange={e => setTimeoutMs(parseInt(e.target.value))} style={{color: '#2563eb'}} />
            <div className="pid-desc">
                已運行: <span ref={domRefs.elapsedTimeText} style={{fontWeight:'bold', color:'#2563eb'}}>0.00</span>s
            </div>
        </div>
      </div>

      {/* 畫布 */}
      <div className="pid-canvas-container">
        <div className="pid-overlay">🖕點擊軌道設定目標🖕</div>
        <svg ref={domRefs.svg} onMouseDown={handleCanvasMouseDown} 
             viewBox="0 0 800 280" className="pid-svg" 
             style={{touchAction: 'none'}}>
            
            <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <line x1="0" y1="140" x2="800" y2="140" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />

            {/* Target */}
            <g ref={domRefs.targetGroup} transform="translate(300, 0)">
                <line x1="0" y1="40" x2="0" y2="240" stroke="#ef4444" strokeWidth="2" strokeDasharray="6 4" />
                <text x="0" y="35" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold">目標值</text>
                <polygon points="-6,40 6,40 0,50" fill="#ef4444" />
            </g>

            {/* Object */}
            <g ref={domRefs.objectGroup} transform="translate(100, 0)">
                <rect x="-25" y="115" width="50" height="50" rx="8" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" fillOpacity="0.2" />
                <circle cx="0" cy="140" r="5" fill="#2563eb" />
                <text x="0" y="185" textAnchor="middle" fill="#3b82f6" fontSize="12" fontWeight="bold">Robot</text>
            </g>

            {/* Arrows */}
            <g ref={domRefs.arrowP} id="arrow-p"><line stroke="#16a34a" strokeWidth="3"/><path fill="#16a34a"/><text textAnchor="middle" fill="#16a34a" fontSize="10" fontWeight="bold">P</text></g>
            <g ref={domRefs.arrowI} id="arrow-i"><line stroke="#ea580c" strokeWidth="3"/><path fill="#ea580c"/><text textAnchor="middle" fill="#ea580c" fontSize="10" fontWeight="bold">I</text></g>
            <g ref={domRefs.arrowD} id="arrow-d"><line stroke="#dc2626" strokeWidth="3"/><path fill="#dc2626"/><text textAnchor="middle" fill="#dc2626" fontSize="10" fontWeight="bold">D</text></g>
            <g ref={domRefs.arrowTotal} id="arrow-total"><line stroke="#1e293b" strokeWidth="4"/><path fill="#1e293b"/><text textAnchor="middle" fill="#1e293b" fontSize="10" fontWeight="bold">Total</text></g>
        </svg>
      </div>

      {/* 圖表與說明 */}
      <div className="pid-charts">
        <div className="pid-chart-box">
            <h3 className="pid-label">
                <span>位置響應曲線</span>
            </h3>
            <div className="pid-graph-container">
                <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
                    <path ref={domRefs.pathTarget} d="" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" className="graph-line" />
                    <path ref={domRefs.pathPos} d="" fill="none" stroke="#3b82f6" strokeWidth="2" className="graph-line" />
                </svg>
                <div style={{position:'absolute', bottom:2, right:5, fontSize:'10px', color:'#999'}}>Time →</div>
                <div style={{position:'absolute', top:2, left:5, fontSize:'10px', color:'#999'}}>Pos ↑</div>
            </div>
        </div>

        <div className="pid-info-box">
            <h3 className="pid-label">💡 觀察指南</h3>
            <ul className="pid-info-list">
                <li><strong style={{color:'#16a34a'}}>P (比例)</strong>: 數值越大，反應越快，但容易震盪。</li>
                <li><strong style={{color:'#dc2626'}}>D (微分)</strong>: 像煞車一樣，抑制震盪與過衝 (Overshoot)。</li>
                <li><strong style={{color:'#ea580c'}}>I (積分)</strong>: 修正即使停止後仍存在的微小誤差。</li>
            </ul>
        </div>
      </div>
    </div>
  );
};

export default function PIDSimulation() {
  return (
    <BrowserOnly fallback={<div>Loading Simulation...</div>}>
      {() => <PIDContent />}
    </BrowserOnly>
  );
}