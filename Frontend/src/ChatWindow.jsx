import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { sendChat } from "./api.js";
import { useAuth } from "./AuthContext.jsx";
import SettingsModal from "./components/SettingsModal.jsx";
import UpgradeModal from "./components/UpgradeModal.jsx";
import Logo from "./components/Logo.jsx";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    currThreadId,
    setPrevChats,
    setNewChat,
    setError,
    refreshThreads,
  } = useContext(MyContext);
  const { user, usage, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleSend = async () => {
    const message = prompt.trim();
    if (!message || loading) return;

    setNewChat(false);
    setError(null);
    setPrompt("");
    setLoading(true);

    setPrevChats((prev) => [...prev, { role: "user", content: message }]);

    try {
      const reply = await sendChat(currThreadId, message);
      setPrevChats((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
      await refreshThreads();
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to get a response. Is the backend running?"
      );
      setPrevChats((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const usageLabel =
    usage?.dailyLimit === null
      ? "Unlimited"
      : `${usage?.messagesToday ?? 0}/${usage?.dailyLimit}`;

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span className="navTitle">
          <Logo size="sm" />
          SigmaGPT
          <span className={`planBadge ${user?.plan}`}>{user?.plan}</span>
        </span>
        <div className="navRight">
          <span className="usageBadge">{usageLabel} today</span>
          <div className="userIconDiv" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="userIcon">
              <i className="fa-solid fa-user"></i>
            </span>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="dropDown">
          <div className="dropDownUser">
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>
          <div
            className="dropDownItem"
            onClick={() => {
              setMenuOpen(false);
              setShowSettings(true);
            }}
          >
            <i className="fa-solid fa-gear"></i> Settings
          </div>
          <div
            className="dropDownItem"
            onClick={() => {
              setMenuOpen(false);
              setShowUpgrade(true);
            }}
          >
            <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan
          </div>
          <div
            className="dropDownItem"
            onClick={() => {
              logout();
              setMenuOpen(false);
            }}
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
          </div>
        </div>
      )}

      <Chat />

      {loading && (
        <div className="loader">
          <ScaleLoader color="#fff" loading={loading} />
        </div>
      )}

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <div
            id="submit"
            onClick={handleSend}
            className={loading ? "disabled" : ""}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          SigmaGPT can make mistakes. Check important info.
        </p>
      </div>

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onOpenUpgrade={() => setShowUpgrade(true)}
        />
      )}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}

export default ChatWindow;
