import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const MonthYearPicker = ({
  value,
  onChange,
  placeholder = "Select Date",
  className = "",
  disabled = false,
  alignRight = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse initial value (expected formats: "YYYY-MM" or "MM-YYYY")
  const getInitialYear = () => {
    if (value && typeof value === "string" && value.includes("-")) {
      const parts = value.split("-");
      // Check if first part is a year (e.g. 2024)
      if (parts[0].length === 4) {
        const parsedYear = parseInt(parts[0], 10);
        if (!isNaN(parsedYear)) return parsedYear;
      }
      // Check if second part is a year (e.g. 08-2023)
      if (parts[1] && parts[1].length === 4) {
        const parsedYear = parseInt(parts[1], 10);
        if (!isNaN(parsedYear)) return parsedYear;
      }
    }
    return new Date().getFullYear();
  };

  const [currentYear, setCurrentYear] = useState(getInitialYear());

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  useEffect(() => {
    if (value && typeof value === "string" && value.includes("-")) {
      const parts = value.split("-");
      let parsedYear;
      if (parts[0].length === 4) {
        parsedYear = parseInt(parts[0], 10);
      } else if (parts[1] && parts[1].length === 4) {
        parsedYear = parseInt(parts[1], 10);
      }
      
      if (parsedYear && !isNaN(parsedYear)) {
        setCurrentYear(parsedYear);
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMonthSelect = (monthIndex) => {
    const formattedMonth = (monthIndex + 1).toString().padStart(2, "0");
    
    // We'll normalize to MM-YYYY since that seems to be what the UI wants
    // The previous implementation used YYYY-MM which might have broken some forms
    const newValue = `${formattedMonth}-${currentYear}`;
    
    // Create a synthetic event object to match expected onChange signature
    const event = {
      target: {
        value: newValue,
      },
    };
    
    onChange(event);
    setIsOpen(false);
  };

  const changeYear = (increment) => {
    setCurrentYear((prev) => prev + increment);
  };

  // Format the display value
  let displayValue = "";
  if (value && typeof value === "string" && value.includes("-")) {
    const parts = value.split("-");
    let year, monthNum;

    if (parts[0].length === 4) {
      // Format YYYY-MM
      year = parts[0];
      monthNum = parseInt(parts[1], 10);
    } else {
      // Format MM-YYYY
      monthNum = parseInt(parts[0], 10);
      year = parts[1];
    }

    if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12 && year) {
      displayValue = `${months[monthNum - 1]} ${year}`;
    } else {
      displayValue = value; // Fallback
    }
  }

  return (
    <div className={`relative w-full ${disabled ? "opacity-60 cursor-not-allowed" : ""}`} ref={containerRef}>
      <div
        className={`flex items-center justify-between w-full cursor-pointer select-none bg-white ${className} ${
          disabled ? "pointer-events-none bg-slate-100 text-slate-400" : ""
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={`flex-1 min-w-0 pr-2 truncate ${displayValue ? "text-slate-900" : "text-slate-400"}`}>
          {displayValue || placeholder}
        </span>
        <Calendar size={16} className="text-slate-500 flex-shrink-0" />
      </div>

      {isOpen && !disabled && (
        <div className={`absolute z-50 top-full mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg p-3 animate-in fade-in zoom-in-95 duration-200 ${alignRight ? "right-0" : "left-0"}`}>
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
            <button
              className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-600"
              onClick={(e) => {
                e.stopPropagation();
                changeYear(-1);
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="font-semibold text-slate-800">{currentYear}</span>
            <button
              className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-600"
              onClick={(e) => {
                e.stopPropagation();
                changeYear(1);
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => {
              const formattedMonth = (index + 1).toString().padStart(2, "0");
              const isSelected =
                value &&
                (value === `${currentYear}-${formattedMonth}` || 
                 value === `${formattedMonth}-${currentYear}`);

              return (
                <button
                  key={month}
                  className={`py-2 px-1 text-sm rounded-md transition-colors ${
                    isSelected
                      ? "bg-blue-600 text-white font-medium"
                      : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMonthSelect(index);
                  }}
                >
                  {month}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthYearPicker;
