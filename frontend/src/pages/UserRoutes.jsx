// src/pages/UserRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";

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



const UserRoutes = () => {
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
