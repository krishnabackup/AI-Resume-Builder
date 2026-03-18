import ProfessionalTemplate from "./Templates/ProfessionalTemplate";
import ModernTemplate from "./Templates/ModernTemplate";
import CreativeTemplate from "./Templates/CreativeTemplate";
import MinimalTemplate from "./Templates/MinimalTemplate";
import ElegantTemplate from "./Templates/ElegantTemplate";
import CorporateTemplate from "./Templates/CorporateTemplate";
import TechTemplate from "./Templates/TechTemplate";
import VibrantTemplate from "./Templates/VibrantTemplate";
import CleanTemplate from "./Templates/CleanTemplate";
import ClassicTemplate from "./Templates/ClassicTemplate";

const CoverLetterTemplatesMap = {
  professional: ProfessionalTemplate,
  modern: ModernTemplate,
  creative: CreativeTemplate,
  minimal: MinimalTemplate,
  elegant: ElegantTemplate,
  corporate: CorporateTemplate,
  tech: TechTemplate,
  vibrant: VibrantTemplate,
  clean: CleanTemplate,
  classic: ClassicTemplate,
  // Fallback
  default: ProfessionalTemplate
};

export default CoverLetterTemplatesMap;
