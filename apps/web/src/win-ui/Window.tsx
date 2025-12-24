import React from "react";
export function Window(props: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="win-window">
      <div className="win-titlebar">
        <div>{props.title}</div>
        <div>{props.right}</div>
      </div>
      <div className="win-body">{props.children}</div>
    </div>
  );
}
