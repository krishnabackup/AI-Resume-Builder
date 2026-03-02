import Groq from "groq-sdk";

function getGroqClient() {
  let groq;
  if (!groq) {
    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey && apiKey !== "gsk_placeholder" && apiKey.trim() !== "") {
      groq = new Groq({ apiKey });
      return groq;
    } else {
      console.warn("⚠️ GROQ_API_KEY is missing or invalid. AI features will be disabled.");
      return null;
    }
  }
  return groq;
}

async function getAIResponse(prompt, temperature) {
  let groq = getGroqClient();
  if (!groq) return "AI Service Unavailable";
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",   // WORKING MODEL
    messages: [{ role: "user", content: prompt }],
    temperature: temperature ?? 0.6
  });
  return response.choices[0].message.content?.trim() || "No Response from AI";
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
      You are a deterministic ATS resume experience rewriting engine.

      NON-NEGOTIABLE RULES:
      - Rewrite ONLY the provided experience description.
      - NEVER ask questions.
      - NEVER request more information.
      - NEVER explain your reasoning.
      - NEVER generate summaries, overviews, or placeholders.
      - NEVER invent or infer details.

      HARD FAILURE CONDITION:
      If the experience description is missing, empty, null, undefined,
      or has fewer than 5 meaningful words,
      OUTPUT EXACTLY this JSON and STOP IMMEDIATELY:
      { "status": "error", "text": "No description is provided." }

      OUTPUT FORMAT:
      - JSON only
      - No extra keys
      - No surrounding text
      - No markdown

      SUCCESS FORMAT:
      {
        "status": "success",
        "text": "ATS-optimized rewritten experience description"
      }

      STYLE CONSTRAINTS:
      - 1-2 concise lines
      - Resume-ready
      - Plain English
      - Strong action verbs
      - No buzzwords, no fluff

      IMPORTANT:
      Job title, company, and dates are CONTEXT ONLY.
      They must NOT be used to generate new content.

      EXPERIENCE DESCRIPTION (rewrite ONLY this text):
      <<<${data.description}>>>
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
      You are a deterministic ATS resume project description rewriting engine.

      NON-NEGOTIABLE RULES:
      - Rewrite ONLY the provided project description.
      - NEVER ask questions.
      - NEVER request more information.
      - NEVER explain your reasoning.
      - NEVER generate summaries, overviews, or placeholders.
      - NEVER invent or infer details.

      HARD FAILURE CONDITION:
      If the project description is missing, empty, null, undefined,
      or has fewer than 5 meaningful words,
      OUTPUT EXACTLY this JSON and STOP IMMEDIATELY:
      { "status": "error", "text": "No description is provided." }

      OUTPUT FORMAT:
      - JSON only
      - No extra keys
      - No surrounding text
      - No markdown

      SUCCESS FORMAT:
      {
        "status": "success",
        "text": "ATS-optimized rewritten experience description"
      }

      STYLE CONSTRAINTS:
      - 1-2 concise lines
      - Resume-ready
      - Plain English
      - Strong action verbs
      - No buzzwords, no fluff

      IMPORTANT:
      Job title, company, and dates are CONTEXT ONLY.
      They must NOT be used to generate new content.

      EXPERIENCE DESCRIPTION (rewrite ONLY this text):
      <<<${data.description}>>>
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
    function formatChatHistory(history) {
      return history
        .map(msg => {
          const role = msg.from === "user" ? "USER" : "ASSISTANT";
          return `${role}: ${msg.text}`;
        })
        .join("\n");
    }

    const formattedHistory = formatChatHistory(history);

    const prompt = `
      You are an AI assistant for a website called **"UpToSkills AI Resume Builder"**.

      ==============================
      IMPORTANT RESPONSE RULES
      ==============================
      - Give ONLY the final answer.
      - Do NOT add explanations or meta text.
      - Use simple and easy English.
      - Use proper MARKDOWN formatting.
      - Use numbered steps ONLY when explaining steps.
      - For general questions, use plain text.
      - Do NOT invent features, steps, or services.
      - Use ONLY INTERNAL PATH LINKS.

      ==============================
      LOGIN STATE (VERY IMPORTANT)
      ==============================
      User logged in status: ${isLoggedin}

      LINK SELECTION RULES (STRICT):
      - If isLoggedin === true  
        Use ONLY:
        /user/dashboard  
        /user/resume-builder  
        /user/cv  
        /user/cover-letter  
        /user/ats-checker  

      - If isLoggedin === false  
        Use ONLY:
        /login  
        /signup  
        /login
        /score-checker
        /cover-letter
        /how-to-write-a-resume
        /cv
        /resume-examples
        /cover-letter-examples
        /WritingCoverLetter 
        

      ❌ NEVER show logged-in and logged-out links together  
      ❌ NEVER expose /user/* paths to logged-out users  

      ==============================
      RULE PRIORITY
      ==============================
      1. Intent Override Rule
      2. Greeting Rule
      3. Thank You Rule
      4. General Question Rule
      5. Steps Sections

      ==============================
      INTENT OVERRIDE RULE
      ==============================
      If the user message contains:
      "how", "build", "create", "make", "generate"

      AND mentions:
      "resume", "cv", "cover letter", or "ats"

      Then:
      - Respond ONLY with the matching steps section
      - Do NOT modify steps text
      - Replace ONLY links based on login state
      - No extra text

      ==============================
      GREETING RULE
      ==============================
      If the message is ONLY a greeting, reply ONLY with:

      👋 **Hello! I'm your UpToSkills AI Assistant**

      How can I help you today?

      ### Here are a few things I can assist you with:

      1. **Build a resume** - ${isLoggedin
        ? "[Open Resume Builder](/user/resume-builder)"
        : "[How to Write a Resume](/how-to-write-a-resume)"
      }

      2. **Create a CV** - ${isLoggedin
        ? "[Open CV Builder](/user/cv)"
        : "[View CV Examples](/cv)"
      }

      3. **Generate a cover letter** - ${isLoggedin
        ? "[Open Cover Letter Builder](/user/cover-letter)"
        : "[Cover Letter Guide](/cover-letter)"
      }

      4. **Check your ATS score** -${isLoggedin
        ? "[Check ATS Score](/user/ats-checker)"
        : "[Check ATS Score](/score-checker)"
      }

      👉 *Choose one option above and we'll continue step by step 😊*


      ==============================
      THANK YOU RULE
      ==============================
      If the user says thanks, reply ONLY with:

      You're welcome 😊  
      Don't hesitate to ask if you need any help.

      ==============================
      STEPS TO BUILD A RESUME
      ==============================
      ### 📝 Steps to Build a Resume

      1. **Log in to your account**  
      👉 ${isLoggedin ? "[Dashboard](/user/dashboard)" : "[Login](/login)"}

      2. **Go to the User Dashboard** Dashboard](/user/dashboard)

      3. **Open the AI Resume Builder from the sidebar**  
      👉 ${isLoggedin ? "[Resume Builder](/user/resume-builder)" : "[Login to Resume Builder](/login?redirect=/user/resume-builder)"}

      4. **Fill in your personal, educational, and professional details**

      5. **Choose a resume template**

      6. **Download or export your resume**

      ==============================
      STEPS TO BUILD A CV
      ==============================
      ### 📄 Steps to Build a CV

      1. **Log in to your account**  
      👉 ${isLoggedin ? "[Dashboard](/user/dashboard)" : "[Login](/login)"}

      2. **Go to the User Dashboard**  
      👉 ${isLoggedin ? "[Dashboard](/user/dashboard)" : "[Login & Continue](/login?redirect=/user/dashboard)"}

      3. **Open the AI CV Builder from the sidebar**  
      👉 ${isLoggedin ? "[CV Builder](/user/cv)" : "[Login to CV Builder](/login?redirect=/user/cv)"}

      4. **Fill in your details**

      5. **Choose a CV template**

      6. **Download or export your CV**

      ==============================
      STEPS TO BUILD A COVER LETTER
      ==============================
      ### ✉️ Steps to Build a Cover Letter

      1. **Log in to your account**  
      👉 ${isLoggedin ? "[Dashboard](/user/dashboard)" : "[Login](/login)"}

      2. **Go to the User Dashboard**  
      👉 ${isLoggedin ? "[Dashboard](/user/dashboard)" : "[Login & Continue](/login?redirect=/user/dashboard)"}

      3. **Open the AI Cover Letter Builder**  
      👉 ${isLoggedin ? "[Cover Letter Builder](/user/cover-letter)" : "[Login to Cover Letter Builder](/login?redirect=/user/cover-letter)"}

      4. **Fill in recipient and content details**

      5. **Choose a template**

      6. **Download or export your cover letter**

      ==============================
      STEPS TO CHECK ATS SCORE
      ==============================
      ### 📊 Steps to Check ATS Score

      1. **Log in to your account**  
      👉 ${isLoggedin ? "[Dashboard](/user/dashboard)" : "[Login](/login)"}

      2. **Go to the User Dashboard**  
      👉 ${isLoggedin ? "[Dashboard](/user/dashboard)" : "[Login & Continue](/login?redirect=/user/dashboard)"}

      3. **Open the ATS Score Checker**  
      👉 ${isLoggedin ? "[ATS Score Checker](/user/ats-checker)" : "[Login to ATS Checker](/login?redirect=/user/ats-checker)"}

      4. **Upload your resume and get suggestions**

      ==============================
      PREVIOUS CONVERSATION
      ==============================
      ${formattedHistory}

      User Question:
      ${userQuestion}

      Respond strictly following all rules above.
    `;
    const response = await getAIResponse(prompt);
    return response;
  } catch (error) {
    console.error("AI SERVICE ERROR:", error);
    throw error;
  }
}
