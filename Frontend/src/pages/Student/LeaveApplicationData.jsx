import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StyledButtton from "../../Components/StyledButtton";
import NavBarStudent from "../../../Navigation/NavBarStudent";

const API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

const LeaveApplicationData = () => {
  const navigate = useNavigate();
  const [leaveInfo, setleaveInfo] = useState([]);

  useEffect(() => {
    let fetchLeave = async () => {
      try {
        let res = await axios.get(`${API_BASE}/LeaveDataStudent`, {
          withCredentials: true,
        });

        setleaveInfo(res.data.info);
      } catch (error) {
        // console.log(error);
      }
    };

    fetchLeave();
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "text-green-700";
      case "rejected":
        return "text-red-700";
      case "pending":
      default:
        return "text-yellow-300";
    }
  };

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-10">
        <NavBarStudent />

        <div className="flex items-center justify-between mt-6 mb-6 pt-30 ">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Your Leave Requests
          </h2>

          <StyledButtton
            btnname={"Add Leave Application"}
            onClick={() => navigate("/LeaveFormStudent")}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leaveInfo.length == 0 ? (
            <h1>No leave Requests</h1>
          ) : (
            leaveInfo.map((leave) => (
              <div
                key={leave._id}
                className="bg-white dark:bg-slate-800 shadow-md rounded-xl p-5 border hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg text-indigo-600">
                  {leave.TypeOfLeave}
                </h3>

                <p>
                  <b>Duration:</b> {leave.DayDuration}
                </p>

                <p>
                  <b>From:</b> {new Date(leave.FromDate).toLocaleDateString()}
                </p>

                <p>
                  <b>To:</b> {new Date(leave.ToDate).toLocaleDateString()}
                </p>

                <p>
                  <b>Remarks:</b> {leave.Remarks}
                </p>

                <p className="mt-2">
                  <b>Status:</b>{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusStyle(leave.status)}`}
                  >
                    {leave.status}
                  </span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default LeaveApplicationData;
