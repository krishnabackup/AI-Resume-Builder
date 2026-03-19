import axios from "axios";

function getOpenRouterApiKey() {
  const apiKey = process.env.OPEN_ROUTER_API_KEY;
  if (apiKey && apiKey !== "sk_placeholder") {
    console.log("Using OpenRouter API key");
    return apiKey;
  }
  console.warn("OPENROUTER_API_KEY missing. AI disabled.");
  return null;
}

async function getAIResponse(prompt, temperature) {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) return "AI Service Unavailable";
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "nvidia/nemotron-3-nano-30b-a3b",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: temperature ?? 0.6
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
          "X-Title": "UpToSkills AI Resume Builder",
          "Content-Type": "application/json"
        }
      }
    );
    return (
      response.data?.choices?.[0]?.message?.content?.trim() ||
      "No Response from AI"
    );
  } catch (error) {
    console.error("AI API Error:", error.response?.data || error.message);
    throw error;
  }
}

export async function generateResumeAI(data) {
  try {
    console.log("AI FUNCTION CALLED");
    console.log("INPUT DATA:", data);
    const formatEducation = (education = []) =>
      education
        .map(
          (e) =>
            `${e.degree || "Degree"} in ${e.school || "Institution"}`
        )
        .join(", ");

    const formatExperience = (experience = []) =>
      experience
        .map(
          (e) =>
            `${e.title || "Role"} at ${e.company || "Company"}`
        )
        .join(", ");

    const formatProjects = (projects = []) =>
      projects
        .map(
          (p) =>
            `${p.name || "Project"} using ${p.technologies || "various technologies"}`
        )
        .join(", ");


    const formatCertifications = (certifications = []) =>
      certifications
        .map(
          (c) =>
            `${c.name || "Certification"} issued by ${c.issuer || "a recognized organization"
            }`
        )
        .join(", ");

    const formatSkills = (skills = {}) => {
      const technical = skills.technical?.join(", ") || "";
      const soft = skills.soft?.join(", ") || "";
      return [technical, soft].filter(Boolean).join(", ");
    };
    const prompt = `
      Create ONLY a professional resume summary in first person.

      Rules:
      - 3 to 4 lines only
      - Write in FIRST PERSON using "I" (not the candidate's name)
      - No headings
      - No bullet points
      - No explanations
      - No notes
      - Plain text only
      - Focus on key achievements and skills
      - Start with "I am" or "I have"

      Instructions:
      - If a professional summary is provided by the user, analyze it and improve it.
      - Preserve the user's intent and core information.
      - Do NOT repeat the summary verbatim.
      - If no summary is provided, generate one from the candidate details.

      Candidate Details:
      Name: ${data.fullName}
      Skills: ${formatSkills(data.skills) || "Not provided"}
      Education: ${formatEducation(data.education) || "Not provided"}
      Experience: ${formatExperience(data.experience) || "Not provided"}
      Certifications: ${formatCertifications(data.certifications) || "Not provided"}
      Projects: ${formatProjects(data.projects) || "Not provided"}
      Existing Summary: ${data.summary?.trim() || "Not provided"}

      Example format: "I am a skilled software developer with expertise in..."
    `;
    const response = await getAIResponse(prompt);
    return response;
  } catch (error) {
    console.error("AI SERVICE ERROR:", error);
    throw error;
  }
};

export async function refineExperienceDescription(data) {
  try {
    console.log("AI FUNCTION CALLED");
    console.log("INPUT DATA:", data);
    const prompt = `
      Create ONLY a professional resume summary in first person.

      Rules:
      - 3 to 4 lines only
      - Write in FIRST PERSON using "I" (not the candidate's name)
      - No headings
      - No bullet points
      - No explanations
      - No notes
      - Plain text only
      - Focus on key achievements and skills
      - Start with "I am" or "I have"

      Instructions:
      - If a professional summary is provided by the user, analyze it and improve it.
      - Preserve the user's intent and core information.
      - Do NOT repeat the summary verbatim.
      - If no summary is provided, generate one from the candidate details.

      Candidate Details:
      Name: ${data.fullName}
      Skills: ${formatSkills(data.skills) || "Not provided"}
      Education: ${formatEducation(data.education) || "Not provided"}
      Experience: ${formatExperience(data.experience) || "Not provided"}
      Certifications: ${formatCertifications(data.certifications) || "Not provided"}
      Projects: ${formatProjects(data.projects) || "Not provided"}
      Existing Summary: ${data.summary?.trim() || "Not provided"}

      Example format: "I am a skilled software developer with expertise in..."
    `;
    const response = await getAIResponse(prompt);
    return response;
  } catch (error) {
    console.error("AI SERVICE ERROR:", error);
    throw error;
  }
}

