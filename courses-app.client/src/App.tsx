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
import type { User } from "@/types";

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
