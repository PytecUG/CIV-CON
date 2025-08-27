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
import Home from "./welcome/Home"
import Signup from "./welcome/Auth/Signup";
import Signin from "./welcome/Auth/Signin";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="uganda-connects-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/topics" element={<Topics />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/People" element={<People />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/home" element={<Home />} />
            <Route path="/discussion/:topicId" element={<DiscussionRoom />} />
            <Route path="/events" element={<Events />} />
            <Route path="/live-discussion/:id" element={<LiveDiscussion />} />
            <Route path="/join-discussions" element={<JoinDiscussions />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
