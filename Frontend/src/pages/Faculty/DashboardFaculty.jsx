import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

import { useNavigate } from "react-router-dom";
import NavBarFaculty from "../../../Navigation/NavBarFaculty";
import StyledButtton from "../../Components/StyledButtton";
import DashboardDivCards from "../../Components/DashboardDivCards";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

const DashboardFaculty = () => {
  let navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    let fetchuser = async () => {
      try {
        let res = await axios.get(`${API_BASE}/getInfo`, {
          withCredentials: true,
        });

        setUsername(res.data.username);
      } catch (error) {
        console.log(error);
        navigate("/");
      }
    };

    fetchuser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      {/* Top Navbar */}
      <NavBarFaculty />
      {/* Main Content */}
      <div className="p-8 pt-40">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
          Your welcome,{username}
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardDivCards
            title={"Attendance"}
            PTAG={"Fill Student Attendance"}
            btn={
              <StyledButtton
                btnname={"Fill Attendance"}
                onClick={() => {
                  navigate("/FillAttendance");
                }}
              />
            }
          />
          <DashboardDivCards
            title={"Subjects"}
            PTAG={"Create or view subject."}
            btn={
              <StyledButtton
                btnname={"view Subjects"}
                onClick={() => {
                  navigate("/AddSubjects");
                }}
              />
            }
          />
          <DashboardDivCards
            title={"Timetable"}
            PTAG={"make or Update Timetale."}
            btn={
              <StyledButtton
                btnname={"Update Timetable"}
                onClick={() => {
                  navigate("/AddTimetable");
                }}
              />
            }
          />
          <DashboardDivCards
            title={"Study Material"}
            PTAG={"Upload Study Materials."}
            btn={
              <StyledButtton
                btnname={
                  <>
                    Add Material
                    <FontAwesomeIcon
                      icon={faArrowUpRightFromSquare}
                      className="ml-2"
                    />
                  </>
                }
                onClick={() =>
                  window.open(
                    "https://classroom.google.com/",
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardFaculty;
