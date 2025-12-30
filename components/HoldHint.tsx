import { memo } from "react";
import Image from "next/image";

interface HoldHintProps {
  show: boolean;
}

function HoldHint({ show }: HoldHintProps) {
  if (!show) {
    return null;
  }

  return (
    <div
      className="fixed z-50 -translate-x-1/2 -translate-y-1/2 top-[75vh] pointer-events-none max-w-[140px] max-h-[140px] min-w-[100px] min-h-[100px]"
      style={{
        left: "calc(65% + min(120px, (100vw - 480px) / 2 + 120px))",
      }}
    >
      <Image
        src="/touch-screen.png"
        alt="touch-screen"
        width={150}
        height={150}
        className="w-full h-full object-contain"
        unoptimized
      />
    </div>
  );
}

export default memo(HoldHint);
