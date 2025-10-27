import React from "react";

export default function Button({
  type,
  onClick,
  label,
  toggle,
  target,
  className,
}) {
  return (
    <button
      type="button"
      className={`btn btn-${type} ${className}`}
      onClick={onClick}
      data-bs-toggle={toggle}
      data-bs-target={target}
    >
      {label}
    </button>
  );
}
