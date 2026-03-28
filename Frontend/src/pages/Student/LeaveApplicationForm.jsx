import { useState } from "react";
import axios from "axios";
import { useNotification } from "../../context/NotificationContext";
import NavBarStudent from "../../../Navigation/NavBarStudent";

const API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

const LeaveApplicationForm = () => {
  const { showNotification } = useNotification();
  const [TypeOfLeave, setTypeOfLeave] = useState("Medical Leave");
  const [DayDuration, setDayDuration] = useState("Full Day");
  const [FromDate, setFromDate] = useState(
    `${new Date().toISOString().split("T")[0]}`,
  );
  const [ToDate, setToDate] = useState("");
  const [Remarks, setRemarks] = useState("");

  let submitHandler = async (e) => {
    e.preventDefault();

    try {
      let res = await axios.post(
        `${API_BASE}/LeaveFormStudent`,
        {
          TypeOfLeave,
          DayDuration,
          FromDate,
          ToDate,
          Remarks,
        },
        {
          withCredentials: true,
        },
      );

      showNotification(res.data.message, "success");
    } catch (error) {
      console.error("Request failed:", error);
    }

    setTypeOfLeave("Medical Leave");
    setDayDuration("Full Day");
    setFromDate(`${new Date().toISOString().split("T")[0]}`);
    setToDate("");
    setRemarks("");
  };
  return (
    <>
      <NavBarStudent />
      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex justify-center items-center p-6 pt-40">
        {/* Card */}
        <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-6 text-center">
            Leave Application Form
          </h2>

          {/* Form */}
          <form className="space-y-5" onSubmit={submitHandler}>
            {/* Leave Type */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Type of Leave
              </label>
              <select
                value={TypeOfLeave}
                onChange={(e) => setTypeOfLeave(e.target.value)}
                className="border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Medical Leave</option>
                <option>Cultural Leave</option>
                <option>Sport Leave</option>
              </select>
            </div>

            {/* Day Wise */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Leave Duration
              </label>
              <select
                value={DayDuration}
                onChange={(e) => setDayDuration(e.target.value)}
                className="border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Full Day</option>
                <option>Partial Day</option>
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={FromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className="border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={ToDate}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  onChange={(e) => setToDate(e.target.value)}
                  className="border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Remarks */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Remarks
              </label>
              <textarea
                rows="3"
                placeholder="Enter reason for leave..."
                value={Remarks}
                required
                onChange={(e) => setRemarks(e.target.value)}
                className="border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Submit */}
            <div className="pt-4 text-center">
              <button
                type="submit"
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LeaveApplicationForm;
