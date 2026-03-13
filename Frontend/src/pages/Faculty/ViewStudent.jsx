import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBarFaculty from "../../../Navigation/NavBarFaculty";

const API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

const ViewStudent = () => {
  const { Enrollno } = useParams();
  const [Edit, setEdit] = useState(false);
  const [Info, setInfo] = useState({});
  const [formData, setFormData] = useState({
    fullname: "",
    DOB: "",
    rollno: "",
    Category: "",
    MONOstd: "",
    MONOsparent: "",
    email: "",
    Aadhar: "",
    Address: "",
    profilePic: "",
    sem: "",
    studentClass: "",
    batch: ""
  });

  useEffect(() => {
    let getInfo = async () => {
      let res = await axios.get(`${API_BASE}/api/students/${Enrollno}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setInfo(res.data.Info);
        setFormData(res.data.Info);
      }

      // alert(res.data.message)
    };
    getInfo();
  }, [Enrollno]);

  if (!Info) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500 dark:text-gray-400 text-lg">
          Loading profile...
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await axios.post(
        `${API_BASE}/upload-profile/${Info._id}?role=${Info.role}`,
        formData,
        { withCredentials: true },
      );

      alert(res.data.message);

      console.log(res.data);
      // ✅ instant UI update
      setInfo((prev) => ({
        ...prev,
        profilePic: res.data.filepath,
      }));
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <>
      <NavBarFaculty />
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-10 pt-32">
        {/* TOP BAR */}
        <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Student Profile</h2>

          <div className="flex gap-4">
            <button
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              onClick={() => {
                setEdit(!Edit);
              }}
            >
              {Edit ? "cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          {/* HEADER: PROFILE PIC & NAME */}
          <div className="flex flex-col sm:flex-row items-center gap-8 mb-8 border-b pb-8">
            {/* Profile Image */}
            <div className="relative w-32 h-32 rounded-full group shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl ring-4 ring-indigo-100 transition duration-300 group-hover:ring-indigo-300 relative z-10 bg-white dark:bg-slate-800">
                {Info.profilePic ? (
                  <img
                    src={`${API_BASE}/${Info.profilePic}`}
                    alt="profile"
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                    {Info.fullname?.charAt(0)}
                  </div>
                )}
              </div>

              {/* Upload Overlay */}
              {Edit && (
                <label className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer z-20">
                  <span className="text-white text-sm font-semibold">
                    Change Photo
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg, image/png"
                    className="hidden"
                    onChange={handleUpload}
                  />
                </label>
              )}
            </div>

            {/* Name and Enrollment Info */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left w-full">
              {Edit ? (
                <>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="border-2 border-indigo-100 focus:border-indigo-500 rounded-lg p-2 text-2xl font-bold text-gray-900 dark:text-gray-100 w-full max-w-md mb-3 outline-none transition"
                    placeholder="Full Name"
                  />
                </>
              ) : (
                <>
                  <h3 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 ml-3">
                    {formData.fullname}
                  </h3>
                </>
              )}
              <p className="text-indigo-600 font-semibold text-lg px-4 py-1 ">
                Enrollment: {Info.Enrollno}
              </p>
            </div>
          </div>
          {/* DETAILS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Detail
              label="DOB"
              type="date"
              name="DOB"
              value={formData.DOB}  
              Edit={Edit}
              handleChange={handleChange}
            />

            <Detail
              label="Roll No"
              type="Number"
              name="rollno"
              value={formData.rollno}
              Edit={Edit}
              handleChange={handleChange}
            />

            <Detail
              label="Semester"
              type="Number"
              name="sem"
              value={formData.sem}
              Edit={Edit}
              handleChange={handleChange}
            />

            <Detail
              label="Class"
              type="text"
              name="studentClass"
              value={formData.studentClass || Info.class}
              Edit={Edit}
              handleChange={handleChange}
            />

            <Detail
              label="Batch"
              type="text"
              name="batch"
              value={formData.batch || Info.batch}
              Edit={Edit}
              handleChange={handleChange}
            />

            <Detail
              label="Category"
              name="Category"
              value={formData.Category}
              Edit={Edit}
              handleChange={handleChange}
              options={["General", "OBC", "SC", "ST"]}
            />

            <Detail
              label="Student Mobile"
              type="Number"
              name="MONOstd"
              value={formData.MONOstd}
              Edit={Edit}
              handleChange={handleChange}
            />

            <Detail
              label="Parent Mobile"
              type="Number"
              name="MONOsparent"
              value={formData.MONOsparent}
              Edit={Edit}
              handleChange={handleChange}
            />

            <Detail
              label="Email"
              type="Email"
              name="email"
              value={formData.email}
              Edit={Edit}
              handleChange={handleChange}
            />

            <Detail
              label="Aadhar"
              type="Number"
              name="Aadhar"
              value={formData.Aadhar}
              Edit={Edit}
              handleChange={handleChange}
            />

            <Detail
              label="Address"
              type="text"
              name="Address"
              value={formData.Address}
              Edit={Edit}
              handleChange={handleChange}
            />
          </div>
          {Edit && (
            <button
              onClick={async () => {
                let formattedData = {...formData, class: formData.studentClass};
                let res = await axios.put(
                  `${API_BASE}/api/students/${Enrollno}`,
                  { formData: formattedData },
                  { withCredentials: true },
                );

                if (res.data.success) {
                  alert(res.data.message);
                }

                setEdit(false);
              }}
              className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg ml-100"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default ViewStudent;

const Detail = ({ label, type, name, value, Edit, handleChange, options }) => {
  let displayValue = value;
  let inputValue = value;

  if (type === "date" && value) {
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      displayValue = d.toLocaleDateString();
      inputValue = d.toISOString().split("T")[0];
    }
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>

      {Edit ? (
        options ? (
          <select
            name={name}
            value={inputValue || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1 bg-white dark:bg-slate-700 dark:text-white"
          >
            <option value="">Select Category</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type || "text"}
            name={name}
            value={inputValue || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1 dark:bg-slate-700 dark:text-white"
          />
        )
      ) : (
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {displayValue ?? "—"}
        </p>
      )}
    </div>
  );
};

