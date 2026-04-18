import React, { lazy, Suspense, memo } from "react";

const withSuspense = (LazyComponent) => {
  return memo(function SuspenseWrapper(props) {
    return (
      <Suspense fallback={<div className="flex justify-center items-center p-8 text-gray-500">Loading Template...</div>}>
        <LazyComponent {...props} />
      </Suspense>
    );
  });
};

const CoverLetterTemplatesMap = Object.freeze({
  professional: withSuspense(lazy(() => import("./Templates/ProfessionalTemplate"))),
  modern: withSuspense(lazy(() => import("./Templates/ModernTemplate"))),
  creative: withSuspense(lazy(() => import("./Templates/CreativeTemplate"))),
  minimal: withSuspense(lazy(() => import("./Templates/MinimalTemplate"))),
  elegant: withSuspense(lazy(() => import("./Templates/ElegantTemplate"))),
  corporate: withSuspense(lazy(() => import("./Templates/CorporateTemplate"))),
  tech: withSuspense(lazy(() => import("./Templates/TechTemplate"))),
  vibrant: withSuspense(lazy(() => import("./Templates/VibrantTemplate"))),
  clean: withSuspense(lazy(() => import("./Templates/CleanTemplate"))),
  classic: withSuspense(lazy(() => import("./Templates/ClassicTemplate"))),
  // Fallback
  default: withSuspense(lazy(() => import("./Templates/ProfessionalTemplate")))
});

export default CoverLetterTemplatesMap;
