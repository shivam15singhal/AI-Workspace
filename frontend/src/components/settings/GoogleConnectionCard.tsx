import api from "../../api/axios";

type Props = {
  connected: boolean;
  email: string;
  onRefresh: () => void;
  onDisconnect: () => void;
};

export default function GoogleConnectionCard({
  connected,
  email,
  onRefresh,
  onDisconnect,
}: Props) {
  const connectGoogle = async () => {
    try {
      const response = await api.get<{ authorization_url: string }>(
        "/api/google/login"
      );

      window.location.href = response.data.authorization_url;
    } catch (error) {
      console.error(error);
      alert("Failed to connect Google Calendar.");
    }
  };

  if (!connected) {
    return (
      <button
        onClick={connectGoogle}
        className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        Connect Google Calendar
      </button>
    );
  }

  return (
    <div className="mb-6 rounded-xl border bg-green-50 p-6">
      <h2 className="text-xl font-semibold text-green-700">
        ✅ Google Calendar Connected
      </h2>

      <p className="mt-2 text-gray-700">
        <strong>Email:</strong> {email}
      </p>

      <div className="mt-5 flex gap-3">
        <button
          onClick={onRefresh}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Refresh Events
        </button>

        <button
          onClick={onDisconnect}
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}