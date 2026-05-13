import { Activity, useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import {
  ArrowDown,
  ArrowUp,
  Car,
  ChevronDown,
  ChevronUp,
  Clock,
  CreditCard,
  DollarSign,
  Gift,
  Home,
  PieChart,
  PiggyBank,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Utensils,
  Zap,
} from "lucide-react";

import axios from "axios";
import { Outlet } from "react-router-dom";
import { API_BASE, getAuthHeaders } from "../utils/api";

/* ---------------- CATEGORY ICONS ---------------- */
const CATEGORY_ICONS = {
  Food: <Utensils className="w-4 h-4" />,
  Housing: <Home className="w-4 h-4" />,
  Transport: <Car className="w-4 h-4" />,
  Shopping: <ShoppingCart className="w-4 h-4" />,
  Entertainment: <Gift className="w-4 h-4" />,
  Utilities: <Zap className="w-4 h-4" />,
  Healthcare: <Activity className="w-4 h-4" />,
  Salary: <ArrowUp className="w-4 h-4" />,
  Freelance: <CreditCard className="w-4 h-4" />,
  Savings: <PiggyBank className="w-4 h-4" />,
};

/* ---------------- FILTER ---------------- */
const filterTransactions = (transactions, frame) => {
  const now = new Date();
  const today = new Date(now).setHours(0, 0, 0, 0);

  switch (frame) {
    case "daily":
      return transactions.filter((t) => new Date(t.date) >= today);

    case "weekly": {
      const startOfWeek = new Date(today);

      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

      return transactions.filter((t) => new Date(t.date) >= startOfWeek);
    }

    case "monthly":
      return transactions.filter(
        (t) => new Date(t.date).getMonth() === now.getMonth(),
      );

    default:
      return transactions;
  }
};

/* ---------------- SAFE ARRAY ---------------- */
const safeArrayFromResponse = (res) => {
  const body = res?.data;

  if (!body) return [];

  if (Array.isArray(body)) return body;

  if (Array.isArray(body.data)) return body.data;

  if (Array.isArray(body.incomes)) return body.incomes;

  if (Array.isArray(body.expenses)) return body.expenses;

  return [];
};

/* ---------------- COMPONENT ---------------- */
const Layout = ({ onLogout, user }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [transactions, setTransactions] = useState([]);

  const [timeFrame, setTimeFrame] = useState("monthly");

  const [loading, setLoading] = useState(false);

  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const [lastUpdated, setLastUpdated] = useState(new Date());

  /* ---------------- FETCH TRANSACTIONS ---------------- */
  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const headers = getAuthHeaders();

      const [incomeRes, expenseRes] = await Promise.all([
        axios.get(`${API_BASE}/income/get`, {
          headers,
        }),

        axios.get(`${API_BASE}/expense/get`, {
          headers,
        }),
      ]);

      const incomes = safeArrayFromResponse(incomeRes).map((i) => ({
        ...i,
        type: "income",
      }));

      const expenses = safeArrayFromResponse(expenseRes).map((e) => ({
        ...e,
        type: "expense",
      }));

      const allTransactions = [...incomes, ...expenses]
        .map((t) => ({
          id: t._id || t.id || Math.random().toString(36).slice(2),

          description: t.description || t.title || t.note || "",

          amount: t.amount != null ? Number(t.amount) : 0,

          date: t.date || t.createdAt || new Date().toISOString(),

          category: t.category || t.type || "Other",

          type: t.type,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setTransactions(allTransactions);

      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- CRUD ---------------- */
  const addTransaction = async (transaction) => {
    try {
      const headers = getAuthHeaders();

      const endpoint =
        transaction.type === "income" ? "income/add" : "expense/add";

      await axios.post(`${API_BASE}/${endpoint}`, transaction, { headers });

      await fetchTransactions();

      return true;
    } catch (err) {
      console.error(err);

      throw err;
    }
  };

  const editTransaction = async (id, transaction) => {
    try {
      const headers = getAuthHeaders();

      const endpoint =
        transaction.type === "income" ? "income/update" : "expense/update";

      await axios.put(`${API_BASE}/${endpoint}/${id}`, transaction, {
        headers,
      });

      await fetchTransactions();

      return true;
    } catch (err) {
      console.error(err);

      throw err;
    }
  };

  const deleteTransaction = async (id, type) => {
    try {
      const headers = getAuthHeaders();

      const endpoint = type === "income" ? "income/delete" : "expense/delete";

      await axios.delete(`${API_BASE}/${endpoint}/${id}`, { headers });

      await fetchTransactions();

      return true;
    } catch (err) {
      console.error(err);

      throw err;
    }
  };

  /* ---------------- EFFECT ---------------- */
  useEffect(() => {
    fetchTransactions();
  }, []);

  /* ---------------- FILTERED ---------------- */
  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, timeFrame),

    [transactions, timeFrame],
  );

  /* ---------------- STATS ---------------- */
  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      allTimeIncome: income,
      allTimeExpenses: expense,
      allTimeSavings: income - expense,
      last30DaysIncome: income,
      last30DaysExpenses: expense,
      last30DaysSavings: income - expense,
      savingsRate:
        income > 0 ? Math.round(((income - expense) / income) * 100) : 0,

      expenseChange: 12,
    };
  }, [transactions]);

  /* ---------------- CATEGORIES ---------------- */
  const topCategories = useMemo(
    () =>
      Object.entries(
        transactions
          .filter((t) => t.type === "expense")
          .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + Number(t.amount);

            return acc;
          }, {}),
      )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),

    [transactions],
  );

  const displayedTransactions = showAllTransactions
    ? transactions
    : transactions.slice(0, 4);

  const outletContext = {
    transactions: filteredTransactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    refreshTransactions: fetchTransactions,
    timeFrame,
    setTimeFrame,
    lastUpdated,
  };

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-gray-50
        via-white
        to-gray-100
      "
    >
      {/* NAVBAR */}
      <Navbar user={user} onLogout={onLogout} />

      {/* SIDEBAR */}
      <Sidebar
        user={user}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />

      {/* MAIN */}
      <main
        className={`
          transition-all
          duration-300
          px-4
          py-6
          sm:px-6
          lg:px-8
          overflow-x-hidden
          ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}
        `}
      >
        {/* HEADER */}
        <div
          className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-4
            mb-8
          "
        >
          <div>
            <h1
              className="
                text-2xl
                sm:text-3xl
                font-bold
                text-gray-800
              "
            >
              Dashboard
            </h1>

            <p
              className="
                text-sm
                sm:text-base
                text-gray-500
                mt-1
              "
            >
              Welcome back 👋
            </p>
          </div>
        </div>

        {/* STATS */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-5
            mb-8
          "
        >
          {/* CARD */}
          <div
            className="
              bg-white
              rounded-3xl
              p-5
              shadow-sm
              border
              border-gray-100
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
              "
            >
              <div>
                <p className="text-gray-500 text-sm">Total Balance</p>

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-gray-800
                    mt-2
                    break-words
                  "
                >
                  ₦{stats.allTimeSavings.toLocaleString()}
                </h2>
              </div>

              <div
                className="
                  p-3
                  rounded-2xl
                  bg-teal-100
                  text-teal-600
                "
              >
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* INCOME */}
          <div
            className="
              bg-white
              rounded-3xl
              p-5
              shadow-sm
              border
              border-gray-100
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
              "
            >
              <div>
                <p className="text-gray-500 text-sm">Income</p>

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-gray-800
                    mt-2
                  "
                >
                  ₦{stats.allTimeIncome.toLocaleString()}
                </h2>
              </div>

              <div
                className="
                  p-3
                  rounded-2xl
                  bg-green-100
                  text-green-600
                "
              >
                <ArrowUp className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* EXPENSE */}
          <div
            className="
              bg-white
              rounded-3xl
              p-5
              shadow-sm
              border
              border-gray-100
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
              "
            >
              <div>
                <p className="text-gray-500 text-sm">Expenses</p>

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-gray-800
                    mt-2
                  "
                >
                  ₦{stats.allTimeExpenses.toLocaleString()}
                </h2>
              </div>

              <div
                className="
                  p-3
                  rounded-2xl
                  bg-orange-100
                  text-orange-600
                "
              >
                <ArrowDown className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* SAVINGS */}
          <div
            className="
              bg-white
              rounded-3xl
              p-5
              shadow-sm
              border
              border-gray-100
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
              "
            >
              <div>
                <p className="text-gray-500 text-sm">Saving Rate</p>

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-gray-800
                    mt-2
                  "
                >
                  {stats.savingsRate}%
                </h2>
              </div>

              <div
                className="
                  p-3
                  rounded-2xl
                  bg-blue-100
                  text-blue-600
                "
              >
                <PiggyBank className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div
          className="
            grid
            grid-cols-1
            xl:grid-cols-3
            gap-6
          "
        >
          {/* LEFT */}
          <div className="xl:col-span-2">
            <div
              className="
                bg-white
                rounded-3xl
                p-4
                sm:p-6
                shadow-sm
                border
                border-gray-100
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-6
                  flex-wrap
                  gap-3
                "
              >
                <h2
                  className="
                    text-lg
                    sm:text-xl
                    font-bold
                    text-gray-800
                    flex
                    items-center
                    gap-2
                  "
                >
                  <TrendingUp className="w-5 h-5 text-teal-500" />
                  Financial Overview
                </h2>
              </div>

              <Outlet context={outletContext} />
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* TRANSACTIONS */}
            <div
              className="
                bg-white
                rounded-3xl
                p-4
                sm:p-6
                shadow-sm
                border
                border-gray-100
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-5
                "
              >
                <h2
                  className="
                    text-lg
                    sm:text-xl
                    font-bold
                    text-gray-800
                    flex
                    items-center
                    gap-2
                  "
                >
                  <Clock className="w-5 h-5 text-purple-500" />
                  Transactions
                </h2>

                <button
                  onClick={fetchTransactions}
                  disabled={loading}
                  className="
                    p-2
                    rounded-xl
                    hover:bg-gray-100
                    transition
                  "
                >
                  <RefreshCw
                    className={`w-5 h-5 text-gray-500 ${
                      loading ? "animate-spin" : ""
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-4">
                {displayedTransactions.map((t) => (
                  <div
                    key={t.id}
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                      p-3
                      rounded-2xl
                      border
                      border-gray-100
                      hover:bg-gray-50
                      transition
                      flex-wrap
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        min-w-0
                      "
                    >
                      <div
                        className={`
                          p-2
                          rounded-xl
                          ${
                            t.type === "income"
                              ? "bg-teal-100 text-teal-600"
                              : "bg-orange-100 text-orange-600"
                          }
                        `}
                      >
                        {CATEGORY_ICONS[t.category] || (
                          <DollarSign className="w-4 h-4" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p
                          className="
                            font-medium
                            text-gray-800
                            truncate
                            max-w-37.5
                            sm:max-w-55
                          "
                        >
                          {t.description}
                        </p>

                        <p
                          className="
                            text-xs
                            text-gray-500
                            mt-1
                          "
                        >
                          {new Date(t.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`
                        font-semibold
                        text-sm
                        ${
                          t.type === "income"
                            ? "text-teal-600"
                            : "text-orange-600"
                        }
                      `}
                    >
                      {t.type === "income" ? "+" : "-"}₦{Number(t.amount)}
                    </span>
                  </div>
                ))}
              </div>

              {transactions.length > 4 && (
                <button
                  onClick={() => setShowAllTransactions(!showAllTransactions)}
                  className="
                    w-full
                    mt-5
                    py-3
                    rounded-2xl
                    bg-gray-50
                    hover:bg-gray-100
                    text-sm
                    font-medium
                    flex
                    items-center
                    justify-center
                    gap-2
                    transition
                  "
                >
                  {showAllTransactions ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      View All
                    </>
                  )}
                </button>
              )}
            </div>

            {/* CATEGORY */}
            <div
              className="
                bg-white
                rounded-3xl
                p-4
                sm:p-6
                shadow-sm
                border
                border-gray-100
              "
            >
              <h2
                className="
                  text-lg
                  sm:text-xl
                  font-bold
                  text-gray-800
                  flex
                  items-center
                  gap-2
                  mb-6
                "
              >
                <PieChart className="w-5 h-5 text-cyan-500" />
                Categories
              </h2>

              <div className="space-y-4">
                {topCategories.map(([category, amount]) => (
                  <div
                    key={category}
                    className="
                        flex
                        items-center
                        justify-between
                        gap-4
                      "
                  >
                    <div
                      className="
                          flex
                          items-center
                          gap-3
                        "
                    >
                      <div
                        className="
                            p-2
                            rounded-xl
                            bg-gray-100
                          "
                      >
                        {CATEGORY_ICONS[category] || (
                          <DollarSign className="w-4 h-4" />
                        )}
                      </div>

                      <span
                        className="
                            text-sm
                            font-medium
                            text-gray-700
                          "
                      >
                        {category}
                      </span>
                    </div>

                    <span
                      className="
                          text-sm
                          font-semibold
                          text-gray-800
                        "
                    >
                      ₦{amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
