import Link from 'next/link';

export default function LandingPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-4xl font-bold">Discover and book unforgettable yacht experiences.</h1>
      <p className="text-lg text-slate-600">
        Rent full vessels or reserve individual seats on shared charters worldwide.
      </p>
      <div className="flex gap-3">
        <Link href="/search" className="rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white">
          Search Boats
        </Link>
        <Link href="/owner" className="rounded-lg border border-slate-300 px-4 py-2 font-semibold">
          List Your Boat
        </Link>
      </div>
    </section>
  );
}
