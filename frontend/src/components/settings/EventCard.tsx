type Props = {
  event: any;
  onDelete: (id: string) => void;
};

export default function EventCard({
  event,
  onDelete,
}: Props) {
  const start =
    event.start?.dateTime || event.start?.date;

  const end =
    event.end?.dateTime || event.end?.date;

  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold">
        {event.summary || "Untitled Event"}
      </h3>

      <p className="mt-2 text-gray-600">
        {new Date(start).toLocaleString()}
      </p>

      <p className="text-gray-600">
        {new Date(end).toLocaleString()}
      </p>

      <div className="mt-4 flex gap-3">
        <button className="rounded bg-yellow-500 px-3 py-2 text-white">
          Edit
        </button>

        <button
          onClick={() => onDelete(event.id)}
          className="rounded bg-red-600 px-3 py-2 text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
}