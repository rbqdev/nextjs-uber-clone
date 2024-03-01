import * as React from "react";

function DestinationIconSvg() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      data-testid="drop-icon"
      data-movable-handle="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 2H2v20h20V2zm-7 7H9v6h6V9z"
        fill="currentColor"
      />
    </svg>
  );
}

export default DestinationIconSvg;
