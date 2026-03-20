import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Courses from "@/pages/Courses";
import CourseView from "@/pages/CourseView";
import MyCourses from "@/pages/MyCourses";
import CreateCourse from "@/pages/CreateCourse";
import Certificates from "@/pages/Certificates";
import Notifications from "@/pages/Notifications";
import Analytics from "@/pages/Analytics";
import ManageUsers from "@/pages/ManageUsers";
import Leaderboard from "@/pages/Leaderboard";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/course/:courseId" element={<CourseView />} />
                <Route path="/my-courses" element={<MyCourses />} />
                <Route path="/create-course" element={<CreateCourse />} />
                <Route path="/certificates" element={<Certificates />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/users" element={<ManageUsers />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
