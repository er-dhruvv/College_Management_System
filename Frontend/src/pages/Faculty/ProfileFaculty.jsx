import { useState, useEffect } from "react";
import axios from "axios";
import { useNotification } from "../../context/NotificationContext";
import NavBarFaculty from "../../../Navigation/NavBarFaculty";
import StyledButtton from "../../Components/StyledButtton";

const API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

const ProfileFaculty = () => {
  const { showNotification } = useNotification();
  const [userInfo, setUserInfo] = useState(null);
  const [Edit, setEdit] = useState(false);
  const [Email, setEmail] = useState("");
  const [TempEmail, setTempEmail] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setpassword] = useState("");
  const [newpassword, setnewpassword] = useState("");
  const [conpassword, setconpassword] = useState("");
  let EditHandler = () => {
    if (Edit) {
      setEmail(TempEmail);
    }
    setEdit(!Edit);
  };

  let saveHandler = async () => {
    try {
      let res = await axios.put(
        `${API_BASE}/UpdateuserEmail`,
        { email: Email },
        { withCredentials: true },
      );

      showNotification(res.data.message, "success");
      setTempEmail(Email); // update backup
      setEdit(false);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  let passwordUpdateHandler = async () => {
    try {
      let res = await axios.put(
        `${API_BASE}/UpdateuserPassword`,
        {
          password: password,
          newpassword: newpassword,
          conpassword: conpassword,
        },
        { withCredentials: true },
      );

      showNotification(res.data.message, "success");

      setpassword("");
      setnewpassword("");
      setconpassword("");
    } catch (err) {
      console.error("Save failed:", err);
    }
  };
  useEffect(() => {
    const getInfo = async () => {
      try {
        const res = await axios.get(`${API_BASE}/ProfileDetails`, {
          withCredentials: true,
        });

        if (res.data.success) {
          setUserInfo(res.data.info || res.data);
          setEmail(res.data.info?.email || res.data.email);
          setTempEmail(res.data.info?.email || res.data.email);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    getInfo();
  }, []);

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500 dark:text-gray-400 text-lg">
          Loading profile...
        </div>
      </div>
    );
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await axios.post(
        `${API_BASE}/upload-profile/${userInfo._id}?role=${userInfo.role}`,
        formData,
        { withCredentials: true },
      );

      showNotification(res.data.message, "success");

      console.log(res.data);
      // ✅ instant UI update
      setUserInfo((prev) => ({
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center p-6 pt-40">
        <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center gap-4">
              {/* Profile Picture Container */}
              <div className="relative group w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg transition">
                {userInfo.profilePic ? (
                  <img
                    src={`${API_BASE}/${userInfo.profilePic}`}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-indigo-400 flex items-center justify-center text-3xl font-bold">
                    {userInfo.fullname?.charAt(0)}
                  </div>
                )}

                {/* Upload Overlay (Only shows when Edit is clicked) */}
                {Edit && (
                  <label
                    className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center 
          opacity-0 group-hover:opacity-100 cursor-pointer transition duration-300 z-10"
                  >
                    <svg
                      className="w-6 h-6 text-white mb-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                    <span className="text-white text-xs font-semibold">
                      Choose File
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg, image/jpg, image/png"
                      className="hidden"
                      onChange={handleUpload}
                    />
                  </label>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold">{userInfo.fullname}</h2>
                <p className="opacity-90">@{userInfo.username}</p>
                <span className="inline-block  text-sm  dark:bg-slate-800/20  py-1 rounded-full">
                  {userInfo.role}
                </span>
              </div>

              {/* Buttons */}
              <div className="ml-auto flex gap-3 items-center">
                <button
                  onClick={EditHandler}
                  className="bg-white dark:bg-slate-800 text-indigo-600 font-semibold px-5 py-2 rounded-full shadow-md hover:bg-indigo-50 hover:scale-105 transition-all duration-200 active:scale-95"
                >
                  {Edit ? "Cancel" : "Edit"}
                </button>

                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="border border-white text-white font-semibold px-5 py-2 rounded-full hover:bg-white dark:bg-slate-800 hover:text-indigo-600 transition-all duration-200 active:scale-95"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 dark:text-gray-200">
            <ProfileItem label="FacultyId" value={userInfo.FacultyId} />
            <ProfileItem label="Salary" value={userInfo.salary} />
            <ProfileItem
              label="Date of Birth"
              value={userInfo.DOB ? new Date(userInfo.DOB).toLocaleDateString() : ""}
            />
            <ProfileItem label="Category" value={userInfo.Category} />

            {Edit ? (
              <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-4 shadow-sm">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Email
                </p>

                <input
                  type="email"
                  value={Email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full bg-transparent border-b-2 border-indigo-400
               focus:outline-none focus:border-purple-600
               text-gray-800 dark:text-gray-100 font-semibold py-1"
                />
                <div className="col-span-full flex justify-center items-center mt-6">
                  <StyledButtton btnname={"save"} onClick={saveHandler} />
                </div>
              </div>
            ) : (
              <ProfileItem label="Email" value={Email} />
            )}

            <ProfileItem label="Mobile" value={userInfo.MONOstd} />

            <ProfileItem label="Aadhar" value={userInfo.Aadhar} />
            <ProfileItem label="Address" value={userInfo.Address} />
            {/* <ProfileItem label="Subject" value={userInfo.subjectId.subject} /> */}
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm
                  flex items-center justify-center z-50"
        >
          {/* Modal Box */}
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6
                    animate-scaleIn"
          >
            <h2 className="text-2xl font-bold text-indigo-600 mb-4 text-center">
              Change Password
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Old Password</label>
                <input
                  type="password"
                  className="w-full mt-1 px-4 py-2 rounded-lg border
                       focus:outline-none focus:ring-2
                       focus:ring-indigo-500"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">New Password</label>
                <input
                  type="password"
                  className="w-full mt-1 px-4 py-2 rounded-lg border
                       focus:outline-none focus:ring-2
                       focus:ring-purple-500"
                  value={newpassword}
                  onChange={(e) => setnewpassword(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full mt-1 px-4 py-2 rounded-lg border
                       focus:outline-none focus:ring-2
                       focus:ring-purple-500"
                  value={conpassword}
                  onChange={(e) => setconpassword(e.target.value)}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-5 py-2 rounded-full border
                     hover:bg-gray-100 dark:bg-slate-900 transition"
              >
                Cancel
              </button>

              <button
                className="bg-gradient-to-r from-indigo-600 to-purple-600
                     text-white px-6 py-2 rounded-full shadow
                     hover:scale-105 transition"
                onClick={passwordUpdateHandler}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ProfileItem = ({ label, value }) => (
  <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-4 shadow-sm hover:shadow transition">
    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
    <p className="font-semibold text-gray-800 dark:text-gray-100 break-words">{value}</p>
  </div>
);

export default ProfileFaculty;
