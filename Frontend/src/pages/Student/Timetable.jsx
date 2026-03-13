import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

import NavBarStudent from "../../../Navigation/NavBarStudent";

const days = {
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

const slotTimes = [
  { start: "07:30 AM", end: "08:25 AM" },
  { start: "08:25 AM", end: "09:20 AM" },
  { start: "09:50 AM", end: "10:45 AM" },
  { start: "10:45 AM", end: "11:40 AM" },
  { start: "11:50 AM", end: "12:45 PM" },
  { start: "12:45 PM", end: "01:40 PM" },
];

const Timetable = () => {
  const [data, setData] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);

  useEffect(() => {
    const getTimetable = async () => {
      try {
        const res = await axios.get(`${API_BASE}/studentTimetable`, { withCredentials: true });
        setData(res.data.Info);
        setStudentDetails(res.data.studentInfo);
      } catch (error) {
        console.error("Error fetching student timetable", error);
      }
    };
    getTimetable();
  }, []);

  const isHiddenByLab = (day, slot) => {
    return data.some(
      (d) => d.weekday === day && d.slot === slot - 1 && d.IsLab,
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-800 font-sans text-black dark:text-white">
      <NavBarStudent />

      <div className="p-4 pt-10 mt-20">
        {/* --- Title Section --- */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black uppercase tracking-widest border-b-4 border-black dark:border-slate-400 inline-block pb-1">
            Student Timetable
          </h1>
          {studentDetails && (
            <p className="mt-2 text-lg font-bold text-gray-700 dark:text-gray-300">
              Semester {studentDetails.sem} | Class {studentDetails.class} {studentDetails.batch ? `| Batch ${studentDetails.batch}` : ''}
            </p>
          )}
        </div>

        {/* --- Table Section --- */}
        <div className="overflow-x-auto shadow-sm">
          <table className="min-w-full border-2 border-black dark:border-slate-400 border-collapse table-fixed">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-900">
                <th className="border-2 border-black dark:border-slate-400 p-2 text-[12px] font-black w-28 uppercase">
                  Lecture #
                </th>
                {Object.values(days).map((day) => (
                  <th
                    key={day}
                    className="border-2 border-black dark:border-slate-400 p-2 text-[13px] font-black tracking-tighter"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {slotTimes.map((time, index) => {
                const slotNo = index + 1;
                return (
                  <tr key={slotNo} className="min-h-[100px]">
                    {/* Time Column */}
                    <td className="border-2 border-black dark:border-slate-400 p-2 text-[11px] font-bold text-center leading-tight bg-gray-50 dark:bg-slate-900">
                      {time.start} <div className="font-normal my-1">to</div>{" "}
                      {time.end}
                    </td>

                    {Object.keys(days).map((dayKey) => {
                      const dNum = Number(dayKey);
                      if (isHiddenByLab(dNum, slotNo)) return null;

                      const entry = data.find(
                        (d) => d.weekday === dNum && d.slot === slotNo,
                      );

                      return (
                        <td
                          key={dayKey}
                          rowSpan={entry?.IsLab ? 2 : 1}
                          className={`border-2 border-black dark:border-slate-400 p-2 text-center align-middle transition-colors ${
                            entry?.IsLab ? "bg-blue-50/30" : "bg-white dark:bg-slate-800"
                          }`}
                        >
                          {entry ? (
                            <div className="flex flex-col gap-1">
                              {/* If it's a lab, we can show batch prefix if available, else just subject */}
                              <div className="text-[12px] font-black leading-tight uppercase">
                                {entry.IsLab && (
                                  <span className="block text-[10px] text-gray-600 dark:text-gray-300 mb-1">
                                    Practical Batch
                                  </span>
                                )}
                                {entry.subject}
                              </div>

                              {/* Location / Room */}
                              <div className="text-[10px] font-bold text-gray-700 dark:text-gray-200 mt-1 uppercase">
                                {entry.location}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-200">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
