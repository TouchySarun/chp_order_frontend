import React from "react";

function Loading() {
  return (
    <p className="flex items-center gap-4 w-full justify-center text-sky-500">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
      </span>
      Loading
    </p>
  );
}

export default Loading;
