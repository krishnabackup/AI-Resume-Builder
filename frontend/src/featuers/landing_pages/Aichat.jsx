import { useEffect, useRef, useState } from "react";
import { Bot, SendHorizontal, Trash2, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import axiosInstance from "../../api/axios";
import chatbotIcon from "../../assets/chatbot_image.png";

export default function Aichat() {
  const navigate = useNavigate();
  const location = useLocation();
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

  // Listen for ATS scan complete → auto open chatbot with edit options
  useEffect(() => {
    const handleAtsScanComplete = (e) => {
      const score = e.detail?.score ?? "";
      setOpen(true);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: `✅ **ATS Scan Complete! Your score: ${score}/100**\n\nWould you like to improve your resume using the AI Resume Builder?`,
          actions: [
            {
              label: "✏️ Continue with same data",
              onClick: "ats-same-data",
            },
            {
              label: "🆕 Build new resume",
              onClick: "ats-new-resume",
            },
          ],
        },
      ]);
    };
    window.addEventListener("ats-scan-complete", handleAtsScanComplete);
    return () => window.removeEventListener("ats-scan-complete", handleAtsScanComplete);
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
    const lower = text.toLowerCase();

    // Admin switch intercept — works even from user dashboard
    if (lower.includes("go to admin") || lower.includes("switch to admin") || lower.includes("admin dashboard") || lower.includes("admin dashbord") || lower.includes("super admin") || lower.includes("admin mode")) {
      setMessages((prev) => [...prev,
        { from: "user", text },
        { from: "bot", text: "✅ Taking you to the Admin Dashboard!" }
      ]);
      setInput("");
      setTimeout(() => { setOpen(false); navigate("/admin"); }, 1000);
      return;
    }

    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setResponseLoading(true);

    // Check if user is asking about their uploaded resume on ATS checker page
    const atsKeywords = ["improve my resume", "how to improve", "ats score", "missing keywords",
      "improve score", "resume feedback", "what's wrong", "whats wrong", "fix my resume",
      "resume suggestions", "improve my ats", "analyze my resume", "resume analysis",
      "how can i improve", "what should i improve", "resume issues", "ats feedback",
      "uploaded resume", "my resume", "improve uploaded", "resume score", "resume problem",
      "resume mistake", "resume error", "keyword missing", "low score"];
    const isAtsQuestion = atsKeywords.some(k => lower.includes(k));

    // Check if user wants to edit their resume
    const editKeywords = ["edit my resume", "edit resume", "can i edit", "how to edit",
      "update my resume", "change my resume", "modify resume", "fix resume",
      "edit this", "update resume", "make changes", "change resume"];
    const isEditQuestion = editKeywords.some(k => lower.includes(k));
    const storedScan = sessionStorage.getItem("ats_analysis_result");

    if (isEditQuestion) {
      setInput("");
      setMessages((prev) => [...prev, {
        from: "bot",
        text: `✏️ **Why Edit with AI Resume Builder?**

Editing your resume with our **AI Resume Builder** gives you a major advantage over manual editing. Here's why:

---

### 🤖 AI-Powered Advantages

- **📝 Smart Summary Generation** — AI writes a professional summary tailored to your experience and skills automatically.

- **💼 Experience Enhancement** — Transforms weak job descriptions into strong, ATS-optimized, action-oriented bullet points.

- **🎯 Keyword Optimization** — AI identifies and adds missing keywords that recruiters and ATS systems look for.

- **📊 Real-time ATS Score** — See your ATS score improve as you make changes before downloading.

- **🎨 Professional Templates** — Choose from premium ATS-friendly templates that pass screening systems.

- **⚡ One-Click Enhance** — Every section has an "Enhance with AI" button for instant improvement.

- **✅ Spelling & Grammar** — AI catches errors and suggests professional language automatically.

- **📄 Instant PDF Export** — Download a perfectly formatted resume in one click.

---

💡 **Pro Tip:** After editing with AI, re-upload here to see your improved ATS score!

Choose where to edit your resume:`,
        actions: [
          { label: "📝 Open AI Resume Builder", path: "/user/resume-builder" },
          { label: "📄 Open CV Builder", path: "/user/cv" },
        ]
      }]);
      setResponseLoading(false);
      return;
    }

    if (isAtsQuestion && !storedScan) {
      // If asking how to improve without a scan, still show AI builder benefits
      const improveKeywords = ["how to improve", "improve ats", "improve score", "increase score",
        "boost score", "increase ats", "boost ats", "get better score", "higher score",
        "improve my ats", "fix my ats", "how can i improve"];
      const isImproveQuestion = improveKeywords.some(k => lower.includes(k));
      if (isImproveQuestion) {
        setMessages((prev) => [...prev, {
          from: "bot",
          text: "📄 Upload your resume first to get your ATS score, then use the **AI Resume Builder** to improve it!",
          actions: [
            { label: "🚀 Open AI Resume Builder", path: "/user/resume-builder" },
          ]
        }]);
      } else {
        setMessages((prev) => [...prev, { from: "bot", text: "📄 Please upload your resume on the [ATS Checker](/user/ats-checker) page first, then ask me to analyze it!" }]);
      }
      setResponseLoading(false);
      return;
    }

    if (isAtsQuestion && storedScan) {
      // If asking HOW TO IMPROVE → show popup + redirect to AI builder
      const improveKeywords = ["how to improve", "improve ats", "improve score", "increase score",
        "boost score", "increase ats", "boost ats", "get better score", "higher score",
        "improve my ats", "fix my ats", "how can i improve"];
      const isImproveQuestion = improveKeywords.some(k => lower.includes(k));

      if (isImproveQuestion) {
        setMessages((prev) => [...prev, {
          from: "bot",
          text: `🚀 **How to Improve Your ATS Score**

The fastest way to improve your ATS score is to use the **AI Resume Builder**. Here's what it does for you:

---

### ✨ AI Resume Builder Advantages

- **🎯 Keyword Optimization** — Automatically adds the missing keywords ATS systems scan for, boosting your match rate instantly.

- **📝 AI Summary Generation** — Rewrites your professional summary to be concise, impactful, and ATS-friendly.

- **💼 Experience Enhancement** — Converts weak job descriptions into strong, action-verb-driven bullet points.

- **📊 Live ATS Score Preview** — Watch your score improve in real-time as you make AI-powered edits.

- **🎨 ATS-Safe Templates** — Choose from professionally designed templates that pass all ATS formatting checks.

- **⚡ One-Click Enhance** — Every section has an instant AI enhance button — no manual rewriting needed.

- **✅ Spell & Grammar Check** — AI catches errors that lower your score automatically.

---

💡 **Result:** Most users improve their ATS score by **20-40 points** after using the AI Resume Builder!`,
          actions: [
            { label: "🚀 Improve with AI Resume Builder", path: "/user/resume-builder" },
            { label: "📄 Try CV Builder", path: "/user/cv" },
          ]
        }]);
        setResponseLoading(false);
        return;
      }
      try {
        const scanData = JSON.parse(storedScan);
        const res = await axiosInstance.post("/api/chatbot/ats-advice", {
          message: text,
          scanData,
        });
        const reply = res.data;
        setMessages((prev) => [...prev, { from: "bot", text: "" }]);
        let idx = 0;
        const interval = setInterval(() => {
          idx += 1;
          setMessages((prev) => {
            const msgs = [...prev];
            msgs[msgs.length - 1].text = reply.text.slice(0, idx);
            return msgs;
          });
          if (idx >= reply.text.length) clearInterval(interval);
        }, 20);
      } catch (err) {
        console.error("ATS advice error:", err);
        setMessages((prev) => [...prev, { from: "bot", text: "Something went wrong analyzing your resume. Please try again." }]);
      }
      setResponseLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.post(location.pathname === "/admin"
    ? "/api/chatbot/admin-chat"
    : "/api/chatbot/chat", {
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
        className="fixed right-8 md:bottom-8 bottom-16 md:w-[380px] w-[350px] h-[560px] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 ease-in-out z-[9999]"
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
              AI Assistant
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
                  {/* Action buttons for edit/navigate options */}
                  {m.actions && m.actions.length > 0 && (
                    <div className="flex flex-col gap-2 mt-3">
                      {m.actions.map((action, ai) => (
                        <button
                          key={ai}
                          onClick={() => {
                            if (action.onClick === "ats-same-data") {
                              // Map extractedData → resumeFormData and navigate
                              const raw = sessionStorage.getItem("ats_extracted_data");
                              if (raw) {
                                try {
                                  const d = JSON.parse(raw);
                                  const mapped = {
                                    fullName: d.fullName || d.name || "",
                                    email: d.email || "",
                                    phone: d.phone || "",
                                    location: d.location || "",
                                    linkedin: d.linkedin || "",
                                    website: d.website || "",
                                    summary: d.summary || "",
                                    experience: (d.experience || []).map((e, i) => ({
                                      id: i + 1,
                                      title: e.title || "",
                                      company: e.company || "",
                                      location: e.location || "",
                                      startDate: e.startDate || "",
                                      endDate: e.endDate || "",
                                      description: e.description || "",
                                    })),
                                    education: (d.education || []).map((e, i) => ({
                                      id: i + 1,
                                      school: e.school || "",
                                      degree: e.degree || "",
                                      location: e.location || "",
                                      startDate: e.startDate || "",
                                      graduationDate: e.graduationDate || e.endDate || "",
                                      gpa: e.gpa || "",
                                    })),
                                    skills: {
                                      technical: Array.isArray(d.skills?.technical) ? d.skills.technical : [],
                                      soft: Array.isArray(d.skills?.soft) ? d.skills.soft : [],
                                    },
                                    projects: (d.projects || []).map((p, i) => ({
                                      id: i + 1,
                                      name: p.name || "",
                                      description: p.description || "",
                                      technologies: p.technologies || "",
                                      link: {
                                        github: p.link?.github || "",
                                        liveLink: p.link?.liveLink || "",
                                        other: p.link?.other || "",
                                      },
                                    })),
                                    certifications: (d.certifications || []).map((c, i) => ({
                                      id: i + 1,
                                      name: c.name || "",
                                      issuer: c.issuer || "",
                                      date: c.date || "",
                                      link: c.link || "",
                                    })),
                                  };
                                  localStorage.setItem("resumeFormData", JSON.stringify(mapped));
                                  console.log("✅ Mapped resume data saved:", mapped);
                                } catch (err) {
                                  console.error("Failed to map extracted data:", err);
                                }
                              } else {
                                console.warn("No ats_extracted_data found in sessionStorage");
                              }
                              setOpen(false);
                              // Small delay to ensure localStorage is written before navigation
                              setTimeout(() => navigate("/user/resume-builder"), 100);
                            } else if (action.onClick === "ats-new-resume") {
                              localStorage.removeItem("resumeFormData");
                              setOpen(false);
                              navigate("/user/resume-builder");
                            } else if (action.path) {
                              setOpen(false);
                              navigate(action.path);
                            }
                          }}
                          className="w-full px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl transition text-left flex items-center gap-2"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                  <hr className="mt-4" />
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