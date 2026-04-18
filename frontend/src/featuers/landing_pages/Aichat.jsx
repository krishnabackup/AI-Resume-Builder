import { useEffect, useRef, useState } from "react";
import { Bot, SendHorizontal, Trash2, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import axiosInstance from "../../api/axios";
import chatbotIcon from "../../assets/chatbot_image.png";

export default function Aichat() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState(() => {
    const savedMessages = sessionStorage.getItem("chatMessages");
    return savedMessages
      ? JSON.parse(savedMessages)
      : [
          {
            from: "bot",
            text: "Hi! I'm the UpToSkills AI Resume Assistant.\nHow can I help you today?",
          },
        ];
  });
  const [input, setInput] = useState("");
  const [responseLoading, setResponseLoading] = useState(false);

  const chatbotBtnRef = useRef(null);
  const chatbotContainerRef = useRef(null);
  const messagesRef = useRef(null);
  const inputRef = useRef(null);

  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  useEffect(() => {
    sessionStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showDeleteModal) return;

      if (
        open &&
        chatbotContainerRef.current &&
        chatbotBtnRef.current &&
        !chatbotContainerRef.current.contains(e.target) &&
        !chatbotBtnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, showDeleteModal]);

  // hotkey to open/close chatbot
  useEffect(() => {
    const listener = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  async function sendMessage(customText) {
    if (!customText && !input.trim()) return;

    const text = customText ? customText : input.trim();

    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setResponseLoading(true);

    try {
      const res = await axiosInstance.post("/api/chatbot/chat", {
        message: text,
        prevMsg: messages,
        isLoggedIn,
      });
      // add an empty bot message that we'll fill in one char at a time
      setMessages((prev) => [...prev, { from: "bot", text: "" }]);
      console.log(res);

      const reply = res.data;
      let idx = 0;
      const typingInterval = setInterval(() => {
        idx += 1;
        setMessages((prev) => {
          const msgs = [...prev];
          msgs[msgs.length - 1].text = reply.text.slice(0, idx);
          return msgs;
        });
        if (idx >= reply.text.length) {
          clearInterval(typingInterval);
        }
      }, 20);
      if (reply.mode === "navigation" && reply.path) {
        setTimeout(() => {
          setOpen(false);
          navigate(reply.path);
        }, 1000);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Something went wrong! Please try again later.",
        },
      ]);
    }

    setResponseLoading(false);
  }

  function clearChat() {
    setMessages([
      {
        from: "bot",
        text: "Hi! I'm the UpToSkills AI Resume Assistant.\nHow can I help you today?",
      },
    ]);
    sessionStorage.setItem(
      "chatMessages",
      JSON.stringify([
        {
          from: "bot",
          text: "Hi! I'm the UpToSkills AI Resume Assistant.\nHow can I help you today?",
        },
      ]),
    );
    setShowDeleteModal(false);
    setOpen(false);
  }

  const suggestions = [
    "How can I improve my resume summary?",
    "What keywords should I add for better ATS score?",
    "How can I make my bullet points more impactful?",
    "What should freshers include in their resume?",
  ];

  return (
    <>
      {/* CHAT CONTAINER */}
      <div
        ref={chatbotContainerRef}
        className="fixed sm:right-8 right-2 md:bottom-8 sm:bottom-16 bottom-4 md:w-[380px] w-[350px] h-[560px] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 ease-in-out z-[9999]"
        style={{
          transform: open ? "translateX(0)" : "translateX(120%)",
          opacity: open ? 1 : 0,
        }}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 rounded-t-2xl">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              AI Resume Assistant
            </div>
            <span className="text-[11px] text-slate-400">
              Powered by UpToSkills AI
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={messages.length <= 1}
              className="cursor-pointer text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-1.5 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              title="Clear chat"
            >
              <Trash2 size={16} />
            </button>
            <X
              size={18}
              className="cursor-pointer text-slate-500 hover:text-black transition"
              onClick={() => setOpen(false)}
            />
          </div>
        </div>

        {/* MESSAGES - scrollbar hidden */}
        <div
          ref={messagesRef}
          className="flex-1 flex flex-col gap-4 p-4 overflow-y-auto scrollbar-hide"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-2 ${
                m.from === "user" ? "justify-end" : "flex-col items-start"
              }`}
            >
              {m.from === "bot" && (
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src={chatbotIcon}
                    alt="Chatbot"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {m.from === "user" && (
                <div className="relative max-w-[250px] text-sm px-4 py-3 bg-orange-600 text-white rounded-2xl rounded-tr-none after:absolute after:top-0 after:right-[-6px] after:content-[''] after:w-0 after:h-0 after:border-t-[8px] after:border-r-[8px] after:border-b-0 after:border-l-0 after:border-solid after:border-t-orange-600 after:border-r-transparent">
                  {m.text}
                </div>
              )}

              {m.from === "bot" && (
                <div className="relative group w-full max-w-full text-sm px-4 py-3 bg-white text-black rounded-2xl ai-bot-no-border">
                  <ReactMarkdown
                    components={{
                      a: ({ href, children }) => (
                        <Link
                          to={href}
                          className="block text-blue-600 font-semibold"
                        >
                          {children}
                        </Link>
                      ),
                      h1: ({ children }) => (
                        <h1 className="text-3xl font-bold mt-2 mb-1">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-2xl font-bold mt-2 mb-1">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-bold mt-2 mb-4">
                          {children}
                        </h3>
                      ),
                      li: ({ children }) => (
                        <li className="mb-4">{children}</li>
                      ),
                      hr: () => <hr className="my-4" />,
                      p: ({ children }) => (
                        <p className="mb-3 last:mb-0">{children}</p>
                      ),
                    }}
                  >
                    {m.text}
                  </ReactMarkdown>
                  <hr className="mt-8" />
                </div>
              )}
            </div>
          ))}

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="mt-2">
              <p className="text-xs text-slate-500 mb-2 font-medium">
                Suggestions
              </p>

              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(s)}
                    className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 rounded-full border border-slate-200 transition-all duration-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Typing */}
          {responseLoading && (
            <div className="flex gap-2 items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Bot size={16} className="text-orange-600" />
              </div>
              <div className="flex items-center gap-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:120ms]"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:240ms]"></span>
              </div>
            </div>
          )}
        </div>

        {/* INPUT */}
        <div className="flex gap-2 p-4 border-t border-slate-100 bg-white rounded-b-2xl">
          <input
            ref={inputRef}
            value={input}
            name="chatBotMessage"
            className="flex-1 p-2.5 bg-slate-100 text-sm rounded-xl outline-none border border-transparent focus:border-slate-300 transition"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about resume..."
          />
          <button
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={responseLoading || !input.trim()}
            onClick={() => sendMessage()}
          >
            <SendHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* FLOATING BUTTON */}
      <div className="fixed right-10 bottom-10 z-50 group">
        <button
          ref={chatbotBtnRef}
          className="bg-orange-600 hover:bg-orange-700 p-4 text-white rounded-full shadow-lg transition"
          onClick={() => setOpen(true)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Bot size={30} />
        </button>
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full right-0 mb-3 bg-slate-900 text-white text-sm font-medium px-3 py-2 rounded-lg whitespace-nowrap shadow-lg z-50 animate-fadeIn pointer-events-none">
            <div className="flex flex-col gap-1">
              <span>AI Chatbot</span>
              <span className="text-xs text-gray-300">Ctrl + Shift + C</span>
            </div>
            <div className="absolute top-full right-4 -mr-1 border-4 border-transparent border-t-slate-900"></div>
          </div>
        )}
      </div>

      {/* CLEAR CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDeleteModal(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Clear Conversation?
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to clear all messages? This action cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition"
                onClick={clearChat}
              >
                Clear and Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
