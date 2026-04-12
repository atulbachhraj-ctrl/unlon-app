import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "#060104" }}
    >
      <div className="text-center max-w-[430px] w-full">
        {/* 404 gradient text */}
        <h1
          className="text-[120px] font-extrabold leading-none"
          style={{
            background: "linear-gradient(135deg, #FF5020, #FF7040)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </h1>

        {/* Subtitle */}
        <p
          className="text-2xl font-bold mt-4"
          style={{ color: "#FFF3EC" }}
        >
          Lost in the vibe?
        </p>

        {/* Description */}
        <p
          className="text-sm mt-2"
          style={{ color: "rgba(255,243,236,0.35)" }}
        >
          The page you&apos;re looking for doesn&apos;t exist
        </p>

        {/* Go Home button */}
        <Link
          href="/home"
          className="inline-block mt-8 px-8 py-3 rounded-xl text-sm font-bold transition-transform active:scale-95"
          style={{
            background: "linear-gradient(135deg, #FF5020, #FF7040)",
            color: "#060104",
          }}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
