type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({
  children,
}: Props) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-10">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-30 -top-30 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute -bottom-30 -right-30 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="absolute inset-0 bg-grid-small-black/[0.03] dark:bg-grid-small-white/[0.03]" />
      </div>

      {/* Content */}
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}