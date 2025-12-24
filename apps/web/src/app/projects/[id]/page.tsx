"use client";
import React, { useEffect, useState } from "react";
import { Window } from "../../../win-ui/Window";
import { api } from "../../../lib/api";

export default function ProjectPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [project, setProject] = useState<any>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [memories, setMemories] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [err, setErr] = useState<string>("");

  useEffect(() => { (async () => {
    try {
      const [p,s,m,a] = await Promise.all([api.project(id), api.sources(id), api.memories(id), api.audits(id)]);
      setProject(p); setSources(s); setMemories(m.items); setBatches(a.items);
    } catch (e: any) { setErr(e.message ?? String(e)); }
  })(); }, [id]);

  return (
    <Window title={`Winmem: ${project?.name ?? id}`} right={<a className="win-btn" href="/">Back</a>}>
      {err ? <div style={{ color:"#800000", fontWeight:800 }}>{err}</div> : null}
      {!project ? <div className="win-muted">Loading...</div> : (
        <>
          <div className="win-row">
            <div className="win-card" style={{ minWidth: 320 }}>
              <div style={{ fontWeight:800, marginBottom:6 }}>Project</div>
              <div><b>Name:</b> {project.name}</div>
              <div><b>Cluster:</b> {project.cluster}</div>
              <div><b>Status:</b> {project.status}</div>
              <div className="win-muted" style={{ marginTop:8 }}>{project.description ?? "No description."}</div>
            </div>

            <div className="win-card" style={{ flex:1, minWidth:360 }}>
              <div style={{ fontWeight:800, marginBottom:6 }}>Sources</div>
              <table className="win-table">
                <thead><tr><th>Kind</th><th>Value</th></tr></thead>
                <tbody>
                  {sources.map((s)=>(
                    <tr key={s.id}><td>{s.kind}</td><td style={{ fontFamily:"monospace", fontSize:12 }}>{s.value}</td></tr>
                  ))}
                  {sources.length===0 ? <tr><td colSpan={2} className="win-muted">No sources.</td></tr> : null}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ height: 12 }} />

          <div className="win-row">
            <div className="win-card" style={{ flex:1, minWidth:420 }}>
              <div style={{ fontWeight:800, marginBottom:6 }}>Witness Logs</div>
              <table className="win-table">
                <thead><tr><th>Window</th><th>Kind</th><th>Leaf</th></tr></thead>
                <tbody>
                  {memories.map((m)=>(
                    <tr key={m.id}>
                      <td>{new Date(m.windowStart*1000).toISOString()} → {new Date(m.windowEnd*1000).toISOString()}</td>
                      <td>{m.kind}</td>
                      <td style={{ fontFamily:"monospace", fontSize:12 }}>{m.leafHash ?? "-"}</td>
                    </tr>
                  ))}
                  {memories.length===0 ? <tr><td colSpan={3} className="win-muted">No memories yet. Worker generates witness logs hourly.</td></tr> : null}
                </tbody>
              </table>
            </div>

            <div className="win-card" style={{ flex:1, minWidth:420 }}>
              <div style={{ fontWeight:800, marginBottom:6 }}>Audit Batches</div>
              <table className="win-table">
                <thead><tr><th>Window</th><th>Root</th><th>Count</th></tr></thead>
                <tbody>
                  {batches.map((b)=>(
                    <tr key={b.id}>
                      <td>{new Date(b.windowStart*1000).toISOString()} → {new Date(b.windowEnd*1000).toISOString()}</td>
                      <td style={{ fontFamily:"monospace", fontSize:12 }}>{b.root}</td>
                      <td>{b.count}</td>
                    </tr>
                  ))}
                  {batches.length===0 ? <tr><td colSpan={3} className="win-muted">No audit batches yet. Worker builds Merkle batches hourly.</td></tr> : null}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Window>
  );
}
