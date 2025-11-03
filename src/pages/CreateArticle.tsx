import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { uploadService } from "@/services/uploadService";
import { articleService } from "@/services/articleService";
import { Loader2, Upload, Image as ImageIcon, Save, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { RichTextEditor } from "@/components/forms/RichTextEditor";
import { useNavigate } from "react-router-dom";

const DRAFT_KEY = "civcon_article_draft_v1";

const CreateArticle = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  /** ✅ Restore saved draft on mount */
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) setShowDraftDialog(true);
  }, []);

  /** ✅ Detect unsaved changes */
  useEffect(() => {
    const hasChanges =
      title.trim() ||
      summary.trim() ||
      category.trim() ||
      content.trim() ||
      tags.length > 0 ||
      imagePreview;
    setHasUnsavedChanges(!!hasChanges);
  }, [title, summary, category, content, tags, imagePreview]);

  /** ✅ Warn before leaving unsaved page */
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !submitting) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges, submitting]);

  /** ✅ Auto-save draft every 30 seconds */
  useEffect(() => {
    const saveDraft = () => {
      const data = { title, summary, category, content, tags, imagePreview };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      console.log("Draft auto-saved ✅");
    };
    const interval = setInterval(saveDraft, 30000);
    return () => clearInterval(interval);
  }, [title, summary, category, content, tags, imagePreview]);

  /** ✅ Restore or discard draft */
  const restoreDraft = () => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (!draft) return;
    try {
      const parsed = JSON.parse(draft);
      setTitle(parsed.title || "");
      setSummary(parsed.summary || "");
      setCategory(parsed.category || "");
      setContent(parsed.content || "");
      setTags(parsed.tags || []);
      setImagePreview(parsed.imagePreview || null);
      toast.success("Draft restored successfully");
    } catch {
      toast.error("Failed to restore draft");
    } finally {
      setShowDraftDialog(false);
    }
  };

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setShowDraftDialog(false);
    toast("Draft discarded");
  };

  /** ✅ Tags logic */
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags((prev) => [...prev, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  /** ✅ Image selection & preview */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  /** ✅ Submit article */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !summary.trim() || !content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!category.trim()) {
      toast.error("Please enter a category");
      return;
    }
    if (!imageFile && !imagePreview) {
      toast.error("Please upload a cover image");
      return;
    }
    if (!token) {
      toast.error("Please sign in first");
      return;
    }

    try {
      setSubmitting(true);
      setUploading(true);

      const imageUrl = imageFile
        ? await uploadService.uploadArticleImage(imageFile)
        : imagePreview || "";

      const payload = {
        title,
        summary,
        category,
        content,
        image: imageUrl,
        tags,
        author_id: user?.id || 1,
      };

      await articleService.createArticle(payload, token);
      toast.success("Article published successfully!");

      localStorage.removeItem(DRAFT_KEY);
      setTitle("");
      setSummary("");
      setCategory("");
      setContent("");
      setTags([]);
      setTagInput("");
      setImageFile(null);
      setImagePreview(null);
      setHasUnsavedChanges(false);

      // ✅ Success overlay animation
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/articles");
      }, 2000);
    } catch (err) {
      console.error("Error creating article:", err);
      toast.error("Failed to create article.");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const isBusy = submitting || uploading;

  return (
    <Layout>
      <div className="relative container mx-auto px-6 py-10 max-w-3xl">
        {/* ✅ Draft Recovery Dialog */}
        {showDraftDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-2">Restore draft?</h3>
              <p className="text-sm text-muted-foreground mb-5">
                A previously saved draft was found. Would you like to restore or discard it?
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowDraftDialog(false)}>
                  Continue new
                </Button>
                <Button variant="outline" onClick={discardDraft}>
                  Discard
                </Button>
                <Button onClick={restoreDraft}>Restore Draft</Button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Success Overlay */}
        {showSuccess && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
            <CheckCircle2 className="text-green-500 h-20 w-20 mb-3 animate-bounce" />
            <h2 className="text-2xl font-bold text-green-600">
              Article Published Successfully!
            </h2>
          </div>
        )}

        {/* ✅ Busy Overlay */}
        {isBusy && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
            <p className="text-sm text-muted-foreground">
              {uploading ? "Uploading image..." : "Publishing your article..."}
            </p>
          </div>
        )}

        {/* ✅ Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Create New Article</h1>
          <Button
            variant="secondary"
            size="sm"
            disabled={isBusy}
            onClick={() => {
              const data = { title, summary, category, content, tags, imagePreview };
              localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
              toast.success("Draft saved manually");
            }}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
        </div>

        <Card className="shadow-soft border border-border">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter article title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isBusy}
                />
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Input
                  id="summary"
                  placeholder="Brief summary of your article"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  required
                  disabled={isBusy}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g. Education, Health, Innovation"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  disabled={isBusy}
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <RichTextEditor value={content} onChange={setContent} />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (press Enter to add)</Label>
                <Input
                  id="tags"
                  placeholder="Add tags like #Education or #Youth"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  disabled={isBusy}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-muted text-sm px-2 py-1 rounded-full cursor-pointer hover:bg-red-100 hover:text-red-600 transition"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ✕
                    </span>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-32 rounded-lg border flex items-center justify-center bg-muted/30 overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isBusy}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Supported formats: JPG, PNG, WEBP
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <Button type="submit" disabled={isBusy} className="min-w-[160px]">
                  {isBusy ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {uploading ? "Uploading..." : "Publishing..."}
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Publish Article
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateArticle;
