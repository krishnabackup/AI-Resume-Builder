import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UpToSkillsImg from "../../assets/logo6.png";
import { ChevronDown } from "lucide-react";
import axiosInstance from "../../api/axios";
// Import React Icons
import { SiYoutube, SiInstagram, SiLinkedin, SiFacebook } from "react-icons/si";
import { FaArrowRight } from "react-icons/fa6";
import { Loader2, Check, Mail, AlertCircle } from "lucide-react";

function Footer() {
  const navigate = useNavigate();

  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };
  // Updated socialLinks with responsive icon sizes
  const socialLinks = [
    {
      icon: <SiYoutube className="w-3 h-3 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />,
      bgColor: "bg-[#ff0000]",
      href: "https://www.youtube.com/channel/UCJzITNWKW5njk0AWkEZxSrw",
    },
    {
      icon: <SiInstagram className="w-3 h-3 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />,
      bgColor: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
      href: "https://www.instagram.com/uptoskills?utm_medium=copy_link",
    },
    {
      icon: <SiLinkedin className="w-3 h-3 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />,
      bgColor: "bg-[#0077b5]",
      href: "https://www.linkedin.com/company/uptoskills/posts/?feedView=all",
    },
    {
      icon: <SiFacebook className="w-3 h-3 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />,
      bgColor: "bg-[#1877f2]",
      href: "https://www.facebook.com/Uptoskills/",
    },
  ];

  /* Newsletter Logic */
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setStatus("invalid_email");
      return;
    }
    setStatus("loading");
    
    try {
      const response = await axiosInstance.post("/api/newsletter/subscribe", { email });
      if (response.status === 200) {
        setStatus("success");
        setEmail("");
        setTimeout(() => setStatus("idle"), 3000); // Reset after 3s
      } else {
        setStatus("server_error");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setStatus("server_error");
    }
  };

  // Responsive header and link styles
  const headerStyle =
    "text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] font-black uppercase tracking-wider text-[#1a2e52] mb-2 sm:mb-3 md:mb-5 flex items-center gap-2";
  const linkStyle =
    "text-[11px] sm:text-xs md:text-sm text-gray-500 hover:text-[#e65100] transition-all duration-300 cursor-pointer flex items-center py-1";

  return (
    <footer className="relative font-['Outfit'] bg-white border-t border-gray-100 overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-50 blur-3xl -z-10 opacity-40"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-orange-50 blur-3xl -z-10 opacity-40"></div>

      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-6 sm:pt-8 md:pt-12 lg:pt-16 pb-4 sm:pb-6 md:pb-8 lg:pb-10">
        {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 5 columns */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10 lg:mb-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* 1. BRAND & NEWSLETTER - Full width on mobile, 2 columns on tablet */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left col-span-1 sm:col-span-2 md:row-span-2 lg:row-span-1 lg:col-span-1 h-full">
            <img
              src={UpToSkillsImg}
              alt="Logo"
              className="w-20 sm:w-24 md:w-28 lg:w-32 mb-3 sm:mb-4 transition-opacity cursor-pointer hover:opacity-80"
              onClick={() => navigate("/")}
            />
            <p className="text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] leading-relaxed text-gray-400 font-medium mb-3 sm:mb-4 md:mb-6 max-w-xs sm:max-w-sm mx-auto md:mx-0">
              Empowering <span className="font-bold text-blue-500">skills</span>
              , connecting{" "}
              <span className="font-bold text-orange-500">talent</span>{" "}
              worldwide.
            </p>

            {/* Social Icons with responsive sizing */}
            <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 md:mb-8">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${social.bgColor} w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg sm:rounded-xl text-white shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <div className="mt-1 sm:mt-2 w-full max-w-[240px] sm:max-w-[280px] mx-auto md:mx-0">
              <h4 className="text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#1a2e52] mb-2 sm:mb-3">
                Stay Connected
              </h4>

              <form
                onSubmit={handleSubscribe}
                className="relative w-full"
                noValidate
              >
                <div
                  className={`
                  flex items-center p-1 sm:p-1.5 border rounded-lg sm:rounded-xl transition-all duration-300 bg-gray-50
                  ${status === "invalid_email" || status === "server_error" ? "border-red-200 ring-2 ring-red-500/10" : "border-gray-200 focus-within:ring-2 focus-within:ring-[#0077cc]/10 focus-within:border-[#0077cc]"}
                  ${status === "success" ? "border-green-200 bg-green-50" : ""}
                `}
                >
                  {/* Icon */}
                  <div className="pl-1.5 sm:pl-2 text-gray-400">
                    {status === "success" ? (
                      <Check size={14} className="text-green-500" />
                    ) : status === "invalid_email" || status === "server_error" ? (
                      <AlertCircle size={14} className="text-red-500" />
                    ) : (
                      <Mail size={14} />
                    )}
                  </div>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "invalid_email" || status === "server_error") setStatus("idle");
                    }}
                    disabled={status === "loading" || status === "success"}
                    placeholder={
                      status === "success" ? "Subscribed!" : "Enter your email"
                    }
                    className={`
                      w-full px-2 sm:px-3 text-[10px] sm:text-[12px] bg-transparent outline-none py-1 sm:py-1.5 placeholder-gray-400 font-medium
                      ${status === "success" ? "text-green-700" : "text-gray-700"}
                    `}
                  />

                  <button
                    type="submit"
                    disabled={status === "loading" || status === "success"}
                    className={`
                      p-1.5 sm:p-2 rounded-lg transition-all duration-300 flex items-center justify-center
                      ${status === "success" ? "bg-green-500 text-white cursor-default" : "bg-[#1a2e52] text-white hover:bg-[#0077cc] hover:scale-105 active:scale-95"}
                      ${status === "loading" ? "opacity-80 cursor-wait" : ""}
                    `}
                  >
                    {status === "loading" ? (
                      <Loader2 size={10} className="animate-spin" />
                    ) : status === "success" ? (
                      <Check size={10} />
                    ) : (
                      <FaArrowRight size={10} />
                    )}
                  </button>
                </div>

                {/* Status Message or Helper Text */}
                {status === "invalid_email" ? (
                  <p className="mt-1.5 sm:mt-2 text-[9px] sm:text-[10px] text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                    Enter a valid email
                  </p>
                ) : status === "server_error" ? (
                  <p className="mt-1.5 sm:mt-2 text-[9px] sm:text-[10px] text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                    Server failed to send email. Check Nodemailer variables.
                  </p>
                ) : (
                  <p className="mt-1.5 sm:mt-2 text-[9px] sm:text-[10px] text-gray-500">
                    Get updates, templates, and new features.{" "}
                    <span className="font-bold text-[#1a2e52]">No spam.</span>
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* 2. RESUME - UPDATED */}
          <div className="flex flex-col h-full">
            <div
              onClick={() => toggleSection("resume")}
              className={`${headerStyle} flex justify-between items-center cursor-pointer md:cursor-default`}
            >
              <span>Resume & CV</span>

              <ChevronDown
                size={16}
                className={`transition-transform duration-300 md:hidden ${
                  openSection === "resume" ? "rotate-180" : ""
                }`}
              />
            </div>
            <div
              className={`
    overflow-hidden transition-all duration-300
    md:overflow-visible md:max-h-full md:opacity-100
    ${openSection === "resume" ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
  `}
            >
              <ul className="space-y-1 sm:space-y-2 md:space-y-4 pt-2">
                <li className={linkStyle}>
                  <Link to="/score-checker">ATS Scorer</Link>
                </li>
                <li className={linkStyle}>
                  <Link to="/#free-templates">Resume Templates</Link>
                </li>
                <li className={linkStyle}>
                  <Link to="/resume-examples">Resume Examples</Link>
                </li>
                <li className={linkStyle}>
                  <Link to="/how-to-write-a-resume">Writing a Resume</Link>
                </li>
                <li className={linkStyle}>
                  <Link to="/cv">Professional CV Formatting</Link>
                </li>
              </ul>
            </div>
          </div>
          {/* 3. COVER LETTER - NEW CATEGORY */}
          <div className="flex flex-col h-full">
  <div
    onClick={() => toggleSection("cover")}
    className={`${headerStyle} flex justify-between items-center cursor-pointer md:cursor-default`}
  >
    <span>Cover Letter</span>
    <ChevronDown
      size={16}
      className={`transition-transform duration-300 md:hidden ${
        openSection === "cover" ? "rotate-180" : ""
      }`}
    />
  </div>

  <div
    className={`
      overflow-hidden transition-all duration-300
      md:overflow-visible md:max-h-full md:opacity-100
      ${openSection === "cover" ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
    `}
  >
    <ul className="space-y-1 sm:space-y-2 md:space-y-4 pt-2">
              <li className={linkStyle}>
                <Link to="/cover-letter-examples">Cover Letter Examples</Link>
              </li>
              <li className={linkStyle}>
                <Link to="/cover-letter">Cover Letter Builder</Link>
              </li>
              {/*added cover letter builder to footer*/}
              <li className={linkStyle}>
                <Link to="/WritingCoverLetter">Writing A Cover Letter</Link>
              </li>
            </ul>
          </div>
</div>
          {/* 4. OUR COMPANY - UPDATED */}
          <div className="flex flex-col h-full">
           <div
  onClick={() => toggleSection("company")}
  className={`${headerStyle} flex justify-between items-center cursor-pointer md:cursor-default`}
>
  <span>Our Company</span>
  <ChevronDown
    size={16}
    className={`transition-transform duration-300 md:hidden ${
      openSection === "company" ? "rotate-180" : ""
    }`}
  />
</div>

<div
  className={`
    overflow-hidden transition-all duration-300
    md:overflow-visible md:max-h-full md:opacity-100
    ${openSection === "company" ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
  `}
>
  <ul className="space-y-1 sm:space-y-2 md:space-y-4 pt-2">
              <li className={linkStyle}>
                <Link to="/about">About Us</Link>
              </li>
              {/* <li className={linkStyle}><Link to={`${isLoggedIn ? "/pricing" : "/login"}`}>Pricing</Link></li> */}
              <li className={linkStyle}>
                {" "}
                <Link to="/pricing">Pricing</Link>
              </li>
              <li className={linkStyle}>
                <Link to="/blog">Blog</Link>
              </li>
              <li className={linkStyle}>
                <Link to="/careers">Careers</Link>
              </li>
            </ul>
          </div>
          </div>

          {/* 5. SUPPORT - UPDATED */}
          <div className="flex flex-col h-full">
           <div
  onClick={() => toggleSection("support")}
  className={`${headerStyle} flex justify-between items-center cursor-pointer md:cursor-default`}
>
  <span>Support</span>
  <ChevronDown
    size={16}
    className={`transition-transform duration-300 md:hidden ${
      openSection === "support" ? "rotate-180" : ""
    }`}
  />
</div>

<div
  className={`
    overflow-hidden transition-all duration-300
    md:overflow-visible md:max-h-full md:opacity-100
    ${openSection === "support" ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
  `}
>
  <ul className="space-y-1 sm:space-y-2 md:space-y-4 pt-2">
              <li className={linkStyle}>
                <Link to="/faq">FAQ</Link>
              </li>
              <li className={linkStyle}>
                <Link to="/contact">Contact Us</Link>
              </li>
              <li className={linkStyle}>
                <Link to="/terms">Terms Of Service</Link>
              </li>
              <li className={linkStyle}>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li className={linkStyle}>
                <Link to="/help-center">Help Center</Link>
              </li>
            </ul>
          </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col items-center justify-between gap-3 sm:gap-4 md:gap-6 pt-4 sm:pt-6 md:pt-8 border-t border-gray-100 md:flex-row">
          <p className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center md:text-left">
            ©️ {new Date().getFullYear()} UptoSkills Inc.
          </p>

          <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] md:text-[13px] font-black tracking-tight">
            <span className="text-[#1a2e52]">Dream Big.</span>
            <span className="text-[#0077cc]">Skill Up.</span>
            <span className="text-[#e65100]">Fly High!</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;



