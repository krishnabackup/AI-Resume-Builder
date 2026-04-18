// src/pages/UserRoutes.jsx
import { useEffect, useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Layout
import UserSidebar from "../../featuers//user/Sidebar/UserSidebar";

// Context
import { UserNotificationProvider } from "../../context/UserNotificationContext";

// Pages
import Dashboard from "../../featuers//user/Dashboard/Dashboard";
import ATSChecker from "../../featuers/user/ATSChecker/ATSChecker";
import ProfileOverview from "../../featuers/user/Profile/ProfileOverview";
import EditProfile from "../../featuers/user/Profile/EditProfile";
import Security from "../../featuers/user/Profile/Security";
import ResumeBuilder from "../../featuers/user/ResumeBuilder/ResumeBuilder";
import CVBuilder from "../../featuers/user/CV/CVBuilder";
import CoverLetterBuilder from "../../featuers/user/CoverLetter/CoverLetterBuilder";
import Downloads from "../../featuers/user/Downloads/Downloads";
import UserNotifications from "../../featuers/user/UserNotification/Notification";
import { trackPageView } from "../../utils/trackPageView";



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
          <Route path="profile" element={<ProfileOverview />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="security" element={<Security />} />
          <Route path="notifications" element={<UserNotifications />} />

        </Route>
      </Routes>
    </UserNotificationProvider>
  );
};

export default UserRoutes;

