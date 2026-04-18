import { ChevronDown } from "lucide-react";
import CustomDateRange from "./CustomeDatePicker";
 const options = [
    { name: "Last 7 days", range: "7d" },
    { name: "Last 30 days", range: "30d" },
    { name: "Last 3 months", range: "3m" },
    { name: "Custom date", custom : true }
  ]
  
export default function FilterDropDown({selected, setSelected, handleFilter, showCustomDate, setCustomDate, startDate, endDate, setStartDate, setEndDate, handleDatePick,setOpen,open}) {
    return(
        <div className="relative w-44">

          {/* Button */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center justify-between w-full px-3 py-2 bg-white border rounded-md shadow-sm text-sm font-medium hover:bg-gray-50"
          >
            {selected.name}
            <ChevronDown size={16} />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute mt-2 w-full bg-white border rounded-md shadow-lg z-10">
              {options.map((item) => (
                <div
                  key={item.name}
                  onClick={() => {
                    setSelected(item);
                    handleFilter(item);
                    item.custom ? setCustomDate(true) : setOpen(false);
                  }}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
           {showCustomDate && (
          <div className="absolute right-0 mt-2 z-20">
            <CustomDateRange startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} handleDatePick={handleDatePick}/>
          </div>
        )}
        </div>
    )
}