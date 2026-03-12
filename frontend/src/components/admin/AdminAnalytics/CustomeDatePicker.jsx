import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CustomDateRange({startDate,endDate,setEndDate,setStartDate,handleDatePick}) {
  return (
    <div className="bg-white border rounded-md shadow-md p-4 w-72">
      <p className="text-sm font-medium mb-3">Custom Date Range</p>

      <div className="flex flex-col gap-3">
        
        <div>
          <label className="text-xs text-gray-500">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholderText="Select start date"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholderText="Select end date"
          />
        </div>
        <div>
            <button className="bg-blue-500 rounded-lg p-2" onClick={handleDatePick}>
                Submit
            </button>
        </div>
      </div>
    </div>
  );
}