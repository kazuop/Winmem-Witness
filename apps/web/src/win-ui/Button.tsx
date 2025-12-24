import React from "react";
export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`win-btn ${props.className ?? ""}`.trim()} />;
}
