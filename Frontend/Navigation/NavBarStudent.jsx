import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarListMenu from "../src/Components/NavbarListMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUser,
  faCalendarCheck,
  faChartBar,
  faFileLines,
  faRightFromBracket,
  faXmark,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNotification } from "../src/context/NotificationContext";

const API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

const NavBarStudent = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { showNotification } = useNotification();

  const menuItems = [
    { name: "Home", icon: faHouse, path: "/DashboardStudent" },
    { name: "Profile", icon: faUser, path: "/ProfileStudent" },
    { name: "Marks", icon: faChartBar, path: "/ViewMarks" },
    {
      name: "Attendance",
      icon: faCalendarCheck,
      path: "/ViewAttendanceStudent",
    },
    { name: "Leave", icon: faFileLines, path: "/LeaveDataStudent" },
  ];

  let logOutHandler = async () => {
    try {
      let res = await axios.post(
        `${API_BASE}/logout`,
        {},
        { withCredentials: true },
      );

      showNotification(res.data.message, "success");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <nav className="bg-white shadow-md px-4 md:px-8 py-4 fixed top-0 left-0 w-full z-50">
      <div className="flex justify-between items-center">
        <img
          src="/image.png"
          alt="logo"
          className="w-32 md:w-40 object-contain"
        />

        <div className="md:hidden">
          <FontAwesomeIcon
            icon={isOpen ? faXmark : faBars}
            className="text-2xl cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>

        {/* Menu */}
        <ul
          className={`
            absolute md:static top-20 left-0 w-full md:w-auto
            bg-white md:bg-transparent
            flex flex-col md:flex-row
            gap-4 md:gap-8
            p-4 md:p-0
            shadow-md md:shadow-none
            transition-all duration-300
            ${isOpen ? "block" : "hidden"} md:flex
          `}
        >
          {menuItems.map((item, index) => (
            <NavbarListMenu
              key={index}
              icon={<FontAwesomeIcon icon={item.icon} />}
              Liname={item.name}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
            />
          ))}

          <li
            className="flex items-center gap-2 cursor-pointer text-red-500 hover:text-red-600 transition"
            onClick={logOutHandler}
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            Logout
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBarStudent;
