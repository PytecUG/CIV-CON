import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarDays, Clock, MapPin, Users, Plus, Filter } from "lucide-react";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  organizer: {
    name: string;
    avatar: string;
    role: string;
  };
  attendees: number;
  category: string;
}

const dummyEvents: Event[] = [
  {
    id: "1",
    title: "Town Hall Meeting: Healthcare Reform",
    description: "Join us for an important discussion about healthcare reform initiatives in our region.",
    date: new Date(2024, 2, 15),
    time: "2:00 PM",
    location: "Community Center, Kampala",
    organizer: {
      name: "Dr. Sarah Mukasa",
      avatar: "/api/placeholder/40/40",
      role: "Healthcare Advocate"
    },
    attendees: 156,
    category: "Healthcare"
  },
  {
    id: "2",
    title: "Youth Leadership Summit",
    description: "Empowering young leaders to shape Uganda's future through innovation and collaboration.",
    date: new Date(2024, 2, 20),
    time: "9:00 AM",
    location: "Makerere University",
    organizer: {
      name: "James Okello",
      avatar: "/api/placeholder/40/40",
      role: "Youth Coordinator"
    },
    attendees: 243,
    category: "Education"
  },
  {
    id: "3",
    title: "Climate Action Workshop",
    description: "Learn about sustainable practices and climate change mitigation strategies.",
    date: new Date(2024, 2, 25),
    time: "10:00 AM",
    location: "Environmental Hub, Entebbe",
    organizer: {
      name: "Grace Namuli",
      avatar: "/api/placeholder/40/40",
      role: "Environmental Activist"
    },
    attendees: 89,
    category: "Environment"
  }
];

const Events = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events] = useState<Event[]>(dummyEvents);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: ""
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Healthcare':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Education':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Environment':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleCreateEvent = () => {
    // This would normally save to backend
    console.log("Creating event:", newEvent);
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      category: ""
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">Events</h1>
            <p className="text-muted-foreground">Discover and participate in community events</p>
          </div>
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
                <div className="grid gap-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="Enter event title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    placeholder="Describe your event"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    placeholder="Event location"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                    placeholder="Event category"
                  />
                </div>
                <Button onClick={handleCreateEvent} className="mt-4">
                  Create Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-2" />
                Calendar
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

          {/* Events List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Badge variant="secondary">All Events</Badge>
            </div>

            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{event.title}</h3>
                        <Badge variant="secondary" className={getCategoryColor(event.category)}>
                          {event.category}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{event.description}</p>
                      
                      <div className="grid sm:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center text-muted-foreground">
                          <CalendarDays className="h-4 w-4 mr-2" />
                          {format(event.date, "PPP")}
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
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={event.organizer.avatar} />
                            <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{event.organizer.name}</p>
                            <p className="text-xs text-muted-foreground">{event.organizer.role}</p>
                          </div>
                        </div>
                        <Button className="bg-primary hover:bg-primary/90">
                          Join Event
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Events;