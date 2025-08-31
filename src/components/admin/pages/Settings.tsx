import { useState } from "react";
import { Settings, Mail, Smartphone, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const AdminSettings = () => {
  const [siteName, setSiteName] = useState("Uganda Connects");
  const [rolePermissions, setRolePermissions] = useState({
    leader: { post: true, moderate: false },
    journalist: { post: true, moderate: true },
    citizen: { post: true, moderate: false },
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
  });

  const handleSave = () => {
    console.log("Saving settings:", { siteName, rolePermissions, notifications });
  };

  return (
    <div className="container py-4 xs:py-6 sm:py-8">
      <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-primary mb-4 xs:mb-6">
        Admin Settings
      </h1>
      <p className="text-sm xs:text-base text-muted-foreground mb-6 xs:mb-8">
        Configure platform settings and permissions.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-6">
        {/* General Settings */}
        <Card className="shadow-soft rounded-lg bg-card">
          <CardHeader className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm xs:text-base">General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName" className="text-sm font-medium">
                Site Name
              </Label>
              <Input
                id="siteName"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Role Permissions */}
        <Card className="shadow-soft rounded-lg bg-card">
          <CardHeader className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm xs:text-base">Role Permissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {["leader", "journalist", "citizen"].map((role) => (
              <div key={role} className="space-y-2">
                <p className="text-sm xs:text-base font-semibold capitalize">{role}</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`${role}-post`}
                      checked={rolePermissions[role as keyof typeof rolePermissions].post}
                      onCheckedChange={(checked) =>
                        setRolePermissions({
                          ...rolePermissions,
                          [role]: { ...rolePermissions[role as keyof typeof rolePermissions], post: checked },
                        })
                      }
                    />
                    <Label htmlFor={`${role}-post`} className="text-xs sm:text-sm">
                      Post Content
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`${role}-moderate`}
                      checked={rolePermissions[role as keyof typeof rolePermissions].moderate}
                      onCheckedChange={(checked) =>
                        setRolePermissions({
                          ...rolePermissions,
                          [role]: { ...rolePermissions[role as keyof typeof rolePermissions], moderate: checked },
                        })
                      }
                    />
                    <Label htmlFor={`${role}-moderate`} className="text-xs sm:text-sm">
                      Moderate Content
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-soft rounded-lg bg-card">
          <CardHeader className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm xs:text-base">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="email"
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
              />
              <Label htmlFor="email" className="text-xs sm:text-sm">
                Email Notifications
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="sms"
                checked={notifications.sms}
                onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
              />
              <Label htmlFor="sms" className="text-xs sm:text-sm">
                SMS Notifications
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 xs:mt-8">
        <Button onClick={handleSave} className="hover:bg-primary/90">
          Save Settings
        </Button>
      </div>
    </div>
  );
};