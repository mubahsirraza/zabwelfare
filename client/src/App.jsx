
function App() {
  return (
    <main className="min-h-screen bg-brand-light flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-brand-blue">
          SZABIST Student Welfare Society
        </p>

        <h1 className="font-display text-5xl font-extrabold tracking-tight text-ink sm:text-6xl">
          ZAB<span className="text-brand-sky">Welfare</span>
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-lg leading-8 text-muted">
          Building a community of compassion, service and meaningful change.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <span className="rounded-full bg-brand-sky px-5 py-2.5 text-sm font-semibold text-white">
            Frontend Ready
          </span>
          <span className="rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white">
            ZABWelfare
          </span>
        </div>
      </div>
    </main>
  );
}

export default App;
