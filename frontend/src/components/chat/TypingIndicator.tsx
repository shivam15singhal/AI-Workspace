export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl bg-muted px-5 py-4">
        <div className="flex gap-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
            style={{
              animationDelay: "150ms",
            }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
            style={{
              animationDelay: "300ms",
            }}
          />
        </div>
      </div>
    </div>
  );
}