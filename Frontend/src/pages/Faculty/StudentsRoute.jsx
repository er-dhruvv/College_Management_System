import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useNotification } from "../../context/NotificationContext";

const API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";
import NavBarFaculty from "../../../Navigation/NavBarFaculty";

const StudentsRoute = () => {
  const { showNotification } = useNotification();
  const [userInfo, setuserInfo] = useState([]);
  const [query, setquery] = useState("");
  const [filters, setFilters] = useState({ sem: "", studentClass: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    fullname: "", Enrollno: "", email: "", sem: "", studentClass: "", username: "", password: "", Aadhar: ""
  });

  const Navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [filters]);

  let fetchData = async () => {
    if (!filters.sem) {
      setuserInfo([]);
      return;
    }

    try {
      const queryParams = new URLSearchParams({
        ...(filters.sem && { sem: filters.sem }),
        ...(filters.studentClass && { studentClass: filters.studentClass }),
      }).toString();

      let res = await axios.get(`${API_BASE}/api/students?${queryParams}`, {
        withCredentials: true,
      });

      setuserInfo(res.data.Info);
    } catch (error) {
      // console.log(error);
    }
  };

  let searchhandler = async (e) => {
    setquery(e.target.value);
    
    if (e.target.value.trim() === "") {
        if (!filters.sem) {
            setuserInfo([]);
        } else {
            fetchData();
        }
        return;
    }

    let res = await axios.get(
      `${API_BASE}/api/students?searchTerm=${e.target.value}`,
      {
        withCredentials: true,
      },
    );

    setuserInfo(res.data.Info);
  };

  let viewDetails = (Enrollno) => {
    Navigate(`/student/${Enrollno}`);
  };

  let handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  let handleAddStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/students`, newStudent, {
        withCredentials: true,
      });
      if(res.data.success) {
        showNotification("Student Created Successfully", "success");
        setShowAddForm(false);
        fetchData();
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Error creating student", "error");
    }
  };

  return (
    <>
      <NavBarFaculty />

      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8 pt-40">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">
          Student Details
        </h1>

        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search name or Enrollment no..."
            value={query}
            onChange={searchhandler}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm text-gray-700 dark:text-gray-200"
          />
          <select name="sem" value={filters.sem} onChange={handleFilterChange} className="px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option value="">All Semesters</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="5">Semester 5</option>
            <option value="6">Semester 6</option>
            <option value="7">Semester 7</option>
            <option value="8">Semester 8</option>
          </select>
          <input
            type="text"
            name="studentClass"
            placeholder="Class (e.g. A, B)"
            value={filters.studentClass}
            onChange={handleFilterChange}
            className="w-32 px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition font-semibold"
          >
            {showAddForm ? "Cancel" : "+ Add Student"}
          </button>
        </div>

        {showAddForm && (
          <div className="mb-8 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-4 text-indigo-700">Add New Student</h2>
            <form onSubmit={handleAddStudentSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input type="text" placeholder="Full Name" required 
                onChange={(e) => setNewStudent({...newStudent, fullname: e.target.value})} 
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none" 
              />
              <input type="number" placeholder="Enrollment No" required 
                onChange={(e) => setNewStudent({...newStudent, Enrollno: e.target.value})} 
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none" 
              />
              <input type="email" placeholder="Email" required 
                onChange={(e) => setNewStudent({...newStudent, email: e.target.value})} 
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none" 
              />
              <input type="number" placeholder="Semester" required 
                onChange={(e) => setNewStudent({...newStudent, sem: e.target.value})} 
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none" 
              />
              <input type="text" placeholder="Class" required 
                onChange={(e) => setNewStudent({...newStudent, studentClass: e.target.value})} 
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none" 
              />
              <input type="text" placeholder="Username" required 
                onChange={(e) => setNewStudent({...newStudent, username: e.target.value})} 
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none" 
              />
              <input type="password" placeholder="Password" required 
                onChange={(e) => setNewStudent({...newStudent, password: e.target.value})} 
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none" 
              />
              <input type="number" placeholder="Aadhar Number" required 
                onChange={(e) => setNewStudent({...newStudent, Aadhar: e.target.value})} 
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none" 
              />
              <div className="col-span-full mt-2">
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow-md transition">
                  Create Student
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700">
          {/* TABLE HEADER */}
          <div className="overflow-x-auto">
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
                    Mobile No
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Action
                  </th>
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
                    <tr key={user._id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-100">
                        {user.fullname}
                      </td>

                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {user.Enrollno}
                      </td>

                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{user.rollno}</td>

                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {user.MONOstd}
                      </td>

                      <td className="px-6 py-4 text-center space-x-2">
                        <button
                          onClick={() => viewDetails(user.Enrollno)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition active:scale-95"
                        >
                          View/Edit
                        </button>
                        <button
                          onClick={async () => {
                            if(window.confirm("Are you sure you want to delete?")) {
                              await axios.delete(`${API_BASE}/api/students/${user.Enrollno}`, { withCredentials: true });
                              fetchData();
                            }
                          }}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition active:scale-95"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentsRoute;
