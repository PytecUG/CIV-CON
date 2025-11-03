// src/components/admin/pages/AdminSettings.tsx
import { useState, useEffect } from "react";
import {
  Settings,
  Mail,
  Smartphone,
  Users,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface RolePermissions {
  leader: { post: boolean; moderate: boolean };
  journalist: { post: boolean; moderate: boolean };
  citizen: { post: boolean; moderate: boolean };
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
}

const DEFAULT_SETTINGS = {
  siteName: "Uganda Connects",
  rolePermissions: {
    leader: { post: true, moderate: false },
    journalist: { post: true, moderate: true },
    citizen: { post: true, moderate: false },
  } as RolePermissions,
  notifications: {
    email: true,
    sms: false,
  } as NotificationSettings,
};

export const AdminSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [siteName, setSiteName] = useState(DEFAULT_SETTINGS.siteName);
  const [rolePermissions, setRolePermissions] = useState<RolePermissions>(DEFAULT_SETTINGS.rolePermissions);
  const [notifications, setNotifications] = useState<NotificationSettings>(DEFAULT_SETTINGS.notifications);

  // Track if form is dirty
  const [isDirty, setIsDirty] = useState(false);

  // Auto-track changes
  useEffect(() => {
    const hasChanges =
      siteName !== DEFAULT_SETTINGS.siteName ||
      JSON.stringify(rolePermissions) !== JSON.stringify(DEFAULT_SETTINGS.rolePermissions) ||
      JSON.stringify(notifications) !== JSON.stringify(DEFAULT_SETTINGS.notifications);

    setIsDirty(hasChanges);
  }, [siteName, rolePermissions, notifications]);

  // Reset to defaults
  const handleReset = () => {
    setSiteName(DEFAULT_SETTINGS.siteName);
    setRolePermissions(DEFAULT_SETTINGS.rolePermissions);
    setNotifications(DEFAULT_SETTINGS.notifications);
    toast({
      title: "Reset",
      description: "All settings restored to default.",
      icon: <RotateCcw className="h-4 w-4" />,
    });
  };

  // Save settings
  const handleSave = async () => {
    if (!siteName.trim()) {
      toast({
        title: "Validation Error",
        description: "Site name is required.",
        variant: "destructive",
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1200));

      console.log("Settings saved:", { siteName, rolePermissions, notifications });

      toast({
        title: "Saved Successfully",
        description: "All settings have been updated.",
        icon: <CheckCircle className="h-4 w-4" />,
      });
      setIsDirty(false);
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-7xl py-6 lg:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            Admin Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure platform behavior, permissions, and notifications.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!isDirty || isLoading}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isDirty || isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center gap-3 pb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="siteName" className="text-base font-medium">
                Site Name
              </Label>
              <Input
                id="siteName"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="e.g. Uganda Connects"
                className="transition-colors"
              />
              <p className="text-xs text-muted-foreground">
                The name displayed in the header and browser tab.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Role Permissions */}
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center gap-3 pb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Role Permissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(rolePermissions).map(([role, perms]) => (
              <div key={role} className="space-y-3 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold capitalize text-foreground">{role}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`${role}-post`} className="text-sm cursor-pointer">
                      Can Post Content
                    </Label>
                    <Switch
                      id={`${role}-post`}
                      checked={perms.post}
                      onCheckedChange={(checked) =>
                        setRolePermissions((prev) => ({
                          ...prev,
                          [role]: { ...prev[role as keyof typeof prev], post: checked },
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`${role}-moderate`} className="text-sm cursor-pointer">
                      Can Moderate
                    </Label>
                    <Switch
                      id={`${role}-moderate`}
                      checked={perms.moderate}
                      onCheckedChange={(checked) =>
                        setRolePermissions((prev) => ({
                          ...prev,
                          [role]: { ...prev[role as keyof typeof prev], moderate: checked },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center gap-3 pb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Receive alerts via email
                    </p>
                  </div>
                </div>
                <Switch
                  id="email"
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, email: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Receive alerts via SMS
                    </p>
                  </div>
                </div>
                <Switch
                  id="sms"
                  checked={notifications.sms}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, sms: checked }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Actions (Mobile) */}
      <div className="flex justify-end gap-3 lg:hidden mt-6">
        <Button variant="outline" onClick={handleReset} disabled={!isDirty || isLoading}>
          <RotateCcw className="h-4 w-4 mr-2" /> Reset
        </Button>
        <Button onClick={handleSave} disabled={!isDirty || isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};