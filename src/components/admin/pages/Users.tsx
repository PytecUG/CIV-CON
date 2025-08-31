import { useState } from "react";
import { Users, Ban, Edit, Eye } from "lucide-react";
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

// Constant array of Uganda's districts
const DISTRICTS = [
  "Kampala",
  "Gulu",
  "Jinja",
  "Mbale",
  "Mbarara",
  "Arua",
  "Lira",
  "Soroti",
  "Hoima",
  "Fort Portal",
  "Masaka",
  "Mukono",
  "Kasese",
  "Kabale",
  "Moroto",
];

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  district: string;
  status: string;
}

export const Users = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const itemsPerPage = 5;

  // Placeholder data
  const users: User[] = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Citizen", district: DISTRICTS[0], status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Journalist", district: DISTRICTS[1], status: "Suspended" },
    { id: 3, name: "Alice Brown", email: "alice@example.com", role: "Leader", district: DISTRICTS[2], status: "Active" },
    { id: 4, name: "Bob Johnson", email: "bob@example.com", role: "Student", district: DISTRICTS[3], status: "Active" },
    { id: 5, name: "Emma Wilson", email: "emma@example.com", role: "Citizen", district: DISTRICTS[4], status: "Pending" },
    { id: 6, name: "Michael Lee", email: "michael@example.com", role: "Journalist", district: DISTRICTS[5], status: "Active" },
    { id: 7, name: "Sarah Davis", email: "sarah@example.com", role: "Leader", district: DISTRICTS[6], status: "Suspended" },
    { id: 8, name: "David Clark", email: "david@example.com", role: "Student", district: DISTRICTS[7], status: "Active" },
    { id: 9, name: "Lisa Adams", email: "lisa@example.com", role: "Citizen", district: DISTRICTS[8], status: "Pending" },
    { id: 10, name: "James Brown", email: "james@example.com", role: "Journalist", district: DISTRICTS[9], status: "Active" },
  ];

  // Pagination logic
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setIsViewOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditUser({ ...user });
    setIsEditOpen(true);
  };

  const handleEditSave = () => {
    if (editUser) {
      // Update user in backend (placeholder)
      console.log("Saving user:", editUser);
      setIsEditOpen(false);
      setEditUser(null);
    }
  };

  const handleSuspend = (user: User) => {
    setSelectedUser(user);
    setIsSuspendOpen(true);
  };

  const handleConfirmSuspend = () => {
    if (selectedUser) {
      // Suspend user in backend (placeholder)
      console.log("Suspending user:", selectedUser);
      setIsSuspendOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="container py-4 xs:py-6 sm:py-8">
      <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-black dark:text-white mb-4 xs:mb-6">
        User Management
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
                <TableHead className="text-xs sm:text-sm font-semibold text-primary">Email</TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold text-primary">Role</TableHead>
                <TableHead className="hidden md:table-cell text-xs sm:text-sm font-semibold text-primary">
                  District
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold text-primary">Status</TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold text-primary">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={cn("transition-colors", index % 2 === 0 ? "bg-background" : "bg-muted/20")}
                >
                  <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
                    {user.id}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm font-medium">{user.name}</TableCell>
                  <TableCell className="text-xs sm:text-sm">{user.email}</TableCell>
                  <TableCell className="text-xs sm:text-sm">{user.role}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                    {user.district}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs",
                        user.status === "Active" && "bg-green-100 text-green-800",
                        user.status === "Suspended" && "bg-red-100 text-red-800",
                        user.status === "Pending" && "bg-yellow-100 text-yellow-800"
                      )}
                    >
                      {user.status}
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
                              onClick={() => handleView(user)}
                              className="hover:bg-primary hover:text-primary-foreground"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only sm:not-sr-only sm:ml-1">View</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View User</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(user)}
                              className="hover:bg-primary hover:text-primary-foreground"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only sm:not-sr-only sm:ml-1">Edit</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit User</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleSuspend(user)}
                              className="hover:bg-destructive/90"
                            >
                              <Ban className="h-4 w-4" />
                              <span className="sr-only sm:not-sr-only sm:ml-1">Suspend</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Suspend User</TooltipContent>
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
          Showing {startIndex + 1} to {Math.min(endIndex, users.length)} of {users.length} users
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

      {/* View User Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">ID</Label>
                <p className="text-sm text-muted-foreground">{selectedUser.id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <p className="text-sm text-muted-foreground">{selectedUser.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Role</Label>
                <p className="text-sm text-muted-foreground">{selectedUser.role}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">District</Label>
                <p className="text-sm text-muted-foreground">{selectedUser.district}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <p className="text-sm text-muted-foreground">{selectedUser.status}</p>
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

      {/* Edit User Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-sm font-medium">
                  Role
                </Label>
                <Input
                  id="role"
                  value={editUser.role}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="district" className="text-sm font-medium">
                  District
                </Label>
                <Input
                  id="district"
                  value={editUser.district}
                  onChange={(e) => setEditUser({ ...editUser, district: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="status" className="text-sm font-medium">
                  Status
                </Label>
                <Input
                  id="status"
                  value={editUser.status}
                  onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}
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

      {/* Suspend User Dialog */}
      <Dialog open={isSuspendOpen} onOpenChange={setIsSuspendOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Suspension</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to suspend {selectedUser?.name}?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSuspendOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmSuspend}>
              Suspend
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};