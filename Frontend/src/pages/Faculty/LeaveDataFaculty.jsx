import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useNotification } from "../../context/NotificationContext";
import NavBarFaculty from "../../../Navigation/NavBarFaculty";

const API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

const LeaveDataFaculty = () => {
  const { showNotification } = useNotification();
  const [leaveInfo, setleaveInfo] = useState([]);
  const [remarksMap, setRemarksMap] = useState({});
  const [LeaveStatus, setLeaveStatus] = useState("Pending");

  const Navigate = useNavigate();

  useEffect(() => {
    let fetchLeave = async () => {
      try {
        let res = await axios.get(`${API_BASE}/getAllStudentLeave`, {
          withCredentials: true,
        });

        setleaveInfo(res.data.info);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLeave();
  }, []);

  const handleRemarkChange = (id, value) => {
    setRemarksMap((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const updateStatus = async (leaveId, status) => {
    try {
      await axios.put(
        `${API_BASE}/UpdateLeaveStatus`,
        {
          leaveId,
          status,
          facultyRemark: remarksMap[leaveId] ? remarksMap[leaveId].trimEnd() : "",
        },
        { withCredentials: true },
      );

      // update UI instantly
      setleaveInfo((prev) =>
        prev.map((l) =>
          l._id === leaveId ? { ...l, status, _locked: true } : l,
        ),
      );

      setRemarksMap((prev) => ({
        ...prev,
        [leaveId]: "",
      }));
    } catch (err) {
      console.log(err);
      showNotification("Update failed", "error");
    }
  };
  let filterLeave = leaveInfo.filter((leave) => {
    return leave.status === LeaveStatus;
  });

  return (
    <>
      <NavBarFaculty />
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8 pt-40">
        {/* FILTER BAR */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
            Leave Requests
          </h1>

          <div className="flex items-center gap-3">
            <select
              value={LeaveStatus}
              onChange={(e) => setLeaveStatus(e.target.value)}
              className="
        bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600
        rounded-lg px-4 py-2
        text-sm font-semibold text-gray-700 dark:text-gray-200
        shadow-sm
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        hover:border-indigo-400
        transition
      "
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filterLeave.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-slate-800 rounded-xl shadow p-10 text-center text-gray-500 dark:text-gray-400">
              No {LeaveStatus.toLowerCase()} requests found.
            </div>
          ) : (
            filterLeave.map((leave) => (
              <div
                key={leave._id}
                className="
    bg-white dark:bg-slate-800 w-full max-w-6xl mx-auto
    rounded-xl shadow-md
    border border-gray-200 dark:border-slate-700
    p-4
    hover:shadow-lg transition
  "
              >
                {/* HEADER */}
                <div className="flex flex-wrap justify-between items-center mb-3">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {leave.userId.fullname}
                    </h2>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      @{leave.userId.username} • {leave.userId.role}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        leave.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : leave.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }
                      `}
                  >
                    {leave.status}
                  </span>
                </div>
                <button
                  onClick={() => Navigate(`/student/${leave.userId.Enrollno}`)}
                  className="
    mt-2 sm:mt-0
    px-4 py-1.5
    text-xs font-semibold
    rounded-full
    border border-indigo-500
    text-indigo-600
    hover:bg-indigo-600
    hover:text-white
    transition
    active:scale-95
  "
                >
                  View Profile
                </button>

                {/* INFO GRID */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-gray-700 dark:text-gray-200 mt-4">
                  <div>
                    <p className="uppercase tracking-wide text-gray-400">
                      Type
                    </p>
                    <p className="font-medium">{leave.TypeOfLeave}</p>
                  </div>

                  <div>
                    <p className="uppercase tracking-wide text-gray-400">
                      Duration
                    </p>
                    <p className="font-medium">{leave.DayDuration}</p>
                  </div>

                  <div>
                    <p className="uppercase tracking-wide text-gray-400">
                      Date
                    </p>
                    <p className="font-medium">
                      {new Date(leave.FromDate).toLocaleDateString()} →{" "}
                      {new Date(leave.ToDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* STUDENT REMARK */}
                <div className="mt-3">
                  <p className="uppercase tracking-wide text-gray-400 text-xs">
                    Student Remark
                  </p>
                  <p className="text-gray-800 dark:text-gray-100 text-sm">{leave.Remarks}</p>
                </div>
                <br />

                {/* FACULTY REMARK BOX */}
                <textarea
                  rows={2}
                  placeholder="Write remark..."
                  disabled={leave._locked || leave.status !== "Pending"}
                  value={remarksMap[leave._id] || ""}
                  className="
                w-full rounded-lg border border-gray-300 dark:border-slate-600
                p-2 text-sm
                outline-none resize-none
                disabled:bg-gray-100 dark:bg-slate-900
                disabled:text-gray-500 dark:text-gray-400
                disabled:cursor-not-allowed
                focus:ring-2 focus:ring-indigo-500
    "
                  onChange={(e) =>
                    handleRemarkChange(leave._id, e.target.value)
                  }
                />

                {/* ACTION BUTTONS */}
                {/* ACTION BUTTONS */}
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    disabled={leave._locked || leave.status !== "Pending"}
                    className="
      px-5 py-1.5 rounded-full
      text-sm font-semibold
      transition
      bg-red-600 text-white
      hover:bg-red-700
      active:scale-95
      disabled:bg-gray-300
      disabled:text-gray-500 dark:text-gray-400
      disabled:cursor-not-allowed
      disabled:hover:bg-gray-300
    "
                    onClick={() => updateStatus(leave._id, "Rejected")}
                  >
                    Reject
                  </button>

                  <button
                    disabled={leave._locked || leave.status !== "Pending"}
                    className="
      px-5 py-1.5 rounded-full
      text-sm font-semibold
      transition
      bg-green-600 text-white
      hover:bg-green-700
      active:scale-95
      disabled:bg-gray-300
      disabled:text-gray-500 dark:text-gray-400
      disabled:cursor-not-allowed
      disabled:hover:bg-gray-300
    "
                    onClick={() => updateStatus(leave._id, "Approved")}
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default LeaveDataFaculty;
