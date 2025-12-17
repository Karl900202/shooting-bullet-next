import { memo } from "react";
import Image from "next/image";

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
    <div className="absolute left-[45vw] top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
      <Image src={src} alt="apple" width={width} height={height} priority />
    </div>
  );
}

export default memo(ShootingBullet);
