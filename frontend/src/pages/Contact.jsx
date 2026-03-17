import { useState, useMemo } from "react";
import Footer from "./Footer";
import NavBar from "../components/NavBar";
// Add MapPin and Mail to your existing lucide-react import
import {
  Mail,
  Phone,
  LifeBuoy,
  Users,
  MessageSquare,
  Zap,
  MapPin,
  CheckCircle2, // Added for success state
} from "lucide-react";
import BlurCircle from "./BlurCircle";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const STATS_DATA = [
  { label: "Active Users", value: "50K+", color: "text-green-500" },
  { label: "Companies", value: "500+", color: "text-blue-500" },
  { label: "Response Time", value: "24hrs", color: "text-orange-500" },
  { label: "Success Rate", value: "95%", color: "text-purple-500" },
];

const WHY_CONTACT_ITEMS = [
  { icon: Users, title: "Personalized Guidance", desc: "Tailored advice for your goals", color: "purple" },
  { icon: LifeBuoy, title: "Enterprise Solutions", desc: "Organizational scaling paths", color: "blue" },
  { icon: Zap, title: "Academic Partnerships", desc: "Educational collaborations", color: "green" },
];

function Contact() {
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSent, setIsSent] = useState(false);

  // Optimized stats using useMemo
  const stats = useMemo(() => STATS_DATA, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending
    setIsSent(true);
    setTimeout(() => setIsSent(false), 5000); // Reset after 5 seconds
  };

  return (
    <div className="min-h-screen bg-white font-['Outfit'] overflow-x-hidden">
      {/* NAVIGATION */}
      <NavBar />
      <div className="h-12" />
      {/* HERO SECTION - MATCHING REFERENCE IMAGE */}
      <section className="relative px-6 pt-16 md:pt-32 lg:pt-14 pb-14 bg-white isolate">
        {/* BLUR CIRCLES - Using more saturated colors for visibility */}
        <BlurCircle
          top="23%"
          right="2%"
          color="bg-orange-300/40"
          size="h-[500px] w-[500px]"
        />

        <BlurCircle
          top="10%"
          left="0%"
          color="bg-blue-300/40"
          size="h-[600px] w-[600px]"
        />

        {/* Floating Background Icons */}
        <motion.div
          className="absolute top-48 left-[12%] w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(59,130,246,0.3)] border-2 border-blue-50 xl:flex group z-20"
          animate={{
            y: [0, -12, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 rounded-2xl -z-10"></div>
          <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl">
            <Users size={28} className="text-white" />
          </div>
        </motion.div>

        {/* Middle Right Icon */}
        <motion.div
          className="absolute top-72 right-[10%] w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(249,115,22,0.2)] border-2 border-orange-50 xl:flex group z-20"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -8, 8, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          whileHover={{ scale: 1.1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-pink-400/10 rounded-2xl -z-10"></div>
          <div className="flex items-center justify-center w-10 h-10 shadow-lg bg-gradient-to-br from-orange-400 to-red-500 rounded-xl">
            <MessageSquare size={22} className="text-white" />
          </div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-[1200px] mx-auto text-center flex flex-col items-center relative z-10"
        >
          <motion.div variants={fadeUp}>
            {/* Support Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-2.5 mb-10 bg-white border border-gray-100 rounded-full shadow-sm hover:border-purple-100 transition-all duration-300">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-50">
                <Users size={16} className="text-purple-600" />
              </div>
              <span className="text-xs font-bold text-[#1a2e52] uppercase tracking-[0.15em]">
                Dedicated Support Team
              </span>
              <div className="relative flex w-2 h-2 ml-1">
                <div className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></div>
                <div className="relative inline-flex w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>

            {/* Main Heading - Sized for impact but clean */}
            <h1 className="text-5xl lg:text-[72px] font-black text-[#1a2e52] leading-[1.1] mb-6 tracking-tight">
              We're Here to <br />
              <span className="text-[#0077cc]">Help You Succeed</span>
            </h1>

            <p className="max-w-xl mx-auto mb-12 text-lg leading-relaxed text-gray-500">
              Get personalized support and connect with our team to achieve your
              career goals.
            </p>

            {/* COMPACT Contact Method Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-[900px] mb-16">
              <a href="mailto:info@uptoskills.com" className="group p-6 bg-white border border-gray-100 rounded-[1.5rem] hover:shadow-xl hover:border-blue-100 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-green-600 transition-transform bg-green-50 rounded-xl group-hover:scale-110">
                  <Mail size={24} />
                </div>
                <h3 className="text-base font-bold text-[#1a2e52] mb-0.5">Email Support</h3>
                <p className="text-[11px] font-semibold tracking-tight text-gray-400">Within 24 hours</p>
              </a>

              <a href="tel:+919319772294" className="group p-6 bg-white border border-gray-100 rounded-[1.5rem] hover:shadow-xl hover:border-orange-100 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-orange-600 transition-transform bg-orange-50 rounded-xl group-hover:scale-110">
                  <Phone size={24} />
                </div>
                <h3 className="text-base font-bold text-[#1a2e52] mb-0.5">Phone Support</h3>
                <p className="text-[11px] font-semibold tracking-tight text-gray-400">Mon-Fri 9AM-6PM</p>
              </a>

              <div className="group p-6 bg-white border border-gray-100 rounded-[1.5rem] hover:shadow-xl hover:border-blue-100 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-blue-600 transition-transform bg-blue-50 rounded-xl group-hover:scale-110">
                  <LifeBuoy size={24} />
                </div>
                <h3 className="text-base font-bold text-[#1a2e52] mb-0.5">Help Center</h3>
                <p className="text-[11px] font-semibold tracking-tight text-gray-400">FAQs & guides</p>
              </div>
            </div>

            {/* STATS BAR - Directly visible under cards */}
            <div className="grid w-full grid-cols-2 gap-8 py-10 border-t border-gray-100 lg:grid-cols-4 max-w-[1200px] mx-auto">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className={`inline-block mb-1 text-3xl font-black tracking-tight ${stat.color} lg:text-4xl`}>
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative px-6 py-12 lg:px-8 bg-white overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-50/50 blur-[100px] rounded-full -z-10" />

        <div className="max-w-[1200px] mx-auto">
          {/* Header Section */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl lg:text-5xl font-black text-[#1a2e52] mb-3 tracking-tight">
              Get In <span className="text-transparent bg-gradient-to-r from-[#0077cc] via-blue-600 to-purple-500 bg-clip-text">Touch</span>
            </h2>
            <p className="max-w-xl mx-auto text-base text-gray-500">
              Have questions? We're here to help you navigate your journey to success.
            </p>
          </motion.div>

          {/* Contact Section Layout */}
          <div className="grid items-start gap-12 lg:grid-cols-5 lg:gap-16">
            {/* LEFT COLUMN: Why Contact Us */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-6 lg:col-span-2">
              <div className="bg-[#1a2e52] text-white p-8 rounded-[1.8rem] shadow-lg border border-white/5">
                <h3 className="mb-6 text-xl font-bold">Why Contact Us?</h3>
                <div className="space-y-6">
                  {WHY_CONTACT_ITEMS.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 transition-transform duration-300 hover:translate-x-2">
                      <div className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 bg-${item.color}-500/10 border border-${item.color}-500/20 text-${item.color}-400`}>
                        <item.icon size={18} />
                      </div>
                      <div>
                        <h4 className="text-base font-bold">{item.title}</h4>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0077cc] to-purple-600 text-white p-8 rounded-[1.8rem] shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 transition-transform rounded-full bg-white/10 blur-2xl group-hover:scale-150" />
                <h3 className="mb-3 text-xl font-bold">Transform Your Future</h3>
                <p className="mb-5 text-sm text-white/80">Join 10,000+ learners already on their way to success.</p>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-7 h-7 bg-gray-200 border-2 border-[#0077cc] rounded-full" />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Contact Form */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="lg:col-span-3 bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100"
            >
              <AnimatePresence mode="wait">
                {!isSent ? (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                    <h3 className="mb-6 text-xl font-bold text-[#1a2e52]">Send us a Message</h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="ml-1 text-xs font-bold text-gray-400 uppercase tracking-widest">Who are you?</label>
                        <select name="role" required onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 text-gray-700 rounded-xl focus:border-blue-500 outline-none transition-all cursor-pointer">
                          <option value="">Select your role</option>
                          <option value="Student">Student</option>
                          <option value="Professional">Professional</option>
                          <option value="Employer">Employer</option>
                        </select>
                      </div>

                      <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="ml-1 text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                          <div className="relative group/input">
                            <Users className="absolute text-gray-400 left-4 top-1/2 -translate-y-1/2 group-focus-within/input:text-blue-500" size={16} />
                            <input name="name" type="text" required placeholder="Your name" onChange={handleChange} className="w-full pl-10 pr-5 py-3.5 bg-gray-50 border border-gray-100 text-gray-700 rounded-xl focus:border-blue-500 outline-none transition-all" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="ml-1 text-xs font-bold text-gray-400 uppercase tracking-widest">Email</label>
                          <div className="relative group/input">
                            <Mail className="absolute text-gray-400 left-4 top-1/2 -translate-y-1/2 group-focus-within/input:text-blue-500" size={16} />
                            <input name="email" type="email" required placeholder="email@example.com" onChange={handleChange} className="w-full pl-10 pr-5 py-3.5 bg-gray-50 border border-gray-100 text-gray-700 rounded-xl focus:border-blue-500 outline-none transition-all" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="ml-1 text-xs font-bold text-gray-400 uppercase tracking-widest">Message</label>
                        <textarea name="message" required rows="4" placeholder="How can we help you?" onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 text-gray-700 rounded-xl focus:border-blue-500 outline-none transition-all resize-none"></textarea>
                      </div>

                      <button type="submit" className="flex items-center justify-center w-full gap-2 py-4 mt-2 font-bold text-white shadow-md bg-[#1a2e52] rounded-xl hover:bg-[#0077cc] transition-all group active:scale-95">
                        <Zap size={18} className="group-hover:scale-125 transition-transform" />
                        Send Message
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center">
                    <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-green-50 rounded-full">
                      <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <h3 className="text-2xl font-black text-[#1a2e52] mb-2">Message Sent!</h3>
                    <p className="text-gray-500">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                    <button onClick={() => setIsSent(false)} className="mt-8 text-sm font-bold text-blue-600 hover:underline">Send another message</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MODERN CONTACT INFO BAR */}
      <section className="px-6 pb-12 pt-12">
        <div className="max-w-[1200px] mx-auto bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 divide-y md:grid-cols-3 md:divide-y-0 md:divide-x divide-gray-50">
            {/* OFFICE CARD */}
            <div className="flex items-center gap-5 p-8 transition-all duration-300 group hover:bg-gray-50/50">
              <div className="flex items-center justify-center transition-all duration-500 bg-white border border-gray-100 shadow-sm w-14 h-14 rounded-2xl text-[#1a2e52] group-hover:bg-[#1a2e52] group-hover:text-white">
                <MapPin size={24} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Visit Us</span>
                <h4 className="text-base font-bold text-[#1a2e52]">Palam, New Delhi</h4>
              </div>
            </div>

            {/* EMAIL CARD */}
            <a href="mailto:info@uptoskills.com" className="flex items-center gap-5 p-8 transition-all duration-300 group hover:bg-gray-50/50">
              <div className="flex items-center justify-center text-blue-600 transition-all duration-500 bg-white border border-gray-100 shadow-sm w-14 h-14 rounded-2xl group-hover:bg-blue-600 group-hover:text-white">
                <Mail size={24} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Email Support</span>
                <span className="text-base font-bold text-[#1a2e52]">info@uptoskills.com</span>
              </div>
            </a>

            {/* PHONE CARD */}
            <a href="tel:+919319772294" className="flex items-center gap-5 p-8 transition-all duration-300 group hover:bg-gray-50/50">
              <div className="flex items-center justify-center text-green-600 transition-all duration-500 bg-white border border-gray-100 shadow-sm w-14 h-14 rounded-2xl group-hover:bg-green-600 group-hover:text-white">
                <Phone size={24} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Call Anytime</span>
                <span className="text-base font-bold text-[#1a2e52]">+91-9319772294</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Contact;