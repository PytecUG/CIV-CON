// src/components/admin/pages/SubscriptionManagement.tsx
import { useState, useEffect } from "react";
import {
  DollarSign,
  CreditCard,
  Users,
  Edit,
  Trash2,
  Search,
  Download,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserType {
  id: string;
  name: string;
  monthlyCharge: number;
  isFree: boolean;
  description: string;
}

interface Subscription {
  id: string;
  userName: string;
  userType: string;
  plan: string;
  status: "active" | "expired" | "pending";
  startDate: string;
  endDate: string;
  amount: number;
  paymentMethod: string;
}

interface RevenueData {
  month: string;
  revenue: number;
}

export const SubscriptionManagement = () => {
  const [userTypes, setUserTypes] = useState<UserType[]>([
    { id: "1", name: "Leaders", monthlyCharge: 50000, isFree: false, description: "MPs and politicians access premium analytics." },
    { id: "2", name: "Journalists", monthlyCharge: 25000, isFree: false, description: "Verified profiles for reporting." },
    { id: "3", name: "Students", monthlyCharge: 0, isFree: true, description: "Free access for educational purposes." },
    { id: "4", name: "Citizens", monthlyCharge: 0, isFree: true, description: "Basic free tier for all." },
    { id: "5", name: "NGOs", monthlyCharge: 100000, isFree: false, description: "Enterprise for organizations." },
  ]);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    { id: "1", userName: "Hon. Jane Doe", userType: "Leaders", plan: "Premium", status: "active", startDate: "2025-10-01", endDate: "2025-10-31", amount: 50000, paymentMethod: "M-Pesa" },
    { id: "2", userName: "John Reporter", userType: "Journalists", plan: "Basic", status: "active", startDate: "2025-09-15", endDate: "2025-10-15", amount: 25000, paymentMethod: "Airtel Money" },
    { id: "3", userName: "Student User", userType: "Students", plan: "Free", status: "active", startDate: "2025-10-01", endDate: "2026-10-01", amount: 0, paymentMethod: "N/A" },
    { id: "4", userName: "Citizen X", userType: "Citizens", plan: "Free", status: "expired", startDate: "2025-09-01", endDate: "2025-09-30", amount: 0, paymentMethod: "N/A" },
    { id: "5", userName: "NGO Uganda", userType: "NGOs", plan: "Enterprise", status: "pending", startDate: "2025-10-30", endDate: "2025-11-30", amount: 100000, paymentMethod: "M-Pesa" },
  ]);

  const [editingType, setEditingType] = useState<UserType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [totalRevenue, setTotalRevenue] = useState(0);

  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === "all" || sub.userType === filterType) &&
      (filterStatus === "all" || sub.status === filterStatus)
  );

  useEffect(() => {
    const revenue = subscriptions.reduce((sum, sub) => sum + (sub.status === "active" ? sub.amount : 0), 0);
    setTotalRevenue(revenue);
  }, [subscriptions]);

  const revenueData: RevenueData[] = [
    { month: "Sep 2025", revenue: 450000 },
    { month: "Oct 2025", revenue: 625000 },
  ];

  const handleEditType = (type: UserType) => setEditingType(type);

  const handleSaveType = (updatedType: UserType) => {
    if (updatedType.id === "new") {
      setUserTypes([...userTypes, { ...updatedType, id: Date.now().toString() }]);
    } else {
      setUserTypes(userTypes.map((t) => (t.id === updatedType.id ? updatedType : t)));
    }
    setEditingType(null);
  };

  const handleDeleteType = (id: string) => {
    if (confirm("Delete this user type? This will affect existing subscriptions.")) {
      setUserTypes(userTypes.filter((t) => t.id !== id));
    }
  };

  const handleBulkRenew = () => {
    const renewed = subscriptions
      .filter((s) => s.status === "expired")
      .map((s) => ({
        ...s,
        status: "active" as const,
        endDate: new Date(Date.parse(s.endDate) + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      }));
    setSubscriptions(subscriptions.map((s) => renewed.find((r) => r.id === s.id) || s));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="container py-6 space-y-6 min-h-screen bg-background">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-600">Subscription Management</h1>
          <p className="text-muted-foreground">Manage user types, monitor subscriptions, and track revenue for CIVCON.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleBulkRenew} className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" /> Bulk Renew Expired
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="shadow-soft bg-gradient-to-br from-green-500/10 to-background hover:scale-105 transition-all duration-300">
          <CardContent className="flex items-center gap-3 pt-4">
            <DollarSign className="h-6 w-6 text-green-500" />
            <div>
              <p className="font-semibold text-green-600">Total Revenue</p>
              <p className="text-xl font-bold">UGX {totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Monthly Active</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft bg-gradient-to-br from-green-500/10 to-background hover:scale-105 transition-all duration-300">
          <CardContent className="flex items-center gap-3 pt-4">
            <CreditCard className="h-6 w-6 text-green-500" />
            <div>
              <p className="font-semibold text-green-600">Active Subscriptions</p>
              <p className="text-xl font-bold">{subscriptions.filter((s) => s.status === "active").length}</p>
              <p className="text-xs text-muted-foreground">Out of {subscriptions.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft bg-gradient-to-br from-green-500/10 to-background hover:scale-105 transition-all duration-300">
          <CardContent className="flex items-center gap-3 pt-4">
            <AlertCircle className="h-6 w-6 text-yellow-500" />
            <div>
              <p className="font-semibold text-yellow-600">Expiring Soon</p>
              <p className="text-xl font-bold">
                {subscriptions.filter(
                  (s) =>
                    new Date(s.endDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && s.status === "active"
                ).length}
              </p>
              <p className="text-xs text-muted-foreground">Within 7 days</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Types Table */}
      <Card className="shadow-soft bg-card hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-500" /> User Types & Pricing
          </CardTitle>
          <Button
            onClick={() =>
              handleEditType({ id: "new", name: "", monthlyCharge: 0, isFree: false, description: "" })
            }
            className="w-full sm:w-auto"
          >
            Add User Type
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Monthly Charge (UGX)</TableHead>
                  <TableHead>Free?</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell>{type.name}</TableCell>
                    <TableCell>UGX {type.monthlyCharge.toLocaleString()}</TableCell>
                    <TableCell>{type.isFree ? "Yes" : "No"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{type.description}</TableCell>
                    <TableCell className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEditType(type)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteType(type.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editingType && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Edit User Type</h3>
              <Input
                placeholder="Type Name (e.g., Leaders)"
                value={editingType.name}
                onChange={(e) => setEditingType({ ...editingType, name: e.target.value })}
                className="mb-2"
              />
              <Input
                type="number"
                placeholder="Monthly Charge (UGX)"
                value={editingType.monthlyCharge}
                onChange={(e) => setEditingType({ ...editingType, monthlyCharge: parseInt(e.target.value) || 0 })}
                className="mb-2"
              />
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={editingType.isFree}
                  onChange={(e) => setEditingType({ ...editingType, isFree: e.target.checked })}
                  className="h-4 w-4"
                />
                <label>Free Tier?</label>
              </div>
              <Input
                placeholder="Description"
                value={editingType.description}
                onChange={(e) => setEditingType({ ...editingType, description: e.target.value })}
                className="mb-4"
              />
              <div className="flex gap-2">
                <Button onClick={() => handleSaveType(editingType)}>Save</Button>
                <Button variant="outline" onClick={() => setEditingType(null)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subscriptions Table */}
      <Card className="shadow-soft bg-card hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-500" /> Active Subscriptions
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-[200px]"
            />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {userTypes.map((t) => (
                  <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.userName}</TableCell>
                    <TableCell>{sub.userType}</TableCell>
                    <TableCell>{sub.plan}</TableCell>
                    <TableCell>{getStatusBadge(sub.status)}</TableCell>
                    <TableCell>{sub.startDate} / {sub.endDate}</TableCell>
                    <TableCell>UGX {sub.amount.toLocaleString()}</TableCell>
                    <TableCell>{sub.paymentMethod}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredSubscriptions.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No subscriptions found.</p>
          )}
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      <Card className="shadow-soft bg-card hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" /> Revenue Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `UGX ${Number(value).toLocaleString()}`} />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};