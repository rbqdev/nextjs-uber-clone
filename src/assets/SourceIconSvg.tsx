import * as React from "react";

function SourceIconSvg() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      data-testid="pickup-icon"
      data-movable-handle="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11zm0-8a3 3 0 100-6 3 3 0 000 6z"
        fill="currentColor"
      />
    </svg>
  );
}

export default SourceIconSvg;
