import React, { useState, useMemo } from "react";
import { Fuel, Zap, Plus, X, ArrowUpDown, Gauge } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ---- Seed dataset: approximate combined WLTP figures from manufacturer data (DE market, mid-2026) ----
// ICE consumption in L/100km, EV consumption in kWh/100km
const SEED_CARS = [
  // Popular ICE in Germany
  { id: "c1", make: "Volkswagen", model: "Golf 1.5 TSI", type: "Petrol", segment: "Compact", origin: "German", consumption: 5.9 },
  { id: "c2", make: "Volkswagen", model: "Golf 2.0 TDI", type: "Diesel", segment: "Compact", origin: "German", consumption: 4.4 },
  { id: "c3", make: "Toyota", model: "Corolla Hybrid 1.8", type: "Petrol", segment: "Compact", origin: "Japanese", consumption: 4.5 },
  { id: "c5", make: "BMW", model: "320d", type: "Diesel", segment: "Sedan", origin: "German", consumption: 4.9 },
  { id: "c6", make: "Škoda", model: "Octavia 2.0 TDI", type: "Diesel", segment: "Sedan", origin: "European", consumption: 4.5 },
  { id: "c7", make: "Mercedes-Benz", model: "C200", type: "Petrol", segment: "Sedan", origin: "German", consumption: 6.3 },
  { id: "c8", make: "Toyota", model: "RAV4 Hybrid", type: "Petrol", segment: "SUV", origin: "Japanese", consumption: 5.0 },
  { id: "c9", make: "Volkswagen", model: "Tiguan 2.0 TDI", type: "Diesel", segment: "SUV", origin: "German", consumption: 5.7 },
  // European / Korean / American EVs
  { id: "e1", make: "Tesla", model: "Model 3 RWD", type: "EV", segment: "Sedan", origin: "American", consumption: 13.2 },
  { id: "e2", make: "Tesla", model: "Model Y RWD", type: "EV", segment: "SUV", origin: "American", consumption: 14.7 },
  { id: "e3", make: "Volkswagen", model: "ID.3 Pro", type: "EV", segment: "Compact", origin: "German", consumption: 15.4 },
  { id: "e4", make: "Volkswagen", model: "ID.4", type: "EV", segment: "SUV", origin: "German", consumption: 16.3 },
  { id: "e5", make: "Hyundai", model: "Ioniq 5", type: "EV", segment: "SUV", origin: "Korean", consumption: 16.8 },
  { id: "e6", make: "Kia", model: "EV6", type: "EV", segment: "SUV", origin: "Korean", consumption: 16.5 },
  { id: "e7", make: "Renault", model: "Megane E-Tech", type: "EV", segment: "Compact", origin: "European", consumption: 15.5 },
  { id: "e9", make: "Škoda", model: "Enyaq", type: "EV", segment: "SUV", origin: "European", consumption: 16.9 },
  // Chinese EVs sold in Germany
  { id: "cn1", make: "BYD", model: "Dolphin", type: "EV", segment: "Compact", origin: "Chinese", consumption: 15.9 },
  { id: "cn2", make: "BYD", model: "Atto 3", type: "EV", segment: "SUV", origin: "Chinese", consumption: 16.0 },
  { id: "cn3", make: "BYD", model: "Seal", type: "EV", segment: "Sedan", origin: "Chinese", consumption: 16.6 },
  { id: "cn4", make: "BYD", model: "Sealion 7", type: "EV", segment: "SUV", origin: "Chinese", consumption: 20.5 },
  { id: "cn5", make: "MG", model: "MG4 Electric Comfort", type: "EV", segment: "Compact", origin: "Chinese", consumption: 16.5 },
  { id: "cn6", make: "NIO", model: "ET5", type: "EV", segment: "Sedan", origin: "Chinese", consumption: 17.0 },
  { id: "cn7", make: "Xpeng", model: "G6", type: "EV", segment: "SUV", origin: "Chinese", consumption: 17.9 },
  { id: "cn8", make: "Xpeng", model: "P7+ Standard Range", type: "EV", segment: "Sedan", origin: "Chinese", consumption: 16.4 },
  // Indian-market cars — ARAI figures adjusted (+18% ICE, +30% EV) to be roughly comparable to WLTP-rated cars elsewhere in this list
  { id: "in1", make: "Maruti Suzuki", model: "Swift 1.2 Petrol", type: "Petrol", segment: "Compact", origin: "Indian", consumption: 4.76 },
  { id: "in2", make: "Maruti Suzuki", model: "Dzire 1.2 Petrol", type: "Petrol", segment: "Compact", origin: "Indian", consumption: 4.59 },
  { id: "in3", make: "Maruti Suzuki", model: "Baleno 1.2 Petrol", type: "Petrol", segment: "Compact", origin: "Indian", consumption: 5.27 },
  { id: "in4", make: "Tata", model: "Nexon 1.2 Turbo Petrol", type: "Petrol", segment: "SUV", origin: "Indian", consumption: 6.76 },
  { id: "in5", make: "Tata", model: "Nexon 1.5 Diesel", type: "Diesel", segment: "SUV", origin: "Indian", consumption: 4.90 },
  { id: "in6", make: "Hyundai", model: "Creta 1.5 Petrol", type: "Petrol", segment: "SUV", origin: "Korean", consumption: 6.78 },
  { id: "in7", make: "Hyundai", model: "Creta 1.5 Diesel", type: "Diesel", segment: "SUV", origin: "Korean", consumption: 5.42 },
  // Indian EVs
  { id: "in8", make: "Tata", model: "Nexon EV Long Range", type: "EV", segment: "SUV", origin: "Indian", consumption: 11.96 },
  { id: "in9", make: "Tata", model: "Nexon EV Medium Range", type: "EV", segment: "SUV", origin: "Indian", consumption: 14.17 },
  { id: "in10", make: "Tata", model: "Punch EV Long Range", type: "EV", segment: "SUV", origin: "Indian", consumption: 12.48 },
  { id: "in11", make: "MG", model: "Windsor EV", type: "EV", segment: "SUV", origin: "Chinese", consumption: 14.82 },
];

