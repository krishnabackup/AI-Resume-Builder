import { useState } from 'react';
import Footer from "./Footer"
import NavBar from "../components/NavBar";
// Add MapPin and Mail to your existing lucide-react import
import { Mail, Phone, LifeBuoy, Users, MessageSquare, Zap, MapPin } from 'lucide-react';
import BlurCircle from './BlurCircle';
import { motion } from 'framer-motion';

function Contact() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const stats = [
    { label: 'Active Users', value: '50K+', color: 'text-green-500' },
    { label: 'Companies', value: '500+', color: 'text-blue-500' },
    { label: 'Response Time', value: '24hrs', color: 'text-orange-500' },
    { label: 'Success Rate', value: '95%', color: 'text-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-white font-['Outfit'] overflow-hidden">
      {/* NAVIGATION */}
    <NavBar />
    <div className="h-12" />
      {/* HERO SECTION - MATCHING REFERENCE IMAGE */}
     <section className="relative px-6 pt-20 md:pt-32 lg:pt-40 pb-14 overflow-hidden bg-white isolate">
  
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
  className="absolute top-48 left-[12%] w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(59,130,246,0.3)] border-2 border-blue-50 hidden xl:flex group z-20"
  animate={{
    y: [0, -12, 0],         // Moves up and down
    rotate: [0, 5, -5, 0],  // Subtle tilt back and forth
  }}
  transition={{
    duration: 6,            // How long one cycle takes
    repeat: Infinity,       // Loops forever
    ease: "easeInOut"       // Smooth movement
  }}
  whileHover={{ scale: 1.1 }} // Keeps your hover effect
>
  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 rounded-2xl -z-10"></div>
  <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl">
    <Users size={28} className="text-white" />
  </div>
</motion.div>
  
  {/* Middle Right Icon */}
  <motion.div 
  className="absolute top-72 right-[10%] w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(249,115,22,0.2)] border-2 border-orange-50 hidden xl:flex group z-20"
  animate={{
    y: [0, 15, 0],          // Moves down then up (opposite of the blue icon)
    rotate: [0, -8, 8, 0],  // Swings in a wider arc
  }}
  transition={{
    duration: 7,            // Slightly slower than the blue one for "offset"
    repeat: Infinity,
    ease: "easeInOut",
    delay: 1                // Starts 1 second late to break the symmetry
  }}
  whileHover={{ scale: 1.1 }}
>
  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-pink-400/10 rounded-2xl -z-10"></div>
  <div className="flex items-center justify-center w-10 h-10 shadow-lg bg-gradient-to-br from-orange-400 to-red-500 rounded-xl">
    <MessageSquare size={22} className="text-white" />
  </div>
</motion.div>

  <div className="max-w-[1200px] mx-auto text-center flex flex-col items-center relative z-10">
    {/* Support Badge */}
    <div className="inline-flex items-center gap-3 px-6 py-2.5 mb-10 bg-white border border-gray-100 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.03)] group hover:border-purple-100 transition-all duration-300">
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
      <span className="text-transparent bg-gradient-to-r from-[#0077cc] via-[#0056b3] to-[#e65100] bg-clip-text">
        Help You Succeed
      </span>
    </h1>

    <p className="max-w-xl mb-12 text-lg leading-relaxed text-gray-500">
      Get personalized support and connect with our team to achieve your career goals.
    </p>

    {/* COMPACT Contact Method Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-[900px] mb-16">
      <div className="group p-6 bg-white border border-gray-100 rounded-[1.5rem] hover:shadow-xl hover:border-blue-100 transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-green-600 transition-transform bg-green-50 rounded-xl group-hover:scale-110">
          <Mail size={24} />
        </div>
        <h3 className="text-base font-bold text-[#1a2e52] mb-0.5">Email Support</h3>
        <p className="text-[11px] font-semibold tracking-tight text-gray-400">Within 24 hours</p>
      </div>

      <div className="group p-6 bg-white border border-gray-100 rounded-[1.5rem] hover:shadow-xl hover:border-orange-100 transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-orange-600 transition-transform bg-orange-50 rounded-xl group-hover:scale-110">
          <Phone size={24} />
        </div>
        <h3 className="text-base font-bold text-[#1a2e52] mb-0.5">Phone Support</h3>
        <p className="text-[11px] font-semibold tracking-tight text-gray-400">Mon-Fri 9AM-6PM</p>
      </div>

      <div className="group p-6 bg-white border border-gray-100 rounded-[1.5rem] hover:shadow-xl hover:border-blue-100 transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-blue-600 transition-transform bg-blue-50 rounded-xl group-hover:scale-110">
          <LifeBuoy size={24} />
        </div>
        <h3 className="text-base font-bold text-[#1a2e52] mb-0.5">Help Center</h3>
        <p className="text-[11px] font-semibold tracking-tight text-gray-400">FAQs & guides</p>
      </div>
    </div>

    {/* STATS BAR - Directly visible under cards */}
   <div className="grid w-full grid-cols-2 gap-8 py-10 border-t border-gray-100 lg:grid-cols-4 max-w-[1200px] mx-auto bg-transparent">
  {/* 50K+ */}
  <div className="flex flex-col items-center group">
    <span className="inline-block mb-1 text-3xl font-black tracking-tight text-green-500 lg:text-4xl animate-pulse-zoom">
      50K+
    </span>
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Active Users</span>
  </div>

  {/* 500+ */}
  <div className="flex flex-col items-center group">
    <span className="inline-block mb-1 text-3xl font-black tracking-tight text-blue-500 lg:text-4xl animate-pulse-zoom">
      500+
    </span>
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Companies</span>
  </div>

  {/* 24hrs */}
  <div className="flex flex-col items-center group">
    <span className="inline-block mb-1 text-3xl font-black tracking-tight text-orange-500 lg:text-4xl animate-pulse-zoom">
      24hrs
    </span>
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Response Time</span>
  </div>

  {/* 95% */}
  <div className="flex flex-col items-center group">
    <span className="inline-block mb-1 text-3xl font-black tracking-tight text-purple-500 lg:text-4xl animate-pulse-zoom">
      95%
    </span>
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Success Rate</span>
  </div>
</div>
  </div>
</section>
<section className="relative px-6 py-18 overflow-hidden bg-white lg:px-8">
  {/* Background Decorative Element */}
  <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-50/50 blur-[100px] rounded-full -z-10" />
  
  <div className="max-w-[1200px] mx-auto">
    
    {/* Header Section */}
    <div className="text-center mb-14">
      <h2 className="text-4xl lg:text-5xl font-black text-[#1a2e52] mb-3 tracking-tight">
        Get In <span className="text-transparent bg-gradient-to-r from-[#0077cc] via-blue-600 to-purple-500 bg-clip-text">Touch</span>
      </h2>
      <p className="max-w-xl mx-auto text-base leading-relaxed text-gray-500">
        Have questions? We're here to help you navigate your journey to success.
      </p>
    </div>

    {/* Increased Gap from gap-6/8 to gap-12 or gap-16 */}
    <div className="grid items-start gap-12 lg:grid-cols-5 lg:gap-16">
      
      {/* LEFT COLUMN: Why Contact Us */}
      <div className="space-y-6 lg:col-span-2">
        
        {/* Info Card */}
        <div className="bg-[#1a2e52] text-white p-7 rounded-[1.8rem] shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/5 group hover:-translate-y-1">
          <h3 className="mb-6 text-xl font-bold">Why Contact Us?</h3>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 transition-transform duration-300 hover:translate-x-2">
              <div className="flex items-center justify-center text-purple-400 transition-colors border w-9 h-9 rounded-xl shrink-0 bg-purple-500/10 border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white">
                <Users size={18} />
              </div>
              <div>
                <h4 className="text-base font-bold">Personalized Guidance</h4>
                <p className="text-xs text-gray-400">Tailored advice for your goals</p>
              </div>
            </div>

            <div className="flex items-center gap-4 transition-transform duration-300 hover:translate-x-2">
              <div className="flex items-center justify-center text-blue-400 transition-colors border w-9 h-9 rounded-xl shrink-0 bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white">
                <LifeBuoy size={18} />
              </div>
              <div>
                <h4 className="text-base font-bold">Enterprise Solutions</h4>
                <p className="text-xs text-gray-400">Organizational scaling paths</p>
              </div>
            </div>

            <div className="flex items-center gap-4 transition-transform duration-300 hover:translate-x-2">
              <div className="flex items-center justify-center text-green-400 transition-colors border w-9 h-9 rounded-xl shrink-0 bg-green-500/10 border-green-500/20 group-hover:bg-green-500 group-hover:text-white">
                <Zap size={18} />
              </div>
              <div>
                <h4 className="text-base font-bold">Academic Partnerships</h4>
                <p className="text-xs text-gray-400">Educational collaborations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Gradient Card */}
        <div className="bg-gradient-to-br from-[#0077cc] to-purple-600 text-white p-7 rounded-[1.8rem] shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-500">
          <div className="absolute top-0 right-0 w-24 h-24 transition-transform rounded-full bg-white/10 blur-2xl group-hover:scale-150" />
          <h3 className="mb-3 text-xl font-bold">Transform Your Future</h3>
          <p className="mb-5 text-sm text-white/80">Join 10,000+ learners already on their way to success.</p>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-7 h-7 bg-gray-200 border-2 border-[#0077cc] rounded-full" />
              ))}
            </div>
            <span className="text-xs font-bold tracking-wider uppercase">Happy Learners</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Contact Form */}
      <div className="lg:col-span-3 bg-white p-8 lg:p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-blue-100 transition-all duration-500 hover:-translate-y-1">
        <h3 className="mb-6 text-xl font-bold text-[#1a2e52]">Send us a Message</h3>
        
        <form className="space-y-5">
          <div className="space-y-1.5">
            <label className="ml-1 text-xs font-bold tracking-widest text-gray-400 uppercase">Who are you?</label>
            <select className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 text-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer">
              <option>Select your role</option>
              <option>Student</option>
              <option>Professional</option>
              <option>Employer</option>
            </select>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="ml-1 text-xs font-bold tracking-widest text-gray-400 uppercase">Full Name</label>
              <div className="relative group/input">
                <Users className="absolute text-gray-400 transition-colors -translate-y-1/2 left-4 top-1/2 group-focus-within/input:text-blue-500" size={16} />
                <input type="text" placeholder="Your name" className="w-full pl-10 pr-5 py-3.5 bg-gray-50 border border-gray-100 text-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="ml-1 text-xs font-bold tracking-widest text-gray-400 uppercase">Email</label>
              <div className="relative group/input">
                <Mail className="absolute text-gray-400 transition-colors -translate-y-1/2 left-4 top-1/2 group-focus-within/input:text-blue-500" size={16} />
                <input type="email" placeholder="email@example.com" className="w-full pl-10 pr-5 py-3.5 bg-gray-50 border border-gray-100 text-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 text-xs font-bold tracking-widest text-gray-400 uppercase">Phone Number</label>
            <div className="relative group/input">
              <div className="absolute flex items-center gap-1.5 text-gray-500 -translate-y-1/2 left-4 top-1/2 font-bold text-sm">
                <span>🇮🇳</span> <span>+91</span>
              </div>
              <input type="tel" className="w-full pl-20 pr-5 py-3.5 bg-gray-50 border border-gray-100 text-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
            </div>
          </div>

          <button className="flex items-center justify-center w-full gap-2 py-4 mt-2 font-bold text-white transition-all shadow-md bg-[#1a2e52] rounded-xl hover:bg-[#0077cc] hover:shadow-blue-200 active:scale-95 group">
            <Zap size={18} className="transition-transform group-hover:scale-125" />
            Send Message
          </button>
        </form>
      </div>

    </div>
  </div>
