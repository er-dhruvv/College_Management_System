import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBarStudent from "../../../Navigation/NavBarStudent";

const API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

const ViewAttendanceStudent = () => {
  const navigate = useNavigate();
  const today = new Date();

  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const startday = new Date(selectedYear, selectedMonth, 1);
  const endday = new Date(selectedYear, selectedMonth + 1, 0);

  // ✅ Generate dates
  const dates = useMemo(() => {
    let arr = [];
    let d = new Date(startday);

    while (d <= endday) {
      arr.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }

    return arr;
  }, [startday, endday]);

  const [data, setData] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfoRes = await axios.get(`${API_BASE}/ProfileDetails`, {
          withCredentials: true,
        });
        setStudentInfo(userInfoRes.data.info);

        const res = await axios.get(`${API_BASE}/timetable`, {
          withCredentials: true,
        });
        setData(res.data.Info);

        const response = await axios.get(`${API_BASE}/ViewAttendanceStudent`, {
          withCredentials: true,
        });
        setAttendance(response.data.Info);
      } catch (err) {
        // console.log(err);
      }
    };

    fetchData();
  }, []);

  // ✅ timetable map
  const timetableMap = useMemo(() => {
    const map = {};
    data.forEach((item) => {
      if (!map[item.weekday]) map[item.weekday] = {};
      map[item.weekday][item.slot] = item;
    });
    return map;
  }, [data]);

  // ✅ attendance map
  const attendanceMap = useMemo(() => {
    const map = {};
    attendance.forEach((item) => {
      const date = new Date(item.date).toLocaleDateString("en-CA");
      if (!map[date]) map[date] = {};
      const status = String(item.status || "").toLowerCase();
      map[date][item.slot] = (status === "present" || status === "p") ? "P" : "A";
    });
    return map;
  }, [attendance]);

  const slots = [1, 2, 3, 4, 5, 6];

  const isHiddenByLab = (day, slot) => {
    return data.some(
      (d) => d.weekday === day && d.slot === slot - 1 && d.IsLab,
    );
  };

  const todayStr = new Date().toLocaleDateString("en-CA");

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      {/* 🔥 NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-50 bg-blue-600 shadow-md">
        <NavBarStudent />
      </div>

      {/* 🔹 CONTENT */}
      <div className="pt-20 px-4 mt-16 max-w-[95vw] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow">
          <div>
            {studentInfo ? (
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {studentInfo.fullname} <span className="text-gray-500 text-base dark:text-gray-400">(Enrollment: {studentInfo.Enrollno})</span>
              </h2>
            ) : (
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Loading Student Info...</h2>
            )}
          </div>
          <div className="flex gap-4 items-center mt-4 md:mt-0">
             <select 
               value={selectedMonth} 
               onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
               className="p-2 border border-gray-300 rounded-md dark:border-slate-600 dark:bg-slate-700 dark:text-white"
             >
               {Array.from({length: 12}).map((_, i) => (
                 <option key={i} value={i}>{new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}</option>
               ))}
             </select>
             <button
               onClick={() => navigate('/SubjectwiseAttendance')}
               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition"
             >
               See Subject-Wise Attendance
             </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-slate-600 text-sm text-center">
            {/* HEADER */}
            <thead className="bg-blue-100 sticky top-0 z-10">
              <tr>
                <th className="border p-1 bg-blue-200">Slot</th>

                {dates.map((d, index) => {
                  const day = d.toLocaleDateString("en-GB", {
                    weekday: "short",
                  });
                  const date = d.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                  });

                  return (
                    <th key={index} className="border p-1">
                      <div className="font-semibold">{date}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">{day}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {slots.map((slot) => (
                <tr key={slot} className="hover:bg-gray-50 dark:bg-slate-900">
                  <td className="border p-1 font-semibold bg-gray-100 dark:bg-slate-900">
                    {slot}
                  </td>

                  {dates.map((d, index) => {
                    let jsDay = d.getDay();
                    let weekday = jsDay === 0 ? 7 : jsDay;
                    const formattedDate = d.toLocaleDateString("en-CA");

                    if (formattedDate <= todayStr) {
                      if (isHiddenByLab(weekday, slot)) {
                        return null;
                      }

                      const lecture = timetableMap?.[weekday]?.[slot];

                      if (!lecture) {
                        return weekday === 7 ? (
                          <td
                            key={index}
                            className="border p-1 font-bold text-red-400"
                          >
                            H
                          </td>
                        ) : (
                          <td key={index} className="border p-1 text-gray-400">
                            -
                          </td>
                        );
                      }

                      let value = attendanceMap?.[formattedDate]?.[slot] ?? "R";

                      return (
                        <td
                          key={index}
                          rowSpan={lecture.IsLab ? 2 : 1}
                          className={`border p-1 font-bold ${
                            value === "P"
                              ? "text-green-600"
                              : value === "A"
                                ? "text-red-600"
                                : "text-orange-300"
                          }`}
                        >
                          {value}
                        </td>
                      );
                    } else {
                      return <td key={index} className="border p-1"></td>;
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewAttendanceStudent;
