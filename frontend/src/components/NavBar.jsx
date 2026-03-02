import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UpToSkillsImg from "../assets/logo6.png";
import axiosInstance from "./../api/axios";
import {
  Menu,
  LogIn,
  UserPlus,
  LogOut,
  X,
  CheckCircle,
  Layout,
  FileSearch,
  Zap,
  Edit3,
  BarChart3,
  Layers,
  Activity,
  Palette,
  PenTool,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  User,
} from "lucide-react";

export default function NavBar() {
  const navigate = useNavigate();
  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("token");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoadingStatus] = useState(false);

  const menuRef = useRef(null);
  const profileMenuOpenRef = useRef(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setFeaturesOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setFeaturesOpen(false);
  };

  const handleLogout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    closeMobileMenu();
  };

  //To decode JWT token
  function decodeJWT(token) {
    if (!token) return null;
    try {
      const payload = token.split(".")[1];
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );

      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error("Invalid JWT", err);
      return null;
    }
  }
  // getting the username from db
  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchUsers = async () => {
      try {
        setLoadingStatus(true);
        const token = localStorage.getItem("token");
        if (!token) return;
        const { id } = decodeJWT(token);
        const res = await axiosInstance.get(`/api/user/profile/${id}`);
        setUserName(res.data.username);
        setLoadingStatus(false);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchUsers();
  }, []);

  //profile dropdown menu click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        profileMenuOpenRef.current &&
        !menuRef.current.contains(e.target) &&
        !profileMenuOpenRef.current.contains(e.target)
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const features = [
    {
      name: "AI Resume Checker",
      path: "/resume-checker",
      icon: CheckCircle,
      colorClass: "text-blue-500",
      hoverClass: "hover:bg-blue-50",
    },
    {
      name: "Categorized Templates",
      path: "/TemplatesFeature",
      icon: Layout,
      colorClass: "text-emerald-500",
      hoverClass: "hover:bg-emerald-50",
    },
    {
      name: "ATS Score Checker",
      path: "/ats-checker",
      icon: FileSearch,
      colorClass: "text-purple-500",
      hoverClass: "hover:bg-purple-50",
    },
    {
      name: "Guilded AI Builder",
      path: "/AI-builder",
      icon: Zap,
      colorClass: "text-cyan-500",
      hoverClass: "hover:bg-cyan-50",
    },
    {
      name: "Content Enhancement",
      path: "/content-enhance",
      icon: Edit3,
      colorClass: "text-rose-500",
      hoverClass: "hover:bg-rose-50",
    },
    {
      name: "Live Quality Scoring",
      path: "/score-checker",
      icon: BarChart3,
      colorClass: "text-amber-500",
      hoverClass: "hover:bg-amber-50",
    },
    {
      name: "Resume Manager",
      path: "/resume-hub",
      icon: Layers,
      colorClass: "text-indigo-500",
      hoverClass: "hover:bg-indigo-50",
    },
    {
      name: "Growth Insights",
      path: "/growths",
      icon: Activity,
      colorClass: "text-green-500",
      hoverClass: "hover:bg-green-50",
    },
    {
      name: "CV Formatting",
      path: "/cv",
      icon: Palette,
      colorClass: "text-violet-500",
      hoverClass: "hover:bg-violet-50",
    },
    {
      name: "Cover Letter Builder",
      path: "/cover-letter",
      icon: PenTool,
      colorClass: "text-teal-500",
      hoverClass: "hover:bg-teal-50",
    },
  ];

  return (
    <>
      {/* Desktop & Mobile NavBar */}
      <nav className="fixed top-0 left-0 w-full z-30 py-2 sm:py-3 md:py-4 bg-white/95 backdrop-blur-md border-b border-gray-100 select-none">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 flex items-center justify-between">
          {/* Mobile Menu Toggle - Now on LEFT */}
          <button
            className="text-2xl md:hidden p-1 order-1"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X size={24} className="sm:w-7 sm:h-7" />
            ) : (
              <Menu size={24} className="sm:w-7 sm:h-7" />
            )}
          </button>

          {/* Logo - Now in CENTER on mobile */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 sm:gap-3 focus:outline-none flex-shrink-0 order-2 md:order-1"
            aria-label="Go to home"
          >
            <img src={UpToSkillsImg} alt="UptoSkills Logo" className="w-24 sm:w-32 md:w-36 lg:w-[160px]" />
          </button>

          {/* Desktop Navigation */}
          <div
            className={`flex-1 flex justify-center ${isLoggedIn ? "" : "ml-4 lg:ml-24"} hidden md:flex order-2`}
          >
            <ul className="flex items-center gap-4 lg:gap-6 xl:gap-8 text-sm lg:text-base">
              <li className="cursor-pointer hover:text-orange-600 transition-colors">
                <Link to="/about">About us</Link>
              </li>

              <li className="cursor-pointer hover:text-orange-600 transition-colors">
                <Link to="/#free-templates">Templates</Link>
              </li>

              {/* Features Dropdown */}
              <li className="relative group cursor-pointer hover:text-orange-600 transition-colors">
                <div className="flex items-center gap-1">
                  <span>Features</span>
                  <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 transition-transform duration-300 group-hover:rotate-180" />
                </div>

                {/* Features Dropdown Menu - 2 Columns */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[420px] lg:w-[520px] bg-white border border-gray-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="flex py-2">
                    {/* Left Column */}
                    <ul className="flex-1 py-2">
                      {features.slice(0, 5).map((feature) => {
                        const Icon = feature.icon;
                        return (
                          <li
                            key={feature.path}
                            className={`px-3 lg:px-4 py-2 lg:py-3 ${feature.hoverClass} transition-colors duration-200`}
                          >
                            <Link
                              to={feature.path}
                              className="flex items-center gap-2 lg:gap-3 text-gray-700"
                            >
                              <Icon
                                className={`${feature.colorClass} w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0`}
                              />
                              <span className="font-medium text-sm lg:text-base">
                                {feature.name}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>

                    {/* Vertical Divider */}
                    <div className="w-px bg-gray-200"></div>

                    {/* Right Column */}
                    <ul className="flex-1 py-2">
                      {features.slice(5, 10).map((feature) => {
                        const Icon = feature.icon;
                        return (
                          <li
                            key={feature.path}
                            className={`px-3 lg:px-4 py-2 lg:py-3 ${feature.hoverClass} transition-colors duration-200`}
                          >
                            <Link
                              to={feature.path}
                              className="flex items-center gap-2 lg:gap-3 text-gray-700"
                            >
                              <Icon
                                className={`${feature.colorClass} w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0`}
                              />
                              <span className="font-medium text-sm lg:text-base">
                                {feature.name}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </li>

              {isLoggedIn && (
                <li className="cursor-pointer hover:text-orange-600 transition-colors">
                  <Link
                    to={
                      JSON.parse(localStorage.getItem("isAdmin") || "false")
                        ? "/admin"
                        : "/user/dashboard"
                    }
                  >
                    Dashboard
                  </Link>
                </li>
              )}
              <li className="cursor-pointer hover:text-orange-600 transition-colors">
                <Link to="/pricing">Pricing</Link>
              </li>
              <li className="cursor-pointer hover:text-orange-600 transition-colors">
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {isLoggedIn && (
            <div
              title="Profile"
              ref={profileMenuOpenRef}
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 p-1 md:pr-2 rounded-full cursor-pointer md:hover:bg-gray-100 order-3"
            >
              <div className="bg-gray-200 p-2 rounded-full items-center md:flex">
                <User size={20} />
              </div>
              <div className="md:flex hidden items-center gap-1">
                {loading && (
                  <div className="w-24 h-4 bg-gray-200 rounded-xl flex justify-center items-center">
                    <div className="w-2 h-2 border border-black border-b-black/30 rounded-xl animate-spin"></div>
                  </div>
                )}
                <span>{userName}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ease-in-out ${
                    profileMenuOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
            </div>
          )}
          {/* DROPDOWN MENU FOR LOGGED IN USER */}
          <div
            ref={menuRef}
            className={`absolute md:top-20 top-16 right-3 w-48 rounded bg-slate-100 border border-slate-200 shadow-lg p-2
                        transition-all duration-200 ease-out origin-top-right
                        ${
                          profileMenuOpen
                            ? "opacity-100 scale-100 visible"
                            : "opacity-0 scale-95 invisible"
                        }`}
          >
            <Link
              className="flex items-center gap-3 px-4 py-2 rounded cursor-pointer 
                  hover:bg-gray-300 hover:text-white transition-colors"
              to="/user/edit-profile"
            >
              <User size={18} />
              <span className="text-sm font-medium">Profile</span>
            </Link>

            <Link
              className="flex items-center gap-3 px-4 py-2 rounded cursor-pointer 
                  hover:bg-gray-300 hover:text-white transition-colors"
              to="/user/dashboard"
            >
              <LayoutDashboard size={18} />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>

            <div
              className="flex items-center gap-3 px-4 py-2 rounded cursor-pointer bg-red-500 text-white mt-2 
                  hover:bg-red-700 hover:text-white transition-colors"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          {!isLoggedIn && (
            <div className="items-center hidden gap-3 lg:gap-4 xl:gap-6 md:flex order-3">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 lg:gap-3 px-3 lg:px-5 xl:px-6 py-2 lg:py-2.5 border-2 border-[#0077cc] text-[#0077cc] rounded-xl font-bold text-sm lg:text-base transition-all duration-300 hover:bg-[#0077cc] hover:text-white hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-1 active:scale-95"
              >
                <LogIn size={18} className="lg:w-5 lg:h-5" />
                <span>Login</span>
              </button>

              <button
                onClick={() => navigate("/register")}
                className="flex items-center gap-2 lg:gap-3 px-3 lg:px-5 xl:px-6 py-2 lg:py-2.5 bg-[#e65100] text-white rounded-xl font-bold text-sm lg:text-base transition-all duration-300 border-2 border-transparent hover:bg-[#ff6d00] hover:shadow-xl hover:shadow-orange-200 hover:-translate-y-1 active:scale-95"
              >
                <UserPlus size={18} className="lg:w-5 lg:h-5" />
                <span>Sign up</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar - Now slides from LEFT */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <img
              src={UpToSkillsImg}
              alt="UptoSkills Logo"
              className="w-[120px]"
            />
            <button
              onClick={closeMobileMenu}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            <ul className="py-4">
              <li className="px-6 py-3 hover:bg-gray-50 transition-colors">
                <a
                  href="/about"
                  onClick={closeMobileMenu}
                  className="block text-gray-700 font-medium"
                >
                  About us
                </a>
              </li>

              <li className="px-6 py-3 hover:bg-gray-50 transition-colors">
                <a
                  href="/#free-templates"
                  onClick={closeMobileMenu}
                  className="block text-gray-700 font-medium"
                >
                  Templates
                </a>
              </li>

              {/* Features Accordion */}
              <li>
                <button
                  onClick={() => setFeaturesOpen(!featuresOpen)}
                  className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-700 font-medium">Features</span>
                  <ChevronRight
                    className={`w-5 h-5 transition-transform duration-200 ${featuresOpen ? "rotate-90" : ""}`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${featuresOpen ? "max-h-[1000px]" : "max-h-0"}`}
                >
                  <ul className="bg-gray-50">
                    {features.map((feature) => {
                      const Icon = feature.icon;
                      return (
                        <li
                          key={feature.path}
                          className="px-8 py-3 hover:bg-gray-100 transition-colors"
                        >
                          <a
                            href={feature.path}
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 text-gray-600"
                          >
                            <Icon className={`${feature.colorClass} w-5 h-5`} />
                            <span className="text-sm">{feature.name}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>

              {isLoggedIn && (
                <li className="px-6 py-3 hover:bg-gray-50 transition-colors">
                  <a
                    href="/user/dashboard"
                    onClick={closeMobileMenu}
                    className="block text-gray-700 font-medium"
                  >
                    Dashboard
                  </a>
                </li>
              )}

              <li className="px-6 py-3 hover:bg-gray-50 transition-colors">
                <a
                  href="/pricing"
                  onClick={closeMobileMenu}
                  className="block text-gray-700 font-medium"
                >
                  Pricing
                </a>
              </li>

              <li className="px-6 py-3 hover:bg-gray-50 transition-colors">
                <a
                  href="/contact"
                  onClick={closeMobileMenu}
                  className="block text-gray-700 font-medium"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Sidebar Footer - Auth Buttons */}
          <div className="p-4 sm:p-6 border-t border-gray-200 space-y-2.5 sm:space-y-3">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    navigate("/login");
                    closeMobileMenu();
                  }}
                  className="w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#0077cc] text-[#0077cc] rounded-xl font-bold text-sm sm:text-base transition-all duration-300 hover:bg-[#0077cc] hover:text-white active:scale-95"
                >
                  <LogIn size={18} className="sm:w-5 sm:h-5" />
                  <span>Login</span>
                </button>

                <button
                  onClick={() => {
                    navigate("/register");
                    closeMobileMenu();
                  }}
                  className="w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#e65100] text-white rounded-xl font-bold text-sm sm:text-base transition-all duration-300 hover:bg-[#ff6d00] active:scale-95"
                >
                  <UserPlus size={18} className="sm:w-5 sm:h-5" />
                  <span>Sign up</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#e65100] text-white rounded-xl font-bold text-sm sm:text-base transition-all duration-300 hover:bg-[#ff6d00] active:scale-95"
              >
                <LogOut size={18} className="sm:w-5 sm:h-5" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
