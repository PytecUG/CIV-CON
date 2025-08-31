import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Landing from "./pages/Landing";
import Feed from "./pages/Feed";
import Topics from "./pages/Topics";
import Articles from "./pages/Articles";
import Explore from "./pages/Explore";
import Groups from "./pages/Groups";
import People from "./pages/People";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import PostDetail from "./pages/PostDetail";
import DiscussionRoom from "./pages/DiscussionRoom";
import Events from "./pages/Events";
import LiveDiscussion from "./pages/LiveDiscussion";
import JoinDiscussions from "./pages/JoinDiscussions";
import Home from "./welcome/Home";
import Signup from "./welcome/Auth/Signup";
import Signin from "./welcome/Auth/Signin";
import NotFound from "./pages/NotFound";
// Admin routes
import { DashboardLayout } from "@/components/admin/layouts/DashboardLayout";
import { Users } from "@/components/admin/pages/Users";
import { AdminGroups } from "@/components/admin/pages/Groups";
import { Analytics } from "@/components/admin/pages/Analytics";
import { Dashboard } from "@/components/admin/pages/Dashboard";
import { Moderation } from "@/components/admin/pages/Moderation";
import { AdminSettings } from "@/components/admin/pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="uganda-connects-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Non-Admin Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/topics" element={<Topics />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/people" element={<People />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/discussion/:topicId" element={<DiscussionRoom />} />
            <Route path="/events" element={<Events />} />
            <Route path="/live-discussion/:id" element={<LiveDiscussion />} />
            <Route path="/join-discussions" element={<JoinDiscussions />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            {/* Admin Routes */}
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="groups" element={<AdminGroups />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="moderation" element={<Moderation />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;