import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";

// Public Pages
import Landing from "./pages/Landing";
import Home from "./welcome/Home";
import Feed from "./pages/Feed";
import Topics from "./pages/Topics";
import Articles from "./pages/Articles";
import Explore from "./pages/Explore";
import Groups from "./pages/Groups";
import GroupDiscussions from "@/pages/GroupDiscussions";
import People from "./pages/People";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import PostDetail from "./pages/PostDetail";
import DiscussionRoom from "./pages/DiscussionRoom";
import Events from "./pages/Events";
import LiveDiscussion from "./pages/LiveDiscussion";
import JoinDiscussions from "./pages/JoinDiscussions";
import Signup from "./welcome/Auth/Signup";
import Signin from "./welcome/Auth/Signin";
import SocialLogin from "./welcome/Auth/SocialLogin";
import ForgotPassword from "./welcome/Auth/ForgotPassword";
import ResetPassword from "./welcome/Auth/ResetPassword";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

// Admin Layout & Pages
import { DashboardLayout } from "@/components/admin/layouts/DashboardLayout";
import { Users } from "@/components/admin/pages/users/Users";
import { AdminGroups } from "@/components/admin/pages/groups/Groups";
import { Analytics } from "@/components/admin/pages/Analytics";
import { Dashboard } from "@/components/admin/pages/Dashboard";
import { Moderation } from "@/components/admin/pages/Moderation";
import { AdminSettings } from "@/components/admin/pages/Settings";
import { AdminCommunication } from "@/components/admin/pages/AdminCommunication";
import { SubscriptionManagement } from "@/components/admin/pages/SubscriptionManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="uganda-connects-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* === PUBLIC ROUTES === */}
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/topics" element={<Topics />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/groups/:id/discussions" element={<GroupDiscussions />} />
              <Route path="/people" element={<People />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/discussion/:topicId" element={<DiscussionRoom />} />
              <Route path="/events" element={<Events />} />
              <Route path="/live-discussion/:id" element={<LiveDiscussion />} />
              <Route path="/join-discussions" element={<JoinDiscussions />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/social-login" element={<SocialLogin />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* === ADMIN DASHBOARD (Nested Layout) === */}
              <Route path="/admin" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="groups" element={<AdminGroups />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="moderation" element={<Moderation />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="communication" element={<AdminCommunication />} />
                <Route path="subscriptions" element={<SubscriptionManagement />} />
              </Route>

              {/* === 404 === */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
