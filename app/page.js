"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";

const UP = "#00c853";
const DOWN = "#ff3d3d";
const GOLD = "#f0c040";
const BG = "#060a06";
const BG2 = "#0a0f0a";
const BG3 = "#0f160f";
const BORDER = "#1a2a1a";
const BORDER2 = "#00c85330";
const TEXT = "#c8d8c8";
const MUTED = "#5a7a5a";

const CATEGORIES = {
  income: ["Salary", "Freelance", "Investment", "Gift", "Other"],
  expense: ["Food", "Rent", "Transport", "Shopping", "Entertainment", "Health", "Education", "Other"],
};

const PIE_COLORS = ["#00c853", "#00e676", "#69f0ae", "#b9f6ca", "#f0c040", "#ff6d00", "#ff3d3d", "#e040fb"];

// ── Auth Page ─────────────────────────────────────────────────────────────────
function AuthPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const handleAuth = async () => {
    setLoading(true); setError(""); setMessage("");
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage("Verification email sent. Check your inbox.");
    }
    setLoading(false);
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour12: false });

  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'IBM Plex Mono', 'Courier New', monospace", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .ss-card { animation: fadeIn 0.4s ease; }
        .ss-input:focus { border-color: ${UP} !important; outline: none; box-shadow: 0 0 0 1px ${UP}40; }
        .ss-input { transition: border-color 0.2s; }
        .ss-btn:hover:not(:disabled) { background: ${UP} !important; color: ${BG} !important; }
        .ss-btn { transition: all 0.15s; }
        .ss-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .live-dot { animation: pulse 1.5s ease infinite; }
      `}</style>

      {/* Background grid */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: `linear-gradient(${BORDER} 1px, transparent 1px), linear-gradient(90deg, ${BORDER} 1px, transparent 1px)`, backgroundSize: "50px 50px", opacity: 0.4, pointerEvents: "none" }} />

      <div className="ss-card" style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420, background: BG2, border: `1px solid ${BORDER}`, borderTop: `2px solid ${UP}` }}>
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", borderBottom: `1px solid ${BORDER}`, background: BG3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div className="live-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: UP }} />
            <span style={{ fontSize: 10, color: UP, letterSpacing: 2 }}>LIVE</span>
          </div>
          <span style={{ fontSize: 10, color: MUTED, fontFamily: "inherit" }}>{timeStr} IST</span>
        </div>

        <div style={{ padding: "clamp(24px,5vw,36px)" }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: "clamp(20px,4vw,28px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.5px", fontFamily: "'IBM Plex Sans', sans-serif" }}>
              Spend<span style={{ color: UP }}>Smart</span>
            </div>
            <div style={{ fontSize: 11, color: MUTED, marginTop: 6, fontFamily: "inherit" }}>
              {mode === "login" ? "TERMINAL ACCESS — AUTHENTICATE" : "NEW ACCOUNT INITIALIZATION"}
            </div>
          </div>

          {error && <div style={{ background: "#ff000015", borderLeft: `2px solid ${DOWN}`, color: "#ff6b6b", padding: "10px 14px", fontSize: 12, marginBottom: 16, fontFamily: "inherit" }}>{error}</div>}
          {message && <div style={{ background: "#00c85315", borderLeft: `2px solid ${UP}`, color: UP, padding: "10px 14px", fontSize: 12, marginBottom: 16 }}>{message}</div>}

          {[
            { label: "EMAIL", type: "email", val: email, set: setEmail, placeholder: "user@domain.com" },
            { label: "PASSWORD", type: "password", val: password, set: setPassword, placeholder: "••••••••••••" },
          ].map(({ label, type, val, set, placeholder }) => (
            <div key={label} style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 9, color: MUTED, letterSpacing: 3, marginBottom: 8 }}>{label}</label>
              <input className="ss-input" style={{ width: "100%", background: BG, border: `1px solid ${BORDER}`, padding: "12px 14px", color: TEXT, fontSize: 13, fontFamily: "inherit" }}
                type={type} placeholder={placeholder} value={val} onChange={e => set(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAuth()} />
            </div>
          ))}

          <button className="ss-btn" style={{ width: "100%", marginTop: 8, padding: "13px", background: "transparent", color: UP, border: `1px solid ${UP}`, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: 2 }}
            onClick={handleAuth} disabled={loading}>
            {loading ? "AUTHENTICATING..." : mode === "login" ? "▶ SIGN IN" : "▶ CREATE ACCOUNT"}
          </button>

          <p style={{ fontSize: 11, color: MUTED, textAlign: "center", marginTop: 20 }}>
            {mode === "login" ? "No account? " : "Have account? "}
            <span style={{ color: UP, cursor: "pointer" }} onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setMessage(""); }}>
              {mode === "login" ? "Register" : "Sign in"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Ticker component ──────────────────────────────────────────────────────────
function Ticker({ income, expense, balance }) {
  const items = [
    { label: "NET_BAL", value: `₹${Math.abs(balance).toLocaleString("en-IN")}`, color: balance >= 0 ? UP : DOWN, dir: balance >= 0 ? "▲" : "▼" },
    { label: "INCOME", value: `₹${income.toLocaleString("en-IN")}`, color: UP, dir: "▲" },
    { label: "EXPENSE", value: `₹${expense.toLocaleString("en-IN")}`, color: DOWN, dir: "▼" },
    { label: "RATIO", value: income > 0 ? `${((expense / income) * 100).toFixed(1)}%` : "0%", color: GOLD, dir: "~" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 1, marginBottom: 20, background: BORDER }}>
      {items.map(({ label, value, color, dir }) => (
        <div key={label} style={{ background: BG2, padding: "16px 18px" }}>
          <div style={{ fontSize: 9, color: MUTED, letterSpacing: 2, marginBottom: 8 }}>{label}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 10, color, fontWeight: 600 }}>{dir}</span>
            <span style={{ fontSize: "clamp(16px,3vw,22px)", fontWeight: 700, color, fontFamily: "inherit" }}>{value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("feed");
  const [form, setForm] = useState({ title: "", amount: "", type: "expense", category: "Food" });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    fetchTransactions();
    const t = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data } = await supabase.from("transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) setTransactions(data);
    setLoading(false);
  };

  const addTransaction = async () => {
    if (!form.title.trim() || !form.amount) return;
    setAdding(true);
    const { error } = await supabase.from("transactions").insert({
      user_id: user.id, title: form.title, amount: parseFloat(form.amount), type: form.type, category: form.category,
    });
    if (!error) { setForm({ title: "", amount: "", type: "expense", category: "Food" }); setShowForm(false); await fetchTransactions(); }
    setAdding(false);
  };

  const deleteTransaction = async (id) => {
    await supabase.from("transactions").delete().eq("id", id);
    await fetchTransactions();
  };

  const totalIncome = transactions.filter(t => t.type === "income").reduce((a, t) => a + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((a, t) => a + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  const pieData = Object.entries(
    transactions.filter(t => t.type === "expense").reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const areaData = Object.values(
    transactions.reduce((acc, t) => {
      const d = new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (!acc[d]) acc[d] = { date: d, income: 0, expense: 0 };
      acc[d][t.type] += Number(t.amount);
      return acc;
    }, {})
  ).slice(-14);

  const timeStr = new Date().toLocaleTimeString("en-US", { hour12: false });

  const tabs = [
    { id: "feed", label: "FEED" },
    { id: "charts", label: "CHARTS" },
    { id: "ledger", label: "LEDGER" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: BG, color: TEXT, fontFamily: "'IBM Plex Mono', 'Courier New', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes slideIn { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .tx-row { animation: slideIn 0.2s ease; transition: background 0.15s; }
        .tx-row:hover { background: ${BG3} !important; }
        .ss-input:focus { border-color: ${UP} !important; outline: none; }
        .ss-btn:hover:not(:disabled) { background: ${UP} !important; color: ${BG} !important; }
        .ss-btn { transition: all 0.15s; }
        .ss-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .tab-btn:hover { color: ${TEXT} !important; }
        .live-dot { animation: pulse 1.5s ease infinite; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: ${UP}40; }
      `}</style>

      {/* Header */}
      <header style={{ background: BG2, borderBottom: `1px solid ${BORDER}`, borderTop: `2px solid ${UP}`, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px clamp(16px,4vw,28px)", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", fontFamily: "'IBM Plex Sans', sans-serif" }}>
              Spend<span style={{ color: UP }}>Smart</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div className="live-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: UP }} />
              <span style={{ fontSize: 9, color: UP, letterSpacing: 2 }}>LIVE</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 10, color: MUTED, fontFamily: "inherit" }}>{timeStr} IST</span>
            <span style={{ fontSize: 10, color: MUTED }}>|</span>
            <span style={{ fontSize: 10, color: MUTED }}>{user.email}</span>
            <button className="ss-btn" style={{ padding: "5px 12px", background: "transparent", color: MUTED, border: `1px solid ${BORDER}`, fontSize: 10, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1 }}
              onClick={() => supabase.auth.signOut()}>EXIT</button>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", borderTop: `1px solid ${BORDER}`, padding: "0 clamp(16px,4vw,28px)" }}>
          {tabs.map(t => (
            <button key={t.id} className="tab-btn" style={{ padding: "10px 16px", background: "transparent", color: activeTab === t.id ? UP : MUTED, border: "none", borderBottom: activeTab === t.id ? `2px solid ${UP}` : "2px solid transparent", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: 2, transition: "all 0.15s" }}
              onClick={() => setActiveTab(t.id)}>{t.label}</button>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px clamp(16px,4vw,28px)" }}>
        <Ticker income={totalIncome} expense={totalExpense} balance={balance} />

        {/* Add Transaction */}
        <div style={{ marginBottom: 16 }}>
          <button className="ss-btn" style={{ padding: "10px 20px", background: showForm ? DOWN + "20" : "transparent", color: showForm ? DOWN : UP, border: `1px solid ${showForm ? DOWN : UP}`, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: 2 }}
            onClick={() => setShowForm(!showForm)}>
            {showForm ? "✕ CANCEL" : "+ NEW TRANSACTION"}
          </button>
        </div>

        {showForm && (
          <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderLeft: `2px solid ${UP}`, padding: "20px", marginBottom: 16 }}>
            <div style={{ fontSize: 9, color: MUTED, letterSpacing: 3, marginBottom: 16 }}>NEW ENTRY</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
              {[
                { label: "DESCRIPTION", key: "title", type: "text", placeholder: "e.g. Groceries" },
                { label: "AMOUNT (₹)", key: "amount", type: "number", placeholder: "0.00" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label style={{ display: "block", fontSize: 9, color: MUTED, letterSpacing: 2, marginBottom: 6 }}>{label}</label>
                  <input className="ss-input" style={{ width: "100%", background: BG, border: `1px solid ${BORDER}`, padding: "10px 12px", color: TEXT, fontSize: 13, fontFamily: "inherit" }}
                    type={type} placeholder={placeholder} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: 9, color: MUTED, letterSpacing: 2, marginBottom: 6 }}>TYPE</label>
                <select className="ss-input" style={{ width: "100%", background: BG, border: `1px solid ${BORDER}`, padding: "10px 12px", color: form.type === "income" ? UP : DOWN, fontSize: 12, fontFamily: "inherit" }}
                  value={form.type} onChange={e => setForm({ ...form, type: e.target.value, category: CATEGORIES[e.target.value][0] })}>
                  <option value="expense">▼ EXPENSE</option>
                  <option value="income">▲ INCOME</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 9, color: MUTED, letterSpacing: 2, marginBottom: 6 }}>CATEGORY</label>
                <select className="ss-input" style={{ width: "100%", background: BG, border: `1px solid ${BORDER}`, padding: "10px 12px", color: TEXT, fontSize: 12, fontFamily: "inherit" }}
                  value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES[form.type].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button className="ss-btn" style={{ marginTop: 16, padding: "10px 24px", background: "transparent", color: UP, border: `1px solid ${UP}`, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: 2 }}
              onClick={addTransaction} disabled={adding}>
              {adding ? "POSTING..." : "▶ POST ENTRY"}
            </button>
          </div>
        )}

        {/* Feed Tab */}
        {activeTab === "feed" && (
          <div style={{ background: BG2, border: `1px solid ${BORDER}` }}>
            <div style={{ padding: "10px 16px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 9, color: MUTED, letterSpacing: 2 }}>RECENT TRANSACTIONS</span>
              <span style={{ fontSize: 9, color: MUTED }}>{transactions.slice(0, 10).length} entries</span>
            </div>
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", fontSize: 11, color: MUTED }}>LOADING...</div>
            ) : transactions.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", fontSize: 11, color: MUTED }}>NO ENTRIES — POST YOUR FIRST TRANSACTION</div>
            ) : (
              transactions.slice(0, 10).map(t => (
                <div className="tx-row" key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 12, color: t.type === "income" ? UP : DOWN, flexShrink: 0 }}>{t.type === "income" ? "▲" : "▼"}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: "#fff", fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 500 }}>{t.title}</div>
                      <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{t.category} · {new Date(t.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: t.type === "income" ? UP : DOWN, fontFamily: "inherit", whiteSpace: "nowrap" }}>
                      {t.type === "income" ? "+" : "-"}₹{Number(t.amount).toLocaleString("en-IN")}
                    </span>
                    <button style={{ background: "transparent", border: "none", color: MUTED, cursor: "pointer", fontSize: 12, padding: "2px 6px", fontFamily: "inherit" }}
                      onClick={() => deleteTransaction(t.id)}>✕</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Charts Tab */}
        {activeTab === "charts" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Area chart */}
            <div style={{ background: BG2, border: `1px solid ${BORDER}`, padding: "20px" }}>
              <div style={{ fontSize: 9, color: MUTED, letterSpacing: 2, marginBottom: 16 }}>DAILY CASHFLOW (14D)</div>
              {areaData.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px", fontSize: 11, color: MUTED }}>NO DATA</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={areaData}>
                    <defs>
                      <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={UP} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={UP} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={DOWN} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={DOWN} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                    <XAxis dataKey="date" tick={{ fill: MUTED, fontSize: 9, fontFamily: "inherit" }} />
                    <YAxis tick={{ fill: MUTED, fontSize: 9, fontFamily: "inherit" }} />
                    <Tooltip contentStyle={{ background: BG, border: `1px solid ${BORDER}`, fontSize: 11, fontFamily: "inherit", color: TEXT }} />
                    <Area type="monotone" dataKey="income" stroke={UP} fill="url(#inc)" strokeWidth={1.5} name="Income" />
                    <Area type="monotone" dataKey="expense" stroke={DOWN} fill="url(#exp)" strokeWidth={1.5} name="Expense" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Pie chart */}
            <div style={{ background: BG2, border: `1px solid ${BORDER}`, padding: "20px" }}>
              <div style={{ fontSize: 9, color: MUTED, letterSpacing: 2, marginBottom: 16 }}>EXPENSE ALLOCATION</div>
              {pieData.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px", fontSize: 11, color: MUTED }}>NO EXPENSE DATA</div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={2}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: BG, border: `1px solid ${BORDER}`, fontSize: 11, fontFamily: "inherit", color: TEXT }}
                      formatter={v => [`₹${Number(v).toLocaleString("en-IN")}`, "Amount"]} />
                  </PieChart>
                </ResponsiveContainer>
              )}
              {/* Legend */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", marginTop: 8 }}>
                {pieData.map((d, i) => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: MUTED }}>{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Ledger Tab */}
        {activeTab === "ledger" && (
          <div style={{ background: BG2, border: `1px solid ${BORDER}` }}>
            <div style={{ padding: "10px 16px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 9, color: MUTED, letterSpacing: 2 }}>FULL LEDGER</span>
              <span style={{ fontSize: 9, color: MUTED }}>{transactions.length} entries</span>
            </div>
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", fontSize: 11, color: MUTED }}>LOADING...</div>
            ) : transactions.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", fontSize: 11, color: MUTED }}>NO ENTRIES</div>
            ) : (
              transactions.map(t => (
                <div className="tx-row" key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 12, color: t.type === "income" ? UP : DOWN, flexShrink: 0 }}>{t.type === "income" ? "▲" : "▼"}</span>
                    <div>
                      <div style={{ fontSize: 13, color: "#fff", fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 500 }}>{t.title}</div>
                      <div style={{ fontSize: 10, color: MUTED, marginTop: 2 }}>{t.category} · {new Date(t.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: t.type === "income" ? UP : DOWN, fontFamily: "inherit", whiteSpace: "nowrap" }}>
                      {t.type === "income" ? "+" : "-"}₹{Number(t.amount).toLocaleString("en-IN")}
                    </span>
                    <button style={{ background: "transparent", border: "none", color: MUTED, cursor: "pointer", fontSize: 12, padding: "2px 6px" }}
                      onClick={() => deleteTransaction(t.id)}>✕</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function Home() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (checking) return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace" }}>
      <div style={{ color: UP, fontSize: 12, letterSpacing: 2 }}>INITIALIZING...</div>
    </div>
  );

  return user ? <Dashboard user={user} /> : <AuthPage />;
}