export async function refineProjectDescription(data) {
  try {
    console.log("AI FUNCTION CALLED");
    console.log("INPUT DATA:", data);
    const prompt = `
      You are an expert resume writer specializing in ATS (Applicant Tracking System) optimization.

      Your task is to enhance and rewrite the provided project description to make it ATS-friendly while keeping it concise, professional, and impactful.

      Requirements:
      - The final output must be a single paragraph.
      - Do NOT use bullet points, numbering, or lists.
      - The description must NOT exceed 500 characters.
      - Use clear professional language suitable for resumes.
      - Include relevant technical keywords, tools, technologies, and outcomes when possible.
      - Preserve the original meaning and core details of the project.
      - Focus on impact, functionality, and technologies used.

      Return ONLY the improved project description with no additional text, explanations, or headings.

      Project Description:
      ${data.name}
      ${data.technologies}
      ${data.description}
    `;
    const response = await getAIResponse(prompt);
    return response;
  } catch (error) {
    console.error("AI SERVICE ERROR:", error);
    throw error;
  }
}

export const generateCoverLetterAI = async (jobDetails, sectionType) => {
  try {
    console.log("🧠 COVER LETTER AI CALLED");
    console.log("🔍 Section:", sectionType);
    console.log("📝 Job Details:", JSON.stringify(jobDetails, null, 2));

    const client = getGroqClient();
    if (!client) {
      console.warn("⚠️ AI Service unavailable (Missing API Key)");
      throw new Error("AI Service unavailable (Missing API Key)");
    }

    let prompt = "";
    const baseContext = `
      Job Title: ${jobDetails.jobTitle || 'Role'}
      Company: ${jobDetails.companyName || 'Company'}
      Candidate Name: ${jobDetails.fullName || 'Candidate'}
      Skills/Context: ${jobDetails.skills || ''}
      Experience: ${jobDetails.experience || ''}
    `;

    switch (sectionType) {
      case 'openingParagraph':
        prompt = `
          Write a professional opening paragraph for a cover letter for the position of ${jobDetails.jobTitle} at ${jobDetails.companyName}.
          Context:
          ${baseContext}
          
          Rules:
          - Write in first person ("I").
          - Express enthusiasm for the role and company.
          - Mention why you are a great fit briefly.
          - Keep it under 4 lines.
          - STRICTLY NO placeholders like [Role] or [Company]. Use the provided details.
          - STRICTLY NO meta-commentary like "Here is the paragraph". Just the text.
          - Tone: Professional, Confident, Engaging.
        `;
        break;

      case 'bodyParagraph1':
        prompt = `
          Write the first body paragraph of a cover letter focusing on key qualifications.
          Context:
          ${baseContext}
          
          Rules:
          - Focus on the candidate's skills and experience relevant to ${jobDetails.jobTitle}.
          - Use specific examples if available in the context.
          - STRICTLY NO placeholders. If specific numbers aren't known, use qualitative descriptors (e.g., "significant increase", "led a team").
          - STRICTLY NO meta-commentary. Just the paragraph text.
          - Keep it under 6 lines.
        `;
        break;

      case 'bodyParagraph2':
        prompt = `
          Write the second body paragraph of a cover letter focusing on cultural fit and additional value.
          Context:
          ${baseContext}
          
          Rules:
          - Explain why the candidate is passionate about ${jobDetails.companyName} or the industry.
          - Mention soft skills like leadership, collaboration, or problem-solving.
          - STRICTLY NO placeholders.
          - STRICTLY NO meta-commentary. Just the paragraph text.
          - Keep it under 6 lines.
        `;
        break;

      case 'closingParagraph':
        prompt = `
          Write a strong closing paragraph for a cover letter.
          Context:
          ${baseContext}
          
          Rules:
          - Reiterate interest in the ${jobDetails.jobTitle} role.
          - Include a call to action (requesting an interview).
          - Thank the reader.
          - Do NOT include the signature ("Sincerely, Name"). JUST the paragraph.
          - STRICTLY NO placeholders.
          - STRICTLY NO meta-commentary.
          - Keep it under 3 lines.
        `;
        break;

      default:
        throw new Error("Invalid section type");
    }
    const response = await getAIResponse(prompt, 0.7);
    return response;
  } catch (error) {
    console.error("❌ AI COVER LETTER ERROR:", error);
    throw error;
  }
};


