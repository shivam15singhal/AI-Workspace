import EventCard from "./EventCard";

type Props = {
  events: any[];
  loading: boolean;
  onDelete: (id: string) => void;
};

export default function GoogleEventsList({
  events,
  loading,
  onDelete,
}: Props) {
  if (loading) {
    return <p>Loading events...</p>;
  }

  if (events.length === 0) {
    return <p>No upcoming events.</p>;
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}