import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Plus,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { eventService } from "@/services/eventService";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: number;
  is_attending?: boolean;
  organizer: {
    id: number;
    name: string;
    avatar?: string;
    role?: string;
  };
}

const Events = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { token } = useAuth();

  const API_URL = import.meta.env.VITE_API_BASE_URL || "https://api.civ-con.org";


  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [selectedDate, selectedCategory, events]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await eventService.list({
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        upcoming: true,
        sort: "popular",
      });
      setEvents(res);
    } catch {
      toast.error("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!token) return toast.warning("Please log in to create events.");
    try {
      setCreating(true);
      const res = await axios.post(`${API_URL}/events/`, newEvent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Event created successfully!");
      setNewEvent({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        category: "",
      });
      setEvents((prev) => [res.data, ...prev]);
    } catch {
      toast.error("Failed to create event.");
    } finally {
      setCreating(false);
    }
  };

  const handleJoinEvent = async (id: string) => {
    if (!token) return toast.warning("Please log in to join events.");
    try {
      await eventService.join(Number(id), token);
      toast.success("Joined event successfully!");
      fetchEvents();
    } catch {
      toast.error("Failed to join event.");
    }
  };

  const handleLeaveEvent = async (id: string) => {
    if (!token) return toast.warning("Sign in to manage your events.");
    try {
      await axios.post(`${API_URL}/events/${id}/leave`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.info("You’ve left this event.");
      setEvents((prev) =>
        prev.map((e) =>
          e.id === id
            ? { ...e, is_attending: false, attendees: Math.max(e.attendees - 1, 0) }
            : e
        )
      );
    } catch {
      toast.error("Failed to leave event.");
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "healthcare":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "education":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "environment":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const filterEvents = () => {
    let filtered = [...events];
    if (selectedDate) {
      const formatted = format(selectedDate, "yyyy-MM-dd");
      filtered = filtered.filter((e) => e.date.startsWith(formatted));
    }
    if (selectedCategory !== "All") {
      filtered = filtered.filter((e) => e.category === selectedCategory);
    }
    setFilteredEvents(filtered);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Community Events</h1>
            <p className="text-muted-foreground">
              Discover and participate in impactful community events.
            </p>
          </div>

          {token && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                    <Input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    />
                  </div>
                  <Input
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="Event location"
                  />
                  <Input
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    placeholder="Event category"
                  />
                  <Button onClick={handleCreateEvent} disabled={creating}>
                    {creating ? "Creating..." : "Create Event"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-2" /> Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
              <Badge variant="secondary">
                {selectedCategory === "All" ? "All Events" : selectedCategory}
              </Badge>
            </div>

            {loading ? (
              <p className="text-muted-foreground text-center py-10">
                Loading events...
              </p>
            ) : filteredEvents.length === 0 ? (
              <p className="text-muted-foreground text-center py-10">
                No events found for this date or filter.
              </p>
            ) : (
              filteredEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{event.title}</h3>
                          <Badge className={getCategoryColor(event.category)}>
                            {event.category}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{event.description}</p>
                        <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
                          <div className="flex items-center text-muted-foreground">
                            <CalendarDays className="h-4 w-4 mr-2" />
                            {format(new Date(event.date), "PPP")}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-4 w-4 mr-2" />
                            {event.time}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2" />
                            {event.location}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Users className="h-4 w-4 mr-2" />
                            {event.attendees} attending
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={event.organizer.avatar} />
                              <AvatarFallback>
                                {event.organizer.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{event.organizer.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {event.organizer.role || "Organizer"}
                              </p>
                            </div>
                          </div>
                          {event.is_attending ? (
                            <Button variant="outline" onClick={() => handleLeaveEvent(event.id)}>
                              Leave Event
                            </Button>
                          ) : (
                            <Button onClick={() => handleJoinEvent(event.id)}>
                              Join Event
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Events;
