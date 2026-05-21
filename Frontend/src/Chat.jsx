import "./Chat.css";
import { useContext } from "react";
import { MyContext } from "./MyContext.jsx";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChats, error } = useContext(MyContext);

  return (
    <>
      {newChat && prevChats.length === 0 && (
        <h1 className="welcome">Start a New Chat!</h1>
      )}

      {error && <p className="chatError">{error}</p>}

      <div className="chats">
        {prevChats.map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={`${chat.role}-${idx}`}
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {chat.content}
              </ReactMarkdown>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Chat;