</section>

{/* MODERN CONTACT INFO BAR */}
<section className="relative px-6 pb-24 lg:px-8">
  <div className="max-w-[1200px] mx-auto">
    {/* Inner Container with subtle glow and glass effect */}
    <div className="relative overflow-hidden bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-2">
      
      {/* Subtle Background Accent for the section */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-50/50 blur-3xl -z-10" />
      
      <div className="grid grid-cols-1 divide-y md:grid-cols-3 md:divide-y-0 md:divide-x divide-gray-50">
        
        {/* OFFICE CARD */}
        <div className="flex items-center gap-5 p-8 transition-all duration-300 group hover:bg-gray-50/50">
          <div className="flex items-center justify-center transition-all duration-500 bg-white border border-gray-100 shadow-sm w-14 h-14 rounded-2xl text-[#1a2e52] group-hover:bg-[#1a2e52] group-hover:text-white group-hover:-translate-y-1">
            <MapPin size={24} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Visit Us</span>
            <h4 className="text-base font-bold text-[#1a2e52]">Palam, New Delhi</h4>
          </div>
        </div>

        {/* EMAIL CARD */}
        <div className="flex items-center gap-5 p-8 transition-all duration-300 group hover:bg-gray-50/50">
          <div className="flex items-center justify-center text-blue-600 transition-all duration-500 bg-white border border-gray-100 shadow-sm w-14 h-14 rounded-2xl group-hover:bg-blue-600 group-hover:text-white group-hover:-translate-y-1">
            <Mail size={24} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Email Support</span>
            <a href="mailto:info@uptoskills.com" className="text-base font-bold text-[#1a2e52] hover:text-blue-600 transition-colors">
              info@uptoskills.com
            </a>
          </div>
        </div>

        {/* PHONE CARD */}
        <div className="flex items-center gap-5 p-8 transition-all duration-300 group hover:bg-gray-50/50">
          <div className="flex items-center justify-center text-green-600 transition-all duration-500 bg-white border border-gray-100 shadow-sm w-14 h-14 rounded-2xl group-hover:bg-green-600 group-hover:text-white group-hover:-translate-y-1">
            <Phone size={24} strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Call Anytime</span>
            <a href="tel:+919319772294" className="text-base font-bold text-[#1a2e52] hover:text-green-600 transition-colors">
              +91-9319772294
            </a>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>

      <Footer />
    </div>
  );
}

export default Contact;