type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({
  children,
}: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      {children}
    </div>
  );
}