import "./AuthGate.css";
import { useState } from "react";
import { useAuth } from "../AuthContext.jsx";
import SettingsModal from "./SettingsModal.jsx";
import Logo from "./Logo.jsx";

function AuthGate({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="authGate">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="authGate">
        <div className="authGateCard">
          <Logo size="lg" className="authLogo" />
          <h1>SigmaGPT</h1>
          <p>Sign in to start chatting with AI and save your history.</p>
          <button
            type="button"
            className="btnPrimary"
            onClick={() => setShowAuth(true)}
          >
            Sign in / Sign up
          </button>
        </div>
        {showAuth && <SettingsModal onClose={() => setShowAuth(false)} />}
      </div>
    );
  }

  return children;
}

export default AuthGate;
