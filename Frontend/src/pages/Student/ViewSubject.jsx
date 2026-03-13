import axios from "axios";
import { useState, useEffect } from "react";
import NavBarStudent from "../../../Navigation/NavBarStudent";

const API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

const ViewSubject = () => {
  const [subjectList, setsubjectList] = useState([]);

  useEffect(() => {
    let getSubjects = async () => {
      let res = await axios.get(`${API_BASE}/getSubjects`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setsubjectList(res.data.Info);
      }
    };

    getSubjects();
  }, []);

  return (
    <>
      <NavBarStudent />

      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-6 mt-30">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Subjects</h1>
        </div>

        {/* Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjectList.map((sub) => (
            <div
              key={sub._id}
              className="group relative bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border border-gray-200 dark:border-slate-700 hover:-translate-y-2"
            >
              {/* Subject Name */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 transition">
                    {sub.subject}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Code: {sub.subject_code}
                  </p>
                </div>

                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                  {sub.credit} Credits
                </span>
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-gray-200 dark:bg-slate-700 mb-4"></div>

              {/* Max Marks Section */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
                  <p className="text-gray-500 dark:text-gray-400">Midsem</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {sub.maxmarks.Midsem}
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
                  <p className="text-gray-500 dark:text-gray-400">SEE</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {sub.maxmarks.SEE}
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
                  <p className="text-gray-500 dark:text-gray-400">Practical</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {sub.maxmarks.PracticalExam}
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
                  <p className="text-gray-500 dark:text-gray-400">Assessment</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                    {sub.maxmarks.RegularAssesment}
                  </p>
                </div>
              </div>

              {/* Bottom Accent Line */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ViewSubject;
