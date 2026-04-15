// === RENDER HELPERS ===
const typeColors = { 'Hedge Fund':'#3b6fdb', 'Institutional Investor':'#0d9488', 'Bank / Stockbroker':'#f59e0b', 'Other':'#8992a8' };
const typeShort = { 'Hedge Fund':'hf', 'Institutional Investor':'inst', 'Bank / Stockbroker':'bank', 'Other':'other' };
const typeClass = { 'Hedge Fund':'type-hf', 'Institutional Investor':'type-inst', 'Bank / Stockbroker':'type-bank', 'Other':'type-other' };

// === COMPOSITION BAR ===
function renderComposition() {
  const groups = { 'Hedge Fund': 0, 'Institutional Investor': 0, 'Bank / Stockbroker': 0, Other: 0 };
  holders.forEach(h => { groups[h.type] = (groups[h.type]||0) + h.long; });
  const total = Object.values(groups).reduce((a,b)=>a+b,0);
  document.getElementById('compBar').innerHTML = Object.entries(groups).map(([k,v]) =>
    `<div class="comp-seg" style="width:${(v/total*100).toFixed(1)}%;background:${typeColors[k]}"></div>`
  ).join('');
  document.getElementById('compLegend').innerHTML = Object.entries(groups).map(([k, v]) =>
    `<div class="comp-legend-item"><div class="comp-dot" style="background:${typeColors[k]}"></div>${k} <strong>${v.toFixed(1)}%</strong></div>`
  ).join('');
}

// === SHAREHOLDER REGISTER TABLE ===
let currentFilter = 'all';
function renderRegister() {
  const maxLong = Math.max(...holders.map(h=>h.long));
  let filtered = currentFilter === 'all' ? holders : holders.filter(h => typeShort[h.type] === currentFilter);
  document.getElementById('regBody').innerHTML = filtered.map((h, i) => `
    <tr onclick="openPanel('${h.name.replace(/'/g,"\\'")}')">
      <td>${i+1}</td>
      <td><span class="holder-name">${h.name}</span></td>
      <td><span class="type-tag ${typeClass[h.type]}">${h.type}</span></td>
      <td><div class="bar-cell"><span class="bar-track"><span class="bar-fill" style="width:${(h.long/maxLong*100).toFixed(0)}%;background:${typeColors[h.type]}"></span></span>${h.long.toFixed(3)}%</div></td>
      <td>${h.short > 0 ? h.short.toFixed(3)+'%' : '&mdash;'}</td>
      <td style="font-weight:700">${(h.long - h.short).toFixed(3)}%</td>
      <td>${h.cross.length ? h.cross.map(c=>`<span class="cross-tag">${c}</span>`).join('') : '<span style="color:var(--muted);font-size:11px">&mdash;</span>'}</td>
    </tr>
  `).join('');
}

