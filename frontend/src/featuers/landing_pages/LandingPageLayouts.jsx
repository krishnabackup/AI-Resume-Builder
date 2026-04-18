import { Outlet } from "react-router-dom";
import Aichat from "./Aichat";

export default function LandingPageLayout() {
  return (
    <>
      <Outlet />
      <Aichat />
    </>
  );
}

