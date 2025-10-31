// src/components/admin/pages/Groups.tsx
import { useState, useMemo, useEffect } from "react";
import {
  GitBranch,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Users,
  Ban,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

import { GroupProfile } from "@/components/admin/pages/groups/GroupProfile";
import { EditGroupModal } from "@/components/admin/pages/groups/EditGroupModal";

interface Group {
  id: number;
  name: string;
  members: number;
  status: "Active" | "Suspended" | "Pending";
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/* Mock data – replace with real API later                           */
/* ------------------------------------------------------------------ */
const generateGroups = (): Group[] => {
  const base = [
    { id: 1, name: "Youth Empowerment", members: 150, status: "Active", createdAt: "2025-01-15" },
    { id: 2, name: "Tech Innovators", members: 80, status: "Pending", createdAt: "2025-02-10" },
    { id: 3, name: "Community Leaders", members: 200, status: "Active", createdAt: "2024-12-01" },
    { id: 4, name: "Education Advocates", members: 120, status: "Suspended", createdAt: "2025-03-05" },
    { id: 5, name: "Health Warriors", members: 90, status: "Active", createdAt: "2025-01-20" },
    { id: 6, name: "Local Governance", members: 110, status: "Pending", createdAt: "2025-02-25" },
    { id: 7, name: "Women in Tech", members: 70, status: "Active", createdAt: "2025-03-10" },
    { id: 8, name: "Environmentalists", members: 130, status: "Active", createdAt: "2025-02-15" },
  ];
  return Array.from({ length: 35 }, (_, i) => ({
    ...base[i % 8],
    id: i + 1,
    name: `${base[i % 8].name} #${i + 1}`,
    createdAt: new Date(2025, 0, 1 + (i % 30)).toISOString().split("T")[0],
  }));
};

export const AdminGroups = () => {
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>(generateGroups());

  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number[]>([]);

  const [profileGroup, setProfileGroup] = useState<Group | null>(null);
  const [editGroup, setEditGroup] = useState<Group | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const perPage = 8;

  /* -------------------------- Filtering -------------------------- */
  const filtered = useMemo(() => {
    return groups.filter(g => {
      const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || g.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [groups, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const pageGroups = filtered.slice((page - 1) * perPage, page * perPage);

  /* --------------------------- Stats --------------------------- */
  const stats = {
    total: groups.length,
    active: groups.filter(g => g.status === "Active").length,
    pending: groups.filter(g => g.status === "Pending").length,
    suspended: groups.filter(g => g.status === "Suspended").length,
  };

  const statusChart = [
    { name: "Active", value: stats.active },
    { name: "Pending", value: stats.pending },
    { name: "Suspended", value: stats.suspended },
  ];
  const growthChart = Array.from({ length: 6 }, (_, i) => ({
    month: format(new Date(2025, i), "MMM"),
    groups: Math.floor(Math.random() * 8) + 3,
  }));
  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  /* --------------------------- Actions --------------------------- */
  const toggleStatus = (id: number) => {
    setGroups(prev =>
      prev.map(g =>
        g.id === id
          ? { ...g, status: g.status === "Active" ? "Suspended" : "Active" }
          : g
      )
    );
    toast({ title: "Status updated" });
  };

  const deleteGroup = (id: number) => {
    setGroups(prev => prev.filter(g => g.id !== id));
    toast({ title: "Group deleted" });
  };

  const saveEdit = (updated: Group) => {
    setGroups(prev => prev.map(g => (g.id === updated.id ? updated : g)));
  };

  const bulkAction = (action: "suspend" | "activate") => {
    const newStatus = action === "suspend" ? "Suspended" : "Active";
    setGroups(prev =>
      prev.map(g => (selected.includes(g.id) ? { ...g, status: newStatus as any } : g))
    );
    toast({ title: "Bulk update", description: `${selected.length} groups ${newStatus.toLowerCase()}.` });
    setSelected([]);
  };

  const exportCSV = () => {
    const csv = [
      "ID,Name,Members,Status,Created",
      ...filtered.map(g => [g.id, g.name, g.members, g.status, g.createdAt].join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `civcon-groups-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    toast({ title: "Exported", description: `${filtered.length} groups` });
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-600 flex items-center gap-2">
            <GitBranch className="h-7 w-7" /> Group Management
          </h1>
          <p className="text-muted-foreground">Create, edit and monitor civic groups.</p>
        </div>
        <Button onClick={exportCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="groups">All Groups</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* ── Overview ── */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Total Groups", value: stats.total, icon: GitBranch },
              { title: "Active", value: stats.active, icon: Users, color: "text-green-600" },
              { title: "Pending", value: stats.pending, icon: Users, color: "text-yellow-600" },
              { title: "Suspended", value: stats.suspended, icon: Users, color: "text-red-600" },
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Group Growth</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={growthChart}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="groups" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={statusChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {statusChart.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── All Groups ── */}
        <TabsContent value="groups" className="space-y-4">
          {/* Search & Filter */}
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search group name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selected.length > 0 && (
            <div className="flex gap-2 p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">{selected.length} selected</span>
              <Button size="sm" variant="outline" onClick={() => bulkAction("suspend")}>
                <Ban className="h-4 w-4 mr-1" /> Suspend
              </Button>
              <Button size="sm" variant="outline" onClick={() => bulkAction("activate")}>
                <CheckCircle className="h-4 w-4 mr-1" /> Activate
              </Button>
            </div>
          )}

          {/* Table */}
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left"><Checkbox /></th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase hidden sm:table-cell">Members</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted">
                  {pageGroups.map(g => (
                    <tr key={g.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selected.includes(g.id)}
                          onCheckedChange={() =>
                            setSelected(prev =>
                              prev.includes(g.id) ? prev.filter(x => x !== g.id) : [...prev, g.id]
                            )
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{g.name}</td>
                      <td className="px-4 py-3 text-sm hidden sm:table-cell">{g.members}</td>
                      <td className="px-4 py-3">
                        <Badge
                          className={
                            g.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : g.status === "Suspended"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {g.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setProfileGroup(g);
                              setProfileOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditGroup(g);
                              setEditOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600"
                            onClick={() => deleteGroup(g.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={page === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ── Analytics ── */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader><CardTitle>Group Analytics</CardTitle></CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Detailed engagement metrics coming soon.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <GroupProfile group={profileGroup} open={profileOpen} onOpenChange={setProfileOpen} />
      <EditGroupModal group={editGroup} open={editOpen} onOpenChange={setEditOpen} onSave={saveEdit} />
    </div>
  );
};