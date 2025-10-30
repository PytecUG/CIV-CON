import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Trash2,
  Power,
  Upload,
} from "lucide-react";
import axios, { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";


const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://civcon.onrender.com";

const Settings = () => {
  const { token, user, refreshUser, logout } = useAuth();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    occupation: "",
    bio: "",
    region: "",
    district_id: "",
    privacy_level: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  /** 🟢 Load user info from backend/context */
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        occupation: user.occupation || "",
        bio: user.bio || "",
        region: user.region || "",
        district_id: String(user.district_id || ""),
        privacy_level: user.privacy_level || "public",
      });
    }
  }, [user]);

  /** 🟢 Handle text/textarea input changes */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  /**  Save updated profile info */
  const handleSave = async () => {
    setLoading(true);
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) form.append(key, value);
      });

      await axios.put(`${API_BASE}/users/profile`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(" Profile updated successfully!");
      await refreshUser?.();
    } catch (error) {
      const err = error as AxiosError<{ detail?: string }>;
      console.error("Error updating profile:", err.response?.data || err.message);
      toast.error(err.response?.data?.detail || " Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  /** 🟢 Profile image upload */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const form = new FormData();
      form.append("profile_image", file);

      await axios.put(`${API_BASE}/users/profile`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("✅ Profile photo updated!");
      await refreshUser?.();
    } catch (error) {
      const err = error as AxiosError;
      console.error("Error uploading image:", err.message);
      toast.error("❌ Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  /** 🟡 Deactivate account */
  const handleDeactivate = async () => {
    if (!confirm("Are you sure you want to deactivate your account?")) return;
    try {
      await axios.patch(
        `${API_BASE}/users/deactivate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.info("🟡 Account deactivated. You’ll be logged out.");
      logout?.();
    } catch (error) {
      toast.error("❌ Failed to deactivate account.");
    }
  };

  /** 🔴 Delete account */
  const handleDelete = async () => {
    if (!confirm("⚠️ This will permanently delete your account. Continue?")) return;
    try {
      await axios.delete(`${API_BASE}/users/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("💀 Account deleted successfully.");
      logout?.();
    } catch (error) {
      toast.error("❌ Failed to delete account.");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center gap-2 mb-6">
          <SettingsIcon className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="grid gap-6">
          {/* 🧑‍💼 Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={user?.profile_image || "/api/placeholder/80/80"}
                    alt="Profile"
                  />
                  <AvatarFallback>
                    {user?.first_name?.[0] ?? ""}
                    {user?.last_name?.[0] ?? ""}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button
                    variant="outline"
                    disabled={uploading}
                    onClick={() =>
                      document.getElementById("fileUpload")?.click()
                    }
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? "Uploading..." : "Change Photo"}
                  </Button>
                  <input
                    id="fileUpload"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>

              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          {/* 🔒 Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Private Profile</Label>
                  <p className="text-sm text-muted-foreground">
                    Only approved followers can view your posts and details.
                  </p>
                </div>

                <Switch
                  checked={formData.privacy_level === "private"}
                  onCheckedChange={async (checked) => {
                    const newLevel = checked ? "private" : "public";
                    setFormData((prev) => ({ ...prev, privacy_level: newLevel }));

                    try {
                      await axios.put(
                        `${API_BASE}/users/profile`,
                        { privacy_level: newLevel },
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );
                      toast.success(
                        checked
                          ? "🔒 Profile is now private."
                          : "🌍 Profile is now public."
                      );
                      await refreshUser?.();
                    } catch (error) {
                      toast.error("❌ Failed to update privacy setting.");
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* 🚨 Danger Zone */}
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Deactivate Account</Label>
                <Button variant="outline" onClick={handleDeactivate}>
                  <Power className="h-4 w-4 mr-2" /> Deactivate
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label>Delete Account</Label>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
