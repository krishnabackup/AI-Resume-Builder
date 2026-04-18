export const dummyData = {
    fullName: "Rahul Chauhan",
    email: "rahul@example.com",
    linkedin: "linkedin.com/in/example",
    location: "San Francisco, CA",
    phone: "(555) 123-4567",
    summary: "Results-oriented Software Engineer with 5+ years of experience in full-stack development. Proven track record of delivering scalable web applications and optimizing system performance. Skilled in React, Node.js, and cloud technologies. Passionate about creating intuitive user experiences and writing clean, maintainable code.",
    website: "rahul.com",
    extraLinks: [],
    education: [
        {
            id: 1,
            school: "University of California, Berkeley",
            degree: "Bachelor of Science in Computer Science",
            gpa: "3.8",
            startDate: "2015-08",
            graduationDate: "2019-05",
            location: "Berkeley, CA",
        },
    ],
    experience: [
        {
            id: 1,
            title: "Senior Software Engineer",
            company: "Tech Solutions Inc.",
            description: "Led a team of 5 developers to rebuild company's core e-commerce platform, resulting in a 40% improvement in page load times. Implemented CI/CD pipelines reducing deployment time by 60%. Mentored junior developers and conducted code reviews to ensure high-quality standards.",
            startDate: "2022-01",
            endDate: "Present",
            location: "San Francisco, CA",
        },
        {
            id: 2,
            title: "Software Engineer",
            company: "StartUp Innovations",
            description: "Developed and maintained multiple React-based projects. Collaborated with UX designers to implement responsive and accessible interfaces. Optimized API endpoints for faster data retrieval.",
            startDate: "2019-06",
            endDate: "2021-12",
            location: "San Mateo, CA",
        },
    ],
    projects: [
        {
            id: 1,
            name: "E-commerce Dashboard",
            description: "A comprehensive dashboard for managing products, orders, and analytics. Built with React, Redux, and D3.js for data visualization.",
            technologies: "React, Redux, Node.js, MongoDB",
            link: {
                github: "github.com/jsmith/dashboard",
                liveLink: "dashboard-demo.com",
                other: "",
            },
        },
        {
            id: 2,
            name: "Task Management App",
            description: "A collaborative task management tool with real-time updates using WebSockets.",
            technologies: "Vue.js, Firebase, Tailwind CSS",
            link: {
                github: "github.com/jsmith/taskmanager",
                liveLink: "",
                other: "",
            },
        },
    ],
    skills: {
        technical: ["JavaScript (ES6+)", "React", "Node.js", "TypeScript", "Python", "AWS", "Docker", "Git"],
        soft: ["Leadership", "Communication", "Problem Solving", "Agile Methodology", "Team Collaboration"],
    },
    certifications: [
        {
            id: 1,
            name: "AWS Certified Solutions Architect",
            issuer: "Amazon Web Services",
            date: "2023-03",
            link: "aws.amazon.com/verify/12345",
        },
    ],
};

export const emptyData = {
    fullName: "",
    email: "",
    linkedin: "",
    location: "",
    phone: "",
    summary: "",
    website: "",
    extraLinks: [],
    education: [],
    experience: [],
    projects: [],
    skills: {
        technical: [],
        soft: [],
      },
    certifications: [],
};
