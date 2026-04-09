import { Outlet } from "react-router-dom";
import Aichat from "../landing_pages/Aichat";

export default function LandingPageLayout() {
  return (
    <>
      <Outlet />
      <Aichat />
    </>
  );
}
