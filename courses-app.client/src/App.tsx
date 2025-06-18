import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import LoginPage from "@/components/LoginPage";
import AdminDashboard from "@/components/AdminDashboard";
import StudentDashboard from "@/components/StudentDashboard";
import CourseDetail from "@/components/CourseDetail";
import type { User, Course } from "@/types";

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return (
      <Router>
        <LoginPage onLogin={handleLogin} />
      </Router>
    );
  }

  // // Add progress to courses for student view
  // const coursesWithProgress = courses.map((course) => ({
  //   ...course,
  //   progress:
  //     user.role === "student" ? Math.floor(Math.random() * 100) : undefined,
  // }));

  // // Mock enrolled courses for students (courses 1 and 2)
  const enrolledCourses : Course[]= [];
    // user.role === "student"
    //   ? coursesWithProgress.filter((course) => [1, 2].includes(course.id))
    //   : coursesWithProgress;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user.role === "professor" ? (
              <AdminDashboard
                currentUser={user.email}
                onLogout={handleLogout}
              />
            ) : (
              <StudentDashboard
                currentUser={user.email}
                onLogout={handleLogout}
                courses={enrolledCourses}
              />
            )
          }
        />
        <Route
          path="/course/:courseId"
          element={
            <CourseDetail
              currentUser={user.email}
              userRole={user.role}
              onLogout={handleLogout}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
