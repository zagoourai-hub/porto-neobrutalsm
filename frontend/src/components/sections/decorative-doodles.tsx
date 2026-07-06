export function DecorativeDoodles() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="doodle-float-1 absolute left-0 top-16 text-6xl font-black text-pink">✦</div>
      <div className="doodle-float-2 absolute right-6 top-24 text-4xl font-black text-cyan">〽</div>
      <div className="doodle-float-3 absolute bottom-20 left-4 text-5xl font-black">✳</div>
      <div className="doodle-float-4 absolute bottom-16 right-2 text-5xl font-black text-yellow">ϟ</div>
      <div className="doodle-float-1 dot-pattern absolute left-14 top-32 h-28 w-20 opacity-80" />
      <div className="doodle-float-2 dot-pattern absolute bottom-6 right-28 h-24 w-28 opacity-80" />
    </div>
  );
}
