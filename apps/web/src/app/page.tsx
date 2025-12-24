"use client";
import React, { useEffect, useState } from "react";
import { Window } from "../win-ui/Window";
import { Button } from "../win-ui/Button";
import { api } from "../lib/api";

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [key, setKey] = useState<string>(() => (typeof window !== "undefined" ? localStorage.getItem("WINMEM_KEY") ?? "" : ""));
  const [err, setErr] = useState<string>("");

  useEffect(() => { (async () => {
    try { const p = await api.projects(); setProjects(p.items); }
    catch (e: any) { setErr(e.message ?? String(e)); }
  })(); }, []);

  return (
    <Window title="Winmem Program Manager" right={<span className="win-muted">retro runtime</span>}>
      <div className="win-row" style={{ justifyContent: "space-between" }}>
        <div className="win-card" style={{ minWidth: 360 }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>API Key</div>
          <div className="win-muted" style={{ marginBottom: 8 }}>Stored locally for browsing protected endpoints.</div>
          <input value={key} onChange={(e)=>setKey(e.target.value)} style={{ width:"100%", padding:8, border:"1px solid #404040" }} placeholder="X-WINMEM-API-KEY" />
          <div style={{ marginTop: 10, display:"flex", gap:8 }}>
            <Button onClick={()=>{ localStorage.setItem("WINMEM_KEY", key); location.reload(); }}>Save</Button>
            <Button onClick={()=>{ localStorage.removeItem("WINMEM_KEY"); location.reload(); }}>Clear</Button>
          </div>
        </div>

        <div className="win-card" style={{ flex: 1, minWidth: 420 }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Projects</div>
          {err ? <div style={{ color:"#800000", fontWeight:700 }}>{err}</div> : null}
          <table className="win-table">
            <thead><tr><th>Name</th><th>Cluster</th><th>Status</th><th>Open</th></tr></thead>
            <tbody>
              {projects.map((p)=>(
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.cluster}</td>
                  <td>{p.status}</td>
                  <td><a className="win-btn" href={`/projects/${p.id}`}>View</a></td>
                </tr>
              ))}
              {projects.length===0 ? <tr><td colSpan={4} className="win-muted">No projects yet. Create one via API (POST /v1/projects).</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </Window>
  );
}
