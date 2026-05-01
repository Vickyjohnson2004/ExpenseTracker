import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import { useEffect, useState, useCallback } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import axios from "axios";

const API_URL = "http://localhost:4000";

const getTransactionsFromStorage = () => {
  const saved = localStorage.getItem("transactions");
  return saved ? JSON.parse(saved) : [];
};

const ProtectedRoute = ({ user, isLoading, children }) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  // If we are still loading the user from storage/API, show nothing or a spinner
  if (isLoading) return null;

  // Only redirect if loading is finished and we definitely have no user/token
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto", left: 0 });
  }, [pathname]);
  return null;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const persistAuth = useCallback((userObj, tokenStr, remember = false) => {
    try {
      const storage = remember ? localStorage : sessionStorage;
      const otherStorage = remember ? sessionStorage : localStorage;

      if (userObj) storage.setItem("user", JSON.stringify(userObj));
      if (tokenStr) storage.setItem("token", tokenStr);

      otherStorage.removeItem("user");
      otherStorage.removeItem("token");

      setUser(userObj || null);
      setToken(tokenStr || null);
    } catch (err) {
      console.error("persistAuth error:", err);
    }
  }, []);

  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const updateUserData = (updatedUser) => {
    setUser(updatedUser);
    if (localStorage.getItem("token")) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } else {
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  // --- FIX: The IIFE (Immediately Invoked Function Expression) ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        const localUserRaw = localStorage.getItem("user");
        const sessionUserRaw = sessionStorage.getItem("user");
        const localToken = localStorage.getItem("token");
        const sessionToken = sessionStorage.getItem("token");

        const storedUser = localUserRaw
          ? JSON.parse(localUserRaw)
          : sessionUserRaw
            ? JSON.parse(sessionUserRaw)
            : null;
        const storedToken = localToken || sessionToken;
        const isPersistent = !!localToken;

        if (storedToken) {
          // Set initial local state so UI updates immediately
          setUser(storedUser);
          setToken(storedToken);

          // Optional: Verify token with backend
          try {
            const res = await axios.get(`${API_URL}/api/user/me`, {
              headers: { Authorization: `Bearer ${storedToken}` },
            });
            persistAuth(res.data, storedToken, isPersistent);
          } catch (fetchErr) {
            console.error("Session expired or invalid:", fetchErr);
            // clearAuth(); // Uncomment if you want to force logout on failed verify
          }
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setTransactions(getTransactionsFromStorage());
        setIsLoading(false);
      }
    };

    initAuth();
  }, [persistAuth]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }
  }, [transactions, isLoading]);

  const handleLogin = (userData, remember, tokenFromApi) => {
    persistAuth(userData, tokenFromApi, remember);
    navigate("/");
  };

  const handleSignup = (userData, remember, tokenFromApi) => {
    persistAuth(userData, tokenFromApi, remember);
    navigate("/");
  };

  const addTransaction = (newTx) => setTransactions((p) => [newTx, ...p]);
  const editTransaction = (id, updated) =>
    setTransactions((p) =>
      p.map((t) => (t.id === id ? { ...updated, id } : t)),
    );
  const deleteTransaction = (id) =>
    setTransactions((p) => p.filter((t) => t.id !== id));
  const refreshTransactions = () =>
    setTransactions(getTransactionsFromStorage());

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={handleSignup} />} />

        <Route
          element={
            <ProtectedRoute user={user} isLoading={isLoading}>
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
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
