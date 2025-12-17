"use client";
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import Modal from "@/components/Modal";
import FinishLine from "@/components/FinishLine";
import Shoot from "@/components/Shoot";
import Distance from "@/components/Distance";

const METRIC = {
  BG_WIDTH: 5000, // 가로로 5000px 진행
  GUN_WIDTH: 100,
  GUN_HEIGHT: 100,
};
const STATE_UPDATE_INTERVAL_MS = 33; // 약 30FPS로 화면 업데이트 (33ms = 1/30초)
const START_VALUE = 4000;
const DECAY_PER_SEC = 1000; // 초당 1000씩 감소
const SUCCESS_METERS = 40;
const AUTO_FAIL_METERS = -1;

type GameState = "ready" | "starting" | "playing" | "success" | "failed";

export default function AppleHoldGame() {
  const [gameState, setGameState] = useState<GameState>("ready");
  const valueRef = useRef(START_VALUE);
  const [displayValue, setDisplayValue] = useState(START_VALUE); // 화면 표시용
  const [isRunning, setIsRunning] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const rafRef = useRef<number | null>(null); //RAF ID 저장
  const lastTimeRef = useRef<number | null>(null); // 이전 프레임 시간 (delta 계산용)
  const lastDisplayUpdateTimeRef = useRef<number>(0); // 마지막 화면 업데이트 시간 (throttle용)

  const loopRef = useRef<(currentTime: number) => void>(() => {});

  // 뷰포트 크기 측정 (모바일 포함)
  useEffect(() => {
    const updateViewport = () => {
      setViewportHeight(window.innerHeight);
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    window.addEventListener("orientationchange", updateViewport);
    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
    };
  }, []);

  // 컴포넌트 언마운트 시 cancelAnimationFrame
  useEffect(() => {
    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  const stopLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const failGame = useCallback(() => {
    stopLoop();
    setIsRunning(false);
    setGameState("failed");
    setTimeout(() => setShowModal(true), 500);
  }, [stopLoop]);

  // 매 렌더링마다 최신 함수로 업데이트하여 스테일 클로저 문제 해결
  // delta 시간 기반으로 변경: FPS에 의존하지 않고 실제 경과 시간 기반으로 동작
  const loop = useCallback(
    (currentTime: number) => {
      // 첫 프레임이면 이전 시간을 현재 시간으로 설정
      if (lastTimeRef.current === null) {
        lastTimeRef.current = currentTime;
      }

      // delta 시간 계산 (밀리초를 초로 변환)
      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;
      // delta 시간 기반으로 감소량 계산
      const decay = DECAY_PER_SEC * deltaTime;
      const next = valueRef.current - decay;

      if (next <= AUTO_FAIL_METERS) {
        valueRef.current = AUTO_FAIL_METERS;
        setDisplayValue(AUTO_FAIL_METERS);
        failGame();
        return;
      }

      valueRef.current = next;

      // 화면 표시는 throttle 적용 (약 30FPS로 업데이트)
      const timeSinceLastUpdate =
        currentTime - lastDisplayUpdateTimeRef.current;
      if (timeSinceLastUpdate >= STATE_UPDATE_INTERVAL_MS) {
        setDisplayValue(next);
        lastDisplayUpdateTimeRef.current = currentTime;
      }

      // loopRef.current를 사용하여 항상 최신 함수를 호출
      rafRef.current = requestAnimationFrame(loopRef.current);
    },
    [failGame, setDisplayValue]
  );

  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  const resetGameState = useCallback(() => {
    setIsRunning(false);
    setShowModal(false);
    stopLoop();
  }, [stopLoop]);
  const handleGameStart = useCallback(() => {
    resetGameState();
    // 먼저 "starting" 상태로 전환하고 1초 뒤에 "playing"으로 바뀜
    setGameState("starting");
    valueRef.current = START_VALUE;
    setDisplayValue(START_VALUE);
  }, [resetGameState, setGameState, setDisplayValue]);

  // 화면 탭 시 루프를 멈추고 결과 판정
  const handleScreenTap = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (gameState !== "playing" || !isRunning) return;

    setIsRunning(false);
    stopLoop();

    const finalValue = valueRef.current;
    // displayValue는 throttle로 인해 최신 값이 아닐 수 있으므로 동기화
    setDisplayValue(finalValue);
    const newState: GameState =
      finalValue <= SUCCESS_METERS && finalValue >= 0 ? "success" : "failed";

    setGameState(newState);
    setTimeout(() => setShowModal(true), 500);
  };

  const handleRetry = useCallback(() => {
    resetGameState();
    setGameState("ready");
    valueRef.current = START_VALUE;
    setDisplayValue(START_VALUE);
  }, [resetGameState]);

  // gameState가 "starting"일 때 1초 뒤에 "playing"으로 전환하면서 루프 시작
  useEffect(() => {
    if (gameState !== "starting") return;

    const timer = window.setTimeout(() => {
      // "playing" 상태로 전환하고 루프 시작 (자동 진행)
      setGameState("playing");
      setIsRunning(true);
      lastTimeRef.current = null;
      lastDisplayUpdateTimeRef.current = 0;
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(loopRef.current);
      }
    }, 500);

    return () => window.clearTimeout(timer);
  }, [gameState]);

  // displayValue를 기반으로 백그라운드 X 오프셋 계산 (왼쪽 → 오른쪽 진행)
  const backgroundTranslateX = useMemo(
    () => -(START_VALUE - displayValue),
    [displayValue]
  );

  return (
    <>
      <div
        className="relative w-full no-select"
        style={{
          width: `${METRIC.BG_WIDTH}px`,
          height: viewportHeight ? `${viewportHeight}px` : "50vh",
          transform: `translateX(${backgroundTranslateX}px)`,
          willChange: "transform",
          overflow: "hidden",
          touchAction: "none",
          userSelect: "none",
        }}
        onContextMenu={(e) => e.preventDefault()}
        onPointerDown={handleScreenTap}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/background.png')",
            backgroundSize: "auto 100%",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "left center",
            pointerEvents: "none",
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: "url('/background.png')",
            backgroundSize: "auto 100%",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "left center",
            zIndex: 1,
          }}
        />

        {/* 도착선 (가로 진행 기준) */}
        <FinishLine startValue={START_VALUE} />
        {/* 사과 (배경 기준 위치 고정) */}
        <Shoot
          width={METRIC.GUN_WIDTH}
          height={METRIC.GUN_HEIGHT}
          // gameState가 "starting"일 때만 시작 GIF 표시
          isStartAnimation={gameState === "starting"}
        />
      </div>

      <Distance value={displayValue} />

      {/* 게임 시작 버튼 */}
      {gameState === "ready" && (
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 flex items-center justify-center z-30">
          <button
            onClick={handleGameStart}
            className="px-10 py-3 text-white rounded-full font-normal text-lg border-[3px] border-white shadow-md transition-colors"
            style={{
              backgroundColor: "#4F00FF",
            }}
          >
            게임 시작
          </button>
        </div>
      )}
      <Modal
        title={useMemo(
          () => (gameState === "success" ? "성공했습니다" : "실패했습니다!"),
          [gameState]
        )}
        description={useMemo(
          () =>
            gameState === "success"
              ? `저격성공: ${displayValue.toFixed(0)}m`
              : "저격에 실패했습니다.",
          [gameState, displayValue]
        )}
        onClick={handleRetry}
        show={showModal}
        buttonText="재시도"
      />
    </>
  );
}
