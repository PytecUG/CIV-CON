import { useState } from "react";
import { Flag, CheckCircle, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Post {
  id: number;
  content: string;
  author: string;
  status: string;
}

export const Moderation = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const itemsPerPage = 5;

  // Placeholder data
  const posts: Post[] = [
    { id: 1, content: "Community event this weekend!", author: "John Doe", status: "Approved" },
    { id: 2, content: "Inappropriate content reported.", author: "Jane Smith", status: "Flagged" },
    { id: 3, content: "Local governance discussion.", author: "Alice Brown", status: "Approved" },
    { id: 4, content: "Offensive language detected.", author: "Bob Johnson", status: "Flagged" },
    { id: 5, content: "Education reform proposal.", author: "Emma Wilson", status: "Approved" },
    { id: 6, content: "Spam post detected.", author: "Michael Lee", status: "Flagged" },
    { id: 7, content: "Health awareness campaign.", author: "Sarah Davis", status: "Approved" },
    { id: 8, content: "Violates community guidelines.", author: "David Clark", status: "Removed" },
  ];

  // Pagination logic
  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleReview = (post: Post) => {
    setSelectedPost(post);
    setIsReviewOpen(true);
  };

  const handleApprove = (post: Post) => {
    setSelectedPost(post);
    setIsApproveOpen(true);
  };

  const handleRemove = (post: Post) => {
    setSelectedPost(post);
    setIsRemoveOpen(true);
  };

  const handleConfirmApprove = () => {
    if (selectedPost) {
      console.log("Approving post:", selectedPost);
      setIsApproveOpen(false);
      setSelectedPost(null);
    }
  };

  const handleConfirmRemove = () => {
    if (selectedPost) {
      console.log("Removing post:", selectedPost);
      setIsRemoveOpen(false);
      setSelectedPost(null);
    }
  };

  return (
    <div className="container py-4 xs:py-6 sm:py-8">
      <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-primary mb-4 xs:mb-6">
        Content Moderation
      </h1>
      <p className="text-sm xs:text-base text-muted-foreground mb-6 xs:mb-8">
        Manage and review flagged content on the platform.
      </p>
      <div className="shadow-soft rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="hidden sm:table-cell text-xs sm:text-sm font-semibold text-primary">
                  Post ID
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold text-primary">Content</TableHead>
                <TableHead className="hidden md:table-cell text-xs sm:text-sm font-semibold text-primary">
                  Author
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold text-primary">Status</TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold text-primary">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPosts.map((post, index) => (
                <TableRow
                  key={post.id}
                  className={cn("transition-colors", index % 2 === 0 ? "bg-background" : "bg-muted/20")}
                >
                  <TableCell className="hidden sm:table-cell text-xs sm:text-sm">{post.id}</TableCell>
                  <TableCell className="text-xs sm:text-sm max-w-[200px] truncate">{post.content}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs sm:text-sm">{post.author}</TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs",
                        post.status === "Approved" && "bg-green-100 text-green-800",
                        post.status === "Flagged" && "bg-yellow-100 text-yellow-800",
                        post.status === "Removed" && "bg-red-100 text-red-800"
                      )}
                    >
                      {post.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <div className="flex space-x-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReview(post)}
                              className="hover:bg-primary hover:text-primary-foreground"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only sm:not-sr-only sm:ml-1">Review</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Review Post</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApprove(post)}
                              className="hover:bg-green-500 hover:text-white"
                              disabled={post.status === "Approved"}
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span className="sr-only sm:not-sr-only sm:ml-1">Approve</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Approve Post</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemove(post)}
                              className="hover:bg-destructive/90"
                              disabled={post.status === "Removed"}
                            >
                              <XCircle className="h-4 w-4" />
                              <span className="sr-only sm:not-sr-only sm:ml-1">Remove</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Remove Post</TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 xs:mt-6 gap-4">
        <div className="text-xs sm:text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, posts.length)} of {posts.length} posts
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="text-xs sm:text-sm hover:bg-primary hover:text-primary-foreground"
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageClick(page)}
              className="text-xs sm:text-sm w-8 h-8 hover:bg-primary hover:text-primary-foreground"
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="text-xs sm:text-sm hover:bg-primary hover:text-primary-foreground"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Review Post Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Post Details</DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Post ID</Label>
                <p className="text-sm text-muted-foreground">{selectedPost.id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Content</Label>
                <p className="text-sm text-muted-foreground">{selectedPost.content}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Author</Label>
                <p className="text-sm text-muted-foreground">{selectedPost.author}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <p className="text-sm text-muted-foreground">{selectedPost.status}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Post Dialog */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Approval</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to approve the post by {selectedPost?.author}?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmApprove}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Post Dialog */}
      <Dialog open={isRemoveOpen} onOpenChange={setIsRemoveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove the post by {selectedPost?.author}?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRemoveOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmRemove}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};