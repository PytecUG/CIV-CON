import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";


// CreatePost Component
export function CreatePost({ onSuccess }: { onSuccess?: () => void }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    district_id: "",
    mediaFiles: [] as File[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, mediaFiles: Array.from(e.target.files) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("author_id", localStorage.getItem("user_id") || ""); // your logged-in user ID
      if (formData.district_id) data.append("district_id", formData.district_id);

      formData.mediaFiles.forEach((file) => data.append("media_files", file));

      await axios.post("https://civcon.onrender.com/posts/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // close modal after successful post
      if (onSuccess) onSuccess();
      setFormData({ title: "", content: "", district_id: "", mediaFiles: [] });
    } catch (err: any) {
      console.error("Post creation error:", err);
      setError(
        err.response?.data?.detail ||
          "Failed to create post. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Input
        name="title"
        placeholder="Enter post title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <Textarea
        name="content"
        placeholder="Write your post..."
        value={formData.content}
        onChange={handleChange}
        required
      />

      <Input
        name="district_id"
        placeholder="Enter district ID (optional)"
        value={formData.district_id}
        onChange={handleChange}
      />

      <Input
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileChange}
      />

      <Button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Create Post"}
      </Button>
    </form>
  );
}

// Post Page Component
function Post() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-end px-2 xs:px-3 sm:px-4">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              variant="premium"
              className="hover:scale-105 transition-all duration-200 text-xs xs:text-sm sm:text-base md:text-lg px-3 xs:px-4 sm:px-5 md:px-6"
            >
              <PlusCircle className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 mr-1 xs:mr-2" />
              Create Post
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create a New Post</DialogTitle>
            </DialogHeader>

            <CreatePost onSuccess={() => setIsModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Post;