const TYPE_STYLE = {
  Petrol: { accent: "#E8A33D", label: "Petrol", icon: Fuel },
  Diesel: { accent: "#C97B3F", label: "Diesel", icon: Fuel },
  EV: { accent: "#3FD0C9", label: "Electric", icon: Zap },
};

const CURRENCY_DEFAULTS = {
  EUR: { symbol: "€", petrol: 2.08, diesel: 1.95, elec: 0.32 }, // Germany, ADAC Bundesdurchschnitt, Jul 2026
  INR: { symbol: "₹", petrol: 102.12, diesel: 95.20, elec: 8.0 }, // Delhi, Aug 2026
};

const CHARGING_PRESETS_BY_CURRENCY = {
  EUR: [
    { key: "home", label: "Home (own wallbox)", price: 0.32 },
    { key: "newcustomer", label: "New-customer tariff", price: 0.26 },
    { key: "public", label: "Public AC charging", price: 0.48 },
    { key: "fast", label: "Public DC fast charging", price: 0.59 },
  ],
  INR: [
    { key: "home", label: "Home (domestic tariff)", price: 8.0 },
    { key: "commercial", label: "Society / commercial charging", price: 12.0 },
    { key: "public", label: "Public AC charging", price: 15.0 },
    { key: "fast", label: "Public DC fast charging", price: 22.0 },
  ],
};

function currencyFmt(n, symbol) {
  return `${symbol}${n.toFixed(2)}`;
}

