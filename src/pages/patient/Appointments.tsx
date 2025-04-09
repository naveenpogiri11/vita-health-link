
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getPatientAppointments, getDoctorAvailability } from "@/services/dataService";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Clock, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

const PatientAppointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [appointmentReason, setAppointmentReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Get appointments from service
  const appointments = user ? getPatientAppointments(user.id) : [];
  
  // Filter appointments by status
  const upcomingAppointments = appointments.filter(a => a.status === "scheduled");
  const pastAppointments = appointments.filter(a => a.status !== "scheduled");
  
  // Get doctor availability for selected date
  const doctorId = "d1"; // For demo, we're using a fixed doctor
  const availableTimeSlots = selectedDate
    ? getDoctorAvailability(doctorId, format(selectedDate, "yyyy-MM-dd"))
      .filter(slot => !slot.isBooked)
      .map(slot => slot.startTime)
    : [];
  
  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTimeSlot || !appointmentReason) {
      toast({
        title: "Incomplete information",
        description: "Please select a date, time slot, and provide a reason for your appointment",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would create a new appointment in the database
    toast({
      title: "Appointment booked",
      description: `Your appointment has been scheduled for ${format(selectedDate, "MMMM d, yyyy")} at ${selectedTimeSlot}`,
      variant: "default",
    });
    
    // Reset form
    setSelectedTimeSlot(null);
    setAppointmentReason("");
    setIsDialogOpen(false);
  };
  
  const renderAppointmentCard = (appointment: typeof appointments[0], isPast: boolean) => (
    <Card key={appointment.id} className={`mb-4 ${isPast ? 'opacity-70' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{appointment.reason}</CardTitle>
            <CardDescription>with {appointment.doctorName}</CardDescription>
          </div>
          <span 
            className={`px-2 py-1 text-xs font-semibold rounded-full 
            ${appointment.status === 'scheduled' ? 'bg-green-100 text-green-800' : 
              appointment.status === 'completed' ? 'bg-gray-100 text-gray-800' : 
              'bg-red-100 text-red-800'}`}
          >
            {appointment.status}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-health-primary" />
            <span>{appointment.date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-health-primary" />
            <span>{appointment.time} ({appointment.duration} min)</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {!isPast && (
          <Button variant="outline" className="w-full">
            Cancel Appointment
          </Button>
        )}
      </CardFooter>
    </Card>
  );
  
  if (!user) return <div>Loading appointments...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Appointments</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Book New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Book an Appointment</DialogTitle>
              <DialogDescription>
                Select a date and time for your appointment with Dr. Sarah Smith.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col space-y-2">
                <Label>Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border mx-auto"
                  disabled={(date) => 
                    date < new Date() || // Can't select past dates
                    date.getDay() === 0 || // Can't select Sunday
                    date.getDay() === 6    // Can't select Saturday
                  }
                />
              </div>
              {selectedDate && (
                <div className="flex flex-col space-y-2">
                  <Label>Select Time Slot</Label>
                  {availableTimeSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {availableTimeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTimeSlot === time ? "default" : "outline"}
                          className={`text-sm ${selectedTimeSlot === time ? "" : "text-gray-700"}`}
                          onClick={() => setSelectedTimeSlot(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No available time slots for this date.</p>
                  )}
                </div>
              )}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="reason">Reason for Appointment</Label>
                <Textarea
                  id="reason"
                  value={appointmentReason}
                  onChange={(e) => setAppointmentReason(e.target.value)}
                  placeholder="Please describe your symptoms or reason for visit"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleBookAppointment}>Book Appointment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No upcoming appointments</p>
              <Button variant="link" onClick={() => setIsDialogOpen(true)}>
                Book your first appointment
              </Button>
            </div>
          ) : (
            upcomingAppointments.map(appointment => renderAppointmentCard(appointment, false))
          )}
        </TabsContent>
        
        <TabsContent value="past">
          {pastAppointments.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No past appointments</p>
            </div>
          ) : (
            pastAppointments.map(appointment => renderAppointmentCard(appointment, true))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientAppointments;
