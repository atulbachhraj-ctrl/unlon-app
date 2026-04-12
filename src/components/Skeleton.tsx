"use client";

const shimmerStyle = `
@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
`;

const shimmerBg = {
  background: "linear-gradient(90deg, #130709 25%, #1a0d0f 37%, #130709 63%)",
  backgroundSize: "800px 100%",
  animation: "shimmer 1.6s ease-in-out infinite",
};

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <>
      <style>{shimmerStyle}</style>
      <div
        className={`rounded-[18px] h-[200px] w-full ${className}`}
        style={shimmerBg}
      />
    </>
  );
}

export function SkeletonAvatar({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <>
      <style>{shimmerStyle}</style>
      <div
        className={`rounded-full flex-shrink-0 ${className}`}
        style={{ ...shimmerBg, width: size, height: size }}
      />
    </>
  );
}

export function SkeletonText({
  width = "100%",
  height = 12,
  className = "",
}: {
  width?: string | number;
  height?: number;
  className?: string;
}) {
  return (
    <>
      <style>{shimmerStyle}</style>
      <div
        className={`rounded ${className}`}
        style={{ ...shimmerBg, width, height }}
      />
    </>
  );
}

export function SkeletonPage() {
  return (
    <>
      <style>{shimmerStyle}</style>
      <div className="px-5 pt-14 pb-28">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col gap-2">
            <div className="rounded h-3 w-24" style={shimmerBg} />
            <div className="rounded h-5 w-40" style={shimmerBg} />
          </div>
          <div className="w-10 h-10 rounded-full" style={shimmerBg} />
        </div>

        {/* Card skeletons */}
        <div className="flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-[18px] h-[200px] w-full"
              style={shimmerBg}
            />
          ))}
        </div>
      </div>
    </>
  );
}
