const apiBase = process.env.NEXT_PUBLIC_API_URL;

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${apiBase}${path}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed request');
  return res.json() as Promise<T>;
}