// ✅ 4. Extract Data from Resume Text (FIX #1)
export async function extractResumeData(resumeText) {
  try {
    console.log("Extracting resume data from text...");

    const prompt = `
      Parse this resume text into JSON:
      {
        "fullName": "",
        "email": "",
        "phone": "",
        "skills": {"technical": [], "soft": []},
        "experience": [{"title": "", "company": "", "description": ""}],
        "education": [{"degree": "", "school": "", "year": ""}]
      }
      Resume: ${resumeText.substring(0, 4000)}
    `;
    const response = await getAIResponse(prompt, 0.1);
    return JSON.parse(response);
  } catch (error) {
    console.error("Resume extraction failed:", error);
    return {
      fullName: "", email: "", phone: "",
      skills: { technical: [], soft: [] },
      experience: [], education: []
    };
  }
}

// ✅ 5. Parse Resume File (FIX #2 - CURRENT ERROR)
export async function parseResume(resumeFilePath) {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');

    const resumeText = await fs.readFile(resumeFilePath, 'utf-8');
    console.log("Parsing resume file:", resumeFilePath);

    const parsedData = await extractResumeData(resumeText);

    return {
      success: true,
      data: parsedData,
      filePath: resumeFilePath
    };
  } catch (error) {
    console.error("Resume parsing failed:", error);
    return {
      success: false,
      error: error.message,
      filePath: resumeFilePath
    };
  }
}

