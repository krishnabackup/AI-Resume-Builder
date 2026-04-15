import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import TemplatesPage from "./pages/TemplatesPage";
import BuilderPage from "./pages/Builder";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/Register";
import ForgotPasswordPage from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import TemplateEditor from "./pages/TemplateEditor";
import Contact from "./pages/Contact";
import HelpCenter from "./pages/HelpCenter";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import BlogPage from "./pages/Blogpage";
import CareersPage from "./pages/Careerpage";
import ATSCheckerPage from "./pages/ATSChecker";
import TemplatesFeature from "./pages/TemplatesFeature";
import AIBuilderPage from "./pages/AIBuilder";
import AIContentEnhancementPage from "./pages/AIContentEnhance";
import ScoreChecker from "./pages/ScoreChecker";
import ResumeHubPage from "./pages/ResumeHub";
import GrowthInsightsPage from "./pages/GrowthInsights";
import AICoverLetterPage from "./pages/CoverLetter";
import CoverLetterExamples from "./pages/CoverLetterExamples";
import CVFormattingPage from "./pages/CV";
import WritingCoverLetter from "./pages/WritingCoverLetter"

import ScrollToTop from "./components/ScrollToTop";
import RequireAuth from "./components/RequireAuth";
import PrivacyPolicy from "./pages/Privacypolicy";
import ResumeChecker from "./pages/ResumeChecker";
import Terms from "./pages/Terms";
import LandingPageLayouts from "./pages/LandingPageLayouts";
import NotFound from "./pages/NotFound";

// ================= ADMIN =================

import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard/AdminDashboard";

// import TemplateDocs from "./components/admin/AdminCreateTemplates/TemplateDocs";
import Resume from "./components/admin/resume";
import AdminUsers from "./components/admin/AdminUser/AdminUsers";
import AdminNotification from "./components/admin/AdminNotification/Notification";
import AdminSubscription from "./components/admin/AdminSubscription/AdminSubscription";
import AdminAnalytics from "./components/admin/AdminAnalytics/AdminAnalytics";
import AdminTemplates from "./components/admin/AdminCreateTemplates/Template";
import AdminSecurity from "./components/admin/AdminSecurity/AdminSecurity";
import AdminProfile from "./components/admin/AdminProfile/AdminProfile";
import AdminBlog from "./components/admin/AdminBlog/AdminBlog";

// User routes
import UserRoutes from "./pages/UserRoutes";
import ResumeGuide from "./pages/ResumeGuide";
import ResumeExamplesPage from "./pages/ResumeExample";
import CoverLetterTemplates from "./pages/CoverLetterTemplates";
import Faq from "./pages/Faq";

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
