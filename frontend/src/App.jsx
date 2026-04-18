import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./featuers/landing_pages/Home";
import TemplatesPage from "./featuers/landing_pages/TemplatesPage";
import BuilderPage from "./featuers/landing_pages/Builder";
import LoginPage from "./featuers/landing_pages/login";
import RegisterPage from "./featuers/landing_pages/Register";
import ForgotPasswordPage from "./featuers/landing_pages/ForgotPassword";
import VerifyEmail from "./featuers/landing_pages/VerifyEmail";
import TemplateEditor from "./featuers/landing_pages/TemplateEditor";
import Contact from "./featuers/landing_pages/Contact";
import HelpCenter from "./featuers/landing_pages/HelpCenter";
import About from "./featuers/landing_pages/About";
import Pricing from "./featuers/landing_pages/Pricing";
import BlogPage from "./featuers/landing_pages/Blogpage";
import CareersPage from "./featuers/landing_pages/Careerpage";
import ATSCheckerPage from "./featuers/landing_pages/ATSChecker";
import TemplatesFeature from "./featuers/landing_pages/TemplatesFeature";
import AIBuilderPage from "./featuers/landing_pages/AIBuilder";
import AIContentEnhancementPage from "./featuers/landing_pages/AIContentEnhance";
import ScoreChecker from "./featuers/landing_pages/ScoreChecker";
import ResumeHubPage from "./featuers/landing_pages/ResumeHub";
import GrowthInsightsPage from "./featuers/landing_pages/GrowthInsights";
import AICoverLetterPage from "./featuers/landing_pages/CoverLetter";
import CoverLetterExamples from "./featuers/landing_pages/CoverLetterExamples";
import CVFormattingPage from "./featuers/landing_pages/CV";
import WritingCoverLetter from "./featuers/landing_pages/WritingCoverLetter"

import ScrollToTop from "./featuers/ScrollToTop";
import RequireAuth from "./featuers/RequireAuth";
import PrivacyPolicy from "./featuers/landing_pages/Privacypolicy";
import ResumeChecker from "./featuers/landing_pages/ResumeChecker";
import Terms from "./featuers/landing_pages/Terms";
import LandingPageLayouts from "./featuers/landing_pages/LandingPageLayouts";
import NotFound from "./featuers/landing_pages/NotFound";

// ================= ADMIN =================

import AdminLayout from "./featuers/admin/AdminLayout";
import AdminDashboard from "./featuers/admin/AdminDashboard/AdminDashboard";

// import TemplateDocs from "./components/admin/AdminCreateTemplates/TemplateDocs";
import Resume from "./featuers/admin/resume";
import AdminUsers from "./featuers/admin/AdminUser/AdminUsers";
import AdminNotification from "./featuers/admin/AdminNotification/Notification";
import AdminSubscription from "./featuers/admin/AdminSubscription/AdminSubscription";
import AdminAnalytics from "./featuers/admin/AdminAnalytics/AdminAnalytics";
import AdminTemplates from "./featuers/admin/AdminCreateTemplates/Template";
import AdminSecurity from "./featuers/admin/AdminSecurity/AdminSecurity";
import AdminProfile from "./featuers/admin/AdminProfile/AdminProfile";
import AdminBlog from "./featuers/admin/AdminBlog/AdminBlog";

// User routes
import UserRoutes from "./featuers/landing_pages/UserRoutes";
import ResumeGuide from "./featuers/landing_pages/ResumeGuide";
import ResumeExamplesPage from "./featuers/landing_pages/ResumeExample";
import CoverLetterTemplates from "./featuers/landing_pages/CoverLetterTemplates";
import Faq from "./featuers/landing_pages/Faq";

function App() {
  return (
    <>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route element={<LandingPageLayouts />}>
            {/* ================= PUBLIC ROUTES ================= */}
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/templates/:id" element={<TemplateEditor />} />
            <Route path="/builder" element={<BuilderPage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              <Route path="/" element={<Home />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/HelpCenter" element={<HelpCenter />} />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/ats-checker" element={<ATSCheckerPage />} />
              <Route path="/AI-builder" element={<AIBuilderPage />} />
              <Route path="/content-enhance" element={<AIContentEnhancementPage />} />
              <Route path="/score-checker" element={<ScoreChecker />} />
              <Route path="/resume-hub" element={<ResumeHubPage />} />
              <Route path="/growths" element={<GrowthInsightsPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/resume-examples" element={<ResumeExamplesPage />} />
              <Route path="/how-to-write-a-resume" element={<ResumeGuide />} />
              <Route path="/cover-letter-templates" element={<CoverLetterTemplates />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/resume-checker" element={<ResumeChecker />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/ats-checker" element={<ATSCheckerPage />} />
              <Route path="/TemplatesFeature" element={<TemplatesFeature />} />
              <Route path="/AI-builder" element={<AIBuilderPage />} />
              <Route path="/content-enhance" element={<AIContentEnhancementPage />} />
              <Route path="/score-checker" element={<ScoreChecker />} />
              <Route path="/resume-hub" element={<ResumeHubPage />} />
              <Route path="/growths" element={<GrowthInsightsPage />} />
              <Route path="/cover-letter" element={<AICoverLetterPage />} />
              <Route path="/cover-letter-examples" element={<CoverLetterExamples />} />
              <Route path="/cv" element={<CVFormattingPage />} />
              <Route path="/WritingCoverLetter" element={<WritingCoverLetter />} />
            {/* ================= USER DASHBOARD ROUTES ================= */}
            <Route path="/user/*" element={<RequireAuth allowedRoles={['user']}><UserRoutes /></RequireAuth>} />

            {/* ================= ADMIN ROUTES ================= */}
            <Route path="/admin" element={<RequireAuth allowedRoles={['admin']}><AdminLayout /></RequireAuth>}>
              <Route index element={<AdminDashboard />} />
              <Route path="manage-templates" element={<AdminTemplates />} />

              <Route path="templates" element={<Resume />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="notifications" element={<AdminNotification />} />
              <Route path="subscription" element={<AdminSubscription />} />

              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="change-password" element={<AdminSecurity />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>

            {/* ================= 404 ================= */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 16px',
            minHeight: '48px'
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
            style: {
              background: '#ffffff',
              color: '#065f46',
              border: '1px solid #10b981',
            }
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
            style: {
              background: '#ffffff',
              color: '#991b1b',
              border: '1px solid #ef4444',
            }
          },
          loading: {
            style: {
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid #0f172a',
            }
          }
        }}
      />
    </>
  );
}

export default App;
