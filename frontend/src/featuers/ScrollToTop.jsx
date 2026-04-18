import { useEffect, memo } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const ScrollToTop = memo(function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType(); 

  useEffect(() => {
    // Agar user naye link par click karke aaya hai (PUSH), tabhi top par bhejo
    // Agar user BACK button (POP) se aaya hai, toh scroll ko mat chedo (browser khud purani position yaad rakhega)
    if (navType !== 'POP') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname, navType]);

  return null;
});

export default ScrollToTop;