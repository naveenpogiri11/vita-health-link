
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getPatientDetails } from "@/services/dataService";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ChevronLeft, Clock, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DoctorPatientDetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  
  // Get patient details from service
  const { patient, appointments, reports } = patientId 
    ? getPatientDetails(patientId)
    : { patient: undefined, appointments: [], reports: [] };
  
  if (!user || !patient) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-500">Patient not found</p>
        <Button 
          variant="link" 
          className="mt-2"
          onClick={() => navigate("/doctor/patients")}
        >
          Go back to patient list
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm"
          className="mr-2"
          onClick={() => navigate("/doctor/patients")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Patient: {patient.name}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Patient Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Patient details and medical history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p>{patient.name}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{patient.email}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                <p>{patient.dateOfBirth}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Gender</p>
                <p>{patient.gender}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Contact Number</p>
                <p>{patient.contactNumber}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Blood Type</p>
                <p>{patient.bloodType}</p>
              </div>
              
              <div className="sm:col-span-2">
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p>{patient.address}</p>
              </div>
            </div>
            
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-medium mb-2">Medical History</h3>
              {patient.medicalHistory.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patient.medicalHistory.map((condition, index) => (
                    <Badge key={index} variant="outline">
                      {condition}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No medical history recorded</p>
              )}
            </div>
            
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-medium mb-2">Allergies</h3>
              {patient.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((allergy, index) => (
                    <Badge key={index} variant="outline" className="bg-red-50 text-red-700">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No allergies recorded</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button>Add Medical Note</Button>
          </CardFooter>
        </Card>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" onClick={() => navigate("/doctor/schedule")}>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Create Medical Report
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Create Prescription
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="appointments" className="mt-6">
        <TabsList>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="reports">Medical Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <p className="text-gray-500">No appointments found for this patient</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{appointment.date}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <Clock className="h-3 w-3 mr-1" />
                              {appointment.time} ({appointment.duration} min)
                            </div>
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Button variant="link" size="sm" className="h-auto p-0">
                              {appointment.status === "scheduled" ? "Update" : "View Details"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Medical Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <p className="text-gray-500">No medical reports found for this patient</p>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{report.title}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{report.date}</span>
                          </div>
                        </div>
                        <Badge variant="outline">{report.type}</Badge>
                      </div>
                      <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
                        {report.content.length > 150 ? `${report.content.substring(0, 150)}...` : report.content}
                      </div>
                      <div className="mt-3">
                        <Button variant="link" className="h-auto p-0">
                          View Full Report
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Create New Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorPatientDetails;
