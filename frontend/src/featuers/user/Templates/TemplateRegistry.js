import JessicaClaire from "./JessicaClaire";
import JessicaClaire1 from "./JessicaClaire1";
import JessicaClaire2 from "./JessicaClaire2";
import JessicaClaire3 from "./JessicaClaire3";
import JessicaClaire4 from "./JessicaClaire4";
import JessicaClaire5 from "./JessicaClaire5";
import JessicaClaire6 from "./JessicaClaire6";
import JessicaClaire7 from "./JessicaClaire7";
import JessicaClaire8 from "./JessicaClaire8";
import JessicaClaire9 from "./JessicaClaire9";
import JessicaClaire10 from "./JessicaClaire10";

// import of raw thumbnails css to import to live preview for export purpose.
import JessicaClairecss from "./JessicaClaire.css?raw";
import JessicaClaire1css from "./JessicaClaire1.css?raw";
import JessicaClaire2css from "./JessicaClaire2.css?raw";
import JessicaClaire3css from "./JessicaClaire3.css?raw";
import JessicaClaire4css from "./JessicaClaire4.css?raw";
import JessicaClaire5css from "./JessicaClaire5.css?raw";
import JessicaClaire6css from "./JessicaClaire6.css?raw";
import JessicaClaire7css from "./JessicaClaire7.css?raw";
import JessicaClaire8css from "./JessicaClaire8.css?raw";
import JessicaClaire9css from "./JessicaClaire9.css?raw";
import JessicaClaire10css from "./JessicaClaire10.css?raw";

// Import Thumbnails
import thumb0 from "../../../assets/template_thumnail/JessicaClaire.png";
import thumb1 from "../../../assets/template_thumnail/JessicaClaire1.png";
import thumb2 from "../../../assets/template_thumnail/JessicaClaire2.png";
import thumb3 from "../../../assets/template_thumnail/JessicaClaire3.png";
import thumb4 from "../../../assets/template_thumnail/JessicaClaire4.png";
import thumb5 from "../../../assets/template_thumnail/JessicaClaire5.png";
import thumb6 from "../../../assets/template_thumnail/JessicaClaire6.png";
import thumb7 from "../../../assets/template_thumnail/JessicaClaire7.png";
import thumb8 from "../../../assets/template_thumnail/JessicaClaire8.png";
import thumb9 from "../../../assets/template_thumnail/JessicaClaire9.png";
import thumb10 from "../../../assets/template_thumnail/JessicaClaire10.png";

export const TEMPLATES = [
    {
        id: "jessica-claire",
        name: "Jessica Claire (Sidebar)",
        component: JessicaClaire,
        style: JessicaClairecss,
        thumbnail: thumb0,
        description: "A clean, professional template with a left sidebar.",
        category: "Professional",
    },
    {
        id: "jessica-claire-1",
        name: "Jessica Claire (Classic)",
        component: JessicaClaire1,
        style: JessicaClaire1css,
        thumbnail: thumb1,
        description: "A classic, elegant layout with Palatino font.",
        category: "Professional",
    },
    {
        id: "jessica-claire-2",
        name: "Jessica Claire (Refined)",
        component: JessicaClaire2,
        style: JessicaClaire2css,
        thumbnail: thumb2,
        description: "Refined Times New Roman style with centered headers.",
        category: "Professional",
    },
    {
        id: "jessica-claire-3",
        name: "Jessica Claire (Modern Blue)",
        component: JessicaClaire3,
        style: JessicaClaire3css,
        thumbnail: thumb3,
        description: "Modern layout with blue accents and monogram.",
        category: "Modern",
    },
    {
        id: "jessica-claire-4",
        name: "Jessica Claire (Green Accent)",
        component: JessicaClaire4,
        style: JessicaClaire4css,
        thumbnail: thumb4,
        description: "Distinctive layout with green borders and accents.",
        category: "Creative",
    },
    {
        id: "jessica-claire-5",
        name: "Jessica Claire (Green/Blue)",
        component: JessicaClaire5,
        style: JessicaClaire5css,
        thumbnail: thumb5,
        description: "Clean layout with green/blue accents and section dividers.",
        category: "Modern",
    },
    {
        id: "jessica-claire-6",
        name: "Jessica Claire (Teal Three-Tone)",
        component: JessicaClaire6,
        style: JessicaClaire6css,
        thumbnail: thumb6,
        description: "Teal themed template with unique header block.",
        category: "Creative",
    },
    {
        id: "jessica-claire-7",
        name: "Jessica Claire (Saira Blue)",
        component: JessicaClaire7,
        style: JessicaClaire7css,
        thumbnail: thumb7,
        description: "Modern split design with Saira font and blue sidebar.",
        category: "Modern",
    },
    {
        id: "jessica-claire-8",
        name: "Jessica Claire (Fira Sans)",
        component: JessicaClaire8,
        style: JessicaClaire8css,
        thumbnail: thumb8,
        description: "Minimalist Fira Sans layout with neat top border.",
        category: "Professional",
    },
    {
        id: "jessica-claire-9",
        name: "Jessica Claire (Saira Split)",
        component: JessicaClaire9,
        style: JessicaClaire9css,
        thumbnail: thumb9,
        description: "Stylish split layout with dark right column using Saira font.",
        category: "Modern",
    },
    {
        id: "jessica-claire-10",
        name: "Jessica Claire (Cyan Header)",
        component: JessicaClaire10,
        style: JessicaClaire10css,
        thumbnail: thumb10,
        description: "Clean, stacked layout with cyan header and section borders.",
        category: "Modern",
    },
];

export const getTemplateComponent = (templateId) => {
    const template = TEMPLATES.find((t) => t.id === templateId);
    return template ? template.component : null;
};

export const getTemplateCSS = (templateId) => {
    const template = TEMPLATES.find((t) => t.id === templateId);
    return template ? template.style : null;
};
