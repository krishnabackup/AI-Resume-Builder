import React from "react";

function AdminFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full px-6 py-3 border-t border-gray-200 bg-white text-xs flex justify-center items-center space-x-1">
      <div className="text-gray-600 font-semibold">
        © {year}
      </div>
      <div className="text-black-600 font-bold">
        UptoSkills.
      </div>
      <div className="text-gray-500 font-medium">
        All Rights Reserved.
      </div>
    </footer>
  );
}

export default AdminFooter;
