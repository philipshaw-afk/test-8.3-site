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

function buildBehaviourPanel(p) {
  // Helper for buyer/seller bar
  const buyerPct = parseFloat(p.netBuyer);
  const sellerPct = parseFloat(p.netSeller);

  return `
    <!-- Nav tabs -->
    <div class="sp-tabs">
      <button class="sp-tab active" onclick="switchTab(this,'tab-overview')">Overview</button>
      <button class="sp-tab" onclick="switchTab(this,'tab-timing')">Timing</button>
      <button class="sp-tab" onclick="switchTab(this,'tab-instruments')">Instruments</button>
    </div>

    <!-- Overview tab -->
    <div class="sp-tab-content active" id="tab-overview">
      <div class="sp-section">
        <div class="sp-label">Deal Activity</div>
        <div class="sp-grid sp-grid-3">
          <div class="sp-metric-card">
            <div class="sp-metric-num">${p.offers}</div>
            <div class="sp-metric-label">Offers Tracked</div>
          </div>
          <div class="sp-metric-card">
            <div class="sp-metric-num">${p.formal}</div>
            <div class="sp-metric-label">Formal Offers</div>
          </div>
          <div class="sp-metric-card accent">
            <div class="sp-metric-num">${p.successRate}</div>
            <div class="sp-metric-label">Success Rate</div>
          </div>
        </div>
      </div>

      <div class="sp-section">
        <div class="sp-label">Deal Outcomes</div>
        <div class="sp-grid">
          <div><div class="sp-stat-label">Completed</div><div class="sp-stat-val">${p.completedFormal}</div></div>
          <div><div class="sp-stat-label">Failed</div><div class="sp-stat-val">${p.failedBids}</div></div>
          <div><div class="sp-stat-label">Inconclusive</div><div class="sp-stat-val">${p.inconclusive}</div></div>
          <div><div class="sp-stat-label">Hostile</div><div class="sp-stat-val">${p.hostile}</div></div>
          <div><div class="sp-stat-label">Increased Offers</div><div class="sp-stat-val">${p.increasedOffers}</div></div>
          <div><div class="sp-stat-label">Avg Market Cap</div><div class="sp-stat-val">${p.avgMktCap}</div></div>
        </div>
      </div>

      <div class="sp-section">
        <div class="sp-label">Offer Types</div>
        <div class="sp-offer-types">
          <div class="sp-offer-type"><span class="sp-offer-dot cash"></span>Cash only <strong>${p.cashOnly}</strong></div>
          <div class="sp-offer-type"><span class="sp-offer-dot share"></span>Share only <strong>${p.shareOnly}</strong></div>
          <div class="sp-offer-type"><span class="sp-offer-dot mixed"></span>Mixed <strong>${p.mixed}</strong></div>
        </div>
      </div>

      <div class="sp-section">
        <div class="sp-label">Net Buyer / Seller</div>
        <div class="sp-buyer-bar-wrap">
          <div class="sp-buyer-bar">
            <div class="sp-buyer-fill" style="width:${buyerPct}%"></div>
          </div>
          <div class="sp-buyer-labels">
            <span class="sp-buyer-label buyer">Buyer ${p.netBuyer}</span>
            <span class="sp-buyer-label seller">Seller ${p.netSeller}</span>
          </div>
        </div>
      </div>

      <div class="sp-section">
        <div class="sp-label">Sector &amp; Geography</div>
        <div class="sp-grid">
          <div><div class="sp-stat-label">Sectors</div><div class="sp-stat-val" style="font-size:12px">${p.sectors}</div></div>
          <div><div class="sp-stat-label">Geographies</div><div class="sp-stat-val" style="font-size:12px">${p.geos}</div></div>
        </div>
      </div>
    </div>

    <!-- Timing tab -->
    <div class="sp-tab-content" id="tab-timing">
      <div class="sp-section">
        <div class="sp-label">Entry &amp; Exit Timing</div>
        <div class="sp-timeline">
          <div class="sp-tl-item">
            <div class="sp-tl-dot start"></div>
            <div class="sp-tl-body">
              <div class="sp-tl-title">Avg Days to First Filing</div>
              <div class="sp-tl-val">${p.avgFirstDay} days</div>
              <div class="sp-tl-sub">from start of offer period</div>
            </div>
          </div>
          <div class="sp-tl-line"></div>
          <div class="sp-tl-item">
            <div class="sp-tl-dot end"></div>
            <div class="sp-tl-body">
              <div class="sp-tl-title">Avg Days to End of Offer</div>
              <div class="sp-tl-val">${p.avgEndDay} days</div>
              <div class="sp-tl-sub">from first filing to offer close</div>
            </div>
          </div>
        </div>
      </div>

      <div class="sp-section">
        <div class="sp-label">Position Building</div>
        <div class="sp-grid">
          <div><div class="sp-stat-label">Avg Start Holding</div><div class="sp-stat-val">${p.avgStartHolding}</div></div>
          <div><div class="sp-stat-label">Avg End Holding</div><div class="sp-stat-val">${p.avgEndHolding}</div></div>
          <div><div class="sp-stat-label">Avg Change (Pre-formal)</div><div class="sp-stat-val">${p.avgChangePreFormal}</div></div>
          <div><div class="sp-stat-label">Avg Change (Formal)</div><div class="sp-stat-val">${p.avgChangeFormal}</div></div>
        </div>
      </div>

      <div class="sp-section">
        <div class="sp-label">Entry Patterns</div>
        <div class="sp-grid">
          <div><div class="sp-stat-label">Existing Shareholder</div><div class="sp-stat-val">${p.existingShareholder}</div></div>
          <div><div class="sp-stat-label">Pre-Formal Entry</div><div class="sp-stat-val">${p.tradingBeforeOffer}</div></div>
          <div><div class="sp-stat-label">Post-Formal Entry</div><div class="sp-stat-val">${p.tradingAfterFormal}</div></div>
          <div><div class="sp-stat-label">Held at End</div><div class="sp-stat-val">${p.heldAtEnd}</div></div>
        </div>
      </div>
    </div>

    <!-- Instruments tab -->
    <div class="sp-tab-content" id="tab-instruments">
      <div class="sp-section">
        <div class="sp-label">Pre-Formal Offer Period</div>
        <div class="sp-inst-row">
          <div class="sp-inst-card">
            <div class="sp-inst-icon shares"></div>
            <div class="sp-inst-pct">${p.sharesPreFormal}</div>
            <div class="sp-inst-label">Shares</div>
          </div>
          <div class="sp-inst-card">
            <div class="sp-inst-icon derivs"></div>
            <div class="sp-inst-pct">${p.derivativesPreFormal}</div>
            <div class="sp-inst-label">Derivatives</div>
          </div>
        </div>
        <div class="sp-stat-note">Deals where traded: ${p.dealsPreFormal} of ${p.offers}</div>
      </div>

      <div class="sp-section">
        <div class="sp-label">Formal Offer Period</div>
        <div class="sp-inst-row">
          <div class="sp-inst-card">
            <div class="sp-inst-icon shares"></div>
            <div class="sp-inst-pct">${p.sharesFormal}</div>
            <div class="sp-inst-label">Shares</div>
          </div>
          <div class="sp-inst-card">
            <div class="sp-inst-icon derivs"></div>
            <div class="sp-inst-pct">${p.derivativesFormal}</div>
            <div class="sp-inst-label">Derivatives</div>
          </div>
        </div>
        <div class="sp-stat-note">Deals where traded: ${p.dealsFormal} of ${p.offers}</div>
      </div>

      <div class="sp-section">
        <div class="sp-label">Overall</div>
        <div class="sp-inst-row">
          <div class="sp-inst-card">
            <div class="sp-inst-icon shares"></div>
            <div class="sp-inst-pct">${p.sharesOverall}</div>
            <div class="sp-inst-label">Shares</div>
          </div>
          <div class="sp-inst-card">
            <div class="sp-inst-icon derivs"></div>
            <div class="sp-inst-pct">${p.derivativesOverall}</div>
            <div class="sp-inst-label">Derivatives</div>
          </div>
        </div>
      </div>
    </div>`;
}

