import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UpToSkillsImg from '../assets/UptoSkills.webp';
import NavBar from '../components/NavBar';
import Footer from "./Footer";

function HelpCenter() {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFAQ, setExpandedFAQ] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [currentView, setCurrentView] = useState('home'); // 'home', 'guide', 'collection'
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [selectedCollection, setSelectedCollection] = useState(null);

    useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height
        });
    };

    // Guide Content Component
    const GuideContent = ({ guide }) => {
        const guideContentMap = {
            'create-first-resume': (
                <div className="prose prose-lg max-w-none">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">Create Your First Resume</h2>
                        <p className="text-blue-700">Building a professional foundation using guided AI workflows.</p>
                    </div>

                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        The UptoSkills AI Resume Builder simplifies the transition from a blank page to a polished career document. Our guided process ensures no critical information is overlooked.
                    </p>
                    <div className="space-y-8">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                                Initialization
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                Navigate to the Resume Builder dashboard and select <strong>Create New Resume</strong>. You may choose to build from a blank slate or import an existing document to allow the AI to parse and update your current information.
                            </p>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                                Core Identification
                            </h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Enter your primary contact details. This includes your full name, professional email (e.g., name.surname@email.com), and a link to your LinkedIn profile or digital portfolio.
                            </p>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-green-800 font-medium">
                                    <i className="fas fa-lightbulb mr-2"></i>
                                    <strong>Note:</strong> Providing a LinkedIn profile increases recruiter engagement by up to 40%.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                                Articulating Experience
                            </h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Document your work history by listing your job title, company, and tenure. When describing responsibilities, focus on quantifiable achievements.
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-red-800 mb-2">❌ Weak Example:</h4>
                                    <p className="text-red-700 italic">"Managed a sales team."</p>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-green-800 mb-2">✅ Strong Example:</h4>
                                    <p className="text-green-700 italic">"Led a sales team of 10 to exceed annual targets by 35%, generating $1.2M in revenue."</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
                                Academic History & Skill Mapping
                            </h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Input your educational credentials and select 8–15 relevant skills. We recommend a balanced blend of <strong>Technical Skills</strong> (e.g., Python, Financial Modeling) and <strong>Soft Skills</strong> (e.g., Cross-functional Leadership).
                            </p>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">5</span>
                                Finalization
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                Apply a professional template and download your document in PDF format to ensure formatting remains consistent across all devices.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-8 text-center">
                        <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                        <p className="text-blue-100 mb-6">Create your professional resume with our AI-powered builder today.</p>
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all transform"
                        >
                            Start Building Your Resume
                        </button>
                    </div>
                </div>
            ),
            'choose-template': (
                <div className="prose prose-lg max-w-none">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">Choosing the Right Template</h2>
                        <p className="text-blue-700">Aligning your visual presentation with industry standards.</p>
                    </div>

                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        Templates are more than aesthetic choices; they dictate how information is processed by both humans and machines (ATS).
                    </p>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Template Recommendations by Career Level</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Level</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Recommended Layout</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Focus Area</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2">Entry-Level</td>
                                        <td className="border border-gray-300 px-4 py-2">Single-column, minimalist</td>
                                        <td className="border border-gray-300 px-4 py-2">Academic projects and skill sets</td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-2">Mid-Career</td>
                                        <td className="border border-gray-300 px-4 py-2">Professional, balanced</td>
                                        <td className="border border-gray-300 px-4 py-2">Impactful work history and certifications</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2">Executive</td>
                                        <td className="border border-gray-300 px-4 py-2">Structured, sophisticated</td>
                                        <td className="border border-gray-300 px-4 py-2">Leadership philosophy and high-level achievements</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">The Golden Rules of Design</h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">1</span>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Readability</h4>
                                    <p className="text-gray-700">Use standard web-safe fonts like Inter, Arial, or Calibri.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">2</span>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Hierarchy</h4>
                                    <p className="text-gray-700">Ensure your name and section headings are prominent.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">3</span>
                                <div>
                                    <h4 className="font-semibold text-gray-900">ATS Compatibility</h4>
                                    <p className="text-gray-700">Avoid templates with heavy graphics, complex tables, or icons within the contact section, as these can confuse scanning software.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            'ai-content-generation': (
                <div className="prose prose-lg max-w-none">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">AI Content Generation</h2>
                        <p className="text-blue-700">Leveraging Large Language Models to articulate your value proposition.</p>
                    </div>

                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        Our AI engine is trained on thousands of high-performing resumes to help you draft impactful content in seconds.
                    </p>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Generate Content</h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">1</span>
                                <p className="text-gray-700">Select the section you wish to populate (e.g., Professional Summary).</p>
                            </div>
                            <div className="flex items-start">
                                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">2</span>
                                <p className="text-gray-700">Click the AI Generate button.</p>
                            </div>
                            <div className="flex items-start">
                                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">3</span>
                                <p className="text-gray-700">Input your target job role and seniority level.</p>
                            </div>
                            <div className="flex items-start">
                                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">4</span>
                                <p className="text-gray-700">The system will provide three variations; select the one that best reflects your voice and edit for accuracy.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-green-900 mb-4">💡 Optimization Tips</h3>
                        <p className="text-green-800">
                            To get the most precise output, provide the AI with specific "seeds." Instead of typing "Accountant," type "Senior Tax Accountant specializing in corporate audits and GAAP compliance."
                        </p>
                    </div>
                </div>
            ),
            'resume-sections': (
                <div className="prose prose-lg max-w-none">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">Understanding Resume Sections</h2>
                        <p className="text-blue-700">Structuring your document for maximum information retention.</p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                        <p className="text-yellow-800 font-medium">
                            <i className="fas fa-clock mr-2"></i>
                            A recruiter spends an average of 6 seconds on an initial resume screen. A logical structure is vital.
                        </p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Standard Architecture</h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">1</span>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Header</h4>
                                    <p className="text-gray-700">Immediate contact accessibility.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">2</span>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Professional Summary</h4>
                                    <p className="text-gray-700">A 3-line "elevator pitch" of your career.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">3</span>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Core Competencies</h4>
                                    <p className="text-gray-700">A scannable grid of industry-specific keywords.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">4</span>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Experience</h4>
                                    <p className="text-gray-700">Reverse-chronological history of your professional impact.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1">5</span>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Education</h4>
                                    <p className="text-gray-700">Formal academic background and relevant honors.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-blue-900 mb-4">Strategic Reordering</h3>
                        <p className="text-blue-800">
                            If you are a fresher, place your "Projects" and "Education" above your "Experience." If you are a senior professional, your "Work Experience" should always follow your "Summary."
                        </p>
                    </div>
                </div>
            ),
            'ai-suggestions': (
                <div className="prose prose-lg max-w-none">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">AI Content Suggestions</h2>
                        <p className="text-blue-700">Refining your language for professional impact and clarity.</p>
                    </div>

                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        The AI Suggestions tool acts as a real-time editor, transforming passive descriptions into active, result-oriented statements.
                    </p>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">The Transformation Engine</h3>
                        <p className="text-gray-700 mb-4">The AI identifies "weak" verbs and suggests "power" verbs.</p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <h4 className="font-semibold text-red-800 mb-2">❌ Draft:</h4>
                                <p className="text-red-700 italic">"Helped with the marketing plan."</p>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h4 className="font-semibold text-green-800 mb-2">✅ AI Suggestion:</h4>
                                <p className="text-green-700 italic">"Orchestrated a comprehensive marketing strategy that boosted lead generation by 20%."</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-blue-900 mb-4">Usage Guide</h3>
                        <p className="text-blue-800">
                            Hover over any bullet point in your experience section and click <strong>Improve with AI</strong>. You can choose between "Professional," "Persuasive," or "Concise" tones.
                        </p>
                    </div>
                </div>
            ),
            'template-selection': (
                <div className="prose prose-lg max-w-none">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">Template Selection Guide</h2>
                        <p className="text-blue-700">Industry-specific design recommendations.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-laptop-code text-blue-500 mr-3"></i>
                                Tech/Startups
                            </h3>
                            <p className="text-gray-700">Use modern, sans-serif fonts with a clean, one-column layout that highlights technical stacks.</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-building text-gray-600 mr-3"></i>
                                Corporate (Finance/Law)
                            </h3>
                            <p className="text-gray-700">Stick to traditional, conservative layouts with serif fonts (like Times New Roman or Georgia).</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-palette text-purple-500 mr-3"></i>
                                Creative (Design/Marketing)
                            </h3>
                            <p className="text-gray-700">Subtle use of color and a two-column layout can demonstrate your eye for design.</p>
                        </div>
                    </div>
                </div>
            ),
            'pdf-export': (
                <div className="prose prose-lg max-w-none">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">PDF Export Options</h2>
                        <p className="text-blue-700">The industry standard for document submission.</p>
                    </div>

                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        Always export as a PDF unless specifically asked otherwise. PDF preserves your layout, fonts, and spacing exactly as you intended.
                    </p>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                        <h3 className="text-xl font-semibold text-green-900 mb-4">✓ Checklist</h3>
                        <p className="text-green-800">Ensure "Searchable Text" is enabled during export.</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-blue-900 mb-4">Naming Convention</h3>
                        <p className="text-blue-800">Save your file as <code className="bg-blue-100 px-2 py-1 rounded">FirstName_LastName_Resume.pdf</code></p>
                    </div>
                </div>
            ),
            'keyword-optimization': (
                <div className="prose prose-lg max-w-none">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">AI Keyword Optimization</h2>
                        <p className="text-blue-700">Bridging the gap between your resume and the Job Description (JD).</p>
                    </div>

                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        Most modern companies use software to filter candidates based on keywords. If your resume lacks the specific terms found in the job posting, it may never reach a human recruiter.
                    </p>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Optimization Process</h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">1</span>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Scan</h4>
                                    <p className="text-gray-700">Our AI analyzes your current text.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">2</span>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Compare</h4>
                                    <p className="text-gray-700">Paste the job description into the tool.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">3</span>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Integrate</h4>
                                    <p className="text-gray-700">The AI will highlight missing skills (e.g., "Agile Methodology" or "Tableau") and suggest natural ways to weave them into your summary or experience.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            'ai-formatting': (
                <div className="prose prose-lg max-w-none">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">Smart Formatting</h2>
                        <p className="text-blue-700">Automated visual perfection without manual adjustment.</p>
                    </div>

                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        Manual formatting in Word can be frustrating. Our Smart Formatting engine handles the heavy lifting.
                    </p>

                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-align-left text-blue-500 mr-3"></i>
                                Auto-Alignment
                            </h3>
                            <p className="text-gray-700">Ensures all bullet points and dates are perfectly justified.</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-arrows-alt-v text-blue-500 mr-3"></i>
                                Consistent Spacing
                            </h3>
                            <p className="text-gray-700">Automatically adjusts white space to ensure a balanced look, whether you have half a page of content or two full pages.</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-heading text-blue-500 mr-3"></i>
                                Dynamic Headings
                            </h3>
                            <p className="text-gray-700">Updates font sizes across the entire document simultaneously to maintain a unified visual identity.</p>
                        </div>
                    </div>
                </div>
            ),
            'content-enhancement': (
                <div className="prose prose-lg max-w-none">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">Content Enhancement</h2>
                        <p className="text-blue-700">Upgrading existing drafts for role-specific relevance.</p>
                    </div>

                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        If you already have a resume, use the Enhancement feature to modernize it. This tool focuses on:
                    </p>

                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-spell-check text-green-500 mr-3"></i>
                                Grammar Correction
                            </h3>
                            <p className="text-gray-700">Eliminating typos and syntax errors.</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-bolt text-yellow-500 mr-3"></i>
                                Action Verbs
                            </h3>
                            <p className="text-gray-700">Replacing "Responsible for" with "Spearheaded" or "Implemented."</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-eye text-blue-500 mr-3"></i>
                                Clarity
                            </h3>
                            <p className="text-gray-700">Breaking down long, convoluted sentences into punchy, readable bullet points.</p>
                        </div>
                    </div>
                </div>
            ),
            'ats-basics': (
                <div className="prose prose-lg max-w-none">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">Understanding ATS Systems</h2>
                        <p className="text-blue-700">Navigating the digital gatekeepers of the hiring process.</p>
                    </div>

                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        An Applicant Tracking System (ATS) is a database that sorts candidates. To pass, your resume must be "machine-readable."
                    </p>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-red-900 mb-4">⚠️ What to Avoid</h3>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <span className="text-red-500 mr-3 mt-1">•</span>
                                <div>
                                    <h4 className="font-semibold text-red-800">Images/Photos</h4>
                                    <p className="text-red-700">Most ATS cannot "see" images and may skip over them.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="text-red-500 mr-3 mt-1">•</span>
                                <div>
                                    <h4 className="font-semibold text-red-800">Charts/Graphs</h4>
                                    <p className="text-red-700">Data inside a chart is often unreadable to an ATS.</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <span className="text-red-500 mr-3 mt-1">•</span>
                                <div>
                                    <h4 className="font-semibold text-red-800">Headers/Footers</h4>
                                    <p className="text-red-700">Critical info (like contact details) placed in the actual Word/PDF header can sometimes be ignored by older systems.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            'ats-score': (
                <div className="prose prose-lg max-w-none">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">Improving Your ATS Score</h2>
                        <p className="text-blue-700">Technical strategies to ensure your resume ranks at the top.</p>
                    </div>

                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        A high ATS score is achieved through a combination of Structural Integrity and Keyword Density.
                    </p>

                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Use Standard Labels</h3>
                            <p className="text-gray-700">Stick to "Work Experience" instead of "My Career Journey."</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Clean Hierarchy</h3>
                            <p className="text-gray-700">Use H1 for your name, H2 for sections, and H3 for job titles.</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Contextual Keywords</h3>
                            <p className="text-gray-700">Don't just list a skill; show it in action within your experience section.</p>
                        </div>
                    </div>
                </div>
            ),
            'keyword-matching': (
                <div className="prose prose-lg max-w-none">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">Job Description Matching</h2>
                        <p className="text-blue-700">Customizing your application for every role.</p>
                    </div>

                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        Applying with a generic resume is a common mistake. Use our JD Matcher to tailor your document.
                    </p>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Matching Process</h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">1</span>
                                <p className="text-gray-700">Upload your base resume.</p>
                            </div>
                            <div className="flex items-start">
                                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">2</span>
                                <p className="text-gray-700">Paste the JD for the role you want.</p>
                            </div>
                            <div className="flex items-start">
                                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">3</span>
                                <p className="text-gray-700">Review the Match Percentage.</p>
                            </div>
                            <div className="flex items-start">
                                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">4</span>
                                <p className="text-gray-700">Follow the AI's "Missing Keywords" checklist to reach a 90%+ match score before applying.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            'ats-testing': (
                <div className="prose prose-lg max-w-none">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">Testing ATS Compatibility</h2>
                        <p className="text-blue-700">The final check before submission.</p>
                    </div>

                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        Before you hit "Apply," perform a final audit.
                    </p>

                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-file-text text-blue-500 mr-3"></i>
                                The Text Test
                            </h3>
                            <p className="text-gray-700">Can you select and highlight all the text in your PDF? If yes, the ATS can read it.</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-search text-green-500 mr-3"></i>
                                The Formatting Audit
                            </h3>
                            <p className="text-gray-700">Ensure no contact info is trapped inside a text box or shape.</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-cog text-purple-500 mr-3"></i>
                                UptoSkills Test Tool
                            </h3>
                            <p className="text-gray-700">Use our built-in simulator to see exactly what an ATS sees when it parses your file.</p>
                        </div>
                    </div>
                </div>
            ),
            'color-customization': (
                <div className="prose prose-lg max-w-none">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">Color Customization</h2>
                        <p className="text-blue-700">Using color psychology to influence recruiter perception.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                                Blue
                            </h3>
                            <p className="text-gray-700">Conveys trust, stability, and professionalism (Best for Finance/Tech).</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                                Green
                            </h3>
                            <p className="text-gray-700">Suggests growth, health, and tranquility (Best for Healthcare/Sustainability).</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <div className="w-4 h-4 bg-gray-500 rounded mr-3"></div>
                                Gray/Charcoal
                            </h3>
                            <p className="text-gray-700">Modern, sophisticated, and neutral.</p>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
                        <h3 className="text-xl font-semibold text-yellow-900 mb-4">💡 Pro-Tip</h3>
                        <p className="text-yellow-800">Only use color for headings or divider lines. Keep the body text black for maximum readability.</p>
                    </div>
                </div>
            ),
            'font-selection': (
                <div className="prose prose-lg max-w-none">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">Font and Typography</h2>
                        <p className="text-blue-700">The science of readable resumes.</p>
                    </div>

                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        Typography influences how long a recruiter will stay on your page.
                    </p>

                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Size</h3>
                            <p className="text-gray-700">Body text should be between 10pt and 12pt.</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pairing</h3>
                            <p className="text-gray-700">If using two fonts, pair a Serif heading with a Sans-Serif body (or vice versa).</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Line Height</h3>
                            <p className="text-gray-700">Ensure a 1.15 or 1.5 line spacing to prevent "walls of text."</p>
                        </div>
                    </div>
                </div>
            ),
            'layout-options': (
                <div className="prose prose-lg max-w-none">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">Layout Options</h2>
                        <p className="text-blue-700">Choosing between single and double-column structures.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-align-left text-blue-500 mr-3"></i>
                                Single Column
                            </h3>
                            <p className="text-gray-700">The safest bet for ATS and the most professional for senior roles. It mimics the natural "F-pattern" of human reading.</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-columns text-green-500 mr-3"></i>
                                Double Column
                            </h3>
                            <p className="text-gray-700">Excellent for fitting a large amount of information onto one page (e.g., placing skills and languages in a narrow sidebar).</p>
                        </div>
                    </div>
                </div>
            ),
            'word-export': (
                <div className="prose prose-lg max-w-none">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">Word Document Export</h2>
                        <p className="text-blue-700">Flexibility for recruiters and manual edits.</p>
                    </div>

                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        Some external recruiters prefer Word (.docx) files so they can remove your contact details before sending the resume to their clients.
                    </p>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-yellow-900 mb-4">⚠️ Warning</h3>
                        <p className="text-yellow-800">Re-check your alignment after exporting to Word, as different versions of Office may shift elements slightly.</p>
                    </div>
                </div>
            ),
            'online-sharing': (
                <div className="prose prose-lg max-w-none">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">Online Resume Sharing</h2>
                        <p className="text-blue-700">Generating a professional digital footprint.</p>
                    </div>

                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        UptoSkills allows you to create a Live Link for your resume.
                    </p>

                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-sync text-blue-500 mr-3"></i>
                                Instant Updates
                            </h3>
                            <p className="text-gray-700">If you fix a typo, the link automatically reflects the change.</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-chart-bar text-green-500 mr-3"></i>
                                Analytics
                            </h3>
                            <p className="text-gray-700">Track how many times your link has been viewed by potential employers.</p>
                        </div>
                    </div>
                </div>
            ),
            'multiple-versions': (
                <div className="prose prose-lg max-w-none">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">Managing Multiple Versions</h2>
                        <p className="text-blue-700">Efficiency in high-volume job searching.</p>
                    </div>

                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        Do not overwrite your resume for every job. Use our Duplicate feature to create:
                    </p>

                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-file-alt text-blue-500 mr-3"></i>
                                Master Resume
                            </h3>
                            <p className="text-gray-700">Everything you've ever done.</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-bullseye text-green-500 mr-3"></i>
                                Tailored Versions
                            </h3>
                            <p className="text-gray-700">e.g., "Marketing_Manager_Target" and "Social_Media_Lead_Target".</p>
                        </div>
                    </div>
                </div>
            ),
            'account-setup': (
                <div className="prose prose-lg max-w-none">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">Account Setup</h2>
                        <p className="text-blue-700">Centralizing your career assets.</p>
                    </div>

                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        Complete your profile to unlock personalized AI suggestions. Linking your LinkedIn profile allows the AI to automatically suggest missing certifications or skills based on your peer group.
                    </p>

                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-8 text-center">
                        <h3 className="text-2xl font-bold mb-4">Get Started Today</h3>
                        <p className="text-blue-100 mb-6">Set up your account and start building professional resumes.</p>
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all transform"
                        >
                            Create Account
                        </button>
                    </div>
                </div>
            ),
            'subscription-plans': (
                <div className="prose prose-lg max-w-none">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">Subscription Plans</h2>
                        <p className="text-blue-700">Choosing the right tier for your career goals.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-star text-yellow-500 mr-3"></i>
                                Basic
                            </h3>
                            <p className="text-gray-700">Ideal for a one-time resume update.</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-crown text-purple-500 mr-3"></i>
                                Premium
                            </h3>
                            <p className="text-gray-700">Includes unlimited AI generations, JD Matching, and multiple resume versions—perfect for active job seekers.</p>
                        </div>
                    </div>
                </div>
            ),
            'billing-management': (
                <div className="prose prose-lg max-w-none">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">Billing Management</h2>
                        <p className="text-blue-700">Secure and transparent payment handling.</p>
                    </div>

                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        Access your invoices and manage subscription renewals through the Billing Dashboard. We support all major credit cards, PayPal, and regional payment methods. You can cancel at any time with one click.
                    </p>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-green-900 mb-4">✓ Payment Security</h3>
                        <p className="text-green-800">All transactions are encrypted and processed securely through industry-standard payment gateways.</p>
                    </div>
                </div>
            ),
            'account-security': (
                <div className="prose prose-lg max-w-none">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                        <h2 className="text-2xl font-bold text-blue-900 mb-2">Account Security</h2>
                        <p className="text-blue-700">Protecting your personal and professional data.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-lock text-red-500 mr-3"></i>
                                Passwords
                            </h3>
                            <p className="text-gray-700">Use a unique password with at least 12 characters.</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                                <i className="fas fa-shield-alt text-green-500 mr-3"></i>
                                Privacy
                            </h3>
                            <p className="text-gray-700">We never share your resume data with third-party advertisers. Your information is encrypted and visible only to you until you choose to share it.</p>
                        </div>
                    </div>
                </div>
            )
        };

        return guideContentMap[guide.id] || (
            <div className="prose prose-lg max-w-none">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
                    <h2 className="text-2xl font-bold text-blue-900 mb-2">{guide.title}</h2>
                    <p className="text-blue-700">{guide.desc}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <i className="fas fa-file-alt text-4xl text-gray-400 mb-4"></i>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Guide Content Coming Soon</h3>
                    <p className="text-gray-600">This guide is currently being developed. Check back soon for detailed content.</p>
                </div>
            </div>
        );
    };

    const CollectionView = ({ collection }) => (
        <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${collection.color} rounded-lg flex items-center justify-center mr-4`}>
                        <i className={`${collection.icon} text-white text-2xl`}></i>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{collection.title}</h2>
                        <p className="text-gray-600">{collection.description}</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {collection.Guides.map((guide) => (
                    <div
                        key={guide.id}
                        onClick={() => {
                            setSelectedGuide(guide);
                            setCurrentView('guide');
                        }}
                        className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {guide.title}
                        </h3>
                        <p className="text-gray-600 mb-3">{guide.desc}</p>
                        <div className="flex items-center justify-between">
                            <span className={`inline-block px-3 py-1 bg-gradient-to-r ${collection.color} text-white text-sm font-medium rounded-full`}>
                                {collection.title}
                            </span>
                            <i className="fas fa-chevron-right text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"></i>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const collections = [
        {
            id: "getting-started",
            title: "Getting Started",
            description: "Everything you need to know to create your first AI-powered resume",
            icon: "fas fa-rocket",
            color: "from-blue-500 to-indigo-600",
            Guides: [
                { id: "create-first-resume", title: "Create Your First Resume", desc: "Step-by-step guide to building your professional resume from scratch using AI" },
                { id: "choose-template", title: "Choosing the Right Template", desc: "Select templates that match your industry and experience level" },
                { id: "ai-content-generation", title: "AI Content Generation", desc: "Let our AI write compelling resume content for you" },
                { id: "resume-sections", title: "Understanding Resume Sections", desc: "Learn about different sections and their importance" }
            ]
        },
        {
            id: "ai-features",
            title: "AI Features",
            description: "Master our AI-powered tools to create outstanding resumes",
            icon: "fas fa-brain",
            color: "from-green-500 to-emerald-600",
            Guides: [
                { id: "ai-suggestions", title: "AI Content Suggestions", desc: "How to use AI to improve your resume content" },
                { id: "keyword-optimization", title: "AI Keyword Optimization", desc: "Optimize your resume for ATS systems automatically" },
                { id: "ai-formatting", title: "Smart Formatting", desc: "Let AI format your resume for maximum impact" },
                { id: "content-enhancement", title: "Content Enhancement", desc: "Improve your existing content with AI assistance" }
            ]
        },
        {
            id: "ats-optimization",
            title: "ATS Optimization",
            description: "Make your resume ATS-friendly and beat applicant tracking systems",
            icon: "fas fa-chart-line",
            color: "from-indigo-500 to-blue-600",
            Guides: [
                { id: "ats-basics", title: "Understanding ATS Systems", desc: "Learn how Applicant Tracking Systems work" },
                { id: "ats-score", title: "Improving Your ATS Score", desc: "Get higher ATS compatibility scores" },
                { id: "keyword-matching", title: "Job Description Matching", desc: "Match your resume to specific job postings" },
                { id: "ats-testing", title: "Testing ATS Compatibility", desc: "Test how well your resume performs with ATS" }
            ]




        },
        {
            id: "templates-design",
            title: "Templates & Design",
            description: "Customize your resume design and choose the perfect template",
            icon: "fas fa-palette",
            color: "from-teal-500 to-cyan-600",
            Guides: [
                { id: "template-selection", title: "Template Selection Guide", desc: "Choose templates based on your industry and role" },
                { id: "color-customization", title: "Color Customization", desc: "Personalize your resume with colors and themes" },
                { id: "font-selection", title: "Font and Typography", desc: "Select professional fonts for your resume" },
                { id: "layout-options", title: "Layout Options", desc: "Understand different layout styles and their uses" }
            ]
        },
        {
            id: "export-sharing",
            title: "Export & Sharing",
            description: "Download, share, and manage your resume files",
            icon: "fas fa-share-alt",
            color: "from-orange-500 to-amber-600",
            Guides: [
                { id: "pdf-export", title: "PDF Export Options", desc: "Export high-quality PDF resumes" },
                { id: "word-export", title: "Word Document Export", desc: "Download editable Word versions" },
                { id: "online-sharing", title: "Online Resume Sharing", desc: "Share your resume with a public link" },
                { id: "multiple-versions", title: "Managing Multiple Versions", desc: "Create and manage different resume versions" }
            ]
        },
        {
            id: "account-billing",
            title: "Account & Billing",
            description: "Manage your account, subscription, and billing information",
            icon: "fas fa-credit-card",
            color: "from-gray-500 to-slate-600",
            Guides: [
                { id: "account-setup", title: "Account Setup", desc: "Set up and configure your UptoSkills account" },
                { id: "subscription-plans", title: "Subscription Plans", desc: "Understanding our pricing and features" },
                { id: "billing-management", title: "Billing Management", desc: "Manage payments and billing information" },
                { id: "account-security", title: "Account Security", desc: "Keep your account safe and secure" }
            ]
        }
    ];

    const faqs = [
        {
            id: 1,
            question: "How does the AI resume builder work?",
            answer: "Our AI analyzes your input and generates professional resume content tailored to your industry and role. It suggests improvements, optimizes keywords, and ensures ATS compatibility while maintaining a human touch."

        },
        {
            id: 2,
            question: "Is my resume data secure and private?",
            answer: "Yes, we use enterprise-grade security measures to protect your data. Your resume information is encrypted and never shared with third parties. You have full control over your data and can delete it anytime."
        },
        {
            id: 3,
            question: "Can I edit AI-generated content?",
            answer: "Absolutely! All AI-generated content is fully editable. You can modify, add, or remove any content to match your personal style and preferences. The AI serves as a starting point to help you create better content faster."
        },
        {
            id: 4,
            question: "How many resume templates are available?",
            answer: "We offer 50+ professional resume templates designed for different industries and career levels. All templates are ATS-friendly and can be customized with colors, fonts, and layouts."
        },
        {
            id: 5,
            question: "What file formats can I download my resume in?",
            answer: "You can download your resume in PDF, Word (.docx), and plain text formats. PDF is recommended for job applications, while Word format allows for further editing."
        },
        {
            id: 6,
            question: "Do you offer a free plan?",
            answer: "Yes, we offer a free plan that includes basic resume building features and 1 template. Premium plans unlock AI features, all templates, and advanced customization options."
        }
    ];

    const popularGuides = [
        { title: "Create Your First Resume", views: "15.2k", category: "Getting Started" },
        { title: "AI Content Suggestions", views: "12.8k", category: "AI Features" },
        { title: "Understanding ATS Systems", views: "10.5k", category: "ATS Optimization" },
        { title: "Template Selection Guide", views: "8.9k", category: "Templates & Design" },
        { title: "PDF Export Options", views: "7.3k", category: "Export & Sharing" }
    ];

    const getAllGuides = () => {
        return collections.flatMap(collection =>
            collection.Guides.map(Guides => ({
                ...Guides,
                collectionTitle: collection.title,
                collectionColor: collection.color
            }))
        );
    };

    const filteredResults = searchQuery.trim()
        ? getAllGuides().filter(Guides =>
            Guides.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            Guides.desc.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Navigation */}
            <NavBar />
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-800 text-white relative overflow-hidden" onMouseMove={handleMouseMove}>
                {/* Minimal 3D Background */}
                <div className="absolute inset-0">
                    <div className="geometric-bg">
                        {['fas fa-file-alt', 'fas fa-user-tie', 'fas fa-briefcase', 'fas fa-graduation-cap', 'fas fa-star', 'fas fa-award'].map((icon, i) => (
                            <div
                                key={i}
                                className="geometric-icon"
                                style={{
                                    '--mouse-x': mousePosition.x,
                                    '--mouse-y': mousePosition.y,
                                    '--index': i
                                }}
                            >
                                <i className={`${icon} text-white/20`}></i>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 text-center relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        What can we help you?
                    </h1>
                    <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                        Get help for AI Resume Builder and create the perfect resume for your dream job
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search for help Guides..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:bg-white/20 focus:border-white/40 text-lg transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Results */}
            {searchQuery.trim() && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">
                        Search results for "{searchQuery}"
                    </h2>

                    {filteredResults.length > 0 ? (
                        <div className="space-y-4">
                            {filteredResults.map((Guides) => (
                                <div
                                    key={Guides.id}
                                    onClick={() => {
                                        setSelectedGuide(Guides);
                                        setCurrentView('guide');
                                        setSearchQuery('');
                                    }}
                                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        {Guides.title}
                                    </h3>
                                    <p className="text-gray-600 mb-3">
                                        {Guides.desc}
                                    </p>
                                    <span className={`inline-block px-3 py-1 bg-gradient-to-r ${Guides.collectionColor} text-white text-sm font-medium rounded-full`}>
                                        {Guides.collectionTitle}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-search text-2xl text-gray-400"></i>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Guides found</h3>
                            <p className="text-gray-600">Try searching with different keywords or browse our categories below</p>
                        </div>
                    )}
                </div>
            )}

            {/* Guide View */}
            {currentView === 'guide' && selectedGuide && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-8">
                        <button
                            onClick={() => {
                                setCurrentView('home');
                                setSelectedGuide(null);
                            }}
                            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4 group"
                        >
                            <i className="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
                            Back to Help Center
                        </button>
                    </div>
                    <GuideContent guide={selectedGuide} />
                </div>
            )}

            {/* Collection View */}
            {currentView === 'collection' && selectedCollection && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-8">
                        <button
                            onClick={() => {
                                setCurrentView('home');
                                setSelectedCollection(null);
                            }}
                            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4 group"
                        >
                            <i className="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
                            Back to Help Center
                        </button>
                    </div>
                    <CollectionView collection={selectedCollection} />
                </div>
            )}

            {/* Main Content */}
            {!searchQuery.trim() && currentView === 'home' && (
                <>
                    {/* Collections Grid */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse Help Topics</h2>
                            <p className="text-lg text-gray-600">Find answers to your questions about our AI Resume Builder</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {collections.map((collection) => (
                                <div
                                    key={collection.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer group overflow-hidden hover:-translate-y-2 animate-fade-in"


                                >
                                    <div className={`h-2 bg-gradient-to-r ${collection.color}`}></div>
                                    <div className="p-6">
                                        <div className="flex items-center mb-4">
                                            <div className={`w-12 h-12 bg-gradient-to-r ${collection.color} rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                                                <i className={`${collection.icon} text-white text-xl`}></i>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {collection.title}
                                                </h3>
                                                <p className="text-sm text-gray-500">{collection.Guides.length} Guides</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 mb-4 leading-relaxed">
                                            {collection.description}
                                        </p>
                                        <div className="space-y-2">
                                            {collection.Guides.slice(0, 3).map((Guides) => (
                                                <div
                                                    key={Guides.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedGuide(Guides);
                                                        setCurrentView('guide');
                                                    }}
                                                    className="text-sm text-blue-600 hover:text-indigo-700 cursor-pointer transition-colors hover:translate-x-1 transform"
                                                >
                                                    • {Guides.title}
                                                </div>
                                            ))}
                                            {collection.Guides.length > 3 && (
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedCollection(collection);
                                                        setCurrentView('collection');
                                                    }}
                                                    className="text-sm text-blue-600 hover:text-indigo-700 cursor-pointer font-medium transition-colors"
                                                >
                                                    +{collection.Guides.length - 3} more Guides
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Popular Guides */}
                    <div className="bg-white border-t border-gray-200">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Guides</h2>
                                <p className="text-lg text-gray-600">Most viewed help Guides by our users</p>
                            </div>

                            <div className="space-y-4">
                                {popularGuides.map((Guides, index) => {
                                    const guide = getAllGuides().find(g => g.title === Guides.title);
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                if (guide) {
                                                    setSelectedGuide(guide);
                                                    setCurrentView('guide');
                                                }
                                            }}
                                            className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-blue-50 hover:shadow-md transition-all duration-300 cursor-pointer group hover:-translate-y-1 transform"
                                        >
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4 font-bold text-sm group-hover:scale-110 transition-transform">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {Guides.title}
                                                    </h3>
                                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                                        <span>{Guides.category}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <i className="fas fa-chevron-right text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"></i>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="bg-gray-50">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                                <p className="text-lg text-gray-600">Quick answers to common questions</p>
                            </div>

                            <div className="space-y-4">
                                {faqs.map((faq) => (
                                    <div
                                        key={faq.id}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 transform"
                                    >
                                        <button
                                            onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {faq.question}
                                            </h3>
                                            <i className={`fas fa-chevron-down text-gray-400 transition-transform ${expandedFAQ === faq.id ? 'rotate-180' : ''}`}></i>
                                        </button>
                                        {expandedFAQ === faq.id && (
                                            <div className="px-6 pb-4 border-t border-gray-100">
                                                <p className="text-gray-600 leading-relaxed pt-4">
                                                    {faq.answer}
                                                </p>




                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Support */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                            <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
                            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                                Can't find what you're looking for? Our support team is here to help you succeed.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => navigate('/Contact')}
                                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transition-all transform"
                                >
                                    Contact Support
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 hover:scale-105 transition-all transform"
                                >
                                    Start Building Resume
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}


            <Footer />

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
                
                .geometric-bg {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }
                
                .geometric-icon {
                    position: absolute;
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    animation: gentleFloat 12s ease-in-out infinite;
                    transform: 
                        translateX(calc(var(--mouse-x) * 20px - 10px))
                        translateY(calc(var(--mouse-y) * 20px - 10px))
                        rotateZ(calc(var(--index) * 60deg));
                    transition: transform 0.8s ease-out;
                }
                
                .geometric-icon:nth-child(1) {
                    top: 10%;
                    left: 5%;
                    animation-delay: 0s;
                }
                
                .geometric-icon:nth-child(2) {
                    top: 15%;
                    right: 8%;
                    animation-delay: 2s;
                }
                
                .geometric-icon:nth-child(3) {
                    bottom: 15%;
                    left: 15%;
                    animation-delay: 4s;
                }
                
                .geometric-icon:nth-child(4) {
                    bottom: 10%;
                    right: 12%;
                    animation-delay: 6s;
                }
                
                .geometric-icon:nth-child(5) {
                    top: 8%;
                    left: 75%;
                    animation-delay: 8s;
                    opacity: 0.3;
                }
                
                .geometric-icon:nth-child(6) {
                    bottom: 25%;
                    right: 5%;
                    animation-delay: 10s;
                    opacity: 0.4;
                }
                
                @keyframes gentleFloat {
                    0%, 100% {
                        transform: 
                            translateX(calc(var(--mouse-x) * 20px - 10px))
                            translateY(calc(var(--mouse-y) * 20px - 10px))
                            rotateZ(calc(var(--index) * 60deg))
                            translateY(0px);
                    }
                    50% {
                        transform: 
                            translateX(calc(var(--mouse-x) * 20px - 10px))
                            translateY(calc(var(--mouse-y) * 20px - 10px))
                            rotateZ(calc(var(--index) * 60deg + 180deg))
                            translateY(-15px);
                    }
                }
            `}</style>
        </div>
    );
}

export default HelpCenter;