export interface Group {
  id: number;
  name: string;
  description?: string;
  members: number;
  status: "Active" | "Suspended" | "Pending";
  createdAt?: string; // optional for editing/new
}
