import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

//inject google fonts (guarded so HMR / StrictMode don't duplicate the tag)
if (!document.getElementById("ledger-fonts")) {
  const fontLink = document.createElement("link");
  fontLink.id = "ledger-fonts";
  fontLink.rel = "stylesheet";
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Playfair+Display:wght@700&display=swap";
  document.head.appendChild(fontLink);
}

//global css (same guard)
if (!document.getElementById("ledger-global-style")) {
  const globalStyle = document.createElement("style");
  globalStyle.id = "ledger-global-style";
  globalStyle.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #F5F2EB; color: #1a1a1a; font-family: 'IBM Plex Mono', monospace; }
  ::selection { background: #1a1a1a; color: #F5F2EB; }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes swipeOut {
    from { opacity: 1; transform: translateX(0); max-height: 80px; }
    to   { opacity: 0; transform: translateX(110%); max-height: 0; padding: 0; margin: 0; }
  }

  .tx-item {
    animation: slideIn 0.3s ease both;
    overflow: hidden;
    transition: background 0.15s;
  }
  .tx-item:hover { background: #f7f4ed !important; }
  .tx-item.removing {
    animation: swipeOut 0.38s cubic-bezier(0.4, 0, 0.6, 1) forwards;
  }

  input, select, button { font-family: 'IBM Plex Mono', monospace; }
  input:focus, select:focus { outline: 2px solid #1a1a1a; outline-offset: -2px; }

  .login-btn:hover   { background: #333 !important; }
  .signup-btn:hover  { background: #ece9e0 !important; }
  .add-btn:hover     { background: #333 !important; }
  .filter-clear:hover { background: #1a1a1a !important; color: #F5F2EB !important; }
  .logout-btn:hover  { color: #1a1a1a !important; }
  .back-btn:hover    { background: #ece9e0 !important; }

  .del-btn {
    background: none;
    border: 1px solid #ddd;
    color: #bbb;
    padding: 4px 10px;
    font-size: 10px;
    cursor: pointer;
    letter-spacing: 0.08em;
    transition: all 0.15s;
    font-family: 'IBM Plex Mono', monospace;
  }
  .del-btn:hover { border-color: #c0392b; color: #c0392b; background: #fff5f5; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #F5F2EB; }
  ::-webkit-scrollbar-thumb { background: #ccc; }
`;
  document.head.appendChild(globalStyle);
}

//constants
const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Salary",
  "Entertainment",
  "Health",
  "Other",
];
const PIE_COLORS = [
  "#1a1a1a",
  "#555",
  "#888",
  "#bbb",
  "#333",
  "#777",
  "#444",
  "#999",
];

//shared tooltip style for both charts
const TOOLTIP_STYLE = {
  background: "#fff",
  border: "1px solid #1a1a1a",
  borderRadius: 0,
  fontFamily: "IBM Plex Mono",
  fontSize: 11,
};

//shared legend style for both charts
const LEGEND_STYLE = {
  fontFamily: "IBM Plex Mono",
  fontSize: 10,
  color: "#aaa",
};

//shared axis tick style
const AXIS_TICK = { fill: "#aaa", fontSize: 10, fontFamily: "IBM Plex Mono" };

//style tokens
const s = {
  page: {
    maxWidth: 920,
    margin: "0 auto",
    padding: "36px 24px",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  eyebrow: {
    fontSize: 9,
    letterSpacing: "0.2em",
    color: "#aaa",
    marginBottom: 4,
  },
  masthead: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 40,
    fontWeight: 700,
    lineHeight: 1,
    color: "#1a1a1a",
  },
  rule: { height: 2, background: "#1a1a1a", marginBottom: 24 },
  card: {
    background: "#fff",
    border: "1px solid #e0ddd4",
    padding: "18px 18px 14px",
  },
  cardLabel: {
    fontSize: 9,
    letterSpacing: "0.2em",
    color: "#aaa",
    marginBottom: 12,
  },
  input: {
    padding: "10px 12px",
    background: "#F5F2EB",
    border: "1px solid #ddd",
    fontSize: 13,
    color: "#1a1a1a",
    borderRadius: 0,
    width: "100%",
  },
  outlineBtn: {
    background: "transparent",
    border: "1px solid #ddd",
    color: "#888",
    padding: "6px 14px",
    fontSize: 10,
    letterSpacing: "0.12em",
    cursor: "pointer",
    transition: "all 0.15s",
  },
};

//ADMIN DASHBOARD

function AdminDashboard({ onBack }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("*")
      .then(({ data, error }) => {
        if (error) alert("Admin Error: Could not fetch users.");
        else setUsers(data || []);
      });
  }, []);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <div style={s.eyebrow}>ADMIN</div>
          <h1 style={s.masthead}>Control Center</h1>
        </div>
        <button className="back-btn" onClick={onBack} style={s.outlineBtn}>
          ← BACK
        </button>
      </div>

      <div style={s.rule} />

      <div style={s.card}>
        <div style={s.cardLabel}>REGISTERED USERS</div>
        {users.length === 0 ? (
          <p style={{ color: "#999", fontSize: 13 }}>No users found.</p>
        ) : (
          users.map((u) => (
            <div
              key={u.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid #ece9e0",
              }}
            >
              <span style={{ fontSize: 13 }}>{u.email}</span>
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  color: u.role === "admin" ? "#1a1a1a" : "#aaa",
                  fontWeight: u.role === "admin" ? 600 : 400,
                }}
              >
                {(u.role ?? "user").toUpperCase()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

//MONTHLY BAR CHART

function SpendingChart({ transactions }) {
  //group transactions by month
  const monthMap = {};
  transactions.forEach((t) => {
    const key = new Date(t.created_at).toLocaleDateString("en-IN", {
      month: "short",
      year: "2-digit",
    });
    if (!monthMap[key]) monthMap[key] = { month: key, Income: 0, Expenses: 0 };
    const val = parseFloat(t.amount) || 0;
    if (t.type === "income") monthMap[key].Income += val;
    else monthMap[key].Expenses += val;
  });

  // monthMap is built in transaction order (newest first, since the query
  // orders by created_at DESC). Reverse to chronological, then take last 6.
  const data = Object.values(monthMap).reverse().slice(-6);
  if (!data.length) return null;

  return (
    <div style={s.card}>
      <div style={s.cardLabel}>MONTHLY OVERVIEW</div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barCategoryGap="30%">
          <XAxis
            dataKey="month"
            tick={AXIS_TICK}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={AXIS_TICK}
            axisLine={false}
            tickLine={false}
            width={45}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "#f7f4ed" }} />
          <Legend wrapperStyle={LEGEND_STYLE} />
          <Bar dataKey="Income" fill="#1a1a1a" radius={0} />
          <Bar dataKey="Expenses" fill="#ccc" radius={0} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

//CATEGORY DONUT CHART

function CategoryChart({ transactions }) {
  const expenses = transactions.filter((t) => t.type === "expense");
  if (!expenses.length) return null;

  //sum up amounts per category
  const catMap = {};
  expenses.forEach((t) => {
    const c = t.category || "Other";
    catMap[c] = (catMap[c] || 0) + (parseFloat(t.amount) || 0);
  });

  const data = Object.entries(catMap)
    .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
    .sort((a, b) => b.value - a.value);

  return (
    <div style={s.card}>
      <div style={s.cardLabel}>EXPENSES BY CATEGORY</div>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={72}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(v) => [`$${v}`, ""]}
          />
          <Legend wrapperStyle={LEGEND_STYLE} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

//SINGLE TRANSACTION ROW

function TxItem({ t, role, onDelete }) {
  const ref = useRef(null);

  function handleDelete() {
    if (!window.confirm("Delete this transaction?")) return;
    // play swipe-out animation, then actually delete
    ref.current.classList.add("removing");
    ref.current.addEventListener("animationend", () => onDelete(t.id), {
      once: true,
    });
  }

  const formattedDate = new Date(t.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const amountDisplay = `${t.type === "income" ? "+" : "−"}$${parseFloat(t.amount).toFixed(2)}`;

  return (
    <li
      ref={ref}
      className="tx-item"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 16px",
        background: "#fff",
        borderBottom: "1px solid #ece9e0",
        borderLeft: `3px solid ${t.type === "income" ? "#1a1a1a" : "#ddd"}`,
      }}
    >
      {/* left side: description + meta */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>{t.description}</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span
            style={{ fontSize: 10, color: "#aaa", letterSpacing: "0.05em" }}
          >
            {formattedDate}
          </span>
          {t.category && (
            <span
              style={{
                fontSize: 9,
                letterSpacing: "0.12em",
                color: "#999",
                border: "1px solid #e0ddd4",
                padding: "1px 6px",
              }}
            >
              {t.category.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* right side: amount + delete button (admin only) */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: t.type === "income" ? "#1a1a1a" : "#888",
            fontFamily: "'Playfair Display', serif",
          }}
        >
          {amountDisplay}
        </span>
        {role === "admin" && (
          <button className="del-btn" onClick={handleDelete}>
            DEL
          </button>
        )}
      </div>
    </li>
  );
}

//MAIN APP

function App() {
  const [session, setSession] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [role, setRole] = useState("user");
  const [currentView, setCurrentView] = useState("app"); //"app" or "admin"
  const [authError, setAuthError] = useState("");
  const lastAttempt = useRef(0);

  //form state
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Other");

  //filter state
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  //listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  //fetch data when user logs in
  useEffect(() => {
    if (session) {
      fetchTransactions();
      fetchUserRole();
    }
  }, [session]);

  async function fetchUserRole() {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .maybeSingle();
    if (data) setRole(data.role);
  }

  async function fetchTransactions() {
    setLoading(true);
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });
    if (!error) setTransactions(data || []);
    setLoading(false);
  }

  async function addTransaction(e) {
    e.preventDefault();
    if (!amount || !description) return;

    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          description,
          amount: parseFloat(amount),
          type,
          category,
          user_id: session.user.id,
        },
      ])
      .select();

    if (error) {
      alert("Error: " + error.message);
    } else if (data) {
      setTransactions((prev) => [data[0], ...prev]);
      setAmount("");
      setDescription("");
      setCategory("Other");
    }
  }

  async function deleteTransaction(id) {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) alert("Unauthorized: Only admins can delete transactions.");
    else setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleAuth(e) {
    // preventDefault MUST come before any early return, otherwise the browser
    // performs a native form submit and reloads the page.
    e.preventDefault();
    const now = Date.now();
    if (now - lastAttempt.current < 2000) return;
    lastAttempt.current = now;
    setAuthError(""); // clear on each attempt
    const email = e.target.email.value;
    const password = e.target.password.value;
    const clickedButton = e.nativeEvent.submitter.innerText;

    if (clickedButton === "SIGN UP") {
      // Password validation
      if (password.length < 8) {
        setAuthError("Password must be at least 8 characters.");
        return;
      }
      if (!/[A-Z]/.test(password)) {
        setAuthError("Password must contain at least one uppercase letter.");
        return;
      }
      if (!/[a-z]/.test(password)) {
        setAuthError("Password must contain at least one lowercase letter.");
        return;
      }
      if (!/[0-9]/.test(password)) {
        setAuthError("Password must contain at least one number.");
        return;
      }
      if (!/[^A-Za-z0-9]/.test(password)) {
        setAuthError("Password must contain at least one symbol.");
        return;
      }

      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setAuthError(error.message);
      else setAuthError("Account created! You can now log in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setAuthError(error.message);
    }
  }

  //derived values
  const filtered = transactions.filter((t) => {
    const typeMatch = filterType === "all" || t.type === filterType;
    const categoryMatch =
      filterCategory === "all" || t.category === filterCategory;
    return typeMatch && categoryMatch;
  });

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

  const balance = totalIncome - totalExpense;

  //loading screen
  if (authLoading) {
    return (
      <div
        style={{
          background: "#F5F2EB",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 11, letterSpacing: "0.2em", color: "#aaa" }}>
          LOADING...
        </span>
      </div>
    );
  }

  //login screen
  if (!session) {
    return (
      <div
        style={{
          background: "#F5F2EB",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div style={{ marginBottom: 36, textAlign: "center" }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.22em",
              color: "#aaa",
              marginBottom: 10,
            }}
          >
            PERSONAL FINANCE
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 48,
              fontWeight: 700,
              lineHeight: 1,
              color: "#1a1a1a",
            }}
          >
            The Ledger
          </h1>
          <div
            style={{
              width: 48,
              height: 2,
              background: "#1a1a1a",
              margin: "14px auto 0",
            }}
          />
        </div>

        <form
          onSubmit={handleAuth}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            width: "100%",
            maxWidth: 300,
          }}
        >
          <input
            name="email"
            type="email"
            placeholder="email address"
            required
            style={s.input}
          />
          <input
            name="password"
            type="password"
            placeholder="password"
            required
            style={s.input}
          />

          {authError && (
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.1em",
                color: authError.startsWith("Account") ? "#555" : "#c0392b",
                border: `1px solid ${authError.startsWith("Account") ? "#ccc" : "#f5c6c6"}`,
                background: authError.startsWith("Account")
                  ? "#f9f9f9"
                  : "#fff5f5",
                padding: "8px 12px",
              }}
            >
              {authError.toUpperCase()}
            </div>
          )}

          <button
            type="submit"
            className="login-btn"
            style={{
              ...s.input,
              background: "#1a1a1a",
              color: "#F5F2EB",
              cursor: "pointer",
              border: "1px solid #1a1a1a",
              letterSpacing: "0.14em",
              fontSize: 12,
              transition: "background 0.15s",
            }}
          >
            LOG IN
          </button>
          <button
            type="submit"
            className="signup-btn"
            style={{
              ...s.input,
              background: "transparent",
              color: "#555",
              cursor: "pointer",
              border: "1px solid #ccc",
              letterSpacing: "0.14em",
              fontSize: 12,
              transition: "background 0.15s",
            }}
          >
            SIGN UP
          </button>
        </form>
      </div>
    );
  }

  //admin screen
  if (currentView === "admin" && role === "admin") {
    return <AdminDashboard onBack={() => setCurrentView("app")} />;
  }

  //main app screen
  return (
    <div style={s.page}>
      {/* header */}
      <div style={s.header}>
        <div>
          <div style={s.eyebrow}>{session.user.email}</div>
          <h1 style={s.masthead}>The Ledger</h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {role === "admin" && (
            <button
              className="back-btn"
              onClick={() => setCurrentView("admin")}
              style={s.outlineBtn}
            >
              ADMIN
            </button>
          )}
          <button
            className="logout-btn"
            onClick={() => supabase.auth.signOut()}
            style={{
              background: "none",
              border: "none",
              fontSize: 10,
              letterSpacing: "0.12em",
              color: "#bbb",
              cursor: "pointer",
              transition: "color 0.15s",
            }}
          >
            SIGN OUT
          </button>
        </div>
      </div>

      <div style={s.rule} />

      {/* summary stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
          background: "#e0ddd4",
          border: "1px solid #e0ddd4",
          marginBottom: 20,
        }}
      >
        {[
          {
            label: "BALANCE",
            value: `${balance >= 0 ? "+" : ""}$${balance.toFixed(2)}`,
            dim: balance < 0,
          },
          {
            label: "TOTAL INCOME",
            value: `+$${totalIncome.toFixed(2)}`,
            dim: false,
          },
          {
            label: "TOTAL EXPENSES",
            value: `−$${totalExpense.toFixed(2)}`,
            dim: true,
          },
        ].map(({ label, value, dim }) => (
          <div
            key={label}
            style={{ background: "#F5F2EB", padding: "18px 16px" }}
          >
            <div
              style={{
                fontSize: 9,
                letterSpacing: "0.18em",
                color: "#aaa",
                marginBottom: 8,
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 22,
                fontWeight: 700,
                color: dim ? "#888" : "#1a1a1a",
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <SpendingChart transactions={transactions} />
        <CategoryChart transactions={transactions} />
      </div>

      {/* add transaction form */}
      <div style={{ ...s.card, marginBottom: 20 }}>
        <div style={s.cardLabel}>NEW ENTRY</div>
        <form
          onSubmit={addTransaction}
          style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
        >
          <input
            placeholder="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...s.input, flex: 2, minWidth: 130 }}
          />
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ ...s.input, flex: 1, minWidth: 80 }}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ ...s.input, flex: 1, minWidth: 110 }}
          >
            <option value="expense">EXPENSE</option>
            <option value="income">INCOME</option>
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ ...s.input, flex: 1, minWidth: 110 }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="add-btn"
            style={{
              ...s.input,
              background: "#1a1a1a",
              color: "#F5F2EB",
              cursor: "pointer",
              border: "1px solid #1a1a1a",
              letterSpacing: "0.12em",
              fontSize: 12,
              transition: "background 0.15s",
              minWidth: 80,
              flex: "none",
            }}
          >
            + ADD
          </button>
        </form>
      </div>

      {/* filters */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 10,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 9, letterSpacing: "0.18em", color: "#aaa" }}>
          FILTER
        </span>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            ...s.input,
            padding: "6px 10px",
            fontSize: 11,
            width: "auto",
          }}
        >
          <option value="all">ALL TYPES</option>
          <option value="income">INCOME</option>
          <option value="expense">EXPENSE</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{
            ...s.input,
            padding: "6px 10px",
            fontSize: 11,
            width: "auto",
          }}
        >
          <option value="all">ALL CATEGORIES</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c.toUpperCase()}
            </option>
          ))}
        </select>
        {(filterType !== "all" || filterCategory !== "all") && (
          <button
            className="filter-clear"
            onClick={() => {
              setFilterType("all");
              setFilterCategory("all");
            }}
            style={{
              ...s.input,
              padding: "6px 12px",
              fontSize: 10,
              cursor: "pointer",
              transition: "all 0.15s",
              letterSpacing: "0.1em",
              width: "auto",
              border: "1px solid #ccc",
            }}
          >
            CLEAR ×
          </button>
        )}
        {filtered.length !== transactions.length && (
          <span
            style={{
              fontSize: 10,
              color: "#aaa",
              marginLeft: "auto",
              letterSpacing: "0.08em",
            }}
          >
            {filtered.length} of {transactions.length}
          </span>
        )}
      </div>

      {/* transaction list */}
      <div
        style={{
          fontSize: 9,
          letterSpacing: "0.18em",
          color: "#aaa",
          marginBottom: 8,
        }}
      >
        TRANSACTION HISTORY
      </div>

      {loading ? (
        <div
          style={{
            padding: 40,
            textAlign: "center",
            fontSize: 11,
            color: "#aaa",
            letterSpacing: "0.12em",
          }}
        >
          LOADING...
        </div>
      ) : transactions.length === 0 ? (
        <EmptyState
          title="No entries yet."
          subtitle="ADD YOUR FIRST TRANSACTION ABOVE"
        />
      ) : filtered.length === 0 ? (
        <EmptyState title="No matches." subtitle="TRY ADJUSTING YOUR FILTERS" />
      ) : (
        <ul style={{ listStyle: "none", border: "1px solid #e0ddd4" }}>
          {filtered.map((t) => (
            <TxItem key={t.id} t={t} role={role} onDelete={deleteTransaction} />
          ))}
        </ul>
      )}

      {/* footer */}
      <div
        style={{
          marginTop: 48,
          paddingTop: 16,
          borderTop: "1px solid #e0ddd4",
          fontSize: 9,
          color: "#ccc",
          letterSpacing: "0.14em",
          textAlign: "center",
        }}
      >
        THE LEDGER — PERSONAL FINANCE TRACKER
      </div>
    </div>
  );
}

function EmptyState({ title, subtitle }) {
  return (
    <div
      style={{ border: "1px dashed #ccc", padding: 48, textAlign: "center" }}
    >
      <div
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 24,
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 10, color: "#aaa", letterSpacing: "0.1em" }}>
        {subtitle}
      </div>
    </div>
  );
}

export default App;
