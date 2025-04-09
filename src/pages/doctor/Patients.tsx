
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getDoctorPatients } from "@/services/dataService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Search, User, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DoctorPatients = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get patients from service
  const allPatients = user ? getDoctorPatients(user.id) : [];
  
  // Filter patients based on search term
  const filteredPatients = allPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.medicalHistory.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  if (!user) return <div>Loading patients...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Patients</h1>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-sm text-gray-500">
          Showing {filteredPatients.length} of {allPatients.length} patients
        </p>
      </div>
      
      {filteredPatients.length === 0 ? (
        <div className="text-center py-10">
          <User className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No patients found matching your search</p>
          {searchTerm && (
            <Button 
              variant="link" 
              className="mt-2"
              onClick={() => setSearchTerm("")}
            >
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map(patient => (
            <Card key={patient.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{patient.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="text-gray-500">Contact: </span>
                    {patient.contactNumber}
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-gray-500">DOB: </span>
                    {patient.dateOfBirth}
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-gray-500">Blood Type: </span>
                    {patient.bloodType}
                  </div>
                  
                  {patient.allergies.length > 0 && (
                    <div className="text-sm">
                      <span className="text-gray-500">Allergies: </span>
                      {patient.allergies.join(", ")}
                    </div>
                  )}
                  
                  <div className="pt-2 flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                    >
                      <FileText className="h-4 w-4" />
                      View Details
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => navigate("/doctor/schedule")}
                    >
                      <Calendar className="h-4 w-4" />
                      Schedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorPatients;