function switchTab(btn, tabId) {
  btn.closest('.slide-panel').querySelectorAll('.sp-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  btn.closest('.slide-panel').querySelectorAll('.sp-tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

function openPanel(name) {
  const sp = document.getElementById('slidePanel');
  const bd = document.getElementById('backdrop');
  document.getElementById('spName').textContent = name;
  const h = holders.find(x => x.name === name);
  const pred = predictions.find(p => p.name === name);
  const isHF = (h && h.type === 'Hedge Fund') || pred;
  document.getElementById('spType').textContent = h ? h.type : 'Predicted Entrant';
  let html = '';

  // Current position (for registered holders)
  if (h) {
    html += `
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
  }

  // Prediction banner (for predicted entrants)
  if (!h && pred) {
    html += `
      <div class="sp-section sp-pred-banner">
        <div class="sp-pred-prob ${pred.prob>=70?'high':'med'}">${pred.prob}%</div>
        <div class="sp-pred-text">
          <div style="font-weight:700;font-size:13px">Predicted to enter</div>
          <div style="font-size:11px;color:var(--mid);margin-top:3px">${pred.reason}</div>
        </div>
      </div>
      <div class="sp-section"><div style="display:flex;gap:4px;flex-wrap:wrap">${pred.tags.map(t=>`<span class="pred-tag">${t}</span>`).join('')}</div></div>`;
  }

  // Full behavioural analysis for hedge funds and predicted entrants
  if (isHF) {
    html += `<div class="sp-divider"><span>Behavioural Analysis</span></div>`;
    html += buildBehaviourPanel(sgProfile);
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
