export default function Loading() {
  return (
    <main className="grid min-h-[70vh] place-items-center">
      <div className="text-center">
        <div className="equalizer mx-auto flex h-10 w-fit items-end justify-center">
          <span /><span /><span /><span /><span />
        </div>
        <p className="mt-4 text-sm font-bold uppercase tracking-[0.3em] text-gold-400">Warming up the decks...</p>
      </div>
    </main>
  );
}
