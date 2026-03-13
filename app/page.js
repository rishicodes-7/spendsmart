"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const CATEGORIES = {
  income: ["Salary", "Freelance", "Investment", "Gift", "Other"],
  expense: ["Food", "Rent", "Transport", "Shopping", "Entertainment", "Health", "Education", "Other"],
};

const COLORS = ["#6366f1", "#8b5cf6", "#a855f7", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];

// ── Auth Page ─────────────────────────────────────────────────────────────────
function AuthPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleAuth = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage("Check your email to confirm your account!");
    }
    setLoading(false);
  };

  return (
    <div style={s.authWrap}>
      <div style={s.authCard}>
        <div style={s.logo}>Spend<span style={{ color: "#6366f1" }}>Smart</span></div>
        <p style={s.authSub}>{mode === "login" ? "Sign in to track your finances" : "Create your free account"}</p>

        {error && <div style={s.errorBox}>{error}</div>}
        {message && <div style={s.successBox}>{message}</div>}

        <div style={s.field}>
          <label style={s.label}>EMAIL</label>
          <input style={s.input} type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={s.field}>
          <label style={s.label}>PASSWORD</label>
          <input style={s.input} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAuth()} />
        </div>

        <button style={s.btnPrimary} onClick={handleAuth} disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
        </button>

        <p style={s.switchText}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span style={s.switchLink} onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setMessage(""); }}>
            {mode === "login" ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [form, setForm] = useState({
    title: "", amount: "", type: "expense", category: "Food",
  });

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setTransactions(data);
    setLoading(false);
  };

  const addTransaction = async () => {
    if (!form.title.trim() || !form.amount) return;
    setAdding(true);
    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      title: form.title,
      amount: parseFloat(form.amount),
      type: form.type,
      category: form.category,
    });
    if (!error) {
      setForm({ title: "", amount: "", type: "expense", category: "Food" });
      setShowForm(false);
      await fetchTransactions();
    }
    setAdding(false);
  };

  const deleteTransaction = async (id) => {
    await supabase.from("transactions").delete().eq("id", id);
    await fetchTransactions();
  };

  // ── Computed values ──
  const totalIncome = transactions.filter(t => t.type === "income").reduce((a, t) => a + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((a, t) => a + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  // Pie chart data — expenses by category
  const pieData = Object.entries(
    transactions.filter(t => t.type === "expense").reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Bar chart data — monthly spending
  const barData = transactions.reduce((acc, t) => {
    const month = new Date(t.created_at).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };
    acc[month][t.type] += Number(t.amount);
    return acc;
  }, {});
  const barChartData = Object.values(barData).slice(-6);

  return (
    <div style={s.dashWrap}>
      {/* Header */}
      <header style={s.header}>
        <div style={s.logo}>Spend<span style={{ color: "#6366f1" }}>Smart</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: "#64748b" }}>{user.email}</span>
          <button style={s.btnGhost} onClick={() => supabase.auth.signOut()}>Sign Out</button>
        </div>
      </header>

      <main style={s.main}>
        {/* Balance Cards */}
        <div style={s.statsRow}>
          {[
            { label: "Balance", value: balance, color: balance >= 0 ? "#10b981" : "#ef4444", prefix: "₹" },
            { label: "Total Income", value: totalIncome, color: "#10b981", prefix: "₹" },
            { label: "Total Expenses", value: totalExpense, color: "#ef4444", prefix: "₹" },
          ].map(({ label, value, color, prefix }) => (
            <div key={label} style={s.statCard}>
              <div style={s.statLabel}>{label}</div>
              <div style={{ ...s.statNum, color }}>{prefix}{value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
            </div>
          ))}
        </div>

        {/* Add Transaction Button */}
        <div style={{ marginBottom: 20 }}>
          <button style={s.btnPrimary} onClick={() => setShowForm(!showForm)}>
            {showForm ? "✕ Cancel" : "+ Add Transaction"}
          </button>
        </div>

        {/* Add Transaction Form */}
        {showForm && (
          <div style={s.card}>
            <div style={s.cardTitle}>New Transaction</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
              <div style={s.field}>
                <label style={s.label}>TITLE</label>
                <input style={s.input} placeholder="e.g. Grocery" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div style={s.field}>
                <label style={s.label}>AMOUNT (₹)</label>
                <input style={s.input} type="number" placeholder="0.00" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
              </div>
              <div style={s.field}>
                <label style={s.label}>TYPE</label>
                <select style={s.input} value={form.type} onChange={e => setForm({ ...form, type: e.target.value, category: CATEGORIES[e.target.value][0] })}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label}>CATEGORY</label>
                <select style={s.input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES[form.type].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button style={{ ...s.btnPrimary, marginTop: 16 }} onClick={addTransaction} disabled={adding}>
              {adding ? "Adding..." : "Add Transaction →"}
            </button>
          </div>
        )}

        {/* Tabs */}
        <div style={s.tabs}>
          {["overview", "charts", "history"].map(t => (
            <button key={t} style={{ ...s.tab, ...(activeTab === t ? s.tabActive : {}) }} onClick={() => setActiveTab(t)}>
              {t === "overview" ? "📊 Overview" : t === "charts" ? "📈 Charts" : "📋 History"}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div style={s.card}>
            <div style={s.cardTitle}>Recent Transactions</div>
            {loading ? (
              <div style={s.empty}>Loading...</div>
            ) : transactions.length === 0 ? (
              <div style={s.empty}>No transactions yet — add your first one above!</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {transactions.slice(0, 8).map(t => (
                  <div key={t.id} style={s.txRow}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                      <div style={{ ...s.txIcon, background: t.type === "income" ? "#10b98120" : "#ef444420" }}>
                        {t.type === "income" ? "↑" : "↓"}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={s.txTitle}>{t.title}</div>
                        <div style={s.txMeta}>{t.category} • {new Date(t.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ ...s.txAmount, color: t.type === "income" ? "#10b981" : "#ef4444" }}>
                        {t.type === "income" ? "+" : "-"}₹{Number(t.amount).toLocaleString("en-IN")}
                      </span>
                      <button style={s.deleteBtn} onClick={() => deleteTransaction(t.id)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Charts Tab */}
        {activeTab === "charts" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Pie Chart */}
            <div style={s.card}>
              <div style={s.cardTitle}>Spending by Category</div>
              {pieData.length === 0 ? (
                <div style={s.empty}>No expense data yet!</div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Amount"]}
                      contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 13 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Bar Chart */}
            <div style={s.card}>
              <div style={s.cardTitle}>Monthly Overview</div>
              {barChartData.length === 0 ? (
                <div style={s.empty}>No data yet!</div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                    <Tooltip
                      formatter={(value) => [`₹${value.toLocaleString("en-IN")}`]}
                      contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 13 }}
                    />
                    <Legend />
                    <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                    <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div style={s.card}>
            <div style={s.cardTitle}>All Transactions</div>
            {loading ? (
              <div style={s.empty}>Loading...</div>
            ) : transactions.length === 0 ? (
              <div style={s.empty}>No transactions yet!</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {transactions.map(t => (
                  <div key={t.id} style={s.txRow}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                      <div style={{ ...s.txIcon, background: t.type === "income" ? "#10b98120" : "#ef444420" }}>
                        {t.type === "income" ? "↑" : "↓"}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={s.txTitle}>{t.title}</div>
                        <div style={s.txMeta}>{t.category} • {new Date(t.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ ...s.txAmount, color: t.type === "income" ? "#10b981" : "#ef4444" }}>
                        {t.type === "income" ? "+" : "-"}₹{Number(t.amount).toLocaleString("en-IN")}
                      </span>
                      <button style={s.deleteBtn} onClick={() => deleteTransaction(t.id)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  authWrap: {
    minHeight: "100vh", background: "#020817",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 20, fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  authCard: {
    background: "#0f172a", border: "1px solid #1e293b",
    borderRadius: 16, padding: "clamp(24px, 5vw, 40px)",
    width: "100%", maxWidth: 420,
  },
  logo: { fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 6 },
  authSub: { fontSize: 14, color: "#64748b", marginBottom: 28 },
  field: { marginBottom: 16 },
  label: { display: "block", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#475569", marginBottom: 8 },
  input: {
    width: "100%", background: "#020817", border: "1px solid #1e293b",
    borderRadius: 8, padding: "12px 14px", color: "#e2e8f0", fontSize: 14,
    fontFamily: "inherit", outline: "none", boxSizing: "border-box",
  },
  btnPrimary: {
    width: "100%", padding: "13px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff", border: "none", borderRadius: 8,
    fontSize: 14, fontWeight: 700, cursor: "pointer",
    fontFamily: "inherit", transition: "opacity 0.2s",
  },
  btnGhost: {
    padding: "8px 16px", background: "transparent",
    color: "#64748b", border: "1px solid #1e293b",
    borderRadius: 8, fontSize: 13, fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit",
  },
  switchText: { fontSize: 13, color: "#64748b", textAlign: "center", marginTop: 20 },
  switchLink: { color: "#6366f1", cursor: "pointer", fontWeight: 600 },
  errorBox: {
    background: "#ef444415", border: "1px solid #ef444430",
    color: "#f87171", borderRadius: 8, padding: "10px 14px",
    fontSize: 13, marginBottom: 16,
  },
  successBox: {
    background: "#22c55e15", border: "1px solid #22c55e30",
    color: "#4ade80", borderRadius: 8, padding: "10px 14px",
    fontSize: 13, marginBottom: 16,
  },
  dashWrap: { minHeight: "100vh", background: "#020817", color: "#e2e8f0", fontFamily: "'DM Sans', system-ui, sans-serif" },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px clamp(16px, 4vw, 32px)", borderBottom: "1px solid #1e293b",
    background: "#020817", position: "sticky", top: 0, zIndex: 10, flexWrap: "wrap", gap: 12,
  },
  main: { maxWidth: 900, margin: "0 auto", padding: "32px clamp(16px, 4vw, 32px)" },
  card: { background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: "clamp(20px, 4vw, 28px)", marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 20 },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 },
  statCard: { background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: "20px", textAlign: "center" },
  statNum: { fontSize: 24, fontWeight: 800, lineHeight: 1, marginTop: 6 },
  statLabel: { fontSize: 12, color: "#64748b", fontWeight: 500 },
  tabs: { display: "flex", gap: 4, marginBottom: 16, background: "#0f172a", borderRadius: 10, padding: 4 },
  tab: {
    flex: 1, padding: "10px 4px", background: "transparent",
    color: "#64748b", border: "none", borderRadius: 8,
    fontSize: "clamp(11px, 2vw, 13px)", fontWeight: 600,
    cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
  },
  tabActive: { background: "#1e293b", color: "#fff" },
  txRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: 12, padding: "12px 14px", background: "#020817",
    borderRadius: 8, flexWrap: "wrap",
  },
  txIcon: {
    width: 36, height: 36, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 16, fontWeight: 700, flexShrink: 0,
  },
  txTitle: { fontSize: 14, fontWeight: 600, color: "#e2e8f0" },
  txMeta: { fontSize: 12, color: "#64748b", marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: 700, whiteSpace: "nowrap" },
  deleteBtn: {
    background: "transparent", border: "none",
    color: "#475569", cursor: "pointer", fontSize: 14,
    padding: "4px 8px", borderRadius: 4,
  },
  empty: { textAlign: "center", padding: "40px 0", color: "#64748b", fontSize: 14 },
};

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
    <div style={{ minHeight: "100vh", background: "#020817", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#6366f1", fontSize: 14 }}>Loading...</div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus, select:focus { border-color: #6366f1 !important; outline: none; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 2px; }
      `}</style>
      {user ? <Dashboard user={user} /> : <AuthPage />}
    </>
  );
}