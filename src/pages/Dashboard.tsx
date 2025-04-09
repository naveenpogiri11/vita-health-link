
import { useAuth } from "@/contexts/AuthContext";
import { 
  getPatientAppointments,
  getPatientReports,
  getDoctorAppointments,
  getDoctorPatients,
} from "@/services/dataService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ClipboardList, Users, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  const isPatient = user.role === "patient";
  
  // Get relevant data based on user role
  const appointments = isPatient 
    ? getPatientAppointments(user.id)
    : getDoctorAppointments(user.id);
    
  const upcomingAppointments = appointments.filter(a => a.status === "scheduled");
  
  // Patient-specific data
  const patientReports = isPatient ? getPatientReports(user.id) : [];
  
  // Doctor-specific data
  const doctorPatients = !isPatient ? getDoctorPatients(user.id) : [];
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Hello, {isPatient ? "" : "Dr. "}{user.name}</h1>
      <p className="text-gray-600">Welcome to your dashboard</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Upcoming Appointments</CardTitle>
            <CalendarIcon className="h-5 w-5 text-health-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-gray-600">
              {upcomingAppointments.length === 0 
                ? "No upcoming appointments" 
                : `Next: ${upcomingAppointments[0].date} at ${upcomingAppointments[0].time}`}
            </p>
            <Button 
              variant="link" 
              className="p-0 mt-4 h-auto"
              onClick={() => navigate(isPatient ? "/patient/appointments" : "/doctor/schedule")}
            >
              View all appointments
            </Button>
          </CardContent>
        </Card>
        
        {/* Patient Reports Card or Doctor Patients Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              {isPatient ? "Medical Reports" : "My Patients"}
            </CardTitle>
            {isPatient 
              ? <FileText className="h-5 w-5 text-health-primary" />
              : <Users className="h-5 w-5 text-health-primary" />
            }
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isPatient ? patientReports.length : doctorPatients.length}
            </div>
            <p className="text-xs text-gray-600">
              {isPatient 
                ? patientReports.length === 0
                  ? "No medical reports available"
                  : `Last report: ${patientReports[0].title}`
                : `Total patients under your care`
              }
            </p>
            <Button 
              variant="link" 
              className="p-0 mt-4 h-auto"
              onClick={() => navigate(isPatient ? "/patient/reports" : "/doctor/patients")}
            >
              {isPatient ? "View all reports" : "View all patients"}
            </Button>
          </CardContent>
        </Card>
        
        {/* Quick Actions Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
            <ClipboardList className="h-5 w-5 text-health-primary" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {isPatient ? (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/patient/appointments")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Book New Appointment
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/patient/profile")}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Update Profile
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/doctor/schedule")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Manage Schedule
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/doctor/patients")}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    View Patient List
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Appointments Preview */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recent Appointments</h2>
        {appointments.length === 0 ? (
          <p className="text-gray-600">No appointments found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {isPatient ? "Doctor" : "Patient"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.slice(0, 5).map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {isPatient ? appointment.doctorName : appointment.patientName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${appointment.status === 'scheduled' ? 'bg-green-100 text-green-800' : 
                          appointment.status === 'completed' ? 'bg-gray-100 text-gray-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-4">
          <Button 
            variant="link" 
            onClick={() => navigate(isPatient ? "/patient/appointments" : "/doctor/schedule")}
          >
            View all appointments
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
