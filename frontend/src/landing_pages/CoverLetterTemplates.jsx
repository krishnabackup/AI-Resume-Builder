import React, { useState } from 'react';
import { 
  X, Mail, Phone, Linkedin, Calendar, MapPin, 
  Download, Printer, FileText, Eye, Briefcase, 
  ChevronDown, Search, ArrowRight 
} from 'lucide-react';
import Footer from "./Footer";

const CoverLetterTemplates = ({ onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  // Categories inspired by the video
  const categories = ['All', 'Simple', 'Creative', 'Modern', 'Professional', 'Executive'];
  
  const templates = [
    { id: 1, title: "Modern Professional", category: "Modern", description: "Clean lines and high readability." },
    { id: 2, title: "Creative Blueprint", category: "Creative", description: "Bold colors for a standout application." },
    { id: 3, title: "Executive Minimal", category: "Professional", description: "Traditional layout for senior roles." },
    { id: 4, title: "Simple Classic", category: "Simple", description: "A timeless look that works for any industry." },
    { id: 5, title: "Tech Lead", category: "Executive", description: "Structured for high-impact leadership roles." },
    { id: 6, title: "Artistic Flow", category: "Creative", description: "Visual-first design for designers and artists." },
  ];

  // Logic to handle "Full Page" Preview Mode
  if (selectedTemplate) {
    return (
      <div className="fixed inset-0 z-[110] bg-[#f8fafc] flex flex-col animate-in slide-in-from-bottom-5 duration-500">
        <nav className="flex items-center justify-between h-20 px-8 bg-white border-b border-gray-200 shadow-sm no-print">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedTemplate(null)} 
              className="flex items-center gap-2 p-2 pr-4 text-gray-500 transition-all group hover:bg-red-50 rounded-xl hover:text-red-600"
            >
              <div className="p-2 transition-colors bg-gray-100 rounded-lg group-hover:bg-red-100">
                <X size={20} />
              </div>
              <span className="text-sm font-bold">Exit Preview</span>
            </button>
            <div className="h-8 w-[1px] bg-gray-200 mx-2" />
            <span className="font-black text-[#1a2e52] tracking-tight">{selectedTemplate.title}</span>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => window.print()} 
              className="px-6 py-2.5 bg-[#0077cc] text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-600 flex items-center gap-2 transition-all active:scale-95"
            >
              <Download size={18} /> Download PDF
            </button>
          </div>
        </nav>

        <main className="flex-1 p-6 overflow-y-auto md:p-12 bg-slate-100/40 custom-scrollbar">
          <div id="cover-letter-content" className="mx-auto w-full max-w-[850px] bg-white shadow-2xl min-h-[1100px] p-16 md:p-24 rounded-sm border border-gray-100 print:shadow-none print:border-0 print:m-0">
              <header className="pb-10 mb-10 border-b-4 border-[#0077cc]">
                <h1 className="text-5xl font-[1000] text-[#1a2e52] mb-4 tracking-tighter text-left">John Applicant</h1>
                <p className="text-sm font-bold tracking-widest text-left text-gray-500 uppercase">Frontend Developer</p>
              </header>
              <div className="space-y-8 text-left text-slate-700 leading-relaxed font-['Outfit']">
                 <div className="inline-flex items-center gap-2 font-black text-[#1a2e52] bg-blue-50/50 px-4 py-2 rounded-lg border border-blue-100">
                    <Calendar size={18} className="text-[#0077cc]" />
                    <span>January 24, 2026</span>
                 </div>
                 <p className="font-bold text-xl text-[#1a2e52]">Dear Hiring Manager,</p>
                 <p>I am writing to express my enthusiastic interest in the Frontend Developer position. With a strong foundation in building production-ready React applications and a passion for crafting pixel-perfect user experiences, I am confident in my ability to contribute effectively to your engineering team.</p>
                 <p>My technical expertise includes working with modern frameworks like Next.js and Tailwind CSS to build scalable UI systems. I look forward to the possibility of discussing how my background aligns with your team's goals.</p>
                 <div className="pt-16">
                   <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Sincerely,</p>
                   <p className="text-3xl font-[1000] text-[#0077cc] tracking-tighter">John Applicant</p>
                 </div>
              </div>
          </div>
        </main>
        <style>{`
          @media print {
            body * { visibility: hidden; }
            #cover-letter-content, #cover-letter-content * { visibility: visible; }
            #cover-letter-content { position: absolute; left: 0; top: 0; width: 100%; border: none !important; }
            .no-print { display: none !important; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] font-['Outfit'] text-[#1a2e52]">
      {/* --- PAGE HEADER --- */}
      <nav className="h-20 px-8 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-[50]">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 text-gray-500 transition-colors rounded-full hover:bg-gray-100">
            <X size={24} />
          </button>
          <h1 className="text-xl font-black tracking-tight font-jakarta">
            Cover Letter <span className="text-[#0077cc]">Blueprints</span>
          </h1>
        </div>
        <button className="hidden md:block px-6 py-2.5 bg-[#0077cc] text-white rounded-xl font-bold hover:bg-blue-600 transition-all">
          Build Custom Letter
        </button>
      </nav>

      {/* --- CATEGORY SELECTOR --- */}
      <div className="flex justify-center gap-3 px-8 py-6 overflow-x-auto bg-white border-b border-gray-100 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-2.5 rounded-full text-sm font-black transition-all whitespace-nowrap ${
              activeCategory === cat 
              ? 'bg-[#1a2e52] text-white shadow-xl shadow-slate-200 translate-y-[-2px]' 
              : 'bg-gray-50 text-gray-400 hover:bg-gray-100 border border-transparent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* --- TEMPLATE GRID --- */}
      <main className="px-8 py-20 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {templates
            .filter(t => activeCategory === 'All' || t.category === activeCategory)
            .map((temp) => (
              <div key={temp.id} className="cursor-pointer group">
                <div className="relative aspect-[3/4] bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,119,204,0.15)] hover:-translate-y-3">
                  {/* Mock content representation */}
                  <div className="flex flex-col h-full gap-4 p-10 transition-colors bg-slate-50/50 group-hover:bg-white">
                     <div className="w-1/4 h-2 bg-blue-100 rounded" />
                     <div className="w-3/4 h-6 rounded bg-slate-200" />
                     <div className="pt-6 space-y-3">
                        <div className="w-full h-2 rounded bg-slate-100" />
                        <div className="w-full h-2 rounded bg-slate-100" />
                        <div className="w-2/3 h-2 rounded bg-slate-100" />
                     </div>
                  </div>
                  
                  {/* Action Overlay */}
                  <div className="absolute inset-0 bg-[#1a2e52]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <button 
                      onClick={() => setSelectedTemplate(temp)}
                      className="bg-[#ff6b35] text-white px-8 py-3.5 rounded-2xl font-black shadow-2xl flex items-center gap-2 transform translate-y-8 group-hover:translate-y-0 transition-all duration-300"
                    >
                      <Eye size={20} /> Use Template
                    </button>
                  </div>
                </div>
                <div className="px-4 mt-8 text-center">
                  <h3 className="text-xl font-black text-[#1a2e52] mb-1 group-hover:text-[#0077cc] transition-colors">
                    {temp.title}
                  </h3>
                  <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">{temp.category}</p>
                </div>
              </div>
          ))}
        </div>
      </main>

      {/* --- GUIDE SECTION --- */}
      <section className="py-24 bg-white border-gray-100 border-y">
        <div className="max-w-5xl px-8 mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-5xl font-[1000] tracking-tight text-[#1a2e52] mb-6">
              The anatomy of a <span className="text-[#0077cc]">perfect</span> letter.
            </h2>
            <p className="max-w-2xl mx-auto text-lg font-medium text-gray-500">
              Our templates are structured based on recruiter feedback to ensure your story is heard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            {[
              { title: "Personalized Greeting", desc: "A specific name increases response rates by 26%." },
              { title: "The 'Hook' Paragraph", desc: "Instantly connect your top achievement to their biggest need." },
              { title: "Evidence-Based Body", desc: "Back up your claims with data, metrics, and specific outcomes." },
              { title: "Strategic Sign-off", desc: "A call-to-action that makes it easy for the manager to say yes." }
            ].map((item, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0077cc] font-black text-xl group-hover:bg-[#0077cc] group-hover:text-white transition-all">
                  {i + 1}
                </div>
                <div>
                  <h4 className="text-xl font-black text-[#1a2e52] mb-2">{item.title}</h4>
                  <p className="font-medium leading-relaxed text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="bg-[#fcfcfd] py-24">
        <div className="max-w-3xl px-8 mx-auto">
          <h3 className="mb-16 text-4xl font-black text-center">Common Questions</h3>
          <div className="space-y-4">
            {[
              { q: "Do recruiters actually read cover letters?", a: "Yes. While resumes show your 'what', cover letters show your 'why' and 'how'." },
              { q: "How long should it be?", a: "Ideally under 400 words. Keep it tight and focused on one page." },
              { q: "Can I use the same letter for every job?", a: "No. Tailoring your letter is the single most important factor for success." }
            ].map((faq, i) => (
              <details key={i} className="overflow-hidden bg-white border border-gray-100 shadow-sm group rounded-3xl">
                <summary className="list-none flex justify-between items-center p-8 cursor-pointer font-black text-[#1a2e52]">
                  {faq.q}
                  <ChevronDown size={20} className="text-[#0077cc] transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-8 pb-8 font-medium leading-relaxed text-gray-500">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
};

export default CoverLetterTemplates;