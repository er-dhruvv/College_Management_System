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
          setInfo(res.data.students);
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
      <div className="p-8 bg-gray-100 dark:bg-slate-900 min-h-screen mt-30">
        <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">
            Fill Attendance
          </h1>

          {/* Filters + Slot + Date Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                className="border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
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
                className="border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
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
                className="border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Table */}

          {AbsentStudents.length === 0 && presentStudents.length === 0 ? (
            <div className="mb-6 flex justify-center">
              <span className="px-6 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm border border-yellow-400 shadow-sm">
                Attendance Status: PENDING
              </span>
            </div>
          ) : (
            <div className="mb-6 flex justify-center">
              <span className="px-6 py-2 rounded-full bg-green-100 text-green-700 font-semibold text-sm border border-green-400 shadow-sm">
                Attendance Marked
              </span>
            </div>
          )}
          <div className="overflow-hidden rounded-lg border">
            <table className="min-w-full border-collapse">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Full Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Enrollment No
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Roll No
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Present
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y bg-white dark:bg-slate-800">
                {Info.length === 0 || facultySlots.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-500 dark:text-gray-400">
                      No Student Found
                    </td>
                  </tr>
                ) : (
                  Info.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-indigo-50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">
                        {user.fullname}
                      </td>

                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {user.Enrollno}
                      </td>

                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{user.rollno}</td>

                      <td className="px-6 py-4 text-center">
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => presentHandler(user._id)}
                            className={`h-6 w-6 rounded flex items-center justify-center font-bold transition-colors ${AbsentStudents.includes(user._id)
                              ? "bg-red-600 text-white border-red-600"
                              : "bg-green-600 text-white border-green-600"
                              }`}
                          >
                            {AbsentStudents.includes(user._id) ? "✕" : "✓"}
                          </button>
                        </td>
                      </td>
                    </tr>
                  ))
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
