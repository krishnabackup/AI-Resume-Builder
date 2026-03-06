import React from "react";
import { useNavigate, Link } from "react-router-dom";
import UpToSkillsImg from "../assets/UptoSkills.webp";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "./Footer";

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const policys = [
    {
      icon: "fa-clipboard-list",
      title: "Information Collection & Usage",
      content:
        "We collect personal information including your name, email address, phone number, work history, education, skills, certifications, and any other details you provide while creating your resume. This data is used exclusively to generate, optimize, and store your professional resume.",
      color: "green"
    },
    {
      icon: "fa-brain",
      title: "AI Processing & Analysis",
      content:
        "Our AI technology analyzes your resume content to provide intelligent suggestions, identify skill gaps, optimize keywords for ATS systems, and generate tailored content. Your data is processed securely and is never used to train external AI models without your explicit consent.",
      color: "orange"
    },
    {
      icon: "fa-database",
      title: "Data Storage & Security",
      content:
        "Your resume data is encrypted both in transit and at rest using industry-standard encryption protocols. We store your information on secure cloud servers with regular backups, multi-factor authentication, and continuous security monitoring to prevent unauthorized access.",
      color: "green"
    },
    {
      icon: "fa-plug",
      title: "Third-Party Integrations",
      content:
        "We may integrate with trusted third-party services such as LinkedIn for profile import, payment processors for subscriptions, and analytics tools to improve our service. These partners are carefully vetted and bound by strict data protection agreements.",
      color: "orange"
    },
    {
      icon: "fa-user-shield",
      title: "User Rights & Data Control",
      content:
        "You have complete control over your data. You can access, modify, download, or permanently delete your resume and personal information at any time through your account settings. We respect your right to data portability and will provide your data in a standard format upon request.",
      color: "green"
    },
    {
      icon: "fa-cookie-bite",
      title: "Cookies & Tracking Technologies",
      content:
        "We use essential cookies to maintain your session and remember your preferences. Optional analytics cookies help us understand how you use our platform to improve user experience. You can manage cookie preferences in your browser settings at any time.",
      color: "orange"
    },
    {
      icon: "fa-clock",
      title: "Data Retention Policy",
      content:
        "We retain your resume data for as long as your account remains active. Inactive accounts are maintained for 24 months before archival. You can request immediate deletion at any time. Deleted data is permanently removed from our systems within 30 days, except where legally required to retain certain records.",
      color: "green"
    },
    {
      icon: "fa-download",
      title: "Account Deletion & Data Export",
      content:
        "You can export all your data in PDF, DOCX, or JSON format at any time. If you choose to delete your account, all associated data including resumes, personal information, and usage history will be permanently removed. This action is irreversible.",
      color: "orange"
    },
    {
      icon: "fa-child",
      title: "Age of Consent",
      content:
        "By using this site, you confirm that you are at least the age of majority in your jurisdiction, or that you have given us your consent to allow any of your minor dependents to use this site.",
      color: "green"
    },
    {
      icon: "fa-bell",
      title: "Policy Updates & Notifications",
      content:
        "We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. When significant changes occur, we will notify you. Continued use of UpToSkills after updates constitutes acceptance of the revised policy.",
      color: "orange"
    },
  ];

  return (
    <div className="min-h-screen text-gray-900 bg-white select-none">
      <NavBar />

      {/* Section to display privacy policy page title and subtitle */}

      <section className="text-center bg-gradient-to-b from-blue-50 via-white to-white pt-24 pb-2 md:pt-24">
        <div className="max-w-4xl px-4 mx-auto sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 mb-4 md:mb-6 text-xs md:text-sm text-green-700 bg-green-200 rounded-full">
            <i className="fa-solid fa-shield-halved text-sm md:text-base"></i>
            <span>Data Protection</span>
          </div>

          <div className="relative mb-4 md:mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold px-4">
              Privacy Policy
            </h1>
          </div>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 px-4">
            Learn how UpToSkills - AI Resume Builder protects your personal
            information and respects your privacy.
          </p>
        </div>
      </section>

      {/* Section to display privacy policy cards, icons, badges, title and content */}

      <section className="max-w-6xl px-4 sm:px-6 pt-6 md:pt-10 pb-4 mx-auto space-y-6 md:space-y-10">
        {policys.map((policy, index) => (
          <div
            key={index}
            className="p-6 sm:p-8 md:p-10 lg:p-12 transition-all duration-300 bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl md:rounded-3xl hover:shadow-2xl hover:shadow-green-300/50 hover:bg-white/50 hover:border-white/80 hover:-translate-y-1"
          >
            {/* Mobile: Stacked Layout, Desktop: Horizontal Layout */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* Badge - Hidden on mobile, visible on sm and above */}
              <div className="hidden sm:flex items-center justify-center w-14 h-14 md:w-16 md:h-16 font-bold text-orange-700 bg-gradient-to-br from-orange-100/80 to-orange-200/60 backdrop-blur-sm rounded-lg md:rounded-xl text-xl md:text-2xl shadow-lg flex-shrink-0">
                {index + 1}
              </div>
              
              {/* Icon and Title Container */}
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-1">
                <i
                  className={`fa-solid ${policy.icon} text-orange-600 text-2xl sm:text-2xl md:text-3xl drop-shadow-lg flex-shrink-0`}
                ></i>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 drop-shadow-sm">
                  {policy.title}
                </h2>
              </div>
            </div>
            
            {/* Content */}
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-700 pl-0 sm:pl-20 md:pl-24">
              {policy.content}
            </p>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}