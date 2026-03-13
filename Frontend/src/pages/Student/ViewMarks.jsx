import { useState, useEffect } from "react";
import NavBarStudent from "../../../Navigation/NavBarStudent";
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

const ViewMarks = () => {
  const [subjects, setSubjects] = useState([]);
  const [MarksData, setMarksData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${API_BASE}/getSubjects`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setSubjects(res.data.Info);

        const marksObj = {};

        for (let s of res.data.Info) {
          let stdmarks = await axios.get(
            `${API_BASE}/api/marks/getMarks?subjectId=${s._id}`,
            { withCredentials: true },
          );

          if (stdmarks.data.success) {
            marksObj[s._id] = stdmarks.data.marks[s._id];
          }
        }

        setMarksData(marksObj);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <NavBarStudent />

      <div className="pt-36 px-10 bg-gray-100 dark:bg-slate-900 min-h-screen">
        <center>
          <h1 className="text-2xl font-bold mb-8">
            Continuous Internal Assessment
          </h1>
        </center>

        {subjects.map((s) => {
          const totalMarks =
            s.maxmarks.Midsem +
            s.maxmarks.SEE +
            s.maxmarks.PracticalExam +
            s.maxmarks.RegularAssesment;

          return (
            <div key={s._id} className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6 mb-8">
              {/* Subject Info */}

              <div className="mb-4 text-gray-700 dark:text-gray-200">
                <p>
                  <span className="font-semibold">Course Code :</span>
                  <span className="ml-2">{s.subject_code}</span>
                </p>

                <p>
                  <span className="font-semibold">Course Name :</span>
                  <span className="ml-2">{s.subject}</span>
                </p>
              </div>

              {/* Table */}

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-400 dark:border-slate-600 text-center">
                  <thead className="bg-gray-200 dark:bg-slate-700">
                    <tr>
                      <th className="border px-3 py-2">Component</th>

                      <th className="border px-3 py-2">Midsem</th>

                      <th className="border px-3 py-2">SEE</th>

                      <th className="border px-3 py-2">PracticalExam</th>

                      <th className="border px-3 py-2">RegularAssesment</th>

                      <th className="border px-3 py-2">Total Marks</th>
                    </tr>
                  </thead>

                  <tbody>
                    {/* Total Marks Row */}

                    <tr className="bg-gray-100 dark:bg-slate-900 font-semibold">
                      <td className="border px-3 py-2">Total Marks</td>

                      <td className="border">{s.maxmarks.Midsem}</td>

                      <td className="border">{s.maxmarks.SEE}</td>

                      <td className="border">{s.maxmarks.PracticalExam}</td>

                      <td className="border">{s.maxmarks.RegularAssesment}</td>

                      <td className="border">{totalMarks}</td>
                    </tr>

                    {/* Obtain Marks (Later from DB) */}

                    <tr>
                      <td className="border px-3 py-2 font-semibold">
                        Obtain Marks
                      </td>

                      <td className="border">
                        {MarksData?.[s._id]?.Midsem ?? "--"}
                      </td>

                      <td className="border">
                        {MarksData?.[s._id]?.SEE ?? "--"}
                      </td>

                      <td className="border">
                        {MarksData?.[s._id]?.PracticalExam ?? "--"}
                      </td>

                      <td className="border">
                        {MarksData?.[s._id]?.RegularAssesment ?? "--"}
                      </td>

                      <td className="border">
                        {(MarksData?.[s._id]?.Midsem || 0) +
                          (MarksData?.[s._id]?.SEE || 0) +
                          (MarksData?.[s._id]?.PracticalExam || 0) +
                          (MarksData?.[s._id]?.RegularAssesment || 0)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ViewMarks;
