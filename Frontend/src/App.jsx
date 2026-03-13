import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from "./pages/Login"
import ProtectedRoute from './ProtectedRoute'

import DashboardFaculty from "./pages/Faculty/DashboardFaculty"
import ProfileFaculty from './pages/Faculty/ProfileFaculty'
import LeaveDataFaculty from './pages/Faculty/LeaveDataFaculty'
import StudentsRoute from './pages/Faculty/StudentsRoute'
import ViewStudent from './pages/Faculty/ViewStudent'
import { FillAttendance } from './pages/Faculty/FillAttendance'
import AddMarks from './pages/Faculty/AddMarks'
import AddSubjects from './pages/Faculty/AddSubjects'
import AddTimetable from './pages/Faculty/AddTimetable'

import DashboardStudent from "./pages/Student/DashboardStudent"
import LeaveApplicationForm from "./pages/Student/LeaveApplicationForm"
import LeaveApplicationData from "./pages/Student/LeaveApplicationData"
import ProfileStudent from './pages/Student/ProfileStudent'
import ViewAttendanceStudent from './pages/Student/ViewAttendanceStudent'
import Timetable from './pages/Student/Timetable'
import ViewMarks from './pages/Student/ViewMarks'
import ViewSubject from './pages/Student/ViewSubject'
import SubjectwiseAttendance from './pages/Student/SubjectwiseAttendance'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          {/* <Route path='/signup' element={<Signup/>}/>
            <Route path='/home' element={<Home/>}/> */}

          <Route path='/DashboardFaculty' element={<ProtectedRoute allowedRole={"faculty"}><DashboardFaculty /></ProtectedRoute>} />
          <Route path='/FillAttendance' element={<ProtectedRoute allowedRole={"faculty"}><FillAttendance /></ProtectedRoute>} />
          <Route path='/ProfileFaculty' element={<ProtectedRoute allowedRole={"faculty"}><ProfileFaculty /></ProtectedRoute>} />
          <Route path='/LeaveDataFaculty' element={<ProtectedRoute allowedRole={"faculty"}><LeaveDataFaculty /></ProtectedRoute>} />
          <Route path='/StudentsRoute' element={<ProtectedRoute allowedRole={"faculty"}><StudentsRoute /></ProtectedRoute>} />
          <Route path='/student/:Enrollno' element={<ProtectedRoute allowedRole={"faculty"}><ViewStudent /></ProtectedRoute>} />
          <Route path='/AddMarks' element={<ProtectedRoute allowedRole={"faculty"}><AddMarks /></ProtectedRoute>} />
          <Route path='/AddSubjects' element={<ProtectedRoute allowedRole={"faculty"}><AddSubjects /></ProtectedRoute>} />
          <Route path='/AddTimetable' element={<ProtectedRoute allowedRole={"faculty"}><AddTimetable /></ProtectedRoute>} />


          <Route path='/DashboardStudent' element={<ProtectedRoute allowedRole={"Student"}><DashboardStudent /></ProtectedRoute>} />
          <Route path='/LeaveFormStudent' element={<ProtectedRoute allowedRole={"Student"}><LeaveApplicationForm /></ProtectedRoute>} />
          <Route path='/ViewAttendanceStudent' element={<ProtectedRoute allowedRole={"Student"}><ViewAttendanceStudent /></ProtectedRoute>} />
          <Route path='/timetable' element={<ProtectedRoute allowedRole={"Student"}><Timetable /></ProtectedRoute>} />
          <Route path='/LeaveDataStudent' element={<ProtectedRoute allowedRole={"Student"}><LeaveApplicationData /></ProtectedRoute>} />
          <Route path='/ProfileStudent' element={<ProtectedRoute allowedRole={"Student"}><ProfileStudent /></ProtectedRoute>} />
          <Route path='/ViewMarks' element={<ProtectedRoute allowedRole={"Student"}><ViewMarks /></ProtectedRoute>} />
          <Route path='/ViewSubject' element={<ProtectedRoute allowedRole={"Student"}><ViewSubject /></ProtectedRoute>} />
          <Route path='/SubjectwiseAttendance' element={<ProtectedRoute allowedRole={"Student"}><SubjectwiseAttendance /></ProtectedRoute>} />

        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
