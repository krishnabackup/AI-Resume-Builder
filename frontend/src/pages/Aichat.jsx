// Aichat.jsx
import { useEffect, useRef, useState } from "react";
import { Bot, SendHorizontal, X } from "lucide-react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import axiosInstance from "./../api/axios";

export default function Aichat() {
  const [open, setOpen] = useState(false);
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
  }, [open]);

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

      setMessages((prev) => [
        ...prev,
        { from: "bot", text: res.data.reply },
      ]);
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
        className="fixed right-8 bottom-8 w-[380px] h-[560px] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 ease-in-out z-[9999]"
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

          <X
            size={18}
            className="cursor-pointer text-slate-500 hover:text-black transition"
            onClick={() => setOpen(false)}
          />
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
                m.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.from === "bot" && (
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Bot size={16} className="text-orange-600" />
                </div>
              )}

              {m.from === "user" && (
                <div className="relative max-w-[250px] text-sm px-4 py-3 bg-orange-600 text-white rounded-2xl rounded-tr-none after:absolute after:top-0 after:right-[-6px] after:content-[''] after:w-0 after:h-0 after:border-t-[8px] after:border-r-[8px] after:border-b-0 after:border-l-0 after:border-solid after:border-t-orange-600 after:border-r-transparent">
                  <ReactMarkdown
                    components={{
                      a: ({ href, children }) => (
                        <Link
                          to={href}
                          className="text-blue-600 font-semibold underline"
                        >
                          {children}
                        </Link>
                      ),
                    }}
                  >
                    {m.text}
                  </ReactMarkdown>
                </div>
              )}

              {m.from === "bot" && (
                <div className="relative max-w-[250px] text-sm px-4 py-3 bg-white text-black border border-slate-200 rounded-2xl rounded-tl-none">
                  {/* Outer border triangle (slate-200) – slightly larger to connect seamlessly */}
                  <div className="absolute top-0 left-[-10px] w-0 h-0 border-t-[10px] border-l-[10px] border-b-0 border-r-0 border-solid border-t-slate-200 border-l-transparent"></div>
                  {/* Inner fill triangle (white) – creates the 1px border effect */}
                  <div className="absolute top-[1px] left-[-8px] w-0 h-0 border-t-[8px] border-l-[8px] border-b-0 border-r-0 border-solid border-t-white border-l-transparent"></div>
                  
                  <ReactMarkdown
                    components={{
                      a: ({ href, children }) => (
                        <Link
                          to={href}
                          className="text-blue-600 font-semibold underline"
                        >
                          {children}
                        </Link>
                      ),
                    }}
                  >
                    {m.text}
                  </ReactMarkdown>
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
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
        </div>

        {/* INPUT */}
        <div className="flex gap-2 p-4 border-t border-slate-100 bg-white rounded-b-2xl">
          <input
            ref={inputRef}
            value={input}
            className="flex-1 p-2.5 bg-slate-100 text-sm rounded-xl outline-none border border-transparent focus:border-slate-300 transition"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about resume..."
          />
          <button
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl transition disabled:opacity-[0.6] disabled:cursor-not-allowed disabled:pointer-events-none"
            disabled={responseLoading || !input.trim()}
            onClick={() => sendMessage()}
          >
            <SendHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* FLOATING BUTTON */}
      <button
        ref={chatbotBtnRef}
        className="fixed right-10 bottom-10 z-50 bg-orange-600 hover:bg-orange-700 p-4 text-white rounded-full shadow-lg transition"
        onClick={() => setOpen(true)}
      >
        <Bot size={28} />
      </button>
    </>
  );
}