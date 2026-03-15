import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { Boat } from '@/types';

interface BoatDetails extends Boat {
  reviews: Array<{ id: string; ratingExperience: number; comment: string }>;
}

export default async function BoatDetailsPage({ params }: { params: { id: string } }) {
  const boat = await apiGet<BoatDetails>(`/boats/${params.id}`);

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">{boat.title}</h1>
      <p>{boat.description}</p>
      <p className="text-slate-600">Marina: {boat.marina}</p>
      <p className="font-medium">Capacity: {boat.capacity} · Captain {boat.captainIncluded ? 'included' : 'optional'}</p>
      <div className="flex gap-4">
        <Link href={`/booking/${boat.id}?mode=FULL_CHARTER`} className="rounded bg-slate-900 px-4 py-2 text-white">Book Full Yacht</Link>
        <Link href={`/booking/${boat.id}?mode=SEAT`} className="rounded border px-4 py-2">Book Seats</Link>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Reviews</h2>
        <ul className="space-y-2">
          {boat.reviews?.map((r) => (
            <li key={r.id} className="rounded border p-2">⭐ {r.ratingExperience} — {r.comment}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
