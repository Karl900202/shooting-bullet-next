import { memo } from "react";
import Image from "next/image";

interface CitizenProps {
  /** 시작 위치(픽셀 단위 거리) */
  locationX: number;
  height: number;
  width: number;
}

function Citizen({ locationX, height, width }: CitizenProps) {
  return (
    <div
      className="absolute top-[52vh] -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
      style={{
        // 화면 가로 중앙(50vw)을 기준으로 locationX만큼 오른쪽에 세로선 배치
        left: `calc(50vw + ${locationX}px)`,
        width: "150px",
        height: "150px",
      }}
    >
      <Image
        src={"/citizen.png"}
        alt="citizen"
        width={height}
        height={width}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        priority
      />
      {/* <Image
        className="absolute top-[36px] left-[42px]"
        src={"/explosion.png"}
        alt="explosion"
        width={42}
        height={42}
        priority
      /> */}
    </div>
  );
}

export default memo(Citizen);
