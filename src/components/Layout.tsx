
import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarTrigger,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  CalendarIcon, 
  ClipboardList, 
  FileText, 
  Home, 
  LogOut,
  Settings, 
  User, 
  Users 
} from "lucide-react";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<{
    title: string;
    url: string;
    icon: React.ElementType;
  }[]>([]);

  useEffect(() => {
    if (!user) return;

    // Set menu items based on user role
    if (user.role === "patient") {
      setMenuItems([
        { title: "Dashboard", url: "/dashboard", icon: Home },
        { title: "My Profile", url: "/patient/profile", icon: User },
        { title: "Appointments", url: "/patient/appointments", icon: CalendarIcon },
        { title: "Medical Reports", url: "/patient/reports", icon: FileText },
      ]);
    } else if (user.role === "doctor") {
      setMenuItems([
        { title: "Dashboard", url: "/dashboard", icon: Home },
        { title: "My Profile", url: "/doctor/profile", icon: User },
        { title: "My Schedule", url: "/doctor/schedule", icon: CalendarIcon },
        { title: "My Patients", url: "/doctor/patients", icon: Users },
      ]);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="p-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-health-primary flex items-center justify-center text-white font-bold text-xl mr-3">
                  {user.role === "doctor" ? "Dr" : "P"}
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{user.name}</h3>
                  <p className="text-xs text-gray-600 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a 
                          href={item.url} 
                          className="flex items-center space-x-2 w-full"
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup className="mt-auto">
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a 
                        href="#"
                        onClick={(e) => { 
                          e.preventDefault(); 
                          handleLogout(); 
                        }} 
                        className="flex items-center space-x-2 text-red-500 w-full"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <main className="flex-1">
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold text-center flex-1">MediCare Connect</h1>
              <div className="w-10"></div> {/* Empty div for layout balance */}
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
