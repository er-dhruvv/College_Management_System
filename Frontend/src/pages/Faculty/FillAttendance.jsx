import { useState, useEffect } from "react";
import axios from "axios";
import { useNotification } from "../../context/NotificationContext";
import NavBarFaculty from "../../../Navigation/NavBarFaculty";
import StyledButtton from "../../Components/StyledButtton";

const API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

export const FillAttendance = () => {
  const [Info, setInfo] = useState([]);
  const [presentStudents, setPresentStudents] = useState([]);
  const [AbsentStudents, setAbsentStudents] = useState([]);
  const [facultySlots, setfacultySlots] = useState([]);
  const [slot, setslot] = useState("");
  const [filterSem, setFilterSem] = useState("");
  const { showNotification } = useNotification();

  const [AttendanceDate, setAttendanceDate] = useState(
    `${new Date().toISOString().split("T")[0]}`,
  );

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get(`${API_BASE}/facultySlots`, {
          params: { AttendanceDate },
          withCredentials: true,
        });

        if (response.data.success) {
          const slots = response.data.slotsWithSubjects;
          setfacultySlots(slots);

          setslot("");
        }
      } catch (error) {
        // console.log(error);
      }
    };

    fetchSlots();
  }, [AttendanceDate, filterSem]);

  useEffect(() => {
    if (!slot) {
      setInfo([]);
      return;
    }
    let fetchData = async () => {
      try {
        const selectedSlotObj = facultySlots.find(s => String(s.slot) === String(slot));
        let res = await axios.get(`${API_BASE}/AttendanceData`, {
          params: {
            slot,
            date: AttendanceDate,
            sem: selectedSlotObj?.sem || "",
          },
          withCredentials: true,
        });

        if (res.data.success) {
          const sortedStudents = [...(res.data.students || [])].sort((a, b) => {
            const rA = Number(a.rollno);
            const rB = Number(b.rollno);
            if (!isNaN(rA) && !isNaN(rB)) return rA - rB;
            return String(a.rollno || "").localeCompare(String(b.rollno || ""), undefined, { numeric: true });
          });
          setInfo(sortedStudents);
          setPresentStudents(res.data.presentStudents);
          setAbsentStudents(res.data.AbsentStudents);
        }
      } catch (error) {
        // console.log(error);
      }
    };

    fetchData();
  }, [slot, AttendanceDate, filterSem]);

  let presentHandler = (id) => {
    setAbsentStudents(
      (prev) =>
        prev.includes(id)
          ? prev.filter((sid) => sid !== id) // uncheck
          : [...prev, id], // check
    );
  };

  let saveHandler = async () => {
    try {
      let res = await axios.post(
        `${API_BASE}/FillAttendance`,
        {
          AbsentStudents,
          slot,
          AttendanceDate,
        },
        {
          withCredentials: true,
        },
      );

      if (res.data.success) {
        showNotification(res.data.message, "success");
      }
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <>
      <NavBarFaculty />
      <div className="pt-24 pb-12 px-4 sm:px-6 md:px-8 bg-gray-100 dark:bg-slate-900 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Fill Attendance
          </h1>

          {/* Filters + Slot + Date Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Semester
              </label>
              <select
                value={filterSem}
                onChange={(e) => {
                  setFilterSem(e.target.value);
                  setslot("");
                  setPresentStudents([]);
                }}
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 dark:text-white"
              >
                <option value="">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Slot
              </label>
              <select
                value={slot}
                onChange={(e) => {
                  setslot(e.target.value);
                  setPresentStudents([]);
                }}
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 dark:text-white"
              >
                <option value="">Select a Slot</option>
                {facultySlots
                  .filter((s) => (!filterSem || String(s.sem) === filterSem))
                  .length === 0 ? (
                  <option value="" disabled>No Slots Available</option>
                ) : (
                  facultySlots
                    .filter((s) => (!filterSem || String(s.sem) === filterSem))
                    .map((s) => (
                      <option key={s.slot} value={s.slot}>
                        Slot-{s.slot} - {s.subject}
                      </option>
                    ))
                )}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Date
              </label>
              <input
                type="date"
                value={AttendanceDate}
                max={`${new Date().toISOString().split("T")[0]}`}
                onChange={(e) => {
                  setAttendanceDate(e.target.value);
                  setAbsentStudents([]);
                }}
                required
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>

          {/* Table */}

          {AbsentStudents.length === 0 && presentStudents.length === 0 ? (
            <div className="mb-6 flex justify-center">
              <span className="px-5 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-xs sm:text-sm border border-yellow-400 shadow-sm">
                Attendance Status: PENDING
              </span>
            </div>
          ) : (
            <div className="mb-6 flex justify-center">
              <span className="px-5 py-2 rounded-full bg-green-100 text-green-700 font-semibold text-xs sm:text-sm border border-green-400 shadow-sm">
                Attendance Marked
              </span>
            </div>
          )}

          {/* Mobile Card List View (Phone Screens) */}
          <div className="sm:hidden space-y-3 mb-6">
            {Info.length === 0 || facultySlots.length === 0 ? (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-dashed dark:border-slate-600">
                No Student Found
              </div>
            ) : (
              Info.map((user) => {
                const isAbsent = AbsentStudents.includes(user._id);
                return (
                  <div
                    key={user._id}
                    className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                      isAbsent
                        ? "bg-red-50/60 border-red-200 dark:bg-red-950/20 dark:border-red-800/40"
                        : "bg-green-50/60 border-green-200 dark:bg-green-950/20 dark:border-green-800/40"
                    }`}
                  >
                    <div className="flex-1 pr-3">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                        {user.fullname}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>Enroll: <strong className="text-gray-700 dark:text-gray-300">{user.Enrollno}</strong></span>
                        <span>Roll: <strong className="text-gray-700 dark:text-gray-300">{user.rollno}</strong></span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => presentHandler(user._id)}
                      className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 shrink-0 cursor-pointer ${
                        isAbsent
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      <span className="text-sm">{isAbsent ? "✕" : "✓"}</span>
                      <span>{isAbsent ? "Absent" : "Present"}</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Desktop & Tablet Table View */}
          <div className="hidden sm:block w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm mb-6">
            <table className="w-full min-w-[550px] border-collapse text-sm">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">
                    Full Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Enrollment No
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Roll No
                  </th>
                  <th className="px-6 py-4 text-center font-semibold">
                    Present
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
                {Info.length === 0 || facultySlots.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-gray-500 dark:text-gray-400">
                      No Student Found
                    </td>
                  </tr>
                ) : (
                  Info.map((user) => {
                    const isAbsent = AbsentStudents.includes(user._id);
                    return (
                      <tr
                        key={user._id}
                        className="hover:bg-indigo-50/50 dark:hover:bg-slate-700/50 transition"
                      >
                        <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">
                          {user.fullname}
                        </td>

                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                          {user.Enrollno}
                        </td>

                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                          {user.rollno}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => presentHandler(user._id)}
                            className={`h-8 w-8 rounded-lg inline-flex items-center justify-center font-bold text-base transition-all transform active:scale-95 shadow-sm mx-auto cursor-pointer ${
                              isAbsent
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                            title={isAbsent ? "Click to mark Present" : "Click to mark Absent"}
                          >
                            {isAbsent ? "✕" : "✓"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center">
            <StyledButtton btnname={"Save"} onClick={saveHandler} />
          </div>
        </div>
      </div>
    </>
  );
};
