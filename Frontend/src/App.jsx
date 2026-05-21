import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { AuthProvider } from "./AuthContext.jsx";
import AuthGate from "./components/AuthGate.jsx";
import { useState, useCallback } from "react";
import { v1 as uuidv1 } from "uuid";
import { fetchThreads } from "./api.js";

function AppContent() {
  const [prompt, setPrompt] = useState("");
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [error, setError] = useState(null);

  const refreshThreads = useCallback(async () => {
    try {
      const threads = await fetchThreads();
      setAllThreads(threads);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const providerValues = {
    prompt,
    setPrompt,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads,
    error,
    setError,
    refreshThreads,
  };

  return (
    <MyContext.Provider value={providerValues}>
      <div className="app">
        <Sidebar />
        <ChatWindow />
      </div>
    </MyContext.Provider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthGate>
        <AppContent />
      </AuthGate>
    </AuthProvider>
  );
}

export default App;
