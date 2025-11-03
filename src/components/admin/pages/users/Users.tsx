// src/components/admin/pages/Users.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Users as UsersIcon,
  Search,
  Download,
  Edit,
  Ban,
  CheckCircle,
  Eye,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";
import {
  LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile } from "@/components/admin/pages/users/UserProfile";
import { EditUserModal } from "@/components/admin/pages/users/EditUserModal";
import { MostActiveUsers } from "@/components/admin/pages/users/MostActiveUsers";
import { TopLeadersInGroups } from "@/components/admin/pages/users/TopLeadersInGroups";
import { MostContactedLeaders } from "@/components/admin/pages/users/MostContactedLeaders";

type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  district: string;
  status: "Active" | "Suspended" | "Pending";
  createdAt: string;
};

const DISTRICTS = [
  "Kampala", "Gulu", "Jinja", "Mbale", "Mbarara", "Arua", "Lira",
  "Soroti", "Hoima", "Fort Portal", "Masaka", "Mukono", "Kasese",
  "Kabale", "Moroto", "Entebbe", "Wakiso", "Nakasongola", "Luweero",
  "Iganga", "Tororo"
];
const ROLES = ["Citizen", "Journalist", "Leader", "Student", "NGO", "Admin"];

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://api.civ-con.org";

