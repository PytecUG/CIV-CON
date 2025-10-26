import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ImageIcon, MapPin, Calendar, X, XCircle } from "lucide-react";
import { postService } from "@/services/postService";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import axios from "axios";

interface CreatePostProps {
  onPostCreated?: () => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user, token } = useAuth();
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [mediaPreview, setMediaPreview] = useState<{ url: string; type: string }[]>([]);
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const cancelSource = useRef(postService.createCancelToken());

  /**  Handle file uploads (images/videos) */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    //  File validation
    for (const file of fileArray) {
      if (file.size > 25 * 1024 * 1024) {
        toast.error(`File "${file.name}" is too large. Max 25MB allowed.`);
        return;
      }
    }

    setMedia((prev) => [...prev, ...fileArray]);
    const previews = fileArray.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setMediaPreview((prev) => [...prev, ...previews]);

    e.target.value = ""; // reset file input so same file can be reselected
  };

  /**  Remove one or all uploaded media */
  const clearMedia = (index?: number) => {
    if (index !== undefined) {
      setMedia((prev) => prev.filter((_, i) => i !== index));
      setMediaPreview((prev) => prev.filter((_, i) => i !== index));
    } else {
      setMedia([]);
      setMediaPreview([]);
    }
  };

  /**  Submit the post */
const handleSubmit = async () => {
  if (!token) {
    toast.error("Please sign in to create a post.");
    return;
  }

  if (!content.trim() && media.length === 0) {
    toast.error("Post content or at least one media file is required.");
    return;
  }

  setLoading(true);
  setUploadProgress(0);
  cancelSource.current = postService.createCancelToken();

  try {
    const formData = new FormData();
    formData.append("title", "Post"); // backend requires a title field
    formData.append("content", content);
    if (location) formData.append("location", location);
    if (eventDate) formData.append("event_date", eventDate);
    media.forEach((file) => formData.append("media_files", file));

    //  Create post
    const res = await postService.createPost(
      formData,
      (progressEvent: ProgressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        }
      },
      cancelSource.current
    );

    toast.success(" Post created successfully!");

    //  Pass new post to Feed.tsx for instant insertion
    onPostCreated && onPostCreated(res);

    // Reset form
    setContent("");
    setMedia([]);
    setMediaPreview([]);
    setLocation("");
    setEventDate("");
    setUploadProgress(0);
  } catch (err: any) {
    if (axios.isCancel(err)) {
      toast.info("Upload cancelled.");
    } else {
      console.error("Error creating post:", err);
      toast.error("Failed to create post. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};


  /**  Cancel upload */
  const handleCancelUpload = () => {
    cancelSource.current.cancel("Upload cancelled by user.");
    setLoading(false);
    setUploadProgress(0);
    toast.info("Upload cancelled.");
  };

  return (
    <Card className="shadow-soft w-full max-w-full md:max-w-2xl lg:max-w-3xl mx-auto">
      <CardContent className="p-4 sm:p-5 md:p-6 lg:p-8">
        <div className="flex items-start gap-4">
          {/*  User Avatar */}
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user?.profile_image || "/api/placeholder/40/40"}
              alt={user?.first_name || "User"}
            />
            <AvatarFallback className="bg-primary-foreground text-gray-700">
              {user?.first_name?.[0]}
              {user?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            {/*  Content Input */}
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening in Uganda? Share your thoughts..."
              className="min-h-[100px] border-none resize-none focus-visible:ring-0 text-sm sm:text-base"
            />

            {/*  Media Previews */}
            {mediaPreview.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {mediaPreview.map((m, idx) => (
                  <div key={idx} className="relative">
                    {m.type.startsWith("image/") ? (
                      <img
                        src={m.url}
                        alt="preview"
                        className="rounded-md max-h-64 w-full object-cover"
                      />
                    ) : (
                      <video
                        src={m.url}
                        controls
                        className="rounded-md max-h-64 w-full"
                      />
                    )}
                    <button
                      onClick={() => clearMedia(idx)}
                      className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/*  Upload Progress Bar */}
            {loading && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="bg-primary h-2"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ ease: "easeOut", duration: 0.3 }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    Uploading... {uploadProgress}%
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleCancelUpload}
                    className="text-xs flex items-center gap-1"
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Action Controls */}
            <div className="flex flex-wrap gap-3 mt-4 items-center justify-between">
              <div className="flex gap-3 flex-wrap items-center">
                {/* Hidden File Input */}
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  id="media-upload"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {/* Add Media Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => document.getElementById("media-upload")?.click()}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Add Media
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const userLoc = prompt("Enter your location:", location);
                    if (userLoc) setLocation(userLoc);
                  }}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {location ? "Update Location" : "Add Location"}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const date = prompt("Enter event date (YYYY-MM-DD):", eventDate);
                    if (date) setEventDate(date);
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {eventDate ? "Change Event" : "Add Event"}
                </Button>
              </div>

              <Button
                variant="premium"
                onClick={handleSubmit}
                disabled={loading}
                className="hover:scale-105 transition-all duration-200"
              >
                {loading ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
