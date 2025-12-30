import { memo } from "react";
import Image from "next/image";
import { UI_CONSTANTS } from "@/app/page";

interface ShootingBulletProps {
  width: number;
  height: number;
  /** true일 때 시작 애니메이션 GIF 표시, 아니면 기본 PNG */
  isStartAnimation: boolean;
}

function ShootingBullet({
  width,
  height,
  isStartAnimation,
}: ShootingBulletProps) {
  const src = isStartAnimation ? "/start-bullet.gif" : "/hold-bullet.png";

  return (
    <div
      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
      style={{
        left: `${UI_CONSTANTS.CENTER_VW}vw`,
      }}
    >
      <Image src={src} alt="apple" width={width} height={height} priority />
    </div>
  );
}

export default memo(ShootingBullet);
