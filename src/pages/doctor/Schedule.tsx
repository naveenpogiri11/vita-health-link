
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getDoctorAppointments, getDoctorAvailability } from "@/services/dataService";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CalendarIcon, Clock, PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const DoctorSchedule = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddingTimeSlot, setIsAddingTimeSlot] = useState(false);
  const [newSlotStart, setNewSlotStart] = useState("09:00");
  const [newSlotEnd, setNewSlotEnd] = useState("09:30");
  
  // Get appointments and availability
  const appointments = user ? getDoctorAppointments(user.id) : [];
  const timeSlots = user 
    ? getDoctorAvailability(user.id, selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined)
    : [];
  
  // Group appointments by date
  const appointmentsByDate: { [key: string]: typeof appointments } = {};
  appointments.forEach(appointment => {
    if (!appointmentsByDate[appointment.date]) {
      appointmentsByDate[appointment.date] = [];
    }
    appointmentsByDate[appointment.date].push(appointment);
  });
  
  // Get appointments for selected date
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const appointmentsForSelectedDate = appointmentsByDate[selectedDateStr] || [];
  
  // Handle add time slot
  const handleAddTimeSlot = () => {
    // In a real app, this would add a new time slot to the database
    toast({
      title: "Time slot added",
      description: `New availability added from ${newSlotStart} to ${newSlotEnd}`,
      variant: "default",
    });
    setIsAddingTimeSlot(false);
  };
  
  // Handle next/prev day
  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
  };
  
  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newDate);
  };
  
  if (!user) return <div>Loading schedule...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Schedule</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border mx-auto"
              initialFocus
            />
          </CardContent>
        </Card>
        
        {/* Daily Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Daily Schedule</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={handlePrevDay}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </span>
              <Button variant="outline" size="icon" onClick={handleNextDay}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="appointments">
              <TabsList className="mb-4">
                <TabsTrigger value="appointments">
                  Appointments ({appointmentsForSelectedDate.length})
                </TabsTrigger>
                <TabsTrigger value="availability">
                  Availability ({timeSlots.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="appointments">
                {appointmentsForSelectedDate.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No appointments for this date</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointmentsForSelectedDate.map(appointment => (
                      <div 
                        key={appointment.id} 
                        className="p-4 border rounded-md flex justify-between items-start"
                      >
                        <div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-health-primary" />
                            <span className="font-medium">{appointment.time} ({appointment.duration} min)</span>
                          </div>
                          <h3 className="font-medium mt-1">{appointment.patientName}</h3>
                          <p className="text-sm text-gray-600">{appointment.reason}</p>
                        </div>
                        <Badge
                          className={`
                            ${appointment.status === 'scheduled' ? 'bg-green-100 text-green-800' : 
                              appointment.status === 'completed' ? 'bg-gray-100 text-gray-800' : 
                              'bg-red-100 text-red-800'}`
                          }
                        >
                          {appointment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="availability">
                <div className="flex justify-between mb-4">
                  <h3 className="text-sm font-medium">Available Time Slots</h3>
                  <Dialog open={isAddingTimeSlot} onOpenChange={setIsAddingTimeSlot}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Add Time Slot
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add Time Slot</DialogTitle>
                        <DialogDescription>
                          Add a new availability slot for {format(selectedDate, "MMMM d, yyyy")}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="startTime">Start Time</Label>
                            <input 
                              id="startTime"
                              type="time" 
                              value={newSlotStart} 
                              onChange={(e) => setNewSlotStart(e.target.value)}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="endTime">End Time</Label>
                            <input 
                              id="endTime"
                              type="time" 
                              value={newSlotEnd} 
                              onChange={(e) => setNewSlotEnd(e.target.value)}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="recurring" />
                          <Label htmlFor="recurring">Make this a recurring time slot every week</Label>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddingTimeSlot(false)}>Cancel</Button>
                        <Button onClick={handleAddTimeSlot}>Add Slot</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {timeSlots.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No availability set for this date</p>
                    <Button 
                      variant="link" 
                      className="mt-2"
                      onClick={() => setIsAddingTimeSlot(true)}
                    >
                      Add your first availability slot
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {timeSlots.map(slot => (
                      <div 
                        key={slot.id}
                        className={`p-3 border rounded-md text-center ${
                          slot.isBooked ? 'bg-gray-50' : 'bg-health-muted'
                        }`}
                      >
                        <p className="font-medium">{slot.startTime} - {slot.endTime}</p>
                        <p className="text-xs text-gray-600">
                          {slot.isBooked ? "Booked" : "Available"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorSchedule;