export const Users: React.FC = () => {
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<string>("overview");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [growthRange, setGrowthRange] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");

  const perPage = 8;

  // Load users
  useEffect(() => {
    let mounted = true;
    const ac = new AbortController();
    const load = async () => {
      setLoading(true);
      try {
        const token = String(localStorage.getItem("token") ?? "");
        const res = await fetch(`${API_BASE.replace(/\/$/, "")}/users`, {
          signal: ac.signal,
          headers: {
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!res.ok) throw new Error(`Failed to load users (${res.status})`);
        const data = await res.json();
        if (!mounted) return;
        // Normalize data to User[]
        const normalized: User[] = (data || []).map((u: any, i: number) => ({
          id: Number(u.id ?? i + 1),
          name: String(u.name ?? `${u.first_name ?? "User"} ${u.last_name ?? ""}`).trim(),
          email: String(u.email ?? u.username ?? `user${i + 1}@example.com`),
          phone: u.phone ?? "",
          role: u.role ?? "Citizen",
          district: u.district ?? (DISTRICTS[i % DISTRICTS.length] ?? "Kampala"),
          status: (u.status ?? "Active") as User["status"],
          createdAt: String(u.createdAt ?? u.created_at ?? new Date().toISOString().split("T")[0]),
        }));
        setUsers(normalized);
      } catch (err: any) {
        toast({ title: "Failed to load users", description: String(err?.message || err) });
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; ac.abort(); };
  }, [toast]);

  // Filtered users
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchesSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.phone && u.phone.includes(search));
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageUsers = filtered.slice((page - 1) * perPage, page * perPage);

  // District summary
  const districtSummary = useMemo(() => {
    return DISTRICTS.map(d => {
      const inDistrict = users.filter(u => u.district === d);
      return {
        name: d,
        total: inDistrict.length,
        active: inDistrict.filter(u => u.status === "Active").length,
        pending: inDistrict.filter(u => u.status === "Pending").length,
        suspended: inDistrict.filter(u => u.status === "Suspended").length,
        topRole: Object.entries(
          inDistrict.reduce((acc: Record<string, number>, u) => ({ ...acc, [u.role]: (acc[u.role] || 0) + 1 }), {})
        ).sort((a, b) => b[1] - a[1])[0]?.[0] || "—",
      };
    }).filter(d => d.total > 0);
  }, [users]);

  // Growth data
  const growthData = useMemo(() => {
    const map = new Map<string, number>();
    users.forEach(u => {
      const d = new Date(u.createdAt);
      let key = "";
      if (growthRange === "daily") key = format(d, "MMM dd");
      else if (growthRange === "weekly") {
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        key = `W${format(weekStart, "w")}`;
      } else if (growthRange === "monthly") key = format(d, "MMM yyyy");
      else key = format(d, "yyyy");
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map.entries()).map(([label, newUsers]) => ({ label, newUsers }));
  }, [users, growthRange]);

  // Role pie
  const rolePieData = useMemo(() => {
    return ROLES.map(r => ({ name: r, value: users.filter(u => u.role === r).length })).filter(d => d.value > 0);
  }, [users]);

  const ROLE_COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#ec4899"];

  // Actions
  const handleStatusToggle = async (id: number) => {
    // optimistic update
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u));
    try {
      const token = String(localStorage.getItem("token") ?? "");
      const res = await fetch(`${API_BASE.replace(/\/$/, "")}/users/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        throw new Error(`Failed to update (${res.status})`);
      }
      toast({ title: "Status Updated" });
    } catch (err: any) {
      toast({ title: "Failed to update status", description: String(err?.message || err), variant: "destructive" });
      // revert
      // reload users
      try {
        const token = String(localStorage.getItem("token") ?? "");
        const r = await fetch(`${API_BASE.replace(/\/$/, "")}/users`, { headers: { Accept: "application/json", Authorization: token ? `Bearer ${token}` : "" }});
        if (r.ok) {
          const d = await r.json();
          setUsers((d || []).map((u: any, i: number) => ({
            id: Number(u.id ?? i + 1),
            name: String(u.name ?? `${u.first_name ?? "User"}`).trim(),
            email: String(u.email ?? `user${i + 1}@example.com`),
            phone: u.phone ?? "",
            role: u.role ?? "Citizen",
            district: u.district ?? DISTRICTS[i % DISTRICTS.length],
            status: (u.status ?? "Active") as User["status"],
            createdAt: String(u.createdAt ?? u.created_at ?? new Date().toISOString()),
          })));
        }
      } catch { /* ignore */ }
    }
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setEditOpen(true);
  };

  const handleSaveEdit = async (updated: User) => {
    try {
      const token = String(localStorage.getItem("token") ?? "");
      const res = await fetch(`${API_BASE.replace(/\/$/, "")}/users/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error(`Failed to save user (${res.status})`);
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
      toast({ title: "User Updated" });
      setEditOpen(false);
    } catch (err: any) {
      toast({ title: "Failed to update user", description: String(err?.message || err), variant: "destructive" });
    }
  };

  const bulkAction = async (action: "suspend" | "activate") => {
    const newStatus = action === "suspend" ? "Suspended" : "Active";
    const token = String(localStorage.getItem("token") ?? "");
    try {
      const res = await fetch(`${API_BASE.replace(/\/$/, "")}/users/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: token ? `Bearer ${token}` : "" },
        body: JSON.stringify({ ids: selected, status: newStatus }),
      });
      if (!res.ok) throw new Error(`Bulk update failed (${res.status})`);
      setUsers(prev => prev.map(u => selected.includes(u.id) ? { ...u, status: newStatus as User["status"] } : u));
      toast({ title: "Bulk Update", description: `${selected.length} users ${newStatus.toLowerCase()}.` });
      setSelected([]);
    } catch (err: any) {
      toast({ title: "Bulk update failed", description: String(err?.message || err), variant: "destructive" });
    }
  };

  const exportCSV = () => {
    const filteredUsers = filtered;
    const csv = [
      "ID,Name,Email,Phone,Role,District,Status,Created",
      ...filteredUsers.map(u => [u.id, `"${u.name.replace(/"/g, '""')}"`, u.email, u.phone ?? "", u.role, u.district, u.status, u.createdAt].join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `civcon-users-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    toast({ title: "Exported", description: `${filtered.length} users.` });
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-600 flex items-center gap-2">
            <UsersIcon className="h-7 w-7" /> User Management
          </h1>
          <p className="text-muted-foreground">View, edit, and analyze CIVCON users by district.</p>
        </div>
        <Button onClick={exportCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">All Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="districts">Districts</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Total Users", value: users.length, icon: UsersIcon },
              { title: "Active", value: users.filter(u => u.status === "Active").length, icon: UsersIcon, color: "text-green-600" },
              { title: "Pending", value: users.filter(u => u.status === "Pending").length, icon: UsersIcon, color: "text-yellow-600" },
              { title: "Suspended", value: users.filter(u => u.status === "Suspended").length, icon: UsersIcon, color: "text-red-600" },
            ].map((s, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
                  <s.icon className={`h-4 w-4 ${s.color || "text-muted-foreground"}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${s.color || ""}`}>{s.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>User Growth</CardTitle>
              <Select value={growthRange} onValueChange={(v: string) => setGrowthRange(v as any)}>
                <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData}>
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="newUsers" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Role Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={rolePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {rolePieData.map((_, i) => <Cell key={`cell-${i}`} fill={ROLE_COLORS[i % ROLE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center">
              <p className="text-muted-foreground">More insights coming soon…</p>
            </div>
          </div>
        </TabsContent>

        {/* All Users */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={roleFilter} onValueChange={(v: string) => setRoleFilter(v)}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v: string) => setStatusFilter(v)}>
              <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selected.length > 0 && (
            <div className="flex gap-2 p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">{selected.length} selected</span>
              <Button size="sm" variant="outline" onClick={() => bulkAction("suspend")}><Ban className="h-4 w-4 mr-1" /> Suspend</Button>
              <Button size="sm" variant="outline" onClick={() => bulkAction("activate")}><CheckCircle className="h-4 w-4 mr-1" /> Activate</Button>
            </div>
          )}

          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left"><Checkbox /></th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase hidden sm:table-cell">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase hidden md:table-cell">District</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageUsers.map(u => (
                    <tr key={u.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <Checkbox checked={selected.includes(u.id)} onCheckedChange={() => setSelected(prev => prev.includes(u.id) ? prev.filter(id => id !== u.id) : [...prev, u.id])} />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3 text-sm hidden sm:table-cell"><Badge variant="outline">{u.role}</Badge></td>
                      <td className="px-4 py-3 text-sm hidden md:table-cell">{u.district}</td>
                      <td className="px-4 py-3">
                        <Badge className={u.status === "Active" ? "bg-green-100 text-green-800" : u.status === "Suspended" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}>{u.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setProfileUser(u); setProfileOpen(true); }}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(u)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleStatusToggle(u.id)} className={u.status === "Active" ? "text-red-600" : "text-green-600"}>
                            {u.status === "Active" ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
                <Button key={i + 1} variant={page === i + 1 ? "default" : "outline"} size="sm" onClick={() => setPage(i + 1)}>{i + 1}</Button>
              ))}
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
            </div>
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MostActiveUsers users={users.filter(u => u.status === "Active").slice(0, 5)} />
            <TopLeadersInGroups />
            <MostContactedLeaders />
          </div>
        </TabsContent>

        {/* Districts */}
        <TabsContent value="districts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {districtSummary.map(d => (
              <Card key={d.name}>
                <CardHeader className="flex flex-row items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg">{d.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Total:</span> <strong>{d.total}</strong></div>
                  <div className="flex justify-between"><span>Active:</span> <strong className="text-green-600">{d.active}</strong></div>
                  <div className="flex justify-between"><span>Pending:</span> <strong className="text-yellow-600">{d.pending}</strong></div>
                  <div className="flex justify-between"><span>Suspended:</span> <strong className="text-red-600">{d.suspended}</strong></div>
                  <div className="flex justify-between text-muted-foreground"><span>Top Role:</span> <Badge variant="secondary">{d.topRole}</Badge></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <UserProfile user={profileUser} open={profileOpen} onOpenChange={setProfileOpen} />
      {editUser && <EditUserModal user={editUser} open={editOpen} onOpenChange={setEditOpen} onSave={handleSaveEdit} />}
    </div>
  );
};

export default Users;
