
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getPatientReports } from "@/services/dataService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const PatientReports = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  
  // Get reports from service
  const allReports = user ? getPatientReports(user.id) : [];
  
  // Filter reports based on search term
  const filteredReports = allReports.filter(report => 
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Group reports by type
  const reportTypes = ["All", "Consultation", "Lab Result", "Prescription", "Radiology"];
  
  // Handle report view
  const handleViewReport = (report: any) => {
    setSelectedReport(report);
  };
  
  // Get badge color based on report type
  const getBadgeColor = (type: string) => {
    switch (type) {
      case "Consultation":
        return "bg-blue-100 text-blue-800";
      case "Lab Result":
        return "bg-green-100 text-green-800";
      case "Prescription":
        return "bg-purple-100 text-purple-800";
      case "Radiology":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const renderReportCard = (report: any) => (
    <Card key={report.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{report.title}</CardTitle>
          <Badge variant="outline" className={getBadgeColor(report.type)}>
            {report.type}
          </Badge>
        </div>
        <CardDescription>by {report.doctorName} on {report.date}</CardDescription>
      </CardHeader>
      <CardFooter>
        <div className="flex space-x-2 w-full justify-end">
          <Button variant="outline" size="sm" onClick={() => handleViewReport(report)}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
  
  if (!user) return <div>Loading reports...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Medical Reports</h1>
      
      <div className="mb-6">
        <Input
          placeholder="Search reports by title, type, or doctor"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      <Tabs defaultValue="All" className="w-full">
        <TabsList className="mb-6 flex flex-wrap">
          {reportTypes.map(type => (
            <TabsTrigger key={type} value={type}>
              {type}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {reportTypes.map(type => (
          <TabsContent key={type} value={type}>
            {filteredReports.length === 0 ? (
              <div className="text-center py-10">
                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No reports found</p>
              </div>
            ) : (
              type === "All" ? 
                filteredReports.map(report => renderReportCard(report)) :
                filteredReports
                  .filter(report => report.type === type)
                  .map(report => renderReportCard(report))
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedReport?.title}</DialogTitle>
            <DialogDescription>
              Report by {selectedReport?.doctorName} on {selectedReport?.date}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-gray-50 p-4 rounded-md whitespace-pre-line">
              {selectedReport?.content}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientReports;
