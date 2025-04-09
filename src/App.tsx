
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import PatientProfile from "./pages/patient/Profile";
import PatientAppointments from "./pages/patient/Appointments";
import PatientReports from "./pages/patient/Reports";
import DoctorProfile from "./pages/doctor/Profile";
import DoctorSchedule from "./pages/doctor/Schedule";
import DoctorPatients from "./pages/doctor/Patients";
import DoctorPatientDetails from "./pages/doctor/PatientDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<Layout />}>
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Patient routes */}
                <Route path="/patient/profile" element={<PatientProfile />} />
                <Route path="/patient/appointments" element={<PatientAppointments />} />
                <Route path="/patient/reports" element={<PatientReports />} />
                
                {/* Doctor routes */}
                <Route path="/doctor/profile" element={<DoctorProfile />} />
                <Route path="/doctor/schedule" element={<DoctorSchedule />} />
                <Route path="/doctor/patients" element={<DoctorPatients />} />
                <Route path="/doctor/patients/:patientId" element={<DoctorPatientDetails />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
