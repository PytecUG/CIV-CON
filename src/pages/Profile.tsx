import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

export default function Profile() {
  const { user, refreshUser, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    occupation: user?.occupation || "",
    bio: user?.bio || "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const navigate = useNavigate();

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-lg text-muted-foreground mb-4">
            You need to sign in to view your profile.
          </p>
          <Button onClick={() => navigate("/signin")}>Go to Sign In</Button>
        </div>
      </Layout>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      form.append("first_name", formData.first_name);
      form.append("last_name", formData.last_name);
      form.append("occupation", formData.occupation);
      form.append("bio", formData.bio);
      if (selectedImage) form.append("profile_image", selectedImage);

      const res = await axios.put("https://civcon.onrender.com/users/profile", form, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("✅ Profile updated successfully!");
      await refreshUser();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Profile Header */}
        <Card className="mb-8 shadow-soft">
          <CardHeader className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage
                  src={user.profile_image || "/api/placeholder/96/96"}
                  alt={user.first_name}
                />
                <AvatarFallback className="bg-gray-200 text-gray-600 text-xl">
                  {user.first_name?.[0]}
                  {user.last_name?.[0]}
                </AvatarFallback>
              </Avatar>

              {/* Change Photo */}
              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            </div>

            <CardTitle className="text-2xl font-bold text-foreground mt-3">
              {user.first_name} {user.last_name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Badge variant="secondary" className="mt-3 capitalize">
              {user.role || "citizen"}
            </Badge>
          </CardHeader>
        </Card>

        {/* Profile Details */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Region</p>
                <p className="font-medium">{user.region || "Not specified"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">District</p>
                <p className="font-medium">{user.district_id || "Not specified"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Occupation</p>
                <p className="font-medium">{user.occupation || "Not specified"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Bio</p>
                <p className="font-medium">
                  {user.bio || "No bio provided yet."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name"
            />
            <Input
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last Name"
            />
            <Input
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="Occupation"
            />
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Short bio..."
              className="min-h-[80px]"
            />

            {/* Profile Image Upload */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Profile Image</p>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
              {selectedImage && (
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedImage.name}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary text-primary-foreground"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
