import { useState, useEffect } from "react";
import {
  DollarSign,
  CreditCard,
  Users,
  Edit,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCcw,
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
import api from "@/lib/api";
import { toast } from "sonner";

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
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [editingType, setEditingType] = useState<UserType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ======================================
  // 🚀 Fetch All Data
  // ======================================
  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [typesRes, subsRes, revenueRes] = await Promise.all([
        api.get("/admin/subscriptions/user-types"),
        api.get("/admin/subscriptions/all"),
        api.get("/admin/subscriptions/revenue-summary"),
      ]);
      setUserTypes(typesRes.data || []);
      setSubscriptions(subsRes.data || []);
      setTotalRevenue(revenueRes.data.totalRevenue || 0);
      setRevenueData(revenueRes.data.trend || []);
    } catch (error) {
      console.error("Failed to load subscription data:", error);
      toast.error("Failed to load subscription data. Showing fallback demo.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ======================================
  // 💳 Subscription Management Handlers
  // ======================================
  const handleRenew = async (id: string) => {
    try {
      await api.post(`/admin/subscriptions/renew/${id}`);
      toast.success("Subscription renewed successfully.");
      fetchData();
    } catch {
      toast.error("Failed to renew subscription.");
    }
  };

  const handleBulkRenew = async () => {
    try {
      await api.post("/admin/subscriptions/bulk-renew");
      toast.success("Expired subscriptions renewed.");
      fetchData();
    } catch {
      toast.error("Failed to renew expired subscriptions.");
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this subscription?")) return;
    try {
      await api.post(`/admin/subscriptions/cancel/${id}`);
      toast.success("Subscription cancelled.");
      fetchData();
    } catch {
      toast.error("Failed to cancel subscription.");
    }
  };

  const handleEditSubscription = async (id: string) => {
    const newPlan = prompt("Enter new plan name:");
    if (!newPlan) return;
    try {
      await api.put(`/admin/subscriptions/edit/${id}`, { plan: newPlan });
      toast.success("Subscription updated successfully.");
      fetchData();
    } catch {
      toast.error("Failed to update subscription.");
    }
  };

  // ======================================
  // 🧩 User Type CRUD Handlers
  // ======================================
  const handleEditType = (type: UserType) => setEditingType(type);

  const handleSaveType = async (updatedType: UserType) => {
    try {
      if (updatedType.id === "new") {
        const res = await api.post("/admin/subscriptions/user-types", updatedType);
        setUserTypes([...userTypes, res.data]);
        toast.success("User type created successfully.");
      } else {
        await api.put(`/admin/subscriptions/user-types/${updatedType.id}`, updatedType);
        setUserTypes(userTypes.map((t) => (t.id === updatedType.id ? updatedType : t)));
        toast.success("User type updated.");
      }
    } catch {
      toast.error("Failed to save user type.");
    }
    setEditingType(null);
  };

  const handleDeleteType = async (id: string) => {
    if (confirm("Delete this user type? This will affect existing subscriptions.")) {
      try {
        await api.delete(`/admin/subscriptions/user-types/${id}`);
        setUserTypes(userTypes.filter((t) => t.id !== id));
        toast.success("User type deleted.");
      } catch {
        toast.error("Failed to delete user type.");
      }
    }
  };

  // ======================================
  // 🎨 Helpers
  // ======================================
  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === "all" || sub.userType === filterType) &&
      (filterStatus === "all" || sub.status === filterStatus)
  );

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

  // ======================================
  // 🕒 Loading State
  // ======================================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-muted-foreground animate-pulse">
        Loading subscription data...
      </div>
    );
  }

  // ======================================
  // 💻 Render
  // ======================================
  return (
    <div className="container py-6 space-y-6 min-h-screen bg-background">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-600">Subscription Management</h1>
          <p className="text-muted-foreground">
            Manage user types, monitor subscriptions, and track revenue for CIVCON.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleBulkRenew} className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" /> Bulk Renew Expired
          </Button>
          <Button
            onClick={fetchData}
            variant="outline"
            className="flex items-center gap-2"
            disabled={refreshing}
          >
            <RefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
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
              <p className="text-xs text-muted-foreground">All Active</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft bg-gradient-to-br from-green-500/10 to-background hover:scale-105 transition-all duration-300">
          <CardContent className="flex items-center gap-3 pt-4">
            <CreditCard className="h-6 w-6 text-green-500" />
            <div>
              <p className="font-semibold text-green-600">Active Subscriptions</p>
              <p className="text-xl font-bold">
                {subscriptions.filter((s) => s.status === "active").length}
              </p>
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
                {
                  subscriptions.filter(
                    (s) =>
                      new Date(s.endDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) &&
                      s.status === "active"
                  ).length
                }
              </p>
              <p className="text-xs text-muted-foreground">Within 7 days</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Types */}
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
                    <TableCell className="max-w-[200px] truncate">
                      {type.description}
                    </TableCell>
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
                placeholder="Type Name"
                value={editingType.name}
                onChange={(e) =>
                  setEditingType({ ...editingType, name: e.target.value })
                }
                className="mb-2"
              />
              <Input
                type="number"
                placeholder="Monthly Charge (UGX)"
                value={editingType.monthlyCharge}
                onChange={(e) =>
                  setEditingType({
                    ...editingType,
                    monthlyCharge: parseInt(e.target.value) || 0,
                  })
                }
                className="mb-2"
              />
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={editingType.isFree}
                  onChange={(e) =>
                    setEditingType({ ...editingType, isFree: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <label>Free Tier?</label>
              </div>
              <Input
                placeholder="Description"
                value={editingType.description}
                onChange={(e) =>
                  setEditingType({ ...editingType, description: e.target.value })
                }
                className="mb-4"
              />
              <div className="flex gap-2">
                <Button onClick={() => handleSaveType(editingType)}>Save</Button>
                <Button variant="outline" onClick={() => setEditingType(null)}>
                  Cancel
                </Button>
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
                  <SelectItem key={t.id} value={t.name}>
                    {t.name}
                  </SelectItem>
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
                    <TableCell>
                      {sub.startDate} / {sub.endDate}
                    </TableCell>
                    <TableCell>UGX {sub.amount.toLocaleString()}</TableCell>
                    <TableCell>{sub.paymentMethod}</TableCell>
                    <TableCell className="flex flex-wrap gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditSubscription(sub.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRenew(sub.id)}
                      >
                        <RefreshCcw className="h-4 w-4 mr-1" /> Renew
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancel(sub.id)}
                        className="text-red-600"
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredSubscriptions.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No subscriptions found.
            </p>
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
              <Tooltip formatter={(v) => `UGX ${Number(v).toLocaleString()}`} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
