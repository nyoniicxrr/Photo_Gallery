import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdmin } from "@/hooks/use-admin";
import { useToast } from "@/hooks/use-toast";
import { Lock, UserPlus } from "lucide-react";

interface AdminLoginProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminLogin({ open, onClose }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, createAdmin } = useAdmin();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(username, password);
    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome to admin panel",
      });
      onClose();
      setUsername("");
      setPassword("");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await createAdmin(newUsername, newPassword);
    if (success) {
      toast({
        title: "Admin Created",
        description: "Admin user created successfully. You can now login.",
      });
      setNewUsername("");
      setNewPassword("");
    } else {
      toast({
        title: "Creation Failed",
        description: "Failed to create admin user. Username might already exist.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-dark-secondary border-gray-700 max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-blue-400" />
            <DialogTitle className="text-white">Admin Access</DialogTitle>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-dark-primary">
            <TabsTrigger value="login" className="text-white data-[state=active]:bg-blue-600">
              Login
            </TabsTrigger>
            <TabsTrigger value="create" className="text-white data-[state=active]:bg-blue-600">
              Create Admin
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-dark-primary border-gray-600 text-white focus:border-blue-500"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-dark-primary border-gray-600 text-white focus:border-blue-500"
                  placeholder="Enter password"
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-gray-600 hover:bg-gray-700 text-white"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="create" className="space-y-4">
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <Label htmlFor="new-username" className="text-white">Username</Label>
                <Input
                  id="new-username"
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="bg-dark-primary border-gray-600 text-white focus:border-blue-500"
                  placeholder="Choose username"
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-password" className="text-white">Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-dark-primary border-gray-600 text-white focus:border-blue-500"
                  placeholder="Choose password"
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-gray-600 hover:bg-gray-700 text-white"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {isLoading ? "Creating..." : "Create Admin"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}