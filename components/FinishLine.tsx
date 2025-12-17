import { memo } from "react";

interface FinishLineProps {
  /** 시작 위치(픽셀 단위 거리) */
  startValue: number;
}

function FinishLine({ startValue }: FinishLineProps) {
  return (
    <div
      className="absolute top-0 h-full w-[2px] bg-blue-500 z-20"
      style={{
        // 화면 가로 중앙(50vw)을 기준으로 startValue만큼 오른쪽에 세로선 배치
        left: `calc(50vw + ${startValue}px)`,
      }}
    />
  );
}

export default memo(FinishLine);
