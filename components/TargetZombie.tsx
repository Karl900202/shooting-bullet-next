import { memo } from "react";
import Image from "next/image";
import { GameState, UI_CONSTANTS } from "@/app/page";

interface TargetZombieProps {
  /** 시작 위치(픽셀 단위 거리) */
  locationX: number;
  gameState: GameState;
  height: number;
  width: number;
}

function TargetZombie({
  locationX,
  gameState,
  height,
  width,
}: TargetZombieProps) {
  const zombieState =
    gameState === "success" ? "/zombie-explosion.png" : "/target-zombie.png";

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none w-[150px] h-[150px]"
      style={{
        top: `${UI_CONSTANTS.TOP_POSITION_VH}vh`,
        // 화면 가로 중앙을 기준으로 locationX만큼 오른쪽에 세로선 배치
        left: `calc(${UI_CONSTANTS.CENTER_VW}vw + ${locationX}px)`,
      }}
    >
      <Image
        src={zombieState}
        alt="zombie-state"
        width={width}
        height={height}
        className={`w-full h-full object-contain `}
        priority
      />
    </div>
  );
}

export default memo(TargetZombie);
