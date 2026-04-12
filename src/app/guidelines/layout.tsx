export default function GuidelinesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh" style={{ background: '#060104' }}>
      <div className="w-full max-w-[430px] mx-auto px-5 py-8">
        {children}
      </div>
    </div>
  );
}