export default function FuelCompare() {
  const [cars, setCars] = useState(SEED_CARS);
const [currencyCode, setCurrencyCode] = useState("EUR");
const currency = CURRENCY_DEFAULTS[currencyCode].symbol;
const [petrolPrice, setPetrolPrice] = useState(CURRENCY_DEFAULTS.EUR.petrol);
const [dieselPrice, setDieselPrice] = useState(CURRENCY_DEFAULTS.EUR.diesel);
const [elecPrice, setElecPrice] = useState(CURRENCY_DEFAULTS.EUR.elec);
const [chargingPreset, setChargingPreset] = useState("home");
  const [distance, setDistance] = useState(100);
  const [segmentFilter, setSegmentFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [originFilter, setOriginFilter] = useState("All");
  const [sortAsc, setSortAsc] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newCar, setNewCar] = useState({ make: "", model: "", type: "Petrol", segment: "Compact", origin: "Chinese", consumption: "" });

  const priceFor = (type) => (type === "Petrol" ? petrolPrice : type === "Diesel" ? dieselPrice : elecPrice);
const handleCurrencyChange = (code) => {
  setCurrencyCode(code);
  setPetrolPrice(CURRENCY_DEFAULTS[code].petrol);
  setDieselPrice(CURRENCY_DEFAULTS[code].diesel);
  setElecPrice(CURRENCY_DEFAULTS[code].elec);
  setChargingPreset("home");
};
  const rows = useMemo(() => {
    const scale = distance / 100;
    let list = cars.map((c) => ({
      ...c,
      cost: c.consumption * priceFor(c.type) * scale,
      unitLabel: c.type === "EV" ? "kWh" : "L",
    }));
    if (segmentFilter !== "All") list = list.filter((c) => c.segment === segmentFilter);
    if (typeFilter !== "All") list = list.filter((c) => c.type === typeFilter);
    if (originFilter !== "All") list = list.filter((c) => c.origin === originFilter);
    list.sort((a, b) => (sortAsc ? a.cost - b.cost : b.cost - a.cost));
    return list;
  }, [cars, petrolPrice, dieselPrice, elecPrice, distance, segmentFilter, typeFilter, originFilter, sortAsc]);

  const segments = ["All", ...Array.from(new Set(cars.map((c) => c.segment)))];
  const origins = ["All", ...Array.from(new Set(cars.map((c) => c.origin).filter(Boolean)))];

  const cheapest = rows[0];
  const priciest = rows[rows.length - 1];

  const handleAddCar = () => {
    if (!newCar.make || !newCar.model || !newCar.consumption) return;
    setCars((prev) => [
      ...prev,
      { ...newCar, id: `custom-${Date.now()}`, consumption: parseFloat(newCar.consumption) },
    ]);
    setNewCar({ make: "", model: "", type: "Petrol", segment: "Compact", origin: "Chinese", consumption: "" });
    setShowAdd(false);
  };

  const removeCar = (id) => setCars((prev) => prev.filter((c) => c.id !== id));

  return (
    <div style={{ minHeight: "100vh", background: "#14171A", color: "#EDEFF1", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        .num { font-family: 'Space Grotesk', sans-serif; font-variant-numeric: tabular-nums; }
        input[type=number]::-webkit-inner-spin-button { opacity: 1; }
        .price-input {
          background: #1C2024; border: 1px solid #2E3338; border-radius: 8px;
          padding: 10px 12px; color: #EDEFF1; width: 100%; font-size: 15px;
        }
        .price-input:focus { outline: none; border-color: #5B6470; }
        .pill { border-radius: 999px; padding: 6px 14px; font-size: 13px; cursor: pointer; border: 1px solid #2E3338; background: #1C2024; color: #A8AFB6; transition: all .15s; }
        .pill.active { background: #EDEFF1; color: #14171A; border-color: #EDEFF1; }
        .row-hover:hover { background: #1A1E22; }
    
      `}</style>

      {/* Header */}
      <header style={{ borderBottom: "1px solid #23272B", padding: "28px 32px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Gauge size={22} color="#3FD0C9" />
          <span style={{ fontSize: 13, letterSpacing: 1.5, color: "#7C848C", textTransform: "uppercase", fontWeight: 600 }}>
            Cost per distance
          </span>
        </div>
        <h1 className="num" style={{ fontSize: 34, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>
          What does {distance} km actually cost?
        </h1>
        <p style={{ color: "#9298A0", marginTop: 6, fontSize: 15 }}>
          Manufacturer-rated consumption figures (WLTP for Europe, ARAI-adjusted for India), priced against current fuel and electricity rates — spanning German and European staples, Chinese EVs from BYD, MG, NIO and Xpeng, and popular Indian-market cars and EVs. Recalculates instantly as you edit.
        </p>
      </header>

      {/* Price / distance controls — styled like a pump/charger readout */}
      <section style={{ padding: "24px 32px", borderBottom: "1px solid #23272B", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        <div>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#E8A33D", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
            <Fuel size={14} /> Petrol / {currency} per L
          </label>
          <input className="price-input num" type="number" step="0.01" value={petrolPrice} onChange={(e) => setPetrolPrice(parseFloat(e.target.value) || 0)} />
        </div>
        <div>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#C97B3F", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
            <Fuel size={14} /> Diesel / {currency} per L
          </label>
          <input className="price-input num" type="number" step="0.01" value={dieselPrice} onChange={(e) => setDieselPrice(parseFloat(e.target.value) || 0)} />
        </div>
        <div>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#3FD0C9", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
            <Zap size={14} /> Electricity / {currency} per kWh
          </label>
          <input className="price-input num" type="number" step="0.01" value={elecPrice} onChange={(e) => { setElecPrice(parseFloat(e.target.value) || 0); setChargingPreset("custom"); }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {CHARGING_PRESETS_BY_CURRENCY[currencyCode].map((p) => (
              <button
                key={p.key}
                onClick={() => { setElecPrice(p.price); setChargingPreset(p.key); }}
                style={{
                  fontSize: 11, padding: "4px 8px", borderRadius: 6, cursor: "pointer",
                  border: `1px solid ${chargingPreset === p.key ? "#3FD0C9" : "#2E3338"}`,
                  background: chargingPreset === p.key ? "rgba(63,208,201,0.12)" : "transparent",
                  color: chargingPreset === p.key ? "#3FD0C9" : "#7C848C",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, color: "#7C848C", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
            Distance (km)
          </label>
          <input className="price-input num" type="number" step="10" value={distance} onChange={(e) => setDistance(parseFloat(e.target.value) || 0)} />
        </div>
        <div>
  <label style={{ display: "block", fontSize: 12, color: "#7C848C", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
    Currency / market
  </label>
  <select className="price-input" value={currencyCode} onChange={(e) => handleCurrencyChange(e.target.value)}>
    <option value="EUR">€ EUR — Germany</option>
    <option value="INR">₹ INR — India</option>
  </select>
</div>
      </section>

      {/* Filters */}
      <section style={{ padding: "18px 32px 0", display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["All", "Petrol", "Diesel", "EV"].map((t) => (
            <button key={t} className={`pill ${typeFilter === t ? "active" : ""}`} onClick={() => setTypeFilter(t)}>
              {t === "All" ? "All types" : t}
            </button>
          ))}
        </div>
        <div style={{ width: 1, height: 20, background: "#2E3338" }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {segments.map((s) => (
            <button key={s} className={`pill ${segmentFilter === s ? "active" : ""}`} onClick={() => setSegmentFilter(s)}>
              {s}
            </button>
          ))}
        </div>
        <div style={{ width: 1, height: 20, background: "#2E3338" }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {origins.map((o) => (
            <button key={o} className={`pill ${originFilter === o ? "active" : ""}`} onClick={() => setOriginFilter(o)}>
              {o === "All" ? "All markets" : o}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid #2E3338", color: "#EDEFF1", borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer" }}
        >
          <Plus size={15} /> Add a car
        </button>
      </section>

      {/* Add car form */}
      {showAdd && (
        <section style={{ margin: "16px 32px 0", padding: 18, background: "#1A1E22", borderRadius: 10, border: "1px solid #23272B", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, alignItems: "end" }}>
          <div>
            <label style={{ fontSize: 11, color: "#7C848C", display: "block", marginBottom: 4 }}>Make</label>
            <input className="price-input" value={newCar.make} onChange={(e) => setNewCar({ ...newCar, make: e.target.value })} placeholder="e.g. Honda" />
          </div>
          <div>
            <label style={{ fontSize: 11, color: "#7C848C", display: "block", marginBottom: 4 }}>Model</label>
            <input className="price-input" value={newCar.model} onChange={(e) => setNewCar({ ...newCar, model: e.target.value })} placeholder="e.g. Civic 1.5" />
          </div>
          <div>
            <label style={{ fontSize: 11, color: "#7C848C", display: "block", marginBottom: 4 }}>Type</label>
            <select className="price-input" value={newCar.type} onChange={(e) => setNewCar({ ...newCar, type: e.target.value })}>
              <option>Petrol</option>
              <option>Diesel</option>
              <option>EV</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: "#7C848C", display: "block", marginBottom: 4 }}>Segment</label>
            <input className="price-input" value={newCar.segment} onChange={(e) => setNewCar({ ...newCar, segment: e.target.value })} placeholder="e.g. SUV" />
          </div>
          <div>
            <label style={{ fontSize: 11, color: "#7C848C", display: "block", marginBottom: 4 }}>Market / origin</label>
            <select className="price-input" value={newCar.origin} onChange={(e) => setNewCar({ ...newCar, origin: e.target.value })}>
              <option>German</option>
              <option>European</option>
              <option>Chinese</option>
              <option>Korean</option>
              <option>Japanese</option>
              <option>American</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: "#7C848C", display: "block", marginBottom: 4 }}>
              Consumption ({newCar.type === "EV" ? "kWh" : "L"}/100km)
            </label>
            <input className="price-input num" type="number" step="0.1" value={newCar.consumption} onChange={(e) => setNewCar({ ...newCar, consumption: e.target.value })} placeholder="e.g. 5.4" />
          </div>
          <button onClick={handleAddCar} style={{ background: "#3FD0C9", color: "#0E1113", border: "none", borderRadius: 8, padding: "10px 16px", fontWeight: 600, cursor: "pointer" }}>
            Add
          </button>
        </section>
      )}

      {/* Summary strip */}
      {rows.length > 0 && (
        <section style={{ display: "flex", gap: 16, padding: "24px 32px 0", flexWrap: "wrap" }}>
          <SummaryCard label="Cheapest" car={cheapest} currency={currency} />
          <SummaryCard label="Most expensive" car={priciest} currency={currency} />
          {cheapest && priciest && cheapest.id !== priciest.id && (
            <div style={{ background: "#1A1E22", border: "1px solid #23272B", borderRadius: 12, padding: "16px 20px", flex: "1 1 220px" }}>
              <div style={{ fontSize: 12, color: "#7C848C", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Spread</div>
              <div className="num" style={{ fontSize: 24, fontWeight: 700 }}>
                {currencyFmt(priciest.cost - cheapest.cost, currency)}
              </div>
              <div style={{ fontSize: 13, color: "#9298A0", marginTop: 2 }}>difference over {distance} km</div>
            </div>
          )}
        </section>
      )}

      {/* Chart */}
      <section style={{ padding: "28px 32px 8px" }}>
        <div style={{ fontSize: 13, color: "#7C848C", marginBottom: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Cost over {distance} km
        </div>
        <div style={{ width: "100%", height: Math.max(220, rows.length * 34) }}>
          <ResponsiveContainer>
            <BarChart data={rows} layout="vertical" margin={{ left: 10, right: 30, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#23272B" horizontal={false} />
              <XAxis type="number" stroke="#5B6470" tickFormatter={(v) => `${currency}${v.toFixed(0)}`} fontSize={12} />
              <YAxis type="category" dataKey="model" width={150} stroke="#5B6470" fontSize={12} tickFormatter={(v) => (v.length > 20 ? v.slice(0, 18) + "…" : v)} />
              <Tooltip
                contentStyle={{ background: "#1C2024", border: "1px solid #2E3338", borderRadius: 8, color: "#EDEFF1" }}
                formatter={(v) => [currencyFmt(v, currency), "Cost"]}
                labelStyle={{ color: "#9298A0" }}
              />
              <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
                {rows.map((r) => (
                  <Cell key={r.id} fill={TYPE_STYLE[r.type].accent} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Table */}
      <section style={{ padding: "20px 32px 40px" }}>
        <div style={{ overflowX: "auto", border: "1px solid #23272B", borderRadius: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#1A1E22", textAlign: "left" }}>
                <th style={th}>Car</th>
                <th style={th}>Type</th>
                <th style={th}>Market</th>
                <th style={th}>Segment</th>
                <th style={th}>Consumption</th>
                <th style={{ ...th, cursor: "pointer" }} onClick={() => setSortAsc((s) => !s)}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    Cost / {distance}km <ArrowUpDown size={12} />
                  </span>
                </th>
                <th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => {
                const Icon = TYPE_STYLE[c.type]?.icon || Fuel;
                const accent = TYPE_STYLE[c.type]?.accent || "#888";
                return (
                  <tr key={c.id} className="row-hover" style={{ borderTop: "1px solid #23272B" }}>
                    <td style={td}>
                      <div style={{ fontWeight: 600 }}>{c.make}</div>
                      <div style={{ color: "#9298A0", fontSize: 13 }}>{c.model}</div>
                    </td>
                    <td style={td}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: accent, fontSize: 13, fontWeight: 600 }}>
                        <Icon size={13} /> {c.type}
                      </span>
                    </td>
                    <td style={{ ...td, color: "#9298A0" }}>{c.origin || "—"}</td>
                    <td style={{ ...td, color: "#9298A0" }}>{c.segment}</td>
                    <td style={{ ...td }} className="num">
                      {c.consumption.toFixed(1)} {c.unitLabel}/100km
                    </td>
                    <td style={{ ...td, fontWeight: 700 }} className="num">
                      {currencyFmt(c.cost, currency)}
                    </td>
                    <td style={{ ...td, textAlign: "right" }}>
                      {c.id.startsWith("custom-") && (
                        <button onClick={() => removeCar(c.id)} style={{ background: "none", border: "none", color: "#7C848C", cursor: "pointer" }}>
                          <X size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ ...td, textAlign: "center", color: "#7C848C", padding: 32 }}>
                    No cars match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p style={{ color: "#5B6470", fontSize: 12, marginTop: 14, lineHeight: 1.6 }}>
          Consumption figures are approximate, combined-cycle WLTP values from manufacturer specifications for common German-market trims (mid-2026) — actual figures vary by trim, battery size and options. Default prices reflect German averages as of late July 2026: ~{currencyFmt(petrolPrice, currency)}/L for Super E10 and ~{currencyFmt(dieselPrice, currency)}/L for diesel (ADAC Bundesdurchschnitt), and ~{currencyFmt(elecPrice, currency)}/kWh for household electricity (Verivox/co2online) — all editable above. Real-world consumption typically runs 10–20% higher than WLTP for ICE vehicles, and EV consumption varies more with temperature, speed and driving style; the ADAC Ecotest often shows 15–25% higher figures for Chinese EVs specifically, so treat these as a starting point rather than a guarantee.
        </p>
      </section>
    </div>
  );
}

function SummaryCard({ label, car, currency }) {
  if (!car) return null;
  const accent = TYPE_STYLE[car.type]?.accent || "#888";
  return (
    <div style={{ background: "#1A1E22", border: "1px solid #23272B", borderRadius: 12, padding: "16px 20px", flex: "1 1 220px" }}>
      <div style={{ fontSize: 12, color: "#7C848C", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>
        {car.make} {car.model}
      </div>
      <div className="num" style={{ fontSize: 24, fontWeight: 700, color: accent }}>
        {currencyFmt(car.cost, currency)}
      </div>
    </div>
  );
}

const th = { padding: "12px 16px", fontSize: 12, color: "#7C848C", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 };
const td = { padding: "12px 16px", verticalAlign: "middle" };
