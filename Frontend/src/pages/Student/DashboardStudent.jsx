import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBarStudent from "../../../Navigation/NavBarStudent";
import StyledButtton from "../../Components/StyledButtton";
import DashboardDivCards from "../../Components/DashboardDivCards";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

const API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

const DashboardStudent = () => {
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
        // console.log(error);
        navigate("/");
      }
    };

    fetchuser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      <NavBarStudent />

      {/* Main Content */}
      <div className="p-8 pt-40">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
          You're welcome, {username}
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardDivCards
            title={"Attendance"}
            PTAG={"Check your daily and monthly attendance records."}
            btn={
              <StyledButtton
                btnname={"View Attendance"}
                onClick={() => {
                  navigate("/ViewAttendanceStudent");
                }}
              />
            }
          />
          <DashboardDivCards
            title={"Subject"}
            PTAG={"View Subjects Here."}
            btn={
              <StyledButtton
                btnname={"View Subject"}
                onClick={() => {
                  navigate("/ViewSubject");
                }}
              />
            }
          />

          <DashboardDivCards
            title={"Timetable"}
            PTAG={"See Timetable here."}
            btn={
              <StyledButtton
                btnname={"View TimeTable"}
                onClick={() => {
                  navigate("/timetable");
                }}
              />
            }
          />
          <DashboardDivCards
            title={"Study Material"}
            PTAG={"view study material here."}
            btn={
              <StyledButtton
                btnname={
                  <>
                    Open Material
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

export default DashboardStudent;
