import React, { useState } from "react";
import {
  MapPin,
  Briefcase,
  Clock,
  Heart,
  Sparkles,
  ArrowRight,
  Brain,
  Target,
  Code2,
  Cpu,
  Home,
  LineChart,
  GraduationCap,
  BatteryCharging,
  Focus,
  CheckCircle2,
} from "lucide-react";
import NavBar from "../../components/NavBar";
import Footer from "./Footer";
import career from "../../assets/careers.png";
import { motion } from "framer-motion";
import { filters, values, perks, jobs } from "./careerData";

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};
const CareersPage = () => {
  const [activeFilter, setActiveFilter] = useState("All Roles");

  const filteredJobs =
    activeFilter === "All Roles"
      ? jobs
      : jobs.filter((job) => job.department === activeFilter);

  return (
    <div className="page-enter min-h-screen bg-white font-['Outfit'] text-[#1a2e52] overflow-x-hidden select-none">
      <NavBar />

      {/* --- HERO SECTION --- */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 md:pt-32 pb-14 overflow-hidden bg-white"
      >
        {/* Soft Background Decorative Blurs */}
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-orange-50 rounded-full blur-[120px] -z-10 opacity-50" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-50 rounded-full blur-[120px] -z-10 opacity-50" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:text-left">
            {/* LEFT CONTENT: Text & CTA */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-blue-50">
                <Sparkles size={16} className="text-[#0077cc]" />
                <span className="text-xs font-black tracking-widest text-[#0077cc] uppercase">
                  Building the Future of Hiring
                </span>
              </div>

              <h1 className="mb-4 text-5xl font-[1000] tracking-tighter leading-[1.1] md:text-7xl font-jakarta text-[#1a2e52]">
                Join the <span className="text-[#0077cc]">AI Career</span>{" "}
                Revolution.
              </h1>

              <p className="max-w-xl mx-auto mb-7 text-xl font-medium leading-relaxed text-gray-500 lg:mx-0">
                At UptoSkills, we're building the most advanced AI resume engine
                on the planet. Help us bridge the gap between talent and
                opportunity.
              </p>

              <button
                onClick={() =>
                  document
                    .getElementById("openings")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-[0_10px_25px_rgba(230,81,0,0.3)] hover:shadow-[0_15px_35px_rgba(230,81,0,0.45)] hover:-translate-y-1 active:scale-95"
              >
                See Open Roles
                <ArrowRight
                  size={22}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>

            {/* RIGHT CONTENT: Career Image */}
            <div className="relative hidden flex-1 w-full max-w-[600px] group lg:block">
              {/* Decorative element behind image */}
              <img
                src={career}
                alt="UptoSkills Career"
                className="object-cover w-full h-auto"
              />

              {/* Small floating badge on image */}
              <div className="absolute flex items-center gap-3 p-4 bg-white shadow-xl -bottom-6 -left-6 rounded-2xl animate-bounce">
                <div className="flex items-center justify-center w-10 h-10 text-green-600 bg-green-100 rounded-full">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400">
                    Hiring status
                  </p>
                  <p className="text-sm font-bold text-[#1a2e52]">
                    Actively Recruiting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* --- VALUES SECTION --- */}
      <section className="px-6 py-10 mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-3">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="p-7 transition-all duration-300 bg-white border border-gray-100 rounded-[2.5rem] hover:shadow-xl group"
            >
              <div
                className={`inline-block p-5 ${value.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform`}
              >
                {value.icon}
              </div>
              <h3 className="mb-4 text-2xl font-bold text-[#1a2e52] font-jakarta">
                {value.title}
              </h3>
              <p className="text-sm font-medium leading-relaxed text-gray-400">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- UPDATED PERKS SECTION: White BG + Blue Text/Icon Hover --- */}
      <section className="relative px-6 py-14 overflow-hidden bg-white">
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="mb-4 text-4xl font-[1000] tracking-tighter text-[#1a2e52] font-jakarta md:text-5xl">
              Perks of Being an <span className="text-[#0077cc]">Explorer</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg font-medium text-gray-500">
              We provide the tools and freedom you need to do your best work and
              push the boundaries of AI.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {perks.map((perk, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                viewport={{ once: true }}
                className="group p-7 bg-white rounded-[2.5rem] border border-gray-100 transition-all duration-300 hover:border-[#0077cc]/30 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-2"
              >
                <div className="inline-block mb-6 transition-transform duration-300 group-hover:scale-110">
                  <perk.icon
                    size={40}
                    className="text-black transition-colors duration-300 group-hover:text-[#0077cc]"
                    strokeWidth={1.5}
                  />
                </div>

                <h4 className="mb-3 text-2xl font-bold text-[#1a2e52] transition-colors duration-300 group-hover:text-[#0077cc] font-jakarta">
                  {perk.title}
                </h4>

                <p className="text-sm font-medium leading-relaxed text-gray-400 transition-colors duration-300 group-hover:text-gray-600">
                  {perk.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- OPEN POSITIONS --- */}
      <section id="openings" className="max-w-6xl px-6 py-14 mx-auto">
        <div className="mb-9 text-center">
          <h2 className="mb-4 text-4xl font-black text-[#1a2e52] font-jakarta tracking-tight">
            Join the Team
          </h2>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  activeFilter === filter
                    ? "bg-[#1a2e52] text-white shadow-lg scale-105"
                    : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-7 bg-white border border-gray-100 shadow-sm rounded-[2.5rem] hover:shadow-2xl hover:translate-x-2 transition-all group"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="mb-3 text-2xl font-black text-[#1a2e52] group-hover:text-[#0077cc] transition-colors font-jakarta tracking-tight">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 mb-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                    <span className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#0077cc]" />{" "}
                      {job.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <Briefcase size={14} className="text-[#0077cc]" />{" "}
                      {job.type}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock size={14} className="text-[#0077cc]" />{" "}
                      {job.department}
                    </span>
                  </div>
                  <p className="max-w-2xl text-sm font-medium text-gray-400">
                    {job.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    window.open(
                      `https://uptoskills.com/homeJobs#${job.title.replace(/\s+/g, "-").toLowerCase()}`,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                  className="px-8 py-4 bg-gradient-to-r from-[#e65100] to-[#f4511e] text-white rounded-xl font-bold transition-all shadow-[0_10px_20px_rgba(230,81,0,0.2)] hover:scale-105"
                >
                  Apply Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-5xl px-6 py-14 mx-auto"
      >
        <div className="relative p-9 overflow-hidden text-center bg-[#1a2e52] rounded-[3rem]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#0077cc]/20 blur-3xl" />
          <div className="relative z-10">
            <h2 className="mb-4 text-4xl font-black tracking-tighter text-white font-jakarta md:text-5xl">
              Want to Build Something Big?
            </h2>
            <p className="max-w-2xl mx-auto mb-7 text-xl font-medium leading-relaxed text-blue-100/60">
              If you don't see a role that fits but you're a wizard at AI,
              design, or engineering, reach out anyway.
            </p>
            <button
              type="button"
              onClick={() =>
                window.open(
                  "https://uptoskills.com/homeJobs",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#1a2e52] rounded-xl font-black text-lg transition-all hover:scale-105 shadow-2xl"
            >
              Send a General Application
              <ArrowRight size={20} className="text-red-500 fill-red-500" />
            </button>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default CareersPage;


