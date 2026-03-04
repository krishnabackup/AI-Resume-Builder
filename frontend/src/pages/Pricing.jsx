import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "./Footer";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";

const Pricing = () => {
  const navigate = useNavigate();
  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  const [backendPlans, setBackendPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axiosInstance.get("/api/plans");
        console.log("Fetched Plans from API:", res.data); // Debug log
        setBackendPlans(res.data);
      } catch (err) {
        console.error("Error fetching plans:", err);
      }
    };
    fetchPlans();
  }, []);

  const getDynamicPriceById = (id, fallbackPrice) => {
    const foundPlan = backendPlans.find((p) => p.planId === id);
    return foundPlan ? `₹${foundPlan.price}` : fallbackPrice;
  };

  const getDynamicFeaturesById = (id) => {
    const foundPlan = backendPlans.find((p) => p.planId === id);
    return foundPlan && foundPlan.features ? foundPlan.features : [];
  };

  const plans = [
    {
      name: "Free",
      badge: "No Cost",
      badgeColor: "bg-green-500",
      priceColor: "text-green-500",
      buttonColor: "bg-green-500 hover:bg-green-600",
      checkColor: "text-green-500",
      price: getDynamicPriceById(1, "₹0"),
      period: "",
      description: "For getting started",
      buttonText: "Get Started",
      buttonAction: () =>
        navigate(`${isLoggedIn ? "/user/dashboard" : "/login"}`),
      gradient: false,
      features: getDynamicFeaturesById(1),
    },
    {
      name: "Pro",
      badge: "Most Popular",
      badgeColor: "bg-orange-500",
      priceColor: "text-orange-500",
      buttonColor: "bg-orange-500 hover:bg-orange-600",
      checkColor: "text-orange-500",
      price: getDynamicPriceById(2, "₹299"),
      period: " / month",
      description: "Best for job seekers",
      buttonText: "Upgrade to Pro",
      buttonAction: () => { },
      gradient: true,
      features: getDynamicFeaturesById(2),
    },
    {
      name: "Premium",
      badge: "Best Features",
      badgeColor: "bg-blue-500",
      priceColor: "text-blue-500",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
      checkColor: "text-blue-500",
      price: getDynamicPriceById(3, "₹999"),
      period: " / year",
      description: "For career acceleration",
      buttonText: "Unlock Premium",
      buttonAction: () => { },
      gradient: false,
      features: getDynamicFeaturesById(3),
    },
  ];

  return (
    <>
      <NavBar />
      <section className="page-enter-fade bg-white pt-20 px-6 md:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14 select-none">
            <h2 className="text-4xl font-extrabold">
              <span className="text-blue-600">Plans & </span>{" "}
              <span className="text-blue-600">Pricing</span>
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Choose a plan that fits your career goals. Upgrade anytime to
              unlock premium resume features.
            </p>
          </div>

          {/* Pricing Cards */}
          <div
            className="
              flex overflow-x-auto gap-6 pt-6 pb-6
              md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pt-0
              snap-x snap-mandatory
              scrollbar-hide
            "
          >
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`snap-center min-w-[85%] md:min-w-0 rounded-2xl shadow-md p-8 relative ${plan.gradient
                  ? "bg-gradient-to-b from-orange-50 to-white shadow-xl"
                  : "bg-white"
                  }`}
              >
                {plan.badge && (
                  <span
                    className={`absolute -top-4 left-1/2 -translate-x-1/2 ${plan.badgeColor} text-white text-xs font-semibold px-4 py-1 rounded-full select-none shadow`}
                  >
                    {plan.badge}
                  </span>
                )}

                <div className="text-center mb-6">
                  <h3
                    className={`text-xl font-semibold ${plan.priceColor} mb-2`}
                  >
                    {plan.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{plan.description}</p>

                  <div className="mt-4">
                    <span
                      className={`text-4xl font-extrabold ${plan.priceColor}`}
                    >
                      {plan.price}
                    </span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                </div>

                <div className="mb-6">
                  {plan.features && plan.features.length > 0 ? (
                    plan.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 mb-4"
                      >
                        <Check
                          className={`${plan.checkColor} w-5 h-5 flex-shrink-0`}
                        />
                        <span className="text-sm text-gray-700">
                          {feature}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 text-center">No features listed</p>
                  )}
                </div>

                <button
                  onClick={plan.buttonAction}
                  className={`w-full ${plan.buttonColor} text-white font-semibold py-3 rounded-lg select-none transition`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Pricing;
