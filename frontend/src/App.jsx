import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import axios from "axios";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Profile from "./pages/Profile";
import { API_BASE } from "./utils/api";

/* ---------------- STORAGE ---------------- */
const getTransactionsFromStorage = () => {
  const saved = localStorage.getItem("transactions");
  return saved ? JSON.parse(saved) : [];
};

/* ---------------- PROTECTED ROUTE ---------------- */
const ProtectedRoute = ({ user, children }) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;
  if (!user) return null;

  return children;
};

/* ---------------- SCROLL ---------------- */
const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto", left: 0 });
  }, [location.pathname]);

  return null;
};

/* ---------------- APP ---------------- */
const App = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  /* ---------------- AUTH ---------------- */
  const persistAuth = (userObj, tokenStr, remember = false) => {
    try {
      if (remember) {
        if (userObj) localStorage.setItem("user", JSON.stringify(userObj));
        if (tokenStr) localStorage.setItem("token", tokenStr);
        sessionStorage.clear();
      } else {
        if (userObj) sessionStorage.setItem("user", JSON.stringify(userObj));
        if (tokenStr) sessionStorage.setItem("token", tokenStr);
        localStorage.clear();
      }

      setUser(userObj || null);
    } catch (err) {
      console.error("persistAuth error:", err);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setUser(null);
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const updateUserData = (updatedUser) => {
    setUser(updatedUser);

    const hasLocal = !!localStorage.getItem("token");

    if (hasLocal) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } else {
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  /* ---------------- INIT AUTH ---------------- */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser =
          JSON.parse(localStorage.getItem("user")) ||
          JSON.parse(sessionStorage.getItem("user"));

        const storedToken =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        setUser(storedUser);

        try {
          const res = await axios.get(`${API_BASE}/user/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          setUser(res.data.user);
        } catch (err) {
          console.error("could not fetch user data:", err);

          if (err?.response?.status === 401) {
            clearAuth();
          }
        }
      } catch (error) {
        console.error("Initialization Error:", error);
      } finally {
        setIsLoading(false);
        setTransactions(getTransactionsFromStorage());
      }
    };

    initAuth();
  }, [navigate]); // ✅ FIXED dependency warning

  /* ---------------- TRANSACTIONS ---------------- */
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const handleLogin = (userData, remember = false, tokenFromApi = null) => {
    persistAuth(userData, tokenFromApi, remember);
    navigate("/");
  };

  const handleSignup = (userData, remember = false, tokenFromApi = null) => {
    persistAuth(userData, tokenFromApi, remember);
    navigate("/");
  };

  const addTransaction = (t) => setTransactions((p) => [t, ...p]);

  const editTransaction = (id, updated) =>
    setTransactions((p) =>
      p.map((t) => (t.id === id ? { ...updated, id } : t)),
    );

  const deleteTransaction = (id) =>
    setTransactions((p) => p.filter((t) => t.id !== id));

  const refreshTransactions = () =>
    setTransactions(getTransactionsFromStorage());

  /* ---------------- LOADING ---------------- */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-500 rounded-full" />
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={handleSignup} />} />

        <Route
          element={
            <ProtectedRoute user={user}>
              <Layout
                user={user}
                onLogout={handleLogout}
                transactions={transactions}
                addTransaction={addTransaction}
                editTransaction={editTransaction}
                deleteTransaction={deleteTransaction}
                refreshTransactions={refreshTransactions}
              />
            </ProtectedRoute>
          }
        >
          <Route
            path="/"
            element={
              <Dashboard
                transactions={transactions}
                addTransaction={addTransaction}
                editTransaction={editTransaction}
                deleteTransaction={deleteTransaction}
                refreshTransactions={refreshTransactions}
              />
            }
          />

          <Route
            path="/income"
            element={
              <Income
                {...{
                  transactions,
                  addTransaction,
                  editTransaction,
                  deleteTransaction,
                  refreshTransactions,
                }}
              />
            }
          />

          <Route
            path="/expense"
            element={
              <Expense
                {...{
                  transactions,
                  addTransaction,
                  editTransaction,
                  deleteTransaction,
                  refreshTransactions,
                }}
              />
            }
          />

          <Route
            path="/profile"
            element={<Profile user={user} onUpdateProfile={updateUserData} />}
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to={user ? "/" : "/login"} replace />}
        />
      </Routes>
    </>
  );
};

export default App;
