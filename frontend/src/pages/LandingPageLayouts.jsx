import { Outlet } from "react-router-dom";
import Aichat from "../pages/Aichat";

export default function LandingPageLayout() {
  return (
    <>
      <Outlet />
      <Aichat />
    </>
  );
}
