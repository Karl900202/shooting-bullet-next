import { memo } from "react";

interface DistanceProps {
  value: number;
}

function Distance({ value }: DistanceProps) {
  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-10 pointer-events-none"
      style={{ top: "calc(50% - 50px)" }}
    >
      <h1 className="text-black text-xl font-bold drop-shadow-lg whitespace-nowrap">
        {value.toFixed(0)}m
      </h1>
    </div>
  );
}

export default memo(Distance);
