export default function Loading() {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gradient-to-br from-[#38261A] via-[#4A3222] to-[#2B1B10]">
      <div className="w-[300px] max-w-full px-4 sm:w-[400px]">
        <video
          src="/assets/loader-ring.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full"
        />
      </div>
    </div>
  );
}
