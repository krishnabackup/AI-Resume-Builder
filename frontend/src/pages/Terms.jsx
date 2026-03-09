import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Scale,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import UpToSkillsImg from "../assets/UptoSkills.webp";
import NavBar from "../components/NavBar";
import Footer from "./Footer"

const TermsAndConditions = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-jakarta text-[#1a2e52] select-none">
      <NavBar />

      {/* Header Section */}
      <header className="px-8 pt-24 pb-12 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-4 bg-[#0077cc]/10 rounded-3xl text-[#0077cc] mb-6">
            <Scale size={40} />
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">
            Terms & Conditions
          </h1>
          <p className="font-medium text-gray-500">
            Last updated: December 30, 2025
          </p>
        </div>
      </header>

      {/* Main Content Area - Centered Layout */}
      <div className="max-w-5xl px-6 py-16 mx-auto">
        <main className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-xl shadow-slate-200/50 border border-gray-100">
          <div className="space-y-16">
            <section id="acceptance">
              <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold">
                <span className="w-10 h-10 bg-[#e65100]/10 text-[#e65100] flex items-center justify-center rounded-xl text-base font-black">
                  1
                </span>
                Acceptance of Terms
              </h2>
              <p className="text-lg leading-relaxed text-gray-600">
              By accessing or using the UptoSkills website and our AI Resume Builder,
              you agree to comply with and be bound by these Terms of Service.
              These terms apply to all visitors, users, and others who access or use
              the Service. If you do not agree with any part of these terms, you are
              prohibited from using this website.
              </p>
            </section>

            <section id="intellectual">
              <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold">
                <span className="w-10 h-10 bg-[#e65100]/10 text-[#e65100] flex items-center justify-center rounded-xl text-base font-black">
                  2
                </span>
                Intellectual Property
              </h2>
              <p className="text-lg leading-relaxed text-gray-600">
               All content available on the UptoSkills website, including but not limited
               to text, graphics, logos, resume templates, AI algorithms, and software,
               is the exclusive property of UptoSkills and is protected by applicable
               intellectual property laws. You may not use, modify, reproduce, distribute,
               or create derivative works from any content without our prior written permission.
              </p>
            </section>

            <section id="usage">
              <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold">
                <span className="w-10 h-10 bg-[#e65100]/10 text-[#e65100] flex items-center justify-center rounded-xl text-base font-black">
                  3
                </span>
                Use of the Website
              </h2>
              <p className="text-lg leading-relaxed text-gray-600">
               You are permitted to use the UptoSkills AI Resume Builder solely for
               personal career development purposes. You agree not to engage in:
              </p>
              <ul className="pl-6 mt-6 space-y-4 text-gray-600 list-none">
                {[
                  "Automated data collection (scraping) of our resume templates.",
                  "Attempting to reverse-engineer the AI content generation engine.",
                  "Sharing account access with unauthorized third parties.",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ChevronRight
                      className="text-[#0077cc] mt-1 shrink-0"
                      size={18}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* --- UPDATED SECTION 4 --- */}
            <section id="ai-content">
              <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold">
                <span className="w-10 h-10 bg-[#e65100]/10 text-[#e65100] flex items-center justify-center rounded-xl text-base font-black">
                  4
                </span>
                AI Content & User Responsibility
              </h2>
              <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem] relative overflow-hidden">
                <h3 className="text-lg font-bold mb-3 text-[#0077cc] flex items-center gap-2">
                  Disclaimer on AI Accuracy
                </h3>
                <p className="relative z-10 text-lg leading-relaxed text-gray-600">
                Our AI provides suggestions based on industry patterns and available data.
                UptoSkills does not guarantee the accuracy, completeness, or reliability
                of AI-generated content. Users are responsible for reviewing and verifying
                all information in their resumes before submission to employers.
                </p>
              </div>
            </section>

            <section id="privacy">
              <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold">
                <span className="w-10 h-10 bg-[#e65100]/10 text-[#e65100] flex items-center justify-center rounded-xl text-base font-black">
                  5
                </span>
                Privacy Policy
              </h2>
              <p className="text-lg leading-relaxed text-gray-600">
              We collect, use, and process personal data in accordance with our Privacy Policy
              to provide and improve our services. Our Privacy Policy explains how we collect,
              use, store, and protect your personal information, including resume data and
              contact details. By using our services, you consent to the data practices
              described in our Privacy Policy.
              </p>
            </section>

            <section id="liability">
              <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold">
                <span className="w-10 h-10 bg-[#e65100]/10 text-[#e65100] flex items-center justify-center rounded-xl text-base font-black">
                  6
                </span>
                Limitation of Liability
              </h2>
              <p className="p-6 text-lg italic leading-relaxed text-gray-600 border bg-slate-50 rounded-2xl border-slate-100">
               To the fullest extent permitted by applicable law, UptoSkills and its affiliates
               shall not be liable for any direct, indirect, incidental, consequential, or
               special damages (including but not limited to loss of job opportunities)
               arising from your use of the platform or from any resume’s inability to
              secure employment.
              </p>
            </section>
          </div>

          {/* Contact Support Section */}
          <div className="grid gap-6 pt-16 mt-20 border-t border-gray-100 md:grid-cols-3">
            <div className="flex flex-col items-center p-8 text-center bg-slate-50 rounded-[2rem] transition-transform hover:-translate-y-1">
              <Mail className="text-[#0077cc] mb-4" size={28} />
              <p className="mb-1 text-xs font-bold tracking-widest text-gray-400 uppercase">
                Email
              </p>
              <p className="text-sm font-bold">info@uptoskills.com</p>
            </div>
            <div className="flex flex-col items-center p-8 text-center bg-slate-50 rounded-[2rem] transition-transform hover:-translate-y-1">
              <Phone className="text-[#0077cc] mb-4" size={28} />
              <p className="mb-1 text-xs font-bold tracking-widest text-gray-400 uppercase">
                Phone
              </p>
              <p className="text-sm font-bold">+91-9319772294</p>
            </div>
            <div className="flex flex-col items-center p-8 text-center bg-slate-50 rounded-[2rem] transition-transform hover:-translate-y-1">
              <MapPin className="text-[#0077cc] mb-4" size={28} />
              <p className="mb-1 text-xs font-bold tracking-widest text-gray-400 uppercase">
                Office
              </p>
              <p className="text-sm font-bold">Palam, New Delhi</p>
            </div>
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
