import { useState } from "react";
import { GitGraph, Eye, Edit, Trash2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Group {
  id: number;
  name: string;
  members: number;
  status: string;
}

export const AdminGroups = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [editGroup, setEditGroup] = useState<Group | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const itemsPerPage = 5;

  // Expanded placeholder data
  const groups: Group[] = [
    { id: 1, name: "Youth Empowerment", members: 150, status: "Active" },
    { id: 2, name: "Tech Innovators", members: 80, status: "Pending" },
    { id: 3, name: "Community Leaders", members: 200, status: "Active" },
    { id: 4, name: "Education Advocates", members: 120, status: "Suspended" },
    { id: 5, name: "Health Warriors", members: 90, status: "Active" },
    { id: 6, name: "Local Governance", members: 110, status: "Pending" },
    { id: 7, name: "Women in Tech", members: 70, status: "Active" },
    { id: 8, name: "Environmentalists", members: 130, status: "Active" },
  ];

  // Pagination logic
  const totalPages = Math.ceil(groups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGroups = groups.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleView = (group: Group) => {
    setSelectedGroup(group);
    setIsViewOpen(true);
  };

  const handleEdit = (group: Group) => {
    setEditGroup({ ...group });
    setIsEditOpen(true);
  };

  const handleEditSave = () => {
    if (editGroup) {
      console.log("Saving group:", editGroup);
      setIsEditOpen(false);
      setEditGroup(null);
    }
  };

  const handleDelete = (group: Group) => {
    setSelectedGroup(group);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedGroup) {
      console.log("Deleting group:", selectedGroup);
      setIsDeleteOpen(false);
      setSelectedGroup(null);
    }
  };

  return (
    <div className="container py-4 xs:py-6 sm:py-8">
      <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-primary mb-4 xs:mb-6">
        Group Management
      </h1>
      <div className="shadow-soft rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="hidden sm:table-cell text-xs sm:text-sm font-semibold text-primary">
                  ID
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold text-primary">Name</TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold text-primary">Members</TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold text-primary">Status</TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold text-primary">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentGroups.map((group, index) => (
                <TableRow
                  key={group.id}
                  className={cn("transition-colors", index % 2 === 0 ? "bg-background" : "bg-muted/20")}
                >
                  <TableCell className="hidden sm:table-cell text-xs sm:text-sm">{group.id}</TableCell>
                  <TableCell className="text-xs sm:text-sm font-medium">{group.name}</TableCell>
                  <TableCell className="text-xs sm:text-sm">{group.members}</TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs",
                        group.status === "Active" && "bg-green-100 text-green-800",
                        group.status === "Suspended" && "bg-red-100 text-red-800",
                        group.status === "Pending" && "bg-yellow-100 text-yellow-800"
                      )}
                    >
                      {group.status}
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
                              onClick={() => handleView(group)}
                              className="hover:bg-primary hover:text-primary-foreground"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only sm:not-sr-only sm:ml-1">View</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Group</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(group)}
                              className="hover:bg-primary hover:text-primary-foreground"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only sm:not-sr-only sm:ml-1">Edit</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Group</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(group)}
                              className="hover:bg-destructive/90"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only sm:not-sr-only sm:ml-1">Delete</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete Group</TooltipContent>
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
          Showing {startIndex + 1} to {Math.min(endIndex, groups.length)} of {groups.length} groups
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

      {/* View Group Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Group Details</DialogTitle>
          </DialogHeader>
          {selectedGroup && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">ID</Label>
                <p className="text-sm text-muted-foreground">{selectedGroup.id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <p className="text-sm text-muted-foreground">{selectedGroup.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Members</Label>
                <p className="text-sm text-muted-foreground">{selectedGroup.members}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <p className="text-sm text-muted-foreground">{selectedGroup.status}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Group Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
          </DialogHeader>
          {editGroup && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editGroup.name}
                  onChange={(e) => setEditGroup({ ...editGroup, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="members" className="text-sm font-medium">
                  Members
                </Label>
                <Input
                  id="members"
                  type="number"
                  value={editGroup.members}
                  onChange={(e) => setEditGroup({ ...editGroup, members: parseInt(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Input
                  id="status"
                  value={editGroup.status}
                  onChange={(e) => setEditGroup({ ...editGroup, status: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Group Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete {selectedGroup?.name}?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};