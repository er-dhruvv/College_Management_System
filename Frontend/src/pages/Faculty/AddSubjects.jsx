import axios from "axios";
import { useState, useEffect } from "react";
import NavBarFaculty from "../../../Navigation/NavBarFaculty";

const API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

const AddSubjects = () => {
  const [subjectList, setsubjectList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setformData] = useState({
    subject: "",
    code: "",
    credit: "",
    SEE: "",
    mid: "",
    practical: "",
    Assesment: "",
  });

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

  let changeHandler = (e) => {
    const { name, value } = e.target;

    setformData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  let SaveHandler = async () => {
    let res = await axios.post(
      `${API_BASE}/AddSubject`,
      { formData },
      { withCredentials: true },
    );
    if (res.data.success) {
      setsubjectList((prev) => [
        ...prev,
        {
          subject: formData.subject,
          subject_code: formData.code,
          credit: formData.credit,
          maxmarks: {
            Midsem: formData.mid,
            SEE: formData.SEE,
            PracticalExam: formData.practical,
            RegularAssesment: formData.Assesment,
          },
        },
      ]);

      setformData({
        subject: "",
        code: "",
        credit: "",
        SEE: "",
        mid: "",
        practical: "",
        Assesment: "",
      });
      alert(res.data.message);

      setShowForm(false);
    }
  };

  return (
    <>
      <NavBarFaculty />

      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-6 mt-30">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Subjects</h1>

          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            + Add Subject
          </button>
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

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 w-[500px] rounded-xl p-6 shadow-xl relative">
            {/* Close Button */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-4 text-gray-500 dark:text-gray-400 hover:text-red-500 text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              Add New Subject
            </h2>

            <form className="space-y-4">
              <input
                type="text"
                name="subject"
                value={formData.subject}
                placeholder="Subject Name"
                className="w-full border p-2 rounded-lg focus:outline-blue-500"
                onChange={changeHandler}
                required
              />

              <input
                type="text"
                name="code"
                value={formData.code}
                placeholder="Subject Code"
                className="w-full border p-2 rounded-lg focus:outline-blue-500"
                onChange={changeHandler}
                required
              />

              <input
                type="number"
                name="credit"
                value={formData.credit}
                placeholder="Credit"
                className="w-full border p-2 rounded-lg focus:outline-blue-500"
                onChange={changeHandler}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Midsem Max"
                  name="mid"
                  value={formData.mid}
                  className="border p-2 rounded-lg"
                  onChange={changeHandler}
                  required
                />

                <input
                  type="number"
                  placeholder="SEE Max"
                  name="SEE"
                  value={formData.SEE}
                  className="border p-2 rounded-lg"
                  onChange={changeHandler}
                  required
                />

                <input
                  type="number"
                  placeholder="Practical Max"
                  name="practical"
                  value={formData.practical}
                  className="border p-2 rounded-lg"
                  onChange={changeHandler}
                  required
                />

                <input
                  type="number"
                  placeholder="Assessment Max"
                  name="Assesment"
                  value={formData.Assesment}
                  className="border p-2 rounded-lg"
                  onChange={changeHandler}
                  required
                />
              </div>

              <button
                type="button"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                onClick={SaveHandler}
              >
                Save Subject
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddSubjects;
