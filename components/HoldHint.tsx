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
      className="fixed z-10 -translate-x-1/2 -translate-y-1/2 top-[75vh] pointer-events-none"
      style={{
        left: "calc(50% + min(120px, (100vw - 480px) / 2 + 120px))",
      }}
    >
      <Image
        src="/click-please.png"
        alt="꾹 눌러주세요"
        width={100}
        height={100}
        className="w-[100px] h-[100px] min-w-[75px] min-h-[75px]"
        unoptimized
      />
    </div>
  );
}

export default memo(HoldHint);
