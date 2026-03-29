import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import NavBarStudent from "../../../Navigation/NavBarStudent";

const API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

const SubjectwiseAttendance = () => {
  const [data, setData] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);

  const defaultStartDate = import.meta.env.VITE_START_DATE || "2024-01-01";
  const defaultEndDate = import.meta.env.VITE_END_DATE || new Date().toISOString().split("T")[0];

  const [startDateStr, setStartDateStr] = useState(defaultStartDate);
  const [endDateStr, setEndDateStr] = useState(defaultEndDate);

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

  const stats = useMemo(() => {
    if (!data.length || !studentInfo) return [];

    let start = new Date(startDateStr);
    let end = new Date(endDateStr);
    end.setHours(23, 59, 59, 999);

    if (end < start) return [];

    const statsMap = {};

    // Calculate theoretical total lectures from TimeTable
    const myTimetable = data.filter(d =>
      (!d.class || d.class === studentInfo.class || d.class === "All") &&
      (!d.batch || d.batch === studentInfo.batch || d.batch === "All" || !d.IsLab)
    );

    // Filter data if it has class and batch properties to match the student's
    const filteredTimetable = myTimetable.filter(item => {
      const matchClass = item.class ? (item.class === studentInfo.class || item.class === "All") : true;
      const matchBatch = item.IsLab && item.batch ? (item.batch === studentInfo.batch || item.batch === "All") : true;
      return matchClass && matchBatch;
    });

    filteredTimetable.forEach(item => {
      if (!statsMap[item.subject]) {
        statsMap[item.subject] = { total: 0, present: 0, absent: 0 };
      }
    });

    // Iterate dates from start to end
    let d = new Date(start);
    while (d <= end) {
      const jsDay = d.getDay();
      const weekday = jsDay === 0 ? 7 : jsDay;

      // Find subjects on this weekday
      filteredTimetable.forEach(t => {
        if (t.weekday === weekday) {
          statsMap[t.subject].total += 1;
        }
      });
      d.setDate(d.getDate() + 1);
    }

    // Now calculate actual attendance occurrences
    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];

    attendance.forEach(att => {
      const attDateStr = new Date(att.date).toISOString().split("T")[0];
      
      if (attDateStr >= startStr && attDateStr <= endStr) {
        const attDate = new Date(att.date);
        const attDay = attDate.getDay() === 0 ? 7 : attDate.getDay();
        
        // Match slot: either exact match, or if it's a lab, check if it's the second slot of a lab session
        const slotData = filteredTimetable.find(t => 
          t.weekday === attDay && 
          (Number(t.slot) === Number(att.slot) || (t.IsLab && Number(t.slot) === Number(att.slot) - 1))
        );

        if (slotData && statsMap[slotData.subject]) {
          const status = String(att.status || "").toLowerCase();
          if (status === "present" || status === "p") {
            statsMap[slotData.subject].present += 1;
          } else if (status === "absent" || status === "a") {
            statsMap[slotData.subject].absent += 1;
          }
        }
      }
    });

    return Object.keys(statsMap).map(subject => {
      const stat = statsMap[subject];
      const conducted = stat.present + stat.absent;
      let remaining = stat.total - conducted;
      if (remaining < 0) remaining = 0; // Fallback for discrepancies

      return {
        subject,
        total: stat.total,
        present: stat.present,
        absent: stat.absent,
        remaining,
        conducted,
        percentage: conducted > 0
          ? ((stat.present / conducted) * 100).toFixed(2)
          : 0
      };
    });

  }, [data, attendance, studentInfo, startDateStr, endDateStr]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      <div className="fixed top-0 left-0 w-full z-50 bg-blue-600 shadow-md">
        <NavBarStudent />
      </div>

      <div className="pt-20 px-4 mt-16 max-w-5xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 border-b pb-2">
            Subject-Wise Attendance Details
          </h2>

          <div className="flex gap-4 mb-6 flex-col sm:flex-row">
            <div className="bg-blue-50 dark:bg-slate-700 p-4 rounded-lg flex-1">
              <label className="block text-sm text-gray-500 dark:text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                value={startDateStr}
                onChange={(e) => setStartDateStr(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div className="bg-blue-50 dark:bg-slate-700 p-4 rounded-lg flex-1">
              <label className="block text-sm text-gray-500 dark:text-gray-300 mb-1">End Date</label>
              <input
                type="date"
                value={endDateStr}
                onChange={(e) => setEndDateStr(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 dark:border-slate-600">
              <thead className="bg-blue-100 dark:bg-slate-700">
                <tr>
                  <th className="border p-3 text-left">Subject</th>
                  <th className="border p-3">Total Lectures</th>
                  <th className="border p-3">Present</th>
                  <th className="border p-3">Absent</th>
                  <th className="border p-3 text-orange-500">Remaining</th>
                  <th className="border p-3">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {stats.length > 0 ? (
                  stats.map((stat, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:bg-slate-800 border-b dark:border-slate-600 text-center">
                      <td className="border p-3 font-semibold text-left">{stat.subject}</td>
                      <td className="border p-3">{stat.total}</td>
                      <td className="border p-3 text-green-600 font-bold">{stat.present}</td>
                      <td className="border p-3 text-red-500 font-bold">{stat.absent}</td>
                      <td className="border p-3 text-orange-500 font-bold">{stat.remaining}</td>
                      <td className={`border p-3 font-bold ${stat.percentage >= 75 ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.percentage}%
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      Loading data or no attendance available...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectwiseAttendance;
