import { Outlet } from "react-router-dom";
import UserNavBar from "./UserNavBar/UserNavBar";
import Sidebar from "./Sidebar/UserSidebar";

export default function UserLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar – desktop */}
      <div className="hidden md:block">
        <Sidebar/>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <UserNavBar />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}