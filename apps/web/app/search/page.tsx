import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { Boat } from '@/types';

interface SearchResponse {
  items: Boat[];
  total: number;
}

export default async function SearchPage() {
  const data = await apiGet<SearchResponse>('/search/boats?page=1&pageSize=12');

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Available Boats ({data.total})</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {data.items.map((boat) => (
          <article key={boat.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-xl font-semibold">{boat.title}</h3>
            <p className="text-sm text-slate-600">{boat.marina}</p>
            <p className="mt-2 text-sm">{boat.capacity} guests · {boat.boatType}</p>
            <p className="mt-2 font-semibold">${boat.pricePerHour}/hour · ${boat.pricePerSeat}/seat</p>
            <Link href={`/boats/${boat.id}`} className="mt-3 inline-block text-sky-600">View details</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
