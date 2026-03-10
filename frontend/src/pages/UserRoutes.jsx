// src/pages/UserRoutes.jsx
import { useEffect, useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Layout
import UserSidebar from "../components/user/Sidebar/UserSidebar";

// Context
import { UserNotificationProvider } from "../context/UserNotificationContext";

// Pages
import Dashboard from "../components/user/Dashboard/Dashboard";
import ATSChecker from "../components/user/ATSChecker/ATSChecker";
import Profile from "../components/user/Profile/EditProfile";
import Security from "../components/user/Profile/Security";
import ResumeBuilder from "../components/user/ResumeBuilder/ResumeBuilder";
import Templates from "../components/user/Templates/TemplatesDashboardPage";
import CVBuilder from "../components/user/CV/CVBuilder";
import CoverLetterBuilder from "../components/user/CoverLetter/CoverLetterBuilder";
import Downloads from "../components/user/Downloads/Downloads";
import UserNotifications from "../components/user/UserNotification/Notification";
import { trackPageView } from "../utils/trackPageView";



const UserRoutes = () => {
  const location = useLocation();
  const lastTrackedPathRef = useRef("");

  useEffect(() => {
    const pageConfig = {
      "/user/dashboard": { page: "Dashboard", route: "/dashboard" },
      "/user/resume-builder": { page: "AI Resume Builder", route: "/resume-builder" },
      "/user/cv": { page: "CV", route: "/cv" },
      "/user/cover-letter": { page: "Cover Letter", route: "/cover-letter" },
      "/user/ats-checker": { page: "ATS Score Checker", route: "/ats-checker" },
      "/user/downloads": { page: "Downloads", route: "/downloads" },
      "/user/notifications": { page: "Notifications", route: "/notifications" },
    };

    const currentPath = location.pathname;
    const currentPage = pageConfig[currentPath];

    if (!currentPage || lastTrackedPathRef.current === currentPath) {
      return;
    }

    lastTrackedPathRef.current = currentPath;
    trackPageView(currentPage.page, currentPage.route);
  }, [location.pathname]);

  return (
    <UserNotificationProvider>
      <Routes>
        {/* Layout Route */}
        <Route element={<UserSidebar />}>

          {/* /user → /user/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route
            path="dashboard"
            element={
              <Dashboard
                user={{ name: "Meghana" }}
                resumes={[]}
                setActivePage={() => { }}
              />
            }
          />

          <Route path="resume-builder" element={<ResumeBuilder />} />
          <Route path="cv" element={<CVBuilder />} />
          <Route path="cover-letter" element={<CoverLetterBuilder />} />

          <Route path="ats-checker" element={<ATSChecker />} />
          <Route path="downloads" element={<Downloads />} />
          <Route path="edit-profile" element={<Profile />} />
          <Route path="security" element={<Security />} />
          <Route path="notifications" element={<UserNotifications />} />

        </Route>
      </Routes>
    </UserNotificationProvider>
  );
};

export default UserRoutes;