function filterReg(f, btn) {
  currentFilter = f;
  document.querySelectorAll('.section-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderRegister();
}

// === MOVERS ===
function renderMovers() {
  document.getElementById('moversBody').innerHTML = movers.map(m => `
    <div class="mover-row">
      <div><span class="mover-name">${m.name}</span>${m.badge ? `<span class="mover-badge badge-new">${m.badge}</span>` : ''}</div>
      <span class="mover-change ${m.dir}">${m.change}</span>
    </div>
  `).join('');
}

// === PREDICTIONS ===
function renderPredictions() {
  document.getElementById('predsBody').innerHTML = predictions.map(p => `
    <div class="pred-row" onclick="openPanel('${p.name.replace(/'/g,"\\'")}')">
      <div class="pred-top">
        <span class="pred-name">${p.name}</span>
        <span class="pred-prob ${p.prob >= 70 ? 'high' : 'med'}">${p.prob}%</span>
      </div>
      <div class="pred-reason">${p.reason}</div>
      <div class="pred-tags">${p.tags.map(t=>`<span class="pred-tag">${t}</span>`).join('')}</div>
    </div>
  `).join('');
}

// === SLIDE-OUT PANEL ===
function openPanel(name) {
  const sp = document.getElementById('slidePanel');
  const bd = document.getElementById('backdrop');
  document.getElementById('spName').textContent = name;
  const h = holders.find(x => x.name === name);
  document.getElementById('spType').textContent = h ? h.type : 'Predicted Entrant';
  let html = '';
  if (name.includes('Sand Grove')) {
    html = `
      <div class="sp-section"><div class="sp-label">Trading Profile</div>
        <div class="sp-grid">
          <div><div class="sp-stat-label">Offers Tracked</div><div class="sp-stat-val">${sgProfile.offers}</div></div>
          <div><div class="sp-stat-label">Formal Offers</div><div class="sp-stat-val">${sgProfile.formal}</div></div>
          <div><div class="sp-stat-label">Success Rate</div><div class="sp-stat-val">${sgProfile.successRate}</div></div>
          <div><div class="sp-stat-label">Avg Market Cap</div><div class="sp-stat-val">${sgProfile.avgMktCap}</div></div>
          <div><div class="sp-stat-label">Hostile Deals</div><div class="sp-stat-val">${sgProfile.hostile}</div></div>
          <div><div class="sp-stat-label">Uses Derivatives</div><div class="sp-stat-val">${sgProfile.derivatives}</div></div>
          <div><div class="sp-stat-label">Net Buyer Rate</div><div class="sp-stat-val">${sgProfile.netBuyer}</div></div>
          <div><div class="sp-stat-label">Avg End Holding</div><div class="sp-stat-val">${sgProfile.avgEndHolding}</div></div>
          <div><div class="sp-stat-label">Avg Days to Entry</div><div class="sp-stat-val">${sgProfile.avgFirstDay}</div></div>
          <div><div class="sp-stat-label">Avg Days to Exit</div><div class="sp-stat-val">${sgProfile.avgEndDay}</div></div>
        </div>
      </div>
      <div class="sp-section"><div class="sp-label">Sector & Geography</div>
        <div class="sp-grid">
          <div><div class="sp-stat-label">Sectors</div><div class="sp-stat-val" style="font-size:12px">${sgProfile.sectors}</div></div>
          <div><div class="sp-stat-label">Geographies</div><div class="sp-stat-val" style="font-size:12px">${sgProfile.geos}</div></div>
        </div>
      </div>`;
  } else if (h) {
    html = `
      <div class="sp-section"><div class="sp-label">Position in Schroders</div>
        <div class="sp-grid">
          <div><div class="sp-stat-label">Long</div><div class="sp-stat-val">${h.long.toFixed(3)}%</div></div>
          <div><div class="sp-stat-label">Short</div><div class="sp-stat-val">${h.short > 0 ? h.short.toFixed(3)+'%' : 'None'}</div></div>
          <div><div class="sp-stat-label">Net Long</div><div class="sp-stat-val">${(h.long-h.short).toFixed(3)}%</div></div>
          <div><div class="sp-stat-label">Type</div><div class="sp-stat-val" style="font-size:12px">${h.type}</div></div>
        </div>
      </div>`;
    if (h.cross.length) {
      html += `<div class="sp-section"><div class="sp-label">Also Active In</div><div>${h.cross.map(c=>`<span class="cross-tag" style="font-size:11px;padding:3px 10px;margin:2px;">${c}</span>`).join('')}</div></div>`;
    }
  } else {
    const pred = predictions.find(p => p.name === name);
    if (pred) {
      html = `
        <div class="sp-section"><div class="sp-label">Prediction</div>
          <div style="font-size:28px;font-weight:800;color:${pred.prob>=70?'var(--green)':'var(--amber)'}">${pred.prob}% likely</div>
          <div style="font-size:12px;color:var(--mid);margin-top:6px">${pred.reason}</div>
          <div style="margin-top:8px">${pred.tags.map(t=>`<span class="pred-tag">${t}</span>`).join('')}</div>
        </div>`;
    }
  }
  document.getElementById('spContent').innerHTML = html;
  sp.classList.add('open');
  bd.classList.add('open');
}

function closePanel() {
  document.getElementById('slidePanel').classList.remove('open');
  document.getElementById('backdrop').classList.remove('open');
}

// === INTERACTIVE CHART (two-canvas approach) ===
(function() {
  const canvas = document.getElementById('hfChart');
  const overlay = document.getElementById('hfChartOverlay');
  const hitArea = document.getElementById('chartHitArea');
  const ctx = canvas.getContext('2d');
  const octx = overlay.getContext('2d');
  const tooltip = document.getElementById('chartTooltip');
  const container = document.getElementById('chartContainer');
  const dpr = window.devicePixelRatio || 1;
  const maxDay = 62, maxPct = 10;
  const pad = { top: 24, right: 20, bottom: 36, left: 48 };
  const H = 200;

  let chartPoints = [];
  let currentW = 0;

  function sizeCanvases() {
    const W = container.clientWidth;
    if (W === currentW) return W;
    currentW = W;
    [canvas, overlay].forEach(c => {
      c.width = W * dpr;
      c.height = H * dpr;
      c.style.width = W + 'px';
      c.style.height = H + 'px';
    });
    return W;
  }

  function drawBase() {
    const W = sizeCanvases();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cw = W - pad.left - pad.right, ch = H - pad.top - pad.bottom;
    chartPoints = [];

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = '#e5e8ee'; ctx.lineWidth = 1;
    for (let p = 0; p <= maxPct; p += 2) {
      const y = pad.top + ch - (p / maxPct) * ch;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + cw, y); ctx.stroke();
      ctx.fillStyle = '#8992a8'; ctx.font = '10px DM Sans'; ctx.textAlign = 'right';
      ctx.fillText(p + '%', pad.left - 8, y + 3);
    }
    ctx.fillStyle = '#8992a8'; ctx.font = '10px DM Sans'; ctx.textAlign = 'center';
    for (let d = 0; d <= maxDay; d += 10) {
      const x = pad.left + (d / maxDay) * cw;
      ctx.fillText('Day ' + d, x, H - pad.bottom + 16);
      if (d > 0) { ctx.beginPath(); ctx.strokeStyle = '#e5e8ee'; ctx.moveTo(x, pad.top); ctx.lineTo(x, pad.top + ch); ctx.stroke(); }
    }

    // Area fill
    ctx.beginPath();
    hfData.forEach((pt, i) => {
      const x = pad.left + (pt.day / maxDay) * cw, y = pad.top + ch - (pt.pct / maxPct) * ch;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.lineTo(pad.left + (hfData[hfData.length-1].day / maxDay) * cw, pad.top + ch);
    ctx.lineTo(pad.left, pad.top + ch);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
    grad.addColorStop(0, 'rgba(59,111,219,0.18)');
    grad.addColorStop(1, 'rgba(59,111,219,0.02)');
    ctx.fillStyle = grad; ctx.fill();

    // Line
    ctx.beginPath(); ctx.strokeStyle = '#3b6fdb'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
    hfData.forEach((pt, i) => {
      const x = pad.left + (pt.day / maxDay) * cw, y = pad.top + ch - (pt.pct / maxPct) * ch;
      chartPoints.push({ x, y, day: pt.day, pct: pt.pct, event: pt.event });
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Dots
    hfData.forEach(pt => {
      const x = pad.left + (pt.day / maxDay) * cw, y = pad.top + ch - (pt.pct / maxPct) * ch;
      ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = pt.event ? '#131b2c' : '#3b6fdb'; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
    });

    // Event annotations
    hfData.filter(pt => pt.event).forEach(pt => {
      const x = pad.left + (pt.day / maxDay) * cw, y = pad.top + ch - (pt.pct / maxPct) * ch;
      ctx.save(); ctx.setLineDash([3,3]); ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, y - 8); ctx.lineTo(x, y - 24); ctx.stroke(); ctx.restore();
      ctx.fillStyle = '#475569'; ctx.font = '9px DM Sans'; ctx.textAlign = 'center';
      ctx.fillText(pt.event, x, y - 28);
    });

    // End label
    const last = hfData[hfData.length - 1];
    ctx.fillStyle = '#3b6fdb'; ctx.font = 'bold 11px DM Sans'; ctx.textAlign = 'left';
    ctx.fillText(last.pct.toFixed(2) + '%', chartPoints[chartPoints.length-1].x + 8, chartPoints[chartPoints.length-1].y + 4);
  }

  function drawOverlay(closest) {
    const W = currentW;
    octx.setTransform(dpr, 0, 0, dpr, 0, 0);
    octx.clearRect(0, 0, W, H);
    if (!closest) return;

    // Crosshair line
    octx.strokeStyle = 'rgba(59,111,219,0.25)'; octx.lineWidth = 1;
    octx.beginPath(); octx.moveTo(closest.x, pad.top); octx.lineTo(closest.x, H - pad.bottom); octx.stroke();

    // Horizontal guide
    octx.strokeStyle = 'rgba(59,111,219,0.15)'; octx.setLineDash([4,4]);
    octx.beginPath(); octx.moveTo(pad.left, closest.y); octx.lineTo(closest.x, closest.y); octx.stroke();
    octx.setLineDash([]);

    // Glow ring
    octx.beginPath(); octx.arc(closest.x, closest.y, 8, 0, Math.PI * 2);
    octx.fillStyle = 'rgba(59,111,219,0.15)'; octx.fill();

    // Dot
    octx.beginPath(); octx.arc(closest.x, closest.y, 5, 0, Math.PI * 2);
    octx.fillStyle = '#3b6fdb'; octx.fill();
    octx.strokeStyle = '#fff'; octx.lineWidth = 2; octx.stroke();
  }

  hitArea.addEventListener('mousemove', function(e) {
    const rect = container.getBoundingClientRect();
    const mx = e.clientX - rect.left;

    let closest = null, minDist = Infinity;
    chartPoints.forEach(pt => {
      const dist = Math.abs(pt.x - mx);
      if (dist < minDist) { minDist = dist; closest = pt; }
    });

    if (closest && minDist < 30) {
      drawOverlay(closest);
      tooltip.innerHTML = '<div style="text-align:center"><strong>Day ' + closest.day + '</strong><br>' + closest.pct.toFixed(2) + '%' + (closest.event ? '<br><span style="color:#7eb8da;font-size:10px">' + closest.event + '</span>' : '') + '</div>';
      tooltip.style.opacity = '1';
      const ttW = tooltip.offsetWidth || 80;
      const ttH = tooltip.offsetHeight || 40;
      tooltip.style.left = Math.max(0, Math.min(closest.x - ttW/2, currentW - ttW)) + 'px';
      tooltip.style.top = (closest.y - ttH - 14) + 'px';
    } else {
      drawOverlay(null);
      tooltip.style.opacity = '0';
    }
  });

  hitArea.addEventListener('mouseleave', function() {
    drawOverlay(null);
    tooltip.style.opacity = '0';
  });

  drawBase();
  window.addEventListener('resize', function() { drawBase(); });
})();

// === INIT ===
renderComposition();
renderRegister();
renderMovers();
renderPredictions();
