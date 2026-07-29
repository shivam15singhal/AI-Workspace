import { useEffect, useState } from "react";
import { toast } from "sonner";

import api from "../../api/axios";

import GoogleConnectionCard from "@/components/settings/GoogleConnectionCard";
import GoogleEventsList from "@/components/settings/GoogleEventsList";

type CalendarEvent = {
  id: string;
  summary?: string;
  description?: string;
  start?: {
    dateTime?: string;
    date?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
  };
};

type StatusResponse = {
  connected: boolean;
  email?: string;
};

type EventsResponse = {
  events: CalendarEvent[];
};

export default function Settings() {
  const [connected, setConnected] = useState(false);
  const [email, setEmail] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkGoogleStatus();
  }, []);

  const checkGoogleStatus = async () => {
    try {
      const response =
        await api.get<StatusResponse>("/api/google/status");

      if (response.data.connected) {
        setConnected(true);
        setEmail(response.data.email || "");
        fetchEvents();
      } else {
        setConnected(false);
        setEmail("");
        setEvents([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to check Google Calendar status.");
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const response =
        await api.get<EventsResponse>("/api/google/events");

      setEvents(response.data.events);
    } catch (err) {
      toast.error("Failed to load calendar events.");
    } finally {
      setLoading(false);
    }
  };

  const disconnectGoogle = async () => {
    try {
      await api.delete("/api/google/disconnect");

      setConnected(false);
      setEmail("");
      setEvents([]);

      toast.success("Google Calendar disconnected.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to disconnect Google Calendar.");
    }
  };

  const deleteEvent = async (id: string) => {
    if (!window.confirm("Delete this event?")) {
      return;
    }

    try {
      await api.delete(`/api/google/events/${id}`);

      toast.success("Event deleted.");

      fetchEvents();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete event.");
    }
  };

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="mx-auto max-w-4xl px-6">

        <h1 className="mb-8 text-4xl font-bold text-foreground">
          Google Calendar Settings
        </h1>

        <GoogleConnectionCard
          connected={connected}
          email={email}
          onRefresh={fetchEvents}
          onDisconnect={disconnectGoogle}
        />

        {connected && (
          <div className="mt-10">
            <h2 className="mb-5 text-2xl font-semibold text-foreground">
              Upcoming Events
            </h2>

            <GoogleEventsList
              events={events}
              loading={loading}
              onDelete={deleteEvent}
            />
          </div>
        )}
      </div>
    </div>
  );
}