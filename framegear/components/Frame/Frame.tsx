export function Frame() {
  return <PlaceholderFrame />;
}

function PlaceholderFrame() {
  return (
    <div className="flex aspect-[1.91/1] w-full rounded-xl border-slate-700 bg-fuchsia-950">
      <div></div>
      <div className="flex h-16 w-full flex-wrap gap-2 self-end rounded-b-xl bg-slate-700 px-4 py-2">
        <button className="w-[45%] grow rounded-lg bg-slate-400 p-2 text-black" type="button">
          Load Frame To Continue
        </button>
      </div>
    </div>
  );
}
