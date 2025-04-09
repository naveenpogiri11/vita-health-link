
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getDoctorProfile } from "@/services/dataService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const DoctorProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Get doctor data from service
  const doctorData = user ? getDoctorProfile(user.id) : null;
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: doctorData?.name || "",
    email: doctorData?.email || "",
    specialization: doctorData?.specialization || "",
    qualifications: doctorData?.qualifications.join(", ") || "",
    experience: doctorData?.experience?.toString() || "",
    contactNumber: doctorData?.contactNumber || "",
    availableDays: doctorData?.availableDays.join(", ") || "",
    bio: doctorData?.bio || "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save this to the database
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated",
      variant: "default",
    });
    setIsEditing(false);
  };
  
  if (!user || !doctorData) return <div>Loading profile...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Doctor Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Professional Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
            <CardDescription>
              {isEditing ? "Edit your professional details below" : "Your professional details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    name="experience"
                    type="number"
                    value={formData.experience}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="availableDays">Available Days</Label>
                  <Input
                    id="availableDays"
                    name="availableDays"
                    value={formData.availableDays}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="e.g., Monday, Wednesday, Friday"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="qualifications">Qualifications</Label>
                  <Input
                    id="qualifications"
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="e.g., MD, PhD, FACC"
                  />
                  {!isEditing && formData.qualifications && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.qualifications.split(", ").map((qual, index) => (
                        <Badge key={index} variant="outline">{qual}</Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>
              </div>
              
              {isEditing && (
                <div className="mt-6 flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              )}
            </form>
          </CardContent>
          {!isEditing && (
            <CardFooter>
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            </CardFooter>
          )}
        </Card>
        
        {/* Schedule Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule Summary</CardTitle>
            <CardDescription>Your current availability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Available Days</h3>
                <div className="flex flex-wrap gap-2">
                  {doctorData.availableDays.map((day, index) => (
                    <Badge key={index} variant="outline" className="bg-health-muted">
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Working Hours</h3>
                <p className="text-sm text-gray-600">9:00 AM - 5:00 PM</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Appointment Length</h3>
                <p className="text-sm text-gray-600">30 minutes</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = "/doctor/schedule"}>
              Manage Schedule
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DoctorProfile;
