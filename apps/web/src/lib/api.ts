export type Page<T> = { items: T[]; nextCursor: string | null };
const API = process.env.NEXT_PUBLIC_WINMEM_API_URL ?? "http://localhost:8787";
async function req<T>(path: string): Promise<T> {
  const key = (typeof window !== "undefined" ? localStorage.getItem("WINMEM_KEY") : null) ?? "";
  const res = await fetch(`${API}${path}`, { headers: key ? { "X-WINMEM-API-KEY": key } : {} });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return await res.json();
}
export const api = {
  whoami: () => req<{ role: string }>("/v1/auth/whoami"),
  projects: () => req<Page<any>>("/v1/projects?limit=50"),
  project: (id: string) => req<any>(`/v1/projects/${id}`),
  sources: (id: string) => req<any[]>(`/v1/projects/${id}/sources`),
  memories: (id: string) => req<Page<any>>(`/v1/projects/${id}/memories?limit=50`),
  audits: (id: string) => req<Page<any>>(`/v1/projects/${id}/audits/batches?limit=50`)
};
