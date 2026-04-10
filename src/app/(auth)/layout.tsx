export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex items-center justify-center">
      <div className="w-full max-w-[420px] mx-auto">{children}</div>
    </div>
  );
}
