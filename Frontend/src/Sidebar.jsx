import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import {
  fetchThreadMessages,
  deleteThread as deleteThreadApi,
} from "./api.js";
import Logo from "./components/Logo.jsx";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setCurrThreadId,
    setPrevChats,
    setError,
    refreshThreads,
  } = useContext(MyContext);

  useEffect(() => {
    refreshThreads();
  }, [refreshThreads, currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setError(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (threadId) => {
    if (threadId === currThreadId) return;

    setCurrThreadId(threadId);
    setError(null);

    try {
      const messages = await fetchThreadMessages(threadId);
      setPrevChats(Array.isArray(messages) ? messages : []);
      setNewChat(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load chat history");
      setPrevChats([]);
    }
  };

  const deleteThread = async (threadId, e) => {
    e.stopPropagation();

    try {
      await deleteThreadApi(threadId);
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete chat");
    }
  };

  return (
    <section className="sidebar">
      <button type="button" onClick={createNewChat} className="newChatBtn">
        <Logo size="sm" />
        <span>New chat</span>
        <i className="fa-solid fa-pen-to-square"></i>
      </button>

      <div className="historySection">
        <h2 className="historyTitle">Chat history</h2>
        <ul className="history">
          {allThreads.length === 0 ? (
            <li className="emptyHistory">No chats yet</li>
          ) : (
            allThreads.map((thread) => (
              <li
                key={thread.threadId}
                onClick={() => changeThread(thread.threadId)}
                className={
                  thread.threadId === currThreadId ? "highlighted" : ""
                }
                title={thread.title}
              >
                <span className="threadTitle">{thread.title}</span>
                <i
                  className="fa-solid fa-trash"
                  onClick={(e) => deleteThread(thread.threadId, e)}
                ></i>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="sign">
        <p>By TriBrains &hearts;</p>
      </div>
    </section>
  );
}

export default Sidebar;
