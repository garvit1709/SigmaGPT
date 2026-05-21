import { useState } from "react";
import "./Modal.css";
import { useAuth } from "../AuthContext.jsx";

function SettingsModal({ onClose, onOpenUpgrade }) {
  const { user, usage, login, register, logout } = useAuth();
  const [tab, setTab] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (tab === "signin") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    const limitLabel =
      usage?.dailyLimit === null
        ? "Unlimited"
        : `${usage?.messagesToday ?? 0} / ${usage?.dailyLimit}`;

    return (
      <div className="modalOverlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modalHeader">
            <h2>Settings</h2>
            <button type="button" className="modalClose" onClick={onClose}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="modalBody">
            <div className="accountInfo">
              <div className="accountRow">
                <span>Name</span>
                <span>{user.name}</span>
              </div>
              <div className="accountRow">
                <span>Email</span>
                <span>{user.email}</span>
              </div>
              <div className="accountRow">
                <span>Plan</span>
                <span className={`planBadge ${user.plan}`}>{user.plan}</span>
              </div>
              <div className="accountRow">
                <span>Messages today</span>
                <span>{limitLabel}</span>
              </div>
            </div>
            <button
              type="button"
              className="btnPrimary"
              style={{ marginBottom: "0.75rem" }}
              onClick={() => {
                onClose();
                onOpenUpgrade?.();
              }}
            >
              Upgrade plan
            </button>
            <button
              type="button"
              className="btnPlan"
              onClick={() => {
                logout();
                onClose();
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h2>Sign in to SigmaGPT</h2>
          <button type="button" className="modalClose" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="modalBody">
          <div className="modalTabs">
            <button
              type="button"
              className={`modalTab ${tab === "signin" ? "active" : ""}`}
              onClick={() => setTab("signin")}
            >
              Sign in
            </button>
            <button
              type="button"
              className={`modalTab ${tab === "signup" ? "active" : ""}`}
              onClick={() => setTab("signup")}
            >
              Sign up
            </button>
          </div>

          {error && <p className="formError">{error}</p>}

          <form onSubmit={handleSubmit}>
            {tab === "signup" && (
              <div className="formGroup">
                <label>Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
            )}
            <div className="formGroup">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="formGroup">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                minLength={6}
                required
              />
            </div>
            <button type="submit" className="btnPrimary" disabled={loading}>
              {loading
                ? "Please wait..."
                : tab === "signin"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
