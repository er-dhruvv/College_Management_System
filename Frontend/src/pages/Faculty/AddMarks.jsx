import NavBarFaculty from "../../../Navigation/NavBarFaculty";
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

const AddMarks = () => {
  const [userInfo, setuserInfo] = useState([]);
  const [query, setquery] = useState("");
  const [subjectList, setsubjectList] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [marksType, setMarksType] = useState([
    "Midsem",
    "SEE",
    "PracticalExam",
    "RegularAssesment",
  ]);

  const [addedTypes, setAddedTypes] = useState([]);
  const [marksData, setMarksData] = useState({});
  const [filters, setFilters] = useState({ sem: "", studentClass: "", batch: "" });

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        let subList = await axios.get(`${API_BASE}/api/marks/facultySubjectList`, {
          withCredentials: true,
        });

        if (subList.data.success) {
          setsubjectList(subList.data.subjectList);
        } else {
          alert(subList.data.message);
        }
      } catch (error) {
        console.log("Error fetching subjects", error);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...(filters.sem && { sem: filters.sem }),
        ...(filters.studentClass && { studentClass: filters.studentClass }),
        ...(filters.batch && { batch: filters.batch }),
      }).toString();

      let stdres = await axios.get(`${API_BASE}/api/students?${queryParams}`, {
        withCredentials: true,
      });

      setuserInfo(stdres.data.Info);
    } catch (error) {
      console.log("Error fetching students", error);
    }
  };

  useEffect(() => {
    if (!selectedSubject) return;

    const fetchMarks = async () => {
      try {
        let res = await axios.get(
          `${API_BASE}/api/marks/getMarks?subjectId=${selectedSubject}`,
          { withCredentials: true },
        );

        if (res.data.success) {
          setMarksData(res.data.marks);
        }
      } catch (error) {
        console.log(error);
      }

      setMarksType(["Midsem", "SEE", "PracticalExam", "RegularAssesment"]);

      setAddedTypes([]);
    };

    fetchMarks();
  }, [selectedSubject]);

  const searchhandler = async (e) => {
    setquery(e.target.value);
    
    if (e.target.value.trim() === '') {
        fetchData();
        return;
    }

    let res = await axios.get(
      `${API_BASE}/api/students?searchTerm=${e.target.value}`,
      { withCredentials: true },
    );

    setuserInfo(res.data.Info);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleMarksChange = (studentId, type, value) => {
    setMarksData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [type]: value,
      },
    }));
  };

  const submitMarks = async () => {
    try {
      let res = await axios.post(
        `${API_BASE}/api/marks/addMarks`,
        {
          subjectId: selectedSubject,
          marksData,
        },
        { withCredentials: true },
      );

      alert(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <NavBarFaculty />

      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 pt-36 px-8">
        <div className="max-w-7xl mx-auto bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Student Marks Entry
          </h1>

          {/* Controls Row */}

          <div className="flex flex-wrap items-end gap-4 mb-6">
            {/* Search Student */}

            <div className="flex flex-col flex-1">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Search Student
              </label>
              <input type="text" placeholder="Search by name..." value={query} onChange={searchhandler} 
                className="px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Semester Filter</label>
              <select name="sem" value={filters.sem} onChange={handleFilterChange} className="px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none">
                <option value="">All Semesters</option>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Class Filter</label>
              <input type="text" name="studentClass" placeholder="Class (e.g. A)" value={filters.studentClass} onChange={handleFilterChange} className="w-24 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"/>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Batch Filter</label>
              <input type="text" name="batch" placeholder="Batch (e.g. B1)" value={filters.batch} onChange={handleFilterChange} className="w-24 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"/>
            </div>

            {/* Select Subject */}

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Select Subject
              </label>

              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="
px-4 py-3
w-60
border
border-gray-300 dark:border-slate-600
rounded-xl
shadow-sm
focus:ring-2
focus:ring-indigo-400
outline-none
"
              >
                <option value="">Choose Subject</option>

                {subjectList?.subjectId?.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Exam Type */}

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Select Exam Type
              </label>

              <select
                disabled={!selectedSubject}
                defaultValue=""
                onChange={(e) => {
                  const value = e.target.value;
                  if (!value) return;

                  setAddedTypes((prev) => [...prev, value]);
                  setMarksType((prev) => prev.filter((m) => m !== value));

                  e.target.value = "";
                }}
                className="
px-4 py-3
w-60
border
border-gray-300 dark:border-slate-600
rounded-xl
shadow-sm
focus:ring-2
focus:ring-indigo-400
outline-none
disabled:bg-gray-100 dark:bg-slate-900
"
              >
                <option value="">Select Exam Type</option>

                {marksType.map((m, index) => (
                  <option key={index} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Table */}

          <div className="overflow-x-auto border rounded-xl">
            <table className="min-w-full text-sm text-gray-700 dark:text-gray-200">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Student Name</th>

                  {addedTypes.map((type, index) => (
                    <th key={index} className="px-6 py-3 text-left">
                      {type}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y">
                {userInfo.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-500 dark:text-gray-400">
                      No Student Found
                    </td>
                  </tr>
                ) : (
                  userInfo.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium">{user.fullname}</td>

                      {addedTypes.map((type, index) => (
                        <td key={index} className="px-6 py-4">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            defaultValue="0"
                            value={marksData[user._id]?.[type] || ""}
                            onChange={(e) => {
                              let value = e.target.value;

                              if (value > 100) value = 100;
                              if (value < 0) value = 0;

                              handleMarksChange(user._id, type, value);
                            }}
                            className="w-24 px-2 py-1 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Save Button */}

          <div className="flex justify-end mt-6">
            <button
              onClick={submitMarks}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-semibold shadow-md transition"
            >
              Save Marks
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddMarks;