export async function chatBotAPIResponse(userQuestion, history, isLoggedin) {

  try {

    const formattedHistory = history
      .map(msg => `${msg.from === "user" ? "USER" : "ASSISTANT"}: ${msg.text}`)
      .join("\n");

    const prompt = `
      You are an AI assistant for **UpToSkills AI Resume Builder**.

      ==============================
      RESPONSE FORMAT (MANDATORY)
      ==============================

      Return ONLY valid JSON.
      Do not include explanations, comments, or text outside JSON.

      Always respond in JSON:

      {
      "mode": "message/navigation",
      "text": "MARKDOWN_RESPONSE"
      }

      Use:
      - "message" for normal responses
      - "navigation" when user wants to open a page

      ======================================
      NAVIGATION RULE
      ======================================

      If the user asks to open, go to, navigate, redirect, or access a page,
      respond using navigation mode.

      if the user says to go to home page or landing page use '/'

      Return ONLY valid JSON in this format:

      {
        "mode": "navigation",
        "text": "Short message confirming navigation",
        "path": "/page-route"
      }

      Rules:
      - Do not include markdown formatting.
      - Do not include explanations.
      - Do not include text outside JSON.
      - Always include the correct route in the "path" field.

      Examples:

      User: open resume builder

      Response:
      {
        "mode": "navigation",
        "text": "Taking you to the Resume Builder 🚀",
        "path": "/user/resume-builder"
      }

      User: go to dashboard

      Response:
      {
        "mode": "navigation",
        "text": "Opening your Dashboard 📊",
        "path": "/user/dashboard"
      }

      ==============================
      MARKDOWN RULE
      ==============================

      Always respond using markdown.

      Use markdown formatting (headings, lists, bold, links).

      Links MUST follow this format:

      [Label](/path)

      Example:

      [Dashboard](/user/dashboard)

      ==============================
      LOGIN STATE
      ==============================

      User logged in: ${isLoggedin}

      If logged in use:

      /user/dashboard
      /user/resume-builder
      /user/cv
      /user/cover-letter
      /user/ats-checker

      If NOT logged in use:

      /login
      /signup
      /how-to-write-a-resume
      /cv
      /cover-letter
      /score-checker

      Never mix links.
      Use ONLY the provided routes.
      Never create new routes.


      ==============================
      GREETING RULE
      ==============================

      If user message is a greeting (hi, hello, hey, good morning, good evening),
      respond only with the greeting message.


      Respond only:

      👋 Hello! I'm your UpToSkills AI Assistant  
      How can I help you today?

      ==============================
      FEATURES RULE
      ==============================

      If user asks about platform features respond like:

      ### 🚀 Platform Features

      UpToSkills provides AI-powered tools to help you create professional career documents quickly.

      - **📝 Resume Builder** - Create professional resumes easily.  
        [Know More](/how-to-write-a-resume)

      - **📄 CV Builder** - Generate professional CVs for academic or professional use.  
        [Know More](/cv)

      - **✉️ Cover Letter Generator** - Generate personalized cover letters using AI.  
        [Know More](/cover-letter)

      - **📊 ATS Score Checker** - Analyze how well your resume performs in ATS systems.  
        [Know More](/score-checker)

      ---

      💡 **Tip:** Start with the Resume Builder to quickly generate a job-ready resume.

      [Open Resume Builder](/user/resume-builder)


      ==============================
      EXPLANATION RULE
      ==============================

      If the user asks conceptual or informational questions such as:

      - what is ats score
      - what is a resume
      - what is cv
      - explain resume
      - explain cv
      - explain ats score

      Follow this response structure strictly.

      FORMAT:

      1. Start with a markdown heading describing the concept.

      Example:
      ### What is ATS Score?

      2. Provide a clear and concise explanation of the concept.

      3. Use bullet points if needed to explain important aspects.

      4. After the explanation, add a divider:

      ---

      5. Then add a call-to-action section with relevant links.

      Example:

      ### 🚀 Explore More

      [Learn More](/score-checker)  
      [Check ATS Score](/user/ats-checker)

      RULES:
      - Always explain first, then provide links.
      - Never place links before the explanation.
      - Always include the divider (---) before the links section.
      - Use markdown formatting for readability.


      ==============================
      STEPS RULE
      ==============================

      If the user asks for steps such as:

      - steps to build a resume
      - how to create a resume
      - how to create a cv
      - how to generate a cover letter
      - how to check ats score

      Respond using well-formatted markdown.

      ### 📝 Steps to Build a Resume

      Creating a professional resume with UpToSkills is simple. Follow these steps:

      1. **Log in to your account**  
        Access your account from the login page.

      2. **Open the Dashboard**  
        Navigate to your personal workspace.

      3. **Start the Resume Builder**  
        Select **Resume Builder** from the sidebar.

      4. **Enter your details**  
        Add your personal information, education, experience, and skills.

      5. **Choose a template**  
        Select a professional resume template.

      6. **Download your resume**  
        Export your resume in your preferred format.

      ---

      ### 🚀 Ready to Build Your Resume?

      [📝 Open Resume Builder](/user/resume-builder)  
      [📘 Learn Resume Writing](/how-to-write-a-resume)

      💡 **Tip:** Highlight measurable achievements and relevant skills to improve your resume's ATS score.
      ---
      ### 📄 Steps to Create a CV

      Creating a professional CV with UpToSkills is quick and easy. Follow these steps:

      1. **Log in to your account**  
        Access your UpToSkills account.

      2. **Open the Dashboard**  
        Navigate to your personal workspace.

      3. **Start the CV Builder**  
        Select **CV Builder** from the sidebar.

      4. **Add your academic and professional details**  
        Include your education, research, experience, publications, and skills.

      5. **Choose a CV template**  
        Pick a professional layout that fits your profile.

      6. **Download your CV**  
        Export your CV in your preferred format.

      ---

      ### 🚀 Ready to Create Your CV?

      [📄 Open CV Builder](/user/cv)  
      [📘 Learn About CV Writing](/cv)

      💡 **Tip:** A CV usually includes detailed academic information, research, publications, and professional achievements.

      ---

      ### ✉️ Steps to Create a Cover Letter

      Follow these steps to generate a professional cover letter:
      ### ✉️ Steps to Generate a Cover Letter

      Creating a professional cover letter with UpToSkills is quick and simple. Follow these steps:

      1. **Log in to your account**  
        Access your UpToSkills account.

      2. **Open the Dashboard**  
        Navigate to your personal workspace.

      3. **Start the Cover Letter Builder**  
        Select **Cover Letter Builder** from the sidebar.

      4. **Enter job and company details**  
        Provide the job title, company name, and relevant information.

      5. **Generate the cover letter**  
        Let AI create a personalized cover letter for the job.

      6. **Download the document**  
        Export the cover letter in your preferred format.

      ---

      ### 🚀 Ready to Generate Your Cover Letter?

      [✉️ Open Cover Letter Builder](/user/cover-letter)  
      [📘 Learn About Cover Letters](/cover-letter)

      💡 **Tip:** Customize your cover letter for each job to increase your chances of getting shortlisted.


      ==============================
      INTENT DETECTION
      ==============================

      Determine user intent before responding:

      Greeting → greeting rule  
      Feature query → features rule  
      Concept question → explanation rule  
      Process question → steps rule  
      Navigation request → navigation mode

      If the question is unrelated to resume, CV, cover letter, or ATS,
      politely inform the user that this assistant only helps with resume building.
      ### Supported Topics

      This assistant helps with:

      - Resume creation
      - CV building
      - Cover letter generation
      - ATS score checking

      Please ask a question related to these topics.

      ==============================
      PREVIOUS CHAT
      ==============================

      ${formattedHistory}

      User Question:
      ${userQuestion}

      Follow all rules strictly.
    `;
    const response = await getAIResponse(prompt);
    return response;
  } catch (error) {
    console.error("AI SERVICE ERROR:", error);
    throw error;
  }
}
