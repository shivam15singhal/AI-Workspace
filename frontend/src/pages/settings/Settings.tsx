import { useEffect, useState } from "react";
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
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const response =
        await api.get<EventsResponse>("/api/google/events");

      setEvents(response.data.events);
    } catch (err) {
      console.error(err);
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

      alert("Google disconnected successfully.");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!window.confirm("Delete this event?")) {
      return;
    }

    try {
      await api.delete(`/api/google/events/${id}`);

      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">
          Google Calendar Settings
        </h1>

        <GoogleConnectionCard
          connected={connected}
          email={email}
          onRefresh={fetchEvents}
          onDisconnect={disconnectGoogle}
        />

        {connected && (
          <>
            <h2 className="mb-4 text-2xl font-semibold">
              Upcoming Events
            </h2>

            <GoogleEventsList
              events={events}
              loading={loading}
              onDelete={deleteEvent}
            />
          </>
        )}
      </div>
    </div>
  );
}