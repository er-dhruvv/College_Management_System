import { useEffect, useState } from "react";
import axios from "axios";
import { useNotification } from "../../context/NotificationContext";
import NavBarFaculty from "../../../Navigation/NavBarFaculty";
import StyledButtton from "../../Components/StyledButtton";

const API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

const days = {
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

const slotTimes = [1, 2, 3, 4, 5, 6];

const AddTimetable = () => {
  const { showNotification } = useNotification();
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [subjectList, setSubjectList] = useState([]);
  const [selectedSem, setSelectedSem] = useState("1");
  const [selectedClass, setSelectedClass] = useState("A");

  const [formData, setFormData] = useState({
    weekday: "1",
    slot: "1",
    subject: "",
    location: "class-133",
    IsLab: "false",
    studentClass: "A",
    batch: "All",
    sem: "1",
  });

  const getTimetable = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/timetable?sem=${selectedSem}&studentClass=${selectedClass}`
      );
      setData(res.data.Info);
    } catch (err) {
      // console.log(err);
    }
  };

  useEffect(() => {
    const getSubjectList = async () => {
      try {
        const r = await axios.get(`${API_BASE}/getsubjectList`, {
          withCredentials: true,
        });

        setSubjectList(r.data.Info);

        if (r.data.Info.length > 0) { 
          setFormData((prev) => ({
            ...prev,
            subject: r.data.Info[0].subject,
          }));
        }
      } catch (err) {
        // console.log(err);
      }
    };

    getSubjectList();
  }, []);

  useEffect(() => {
    getTimetable();
  }, [selectedSem, selectedClass]);

  const isHiddenByLab = (day, slot) => {
    return data.some(
      (d) => d.weekday === day && d.slot === slot - 1 && d.IsLab
    );
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveHandler = async (e) => {
    try {
      e.preventDefault();

      const payload = {
        ...formData,
        weekday: Number(formData.weekday),
        slot: Number(formData.slot),
        IsLab: formData.IsLab === "true",
        studentClass: selectedClass,
        sem: selectedSem,
      };

      const r = await axios.post(`${API_BASE}/AddTimetable`, payload, {
        withCredentials: true,
      });

      showNotification(r.data.message, "success");

      getTimetable();

      setFormData({
        weekday: "1",
        slot: "1",
        subject: subjectList[0]?.subject || "",
        location: "class-133",
        IsLab: "false",
        studentClass: selectedClass,
        batch: "All",
        sem: selectedSem,
      });

      setShowForm(false);
    } catch (error) {
      // console.log(error);

      if (error.response) {
        showNotification(error.response.data.message, "error");
      } else {
        showNotification("Server error", "error");
      }
    }
  };

  const handleSlotClick = (weekday, slot) => {
    const entry = data.find((d) => d.weekday === weekday && d.slot === slot);

    if (entry) {
      setFormData({
        weekday: String(entry.weekday),
        slot: String(entry.slot),
        subject: entry.subject,
        location: entry.location,
        IsLab: entry.IsLab ? "true" : "false",
        studentClass: entry.class || selectedClass,
        batch: entry.batch || "All",
        sem: entry.sem || selectedSem,
      });
    } else {
      setFormData({
        weekday: String(weekday),
        slot: String(slot),
        subject: subjectList[0]?.subject || "",
        location: "class-133",
        IsLab: "false",
        studentClass: selectedClass,
        batch: "All",
        sem: selectedSem,
      });
    }

    setShowForm(true);
  };

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-slate-800 text-black dark:text-white">
        <NavBarFaculty />

        <div className="p-6 mt-20">

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold border-b-4 inline-block pb-1">
              Timetable
            </h1>
          </div>

          <div className="flex gap-4 justify-center mb-6">

            <select
              value={selectedSem}
              onChange={(e) => setSelectedSem(e.target.value)}
              className="border p-2 rounded-lg"
            >
              {[...Array(8)].map((_, i) => (
                <option key={i} value={String(i + 1)}>
                  Semester {i + 1}
                </option>
              ))}
            </select>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border p-2 rounded-lg"
            >
              {["A", "B", "C"].map((c) => (
                <option key={c} value={c}>
                  Class {c}
                </option>
              ))}
            </select>

            <StyledButtton
              btnname={"Add / Update Timetable"}
              onClick={() => setShowForm(true)}
            />

          </div>

          <div className="overflow-x-auto">

            <table className="min-w-full border-2 border-black dark:border-slate-400 border-collapse">

              <thead>
                <tr className="bg-gray-100 dark:bg-slate-900">

                  <th className="border p-2">Slot</th>

                  {Object.values(days).map((day) => (
                    <th key={day} className="border p-2">
                      {day}
                    </th>
                  ))}

                </tr>
              </thead>

              <tbody>

                {slotTimes.map((slot) => (
                  <tr key={slot}>

                    <td className="border p-2 text-center font-bold bg-gray-50 dark:bg-slate-900">
                      {slot}
                    </td>

                    {Object.keys(days).map((dayKey) => {
                      const dNum = Number(dayKey);

                      if (isHiddenByLab(dNum, slot)) return null;

                      const entry = data.find(
                        (d) => d.weekday === dNum && d.slot === slot
                      );

                      return (
                        <td
                          key={dayKey}
                          onClick={() => handleSlotClick(dNum, slot)}
                          rowSpan={entry?.IsLab ? 2 : 1}
                          className={`cursor-pointer border p-2 text-center transition hover:bg-slate-100 dark:hover:bg-slate-700 ${
                            entry?.IsLab ? "bg-blue-100/40" : ""
                          }`}
                        >

                          {entry ? (
                            <div>

                              {entry.IsLab && (
                                <div className="text-xs text-gray-500">
                                  Practical Batch
                                </div>
                              )}

                              <div className="font-bold text-sm">
                                {entry.subject}
                              </div>

                              <div className="text-xs">
                                {entry.location} ({entry.class} - {entry.batch})
                              </div>

                            </div>
                          ) : (
                            "-"
                          )}

                        </td>
                      );
                    })}

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white dark:bg-slate-800 w-[420px] p-6 rounded-xl shadow-xl relative">

            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-4 text-lg"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">
              Add / Update Subject
            </h2>

            <form className="space-y-3" onSubmit={saveHandler}>

              <select
                name="weekday"
                value={formData.weekday}
                onChange={changeHandler}
                className="w-full border p-2 rounded"
              >
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
              </select>

              <select
                name="slot"
                value={formData.slot}
                onChange={changeHandler}
                className="w-full border p-2 rounded"
              >
                {slotTimes.map((s) => (
                  <option key={s} value={s}>
                    Slot {s}
                  </option>
                ))}
              </select>

              <select
                name="subject"
                value={formData.subject}
                onChange={changeHandler}
                className="w-full border p-2 rounded"
              >
                {subjectList.map((s, i) => (
                  <option key={i} value={s.subject}>
                    {s.subject}
                  </option>
                ))}
              </select>

              <select
                name="location"
                value={formData.location}
                onChange={changeHandler}
                className="w-full border p-2 rounded"
              >
                <option value="class-133">class-133</option>
                <option value="class-136">class-136</option>
                <option value="B2-lab">B2-lab</option>
                <option value="B9-lab">B9-lab</option>
              </select>

              <select
                name="IsLab"
                value={formData.IsLab}
                onChange={changeHandler}
                className="w-full border p-2 rounded"
              >
                <option value="false">Lecture</option>
                <option value="true">Lab</option>
              </select>

              <select
                name="batch"
                value={formData.batch}
                onChange={changeHandler}
                className="w-full border p-2 rounded"
              >
                <option value="All">Whole Class</option>

                {selectedClass === "A" &&
                  ["A1", "A2", "A3"].map((b) => (
                    <option key={b}>{b}</option>
                  ))}

                {selectedClass === "B" &&
                  ["B1", "B2", "B3"].map((b) => (
                    <option key={b}>{b}</option>
                  ))}

                {selectedClass === "C" &&
                  ["C1", "C2", "C3"].map((b) => (
                    <option key={b}>{b}</option>
                  ))}
              </select>

              <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                Save Subject
              </button>

            </form>

          </div>

        </div>
      )}
    </>
  );
};

export default AddTimetable;