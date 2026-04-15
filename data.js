// === DATA ===
const holders = [
  {name:"Millennium Management LLC",type:"Hedge Fund",long:3.315,short:0,cross:["Beazley","Senior"]},
  {name:"HBK Capital Management",type:"Hedge Fund",long:1.78,short:0,cross:["Beazley"]},
  {name:"UBS O'Connor LLC",type:"Hedge Fund",long:1.136,short:0.05,cross:[]},
  {name:"Glazer Capital Management LP",type:"Hedge Fund",long:1.05,short:0,cross:[]},
  {name:"BlackRock Inc",type:"Institutional Investor",long:8.21,short:0.14,cross:["Beazley","Senior"]},
  {name:"Vanguard Group Inc",type:"Institutional Investor",long:3.95,short:0,cross:[]},
  {name:"Schroders Investment Mgmt",type:"Institutional Investor",long:2.88,short:0,cross:[]},
  {name:"Legal & General Group",type:"Institutional Investor",long:2.14,short:0,cross:["Beazley"]},
  {name:"Norges Bank",type:"Institutional Investor",long:1.92,short:0,cross:[]},
  {name:"Dimensional Fund Advisors",type:"Institutional Investor",long:1.45,short:0,cross:[]},
  {name:"State Street Corporation",type:"Institutional Investor",long:1.22,short:0,cross:["Beazley","Senior"]},
  {name:"Aberdeen Standard Investments",type:"Institutional Investor",long:1.08,short:0,cross:[]},
  {name:"Goldman Sachs International",type:"Bank / Stockbroker",long:0.95,short:0.32,cross:["Beazley","Senior"]},
  {name:"J.P. Morgan Securities plc",type:"Bank / Stockbroker",long:0.88,short:0.15,cross:["Beazley"]},
  {name:"Barclays Capital Securities",type:"Bank / Stockbroker",long:0.72,short:0.28,cross:["Senior"]},
  {name:"Citigroup Global Markets",type:"Bank / Stockbroker",long:0.61,short:0.09,cross:[]},
  {name:"BNP Paribas Arbitrage SNC",type:"Other",long:0.44,short:0.12,cross:["Beazley"]},
  {name:"Virtu Financial Ireland Ltd",type:"Other",long:0.32,short:0.18,cross:[]}
];

const movers = [
  {name:"Glazer Capital",change:"+1.05pp",dir:"up",badge:"NEW"},
  {name:"Millennium Mgmt",change:"+0.42pp",dir:"up"},
  {name:"HBK Capital",change:"+0.28pp",dir:"up"},
  {name:"UBS O'Connor",change:"+0.14pp",dir:"up"},
  {name:"Goldman Sachs",change:"-0.10pp",dir:"down"},
  {name:"BNP Paribas",change:"-0.06pp",dir:"down"}
];

const predictions = [
  {name:"Sand Grove Capital",prob:78,reason:"Active in 85% of UK formal offers >£500m. Net buyer in 87.5% of deals. Avg entry by day 30.",tags:["Large-cap pref","Net buyer","Derivatives user"]},
  {name:"Citadel Advisors",prob:72,reason:"Already holds 5.03% in Beazley. Participates in 80%+ of FTSE 100 offers. Typically enters within 3 weeks.",tags:["Cross-deal active","Fast entry","High participation"]},
  {name:"Caxton Associates",prob:65,reason:"Holds 4.34% in Beazley. History of entering multiple live deals. Avg holding 2.1%.",tags:["Multi-deal","Cash offers pref","Institutional style"]},
  {name:"Pentwater Capital",prob:58,reason:"Active in Beazley (4.17%). Favours UK financial sector deals. Usually takes 40+ days to enter.",tags:["Sector specialist","Late entry","Patient builder"]},
  {name:"Elliott Investment Mgmt",prob:45,reason:"Activist investor. Targets deals where spread > 3% or hostile element. May engage if bid is raised.",tags:["Activist","Hostile pref","Event-driven"]}
];

const sgProfile = {
  // Overview
  offers: 8, formal: 7, inconclusive: 1, completedFormal: 6, failedBids: 1,
  successRate: '85.71%', avgMktCap: '£1,015m', hostile: 0,
  increasedOffers: 1, cashOnly: 3, shareOnly: 0, mixed: 2,
  existingShareholder: 0,
  // Pre-formal offer period
  avgStartHolding: '0%',
  tradingBeforeOffer: '12.5%', tradingBetweenIndicativeAndFormal: '0%',
  avgChangePreFormal: '3.95%', dealsPreFormal: 1,
  sharesPreFormal: '0%', derivativesPreFormal: '100%',
  // Formal offer period
  tradingAfterFormal: '100%', avgChangeFormal: '1.66%',
  dealsFormal: 7, sharesFormal: '28.6%', derivativesFormal: '100%',
  // End of offer
  heldAtEnd: '100%', avgEndHolding: '2.49%',
  // Timing
  avgFirstDay: 30.5, avgEndDay: 141.6,
  // Buyer/seller
  netSeller: '12.5%', netBuyer: '87.5%',
  // Instruments overall
  sharesOverall: '25%', derivativesOverall: '100%',
  // Sector & geo
  sectors: 'Financials, Industrials, Tech', geos: 'UK (75%), Europe (25%)'
};

const hfData = [
  {day:0,pct:0.0,event:null},
  {day:3,pct:0.4,event:null},
  {day:5,pct:0.9,event:null},
  {day:7,pct:1.2,event:"Millennium enters"},
  {day:10,pct:1.6,event:null},
  {day:12,pct:2.1,event:null},
  {day:14,pct:2.0,event:null},
  {day:17,pct:2.5,event:null},
  {day:20,pct:2.9,event:null},
  {day:22,pct:3.1,event:null},
  {day:24,pct:3.4,event:null},
  {day:27,pct:3.2,event:null},
  {day:30,pct:3.8,event:"HBK files"},
  {day:32,pct:4.2,event:null},
  {day:34,pct:4.1,event:null},
  {day:37,pct:4.6,event:null},
  {day:40,pct:5.0,event:null},
  {day:42,pct:5.3,event:null},
  {day:44,pct:5.1,event:null},
  {day:47,pct:5.6,event:null},
  {day:50,pct:6.0,event:"Glazer enters"},
  {day:52,pct:6.2,event:null},
  {day:54,pct:6.5,event:null},
  {day:56,pct:6.8,event:null},
  {day:58,pct:7.0,event:null},
  {day:60,pct:7.1,event:null},
  {day:62,pct:7.29,event:null}
];
