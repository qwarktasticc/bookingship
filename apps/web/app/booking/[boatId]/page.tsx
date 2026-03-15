'use client';

import { useState } from 'react';

export default function BookingPage({ params }: { params: { boatId: string } }) {
  const [seats, setSeats] = useState(1);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Secure your reservation</h1>
      <p>Boat ID: {params.boatId}</p>
      <label className="block">
        Seats
        <input
          type="number"
          min={1}
          max={12}
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
          className="mt-1 block rounded border p-2"
        />
      </label>
      <button className="rounded bg-sky-600 px-4 py-2 font-semibold text-white">Continue to payment</button>
    </section>
  );
}
