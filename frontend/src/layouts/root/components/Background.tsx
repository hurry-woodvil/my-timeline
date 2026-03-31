import './background.css';

export default function Background() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* 海 → 砂浜 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_#9fd4f6_0%,_#bfe5fb_32%,_#f5eddc_58%,_#f2dfb4_100%)]" />

      {/* うっすらドット */}
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.55)_1px,transparent_1px)] [background-size:18px_18px]" />

      {/* 境目を少しぼかす */}
      <div className="absolute inset-x-0 bottom-[28%] h-40 bg-white/20 blur-3xl" />
    </div>
  );
}
