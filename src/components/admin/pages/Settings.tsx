// src/components/admin/pages/AdminSettings.tsx
import React, { useEffect, useState } from "react";
import {
  Settings,
  Mail,
  Smartphone,
  Users,
  Save,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

type RolePermissions = {
  leader: { post: boolean; moderate: boolean };
  journalist: { post: boolean; moderate: boolean };
  citizen: { post: boolean; moderate: boolean };
};

type NotificationSettings = {
  email: boolean;
  sms: boolean;
};

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

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://api.civ-con.org";

export const AdminSettings: React.FC = () => {
  const { toast } = useToast();
  const { token } = useAuth();

  const [isSaving, setIsSaving] = useState(false);
  const [siteName, setSiteName] = useState(DEFAULT_SETTINGS.siteName);
  const [rolePermissions, setRolePermissions] = useState<RolePermissions>(
    DEFAULT_SETTINGS.rolePermissions
  );
  const [notifications, setNotifications] = useState<NotificationSettings>(
    DEFAULT_SETTINGS.notifications
  );
  const [isDirty, setIsDirty] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // ✅ Load settings from backend
  useEffect(() => {
    const ac = new AbortController();
    const loadSettings = async () => {
      setLoadingInitial(true);
      try {
        const res = await fetch(`${API_BASE}/admin/settings`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`Failed to load settings (${res.status})`);

        const data = await res.json();
        setSiteName(data.siteName ?? DEFAULT_SETTINGS.siteName);
        setRolePermissions(
          Object.assign({}, DEFAULT_SETTINGS.rolePermissions, data.rolePermissions ?? {})
        );
        setNotifications(
          Object.assign({}, DEFAULT_SETTINGS.notifications, data.notifications ?? {})
        );
      } catch (err: any) {
        console.error("Error loading admin settings:", err);
        toast({
          title: "Failed to load settings",
          description: String(err.message || err),
          variant: "destructive",
        });
      } finally {
        setLoadingInitial(false);
      }
    };
    loadSettings();
    return () => ac.abort();
  }, [toast, token]);

  // ✅ Track dirty state
  useEffect(() => {
    const changed =
      siteName !== DEFAULT_SETTINGS.siteName ||
      JSON.stringify(rolePermissions) !==
        JSON.stringify(DEFAULT_SETTINGS.rolePermissions) ||
      JSON.stringify(notifications) !==
        JSON.stringify(DEFAULT_SETTINGS.notifications);
    setIsDirty(changed);
  }, [siteName, rolePermissions, notifications]);

  // ✅ Reset to defaults
  const handleReset = () => {
    setSiteName(DEFAULT_SETTINGS.siteName);
    setRolePermissions(DEFAULT_SETTINGS.rolePermissions);
    setNotifications(DEFAULT_SETTINGS.notifications);
    setIsDirty(false);
    toast({ title: "Reset", description: "Settings restored to defaults." });
  };

  // ✅ Save to backend
  const handleSave = async () => {
    if (!siteName.trim()) {
      toast({
        title: "Validation Error",
        description: "Site name is required.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE}/admin/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          siteName,
          rolePermissions,
          notifications,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to save settings (${res.status})`);
      }

      toast({
        title: "Saved",
        description: "Settings have been successfully updated.",
      });
      setIsDirty(false);
    } catch (err: any) {
      toast({
        title: "Save Failed",
        description: String(err.message || err),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="p-10 text-center text-muted-foreground">Loading settings...</div>
    );
  }

  return (
    <div className="container max-w-7xl py-6 lg:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <Settings className="h-7 w-7 text-primary" />
            Admin Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage permissions, notifications, and global platform options.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!isDirty || isSaving}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
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
        {/* General */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Uganda Connects"
            />
          </CardContent>
        </Card>

        {/* Role Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(rolePermissions).map(([role, perms]) => (
              <div
                key={role}
                className="p-4 border rounded-lg bg-muted/20 space-y-3"
              >
                <h4 className="capitalize font-semibold">{role}</h4>
                <div className="flex justify-between items-center">
                  <Label htmlFor={`${role}-post`}>Can Post</Label>
                  <Switch
                    id={`${role}-post`}
                    checked={perms.post}
                    onCheckedChange={(v) =>
                      setRolePermissions((prev) => ({
                        ...prev,
                        [role]: { ...prev[role as keyof typeof prev], post: v },
                      }))
                    }
                  />
                </div>
                <div className="flex justify-between items-center">
                  <Label htmlFor={`${role}-moderate`}>Can Moderate</Label>
                  <Switch
                    id={`${role}-moderate`}
                    checked={perms.moderate}
                    onCheckedChange={(v) =>
                      setRolePermissions((prev) => ({
                        ...prev,
                        [role]: {
                          ...prev[role as keyof typeof prev],
                          moderate: v,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <Mail className="text-primary h-5 w-5" />
                <div>
                  <p className="font-medium">Email Alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Receive updates via email.
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(v) =>
                  setNotifications((prev) => ({ ...prev, email: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <Smartphone className="text-primary h-5 w-5" />
                <div>
                  <p className="font-medium">SMS Alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Receive updates via SMS.
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.sms}
                onCheckedChange={(v) =>
                  setNotifications((prev) => ({ ...prev, sms: v }))
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
