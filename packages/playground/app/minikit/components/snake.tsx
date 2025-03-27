"use client";

import React, {
  useEffect,
  useRef,
  useMemo,
  useState,
  DependencyList,
  useCallback,
  createContext,
  useContext,
} from "react";
import { useOpenUrl, useNotification } from "@coinbase/onchainkit/minikit";
import {
  Transaction,
  TransactionButton,
  TransactionToast,
  TransactionToastAction,
  TransactionToastIcon,
  TransactionToastLabel,
  TransactionError,
} from "@coinbase/onchainkit/transaction";
import {
  ConnectWallet,
  ConnectWalletText,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Name,
  Identity,
  EthBalance,
  Address,
  Avatar,
} from "@coinbase/onchainkit/identity";
import { useAccount } from "wagmi";
import { encodeAbiParameters, type Address as AddressType } from "viem";
import ArrowSvg from "../svg/ArrowSvg";
import SnakeLogo from "../svg/SnakeLogo";

const MAX_SCORES = 8;
const FPS = 60;
const MS_PER_FRAME = 1000 / FPS;
const COLORS = {
  blue: "#0052FF",
  white: "#FFFFFF",
  black: "#000000",
  random: () =>
    `#${Math.floor(Math.random() * 12582912)
      .toString(16)
      .padStart(6, "0")}`,
};
const NUM_TARGETS_PER_LEVEL = 10;
const EAS_GRAPHQL_URL = "https://base.easscan.org/graphql";

const GameState = {
  INTRO: 0,
  PAUSED: 1,
  RUNNING: 2,
  WON: 3,
  DEAD: 4,
  AWAITINGNEXTLEVEL: 5,
};

const MoveState = {
  NONE: 0,
  UP: 1,
  RIGHT: 2,
  DOWN: 3,
  LEFT: 4,
};

export type Score = {
  attestationUid: string;
  transactionHash: string;
  address: AddressType;
  score: number;
};

const LevelMaps: {
  [key: number]: { x1: number; y1: number; width: number; height: number }[];
} = {
  1: [
    { x1: 0, y1: 0, width: 10, height: 500 },
    { x1: 0, y1: 0, width: 500, height: 10 },
    { x1: 490, y1: 0, width: 10, height: 500 },
    { x1: 0, y1: 490, width: 500, height: 10 },
  ],
  2: [
    { x1: 0, y1: 0, width: 10, height: 500 },
    { x1: 0, y1: 0, width: 500, height: 10 },
    { x1: 490, y1: 0, width: 10, height: 500 },
    { x1: 0, y1: 490, width: 500, height: 10 },
    { x1: 250, y1: 0, width: 10, height: 200 },
    { x1: 250, y1: 300, width: 10, height: 200 },
  ],
  3: [
    { x1: 0, y1: 0, width: 10, height: 500 },
    { x1: 0, y1: 0, width: 500, height: 10 },
    { x1: 490, y1: 0, width: 10, height: 500 },
    { x1: 0, y1: 490, width: 500, height: 10 },
    { x1: 250, y1: 0, width: 10, height: 200 },
    { x1: 250, y1: 300, width: 10, height: 200 },
    { x1: 0, y1: 250, width: 200, height: 10 },
    { x1: 300, y1: 250, width: 200, height: 10 },
  ],
  4: [
    { x1: 0, y1: 0, width: 10, height: 500 },
    { x1: 0, y1: 0, width: 500, height: 10 },
    { x1: 490, y1: 0, width: 10, height: 500 },
    { x1: 0, y1: 490, width: 500, height: 10 },
    { x1: 100, y1: 0, width: 10, height: 200 },
    { x1: 200, y1: 0, width: 10, height: 200 },
    { x1: 300, y1: 0, width: 10, height: 200 },
    { x1: 400, y1: 0, width: 10, height: 200 },
    { x1: 100, y1: 300, width: 10, height: 200 },
    { x1: 200, y1: 300, width: 10, height: 200 },
    { x1: 300, y1: 300, width: 10, height: 200 },
    { x1: 400, y1: 300, width: 10, height: 200 },
  ],
};

const NumberOfMaps = Object.keys(LevelMaps).length;

const DIRECTION_MAP: Record<string, number> = {
  ArrowUp: MoveState.UP,
  ArrowRight: MoveState.RIGHT,
  ArrowDown: MoveState.DOWN,
  ArrowLeft: MoveState.LEFT,
};

type Attestation = {
  decodedDataJson: string;
  attester: string;
  time: string;
  id: string;
  txid: string;
};

async function fetchLastAttestations() {
  const query = `
    query GetAttestations {
      attestations(
        where: { schemaId: { equals: "${SCHEMA_UID}" } }
        orderBy: { time: desc }
        take: 8
      ) {
        decodedDataJson
        attester
        time
        id
        txid
      }
    }
  `;

  const response = await fetch(EAS_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  const { data } = await response.json();
  return (data?.attestations ?? [])
    .map((attestation: Attestation) => {
      const parsedData = JSON.parse(attestation?.decodedDataJson ?? "[]");
      const pattern = /(0x[a-fA-F0-9]{40}) scored (\d+) on minikit/;
      const match = parsedData[0].value?.value?.match(pattern);
      if (match) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, address, score] = match;
        return {
          score: parseInt(score),
          address,
          attestationUid: attestation.id,
          transactionHash: attestation.txid,
        };
      }
      return null;
    })
    .sort((a: Score, b: Score) => b.score - a.score);
}

function useKonami(gameState: number) {
  const CODE = [
    MoveState.UP,
    MoveState.UP,
    MoveState.DOWN,
    MoveState.DOWN,
    MoveState.LEFT,
    MoveState.RIGHT,
    MoveState.LEFT,
    MoveState.RIGHT,
  ];
  const [konami, setKonami] = useState(false);
  const [sequence, setSequence] = useState<number[]>([]);

  const updateSequence = (input: number) => {
    if (!konami && gameState === GameState.INTRO) {
      const newSequence = sequence.concat(input);
      if (newSequence.length > CODE.length) {
        newSequence.shift();
      }
      if (newSequence.join(",") === CODE.join(",")) {
        setKonami(true);
        console.log("Slow motion activated!");
      } else {
        setSequence(newSequence);
      }
    }
  };

  return { konami, updateSequence };
}

type HighScoresContextType = {
  highScores: Score[];
  checkIsHighScore: (currentScore: number) => boolean;
  invalidateHighScores: () => void;
  loadHighScores: () => Promise<void>;
};

const emptyHighScoresContext = {} as HighScoresContextType;
export const HighScoresContext = createContext<HighScoresContextType>(
  emptyHighScoresContext,
);
export function useHighScores() {
  const context = useContext(HighScoresContext);
  if (context === emptyHighScoresContext) {
    throw new Error(
      "useHighScores must be used within an HighScoresProvider component",
    );
  }
  return context;
}

function HighScoresProvider({ children }: { children: React.ReactNode }) {
  const [highScores, setHighScores] = useState<Score[]>([]);
  const [invalidate, setInvalidate] = useState(true);

  const loadHighScores = useCallback(async () => {
    if (invalidate) {
      setInvalidate(false);
      const scores = await fetchLastAttestations();
      setHighScores(scores ?? []);
    }
  }, [invalidate]);

  const invalidateHighScores = useCallback(() => {
    setInvalidate(true);
  }, []);

  const checkIsHighScore = useCallback(
    (currentScore: number) => {
      if (currentScore === 0) {
        return false;
      }

      // if less than MAX_SCORES scores or current score is higher than lowest score
      if (
        (highScores?.length ?? 0) < MAX_SCORES ||
        currentScore > (highScores?.[highScores.length - 1]?.score ?? 0)
      ) {
        return true;
      }
      return false;
    },
    [highScores],
  );

  const value = useMemo(
    () => ({
      highScores,
      invalidateHighScores,
      checkIsHighScore,
      loadHighScores,
    }),
    [highScores, invalidateHighScores, checkIsHighScore, loadHighScores],
  );

  return (
    <HighScoresContext.Provider value={value}>
      {children}
    </HighScoresContext.Provider>
  );
}

type ControlButtonProps = {
  className?: string;
  children?: React.ReactNode;
  onClick: () => void;
};

function ControlButton({ children, onClick, className }: ControlButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      type="button"
      className={`w-12 h-12 bg-[#0052FF] rounded-full cursor-pointer select-none
        transition-all duration-150 border-[1px] border-[#0052FF] ${className}
        ${
          isPressed
            ? "translate-y-1 [box-shadow:0_0px_0_0_#002299,0_0px_0_0_#0033cc33] border-b-[0px]"
            : "[box-shadow:0_5px_0_0_#002299,0_8px_0_0_#0033cc33]"
        }`}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      onPointerLeave={() => setIsPressed(false)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function WalletControl() {
  return (
    <Wallet className="[&>div:nth-child(2)]:!opacity-20 md:[&>div:nth-child(2)]:!opacity-100">
      <ConnectWallet className="w-12 h-12 bg-[#0052FF] rounded-full hover:bg-[#0052FF] focus:bg-[#0052FF] cursor-pointer select-none transition-all duration-150 border-[1px] border-[#0052FF] min-w-12 [box-shadow:0_5px_0_0_#002299,0_8px_0_0_#0033cc33]">
        <ConnectWalletText>{""}</ConnectWalletText>
      </ConnectWallet>
      <WalletDropdown>
        <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
          <Avatar />
          <Name />
          <Address />
          <EthBalance />
        </Identity>
        <WalletDropdownDisconnect />
      </WalletDropdown>
    </Wallet>
  );
}

type ControlButtonsProps = {
  gameState: number;
  handleMobileGameState: () => void;
};

function ControlButtons({
  gameState,
  handleMobileGameState,
}: ControlButtonsProps) {
  const { address } = useAccount();

  return (
    <>
      <div className="absolute left-8 top-16 w-24">
        <ControlButton className="block" onClick={handleMobileGameState} />
        <div className="ml-6 w-16 text-center -rotate-45 leading-[1.2]">
          {gameState === GameState.RUNNING ? "PAUSE" : "PLAY"}
        </div>
      </div>
      <div className="absolute right-0 top-4 w-24">
        <WalletControl />
        <div className="ml-4 w-20 text-center -rotate-45 leading-[1.2]">
          {address ? "LOGOUT" : "LOGIN"}
        </div>
      </div>
    </>
  );
}

type DPadProps = {
  onDirectionChange: (direction: number) => void;
};

function DPad({ onDirectionChange }: DPadProps) {
  return (
    <div className="flex">
      <div className="grid grid-cols-3">
        <div className="h-12 w-12" />
        <button
          className="h-12 w-12 bg-black rounded-t-lg hover:shadow-dpad-hover active:shadow-dpad-pressed active:translate-y-[1px] bg-dpad-gradient shadow-dpad"
          onClick={() => onDirectionChange(MoveState.UP)}
        />
        <div className="h-12 w-12" />
        <button
          className="h-12 w-12 bg-black rounded-t-lg hover:shadow-dpad-hover active:shadow-dpad-pressed active:translate-x-[1px] bg-dpad-gradient -rotate-90"
          onClick={() => onDirectionChange(MoveState.LEFT)}
        />
        <div className="h-12 w-12 bg-black" />
        <button
          className="h-12 w-12 bg-black rounded-t-lg hover:shadow-dpad-hover active:shadow-dpad-pressed active:translate-x-[-1px] bg-dpad-gradient shadow-dpad rotate-90"
          onClick={() => onDirectionChange(MoveState.RIGHT)}
        />
        <div className="h-12 w-12" />
        <button
          className="h-12 w-12 bg-black rounded-t-lg hover:shadow-dpad-hover active:shadow-dpad-pressed active:translate-y-[-1px] bg-dpad-gradient shadow-dpad rotate-180"
          onClick={() => onDirectionChange(MoveState.DOWN)}
        />
        <div className="h-12 w-12" />
      </div>
    </div>
  );
}

type StatsProps = {
  score: number;
  level: number;
  width?: number;
};

function Stats({ score, level, width = 390 }: StatsProps) {
  const { highScores } = useHighScores();
  const record = highScores?.[0]?.score ?? 0;
  return (
    <div className="grid grid-cols-2" style={{ width }}>
      {record > 0 && (
        <>
          <div className="text-lg mb-4 w-[200px]">RECORD</div>
          <div className="text-lg mb-4 text-right">{record}</div>
        </>
      )}
      <div className="text-lg mb-4 w-[200px]">LEVEL</div>
      <div className="text-lg mb-4 text-right">{level}</div>
      <div className="text-lg mb-4 w-[200px]">SCORE</div>
      <div className="text-lg mb-4 text-right">{score}</div>
    </div>
  );
}

type AwaitingNextLevelProps = {
  score: number;
  level: number;
};

function AwaitingNextLevel({ score, level }: AwaitingNextLevelProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 z-20 m-[10px] mb-[30px]">
      <h1 className="text-5xl mb-4">LEVEL COMPLETE!</h1>
      <Stats score={score} level={level} />
      <p className="absolute bottom-4 text-lg">
        Press play or space for the next level
      </p>
    </div>
  );
}

const SCHEMA_UID =
  "0xdc3cf7f28b4b5255ce732cbf99fe906a5bc13fbd764e2463ba6034b4e1881835";
const EAS_CONTRACT = "0x4200000000000000000000000000000000000021";
const easABI = [
  {
    name: "attest",
    type: "function" as const,
    stateMutability: "payable" as const,
    inputs: [
      {
        name: "request",
        type: "tuple",
        components: [
          { name: "schema", type: "bytes32" },
          {
            name: "data",
            type: "tuple",
            components: [
              { name: "recipient", type: "address" },
              { name: "expirationTime", type: "uint64" },
              { name: "revocable", type: "bool" },
              { name: "refUID", type: "bytes32" },
              { name: "data", type: "bytes" },
              { name: "value", type: "uint256" },
            ],
          },
        ],
      },
    ],
    outputs: [{ name: "", type: "bytes32" }],
  },
];

type DeadProps = {
  score: number;
  level: number;
  onGoToIntro: () => void;
  isWin: boolean;
};

export function Dead({ score, level, onGoToIntro, isWin }: DeadProps) {
  const { invalidateHighScores, checkIsHighScore } = useHighScores();
  const sendNotification = useNotification();
  const { address } = useAccount();
  const isHighScore = checkIsHighScore(score);

  const handleAttestationSuccess = useCallback(async () => {
    if (!address) {
      return null;
    }

    await sendNotification({
      title: "Congratulations!",
      body: `You scored a new high score of ${score} on minikit!`,
    });

    invalidateHighScores();
  }, [address, invalidateHighScores, score, sendNotification]);

  const transactionButton = useMemo(() => {
    if (!address) {
      return (
        <Wallet>
          <ConnectWallet>
            <ConnectWalletText>Login to save your high score</ConnectWalletText>
          </ConnectWallet>
        </Wallet>
      );
    }

    return (
      <Transaction
        calls={[
          {
            address: EAS_CONTRACT,
            abi: easABI,
            functionName: "attest",
            args: [
              {
                schema: SCHEMA_UID,
                data: {
                  recipient: address,
                  expirationTime: BigInt(0),
                  revocable: false,
                  refUID:
                    "0x0000000000000000000000000000000000000000000000000000000000000000",
                  data: encodeAbiParameters(
                    [{ type: "string" }],
                    [`${address} scored ${score} on minikit`],
                  ),
                  value: BigInt(0),
                },
              },
            ],
          },
        ]}
        onSuccess={handleAttestationSuccess}
        onError={(error: TransactionError) =>
          console.error("Attestation failed:", error)
        }
      >
        <TransactionButton
          text="Submit to save high score"
          className="mx-auto w-[60%]"
          successOverride={{
            text: "View High Scores",
            onClick: onGoToIntro,
          }}
        />
        <TransactionToast className="mb-4">
          <TransactionToastIcon />
          <TransactionToastLabel />
          <TransactionToastAction />
        </TransactionToast>
      </Transaction>
    );
  }, [address, handleAttestationSuccess, onGoToIntro, score]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 z-20 m-[10px] mb-[30px]">
      <h1 className="text-6xl mb-4">{isWin ? "YOU WON!" : "GAME OVER"}</h1>
      {isHighScore && <p className="text-2xl mb-4">You got a high score!</p>}
      <Stats score={score} level={level} width={250} />
      {isHighScore && address && (
        <fieldset className="border-2 border-gray-300 rounded-md mb-4">
          <legend className="text-sm">Attestation</legend>
          <div className="text-gray-800 px-2 py-1 italic">
            <Address className="text-inherit" address={address} /> scored{" "}
            {score} on minikit
          </div>
        </fieldset>
      )}

      {isHighScore && transactionButton}
      <p className="text-lg mb-4 absolute bottom-0">
        Press play or space to play again
      </p>
    </div>
  );
}

function HighScores() {
  const { highScores, loadHighScores } = useHighScores();
  const openUrl = useOpenUrl();

  useEffect(() => {
    loadHighScores();
  }, [loadHighScores]);

  const handleHighScoreClick = (score: Score) => {
    openUrl(`https://basescan.org/tx/${score.transactionHash}`);
  };

  return (
    <div className="flex flex-col items-center justify-center absolute top-32 w-[80%]">
      <h1 className="text-2xl mb-4">RECENT HIGH SCORES</h1>
      {highScores
        .sort((a, b) => b.score - a.score)
        .map((score, index) => (
          <button
            type="button"
            key={score.attestationUid}
            className="flex items-center w-full"
            onClick={() => handleHighScoreClick(score)}
          >
            <span className="text-black w-8">{index + 1}.</span>
            <div className="flex items-center flex-grow">
              <Identity
                className="!bg-inherit space-x-1 px-0 [&>div]:space-x-2"
                address={score.address}
              >
                <Name className="text-black" />
              </Identity>
              <div className="px-2">
                <ArrowSvg />
              </div>
            </div>
            <div className="text-black text-right flex-grow">{score.score}</div>
          </button>
        ))}
    </div>
  );
}

type IntroProps = {
  konami: boolean;
};

function Intro({ konami }: IntroProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center bg-white/70 z-20 m-[10px] mb-[30px] pb-6">
      <div className="absolute top-12">
        <SnakeLogo width={300} height={60} animate={konami} />
      </div>
      <HighScores />
      <div className="absolute bottom-4">Press play or space to start</div>
    </div>
  );
}

let msPrev = performance.now();
const useGameLoop = (callback: () => void, dependencies: DependencyList) => {
  useEffect(() => {
    let frameId: number;
    const loop = () => {
      const msNow = performance.now();
      const delta = msNow - msPrev;
      if (delta > MS_PER_FRAME) {
        callback();
        msPrev = msNow - (delta % MS_PER_FRAME);
      }
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, callback]);
};

type Segment = { x: number; y: number };

const Sammy = () => {
  const gameCanvasRef = useRef<HTMLCanvasElement>(null);
  const mapCanvasRef = useRef<HTMLCanvasElement>(null);
  const sammyCanvasRef = useRef<HTMLCanvasElement>(null);
  const scoreCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef(1); // track level with a ref to ensure it is updated correctly in dev mode

  const [gameState, setGameState] = useState(GameState.INTRO);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState({ points: 2000, total: 0 });
  const [sammy, setSammy] = useState<{
    x: number;
    y: number;
    length: number;
    direction: number;
    newDirection: number;
    segments: Segment[];
  }>({
    x: 50,
    y: 100,
    length: 10,
    direction: MoveState.DOWN,
    newDirection: MoveState.NONE,
    segments: [],
  });
  const [target, setTarget] = useState({
    exists: false,
    num: 0,
    x: 0,
    y: 0,
    color: COLORS.black,
  });
  const [scale, setScale] = useState<number | null>(null);
  const { konami, updateSequence } = useKonami(gameState);

  const getStartingScore = useCallback(
    (level: number, adjust = false) => {
      const startingScore = 2000 + (level - 1) * 500;
      if (adjust) {
        return konami ? startingScore + 1 : startingScore + 2;
      }
      return startingScore;
    },
    [konami],
  );

  const updateGameState = useCallback(() => {
    setGameState((prev) => {
      switch (prev) {
        case GameState.RUNNING:
          return GameState.PAUSED;
        case GameState.PAUSED:
        case GameState.INTRO:
          return GameState.RUNNING;
        case GameState.WON:
        case GameState.DEAD:
          setSammy({
            x: 50,
            y: 100,
            length: 10,
            direction: MoveState.DOWN,
            newDirection: MoveState.NONE,
            segments: [],
          });
          setScore({ points: getStartingScore(1), total: 0 });
          setTarget({ exists: false, num: 0, x: 0, y: 0, color: "" });
          setLevel(1);
          return GameState.RUNNING;
        case GameState.AWAITINGNEXTLEVEL:
          setSammy({
            x: 50,
            y: 100,
            length: 10,
            direction: MoveState.DOWN,
            newDirection: MoveState.NONE,
            segments: [],
          });
          setScore((prevScore) => ({
            ...prevScore,
            points: getStartingScore(levelRef.current + 1),
          }));
          setTarget({ exists: false, num: 0, x: 0, y: 0, color: "" });
          setLevel(levelRef.current + 1);
          return GameState.RUNNING;
        default:
          return prev;
      }
    });
  }, [getStartingScore, setGameState]);

  useEffect(() => {
    const handleResize = () => {
      setScale(
        Math.min(
          window.document.body.clientWidth / 520,
          window.document.body.clientHeight / 520,
          1,
        ),
      );
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    levelRef.current = level;
  }, [level]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const newDirection = DIRECTION_MAP[e.code];
      if (newDirection || e.code === "Space") {
        e.preventDefault();
        if (e.code === "Space") {
          updateGameState();
        } else {
          setSammy((prev) => ({
            ...prev,
            newDirection: newDirection || prev.newDirection,
          }));
          updateSequence(newDirection);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [konami, updateGameState, updateSequence]);

  const drawMap = useCallback(() => {
    const ctx = mapCanvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, 500, 520);
      ctx.fillStyle = COLORS.white;
      ctx.fillRect(0, 0, 500, 520);
      LevelMaps[level].forEach((wall) => {
        ctx.fillStyle = COLORS.blue;
        ctx.fillRect(wall.x1, wall.y1, wall.width, wall.height);
      });
    }
  }, [level]);

  useEffect(() => {
    if (mapCanvasRef.current) {
      drawMap();
    }
  }, [drawMap, level, scale]);

  const createTarget = useCallback(() => {
    if (!target.exists) {
      let isValidPosition = false;
      const newTarget = {
        x: 0,
        y: 0,
        exists: true,
        num: target.num + 1,
        color: COLORS.black,
      };

      while (!isValidPosition) {
        newTarget.x = Math.floor(Math.random() * 48) * 10 + 10;
        newTarget.y = Math.floor(Math.random() * 48) * 10 + 10;
        newTarget.color = COLORS.random();

        // check if target overlaps with any wall
        isValidPosition = !LevelMaps[level].some((wall) => {
          const targetLeft = newTarget.x;
          const targetRight = newTarget.x + 10;
          const targetTop = newTarget.y;
          const targetBottom = newTarget.y + 10;

          const wallLeft = wall.x1;
          const wallRight = wall.x1 + wall.width;
          const wallTop = wall.y1;
          const wallBottom = wall.y1 + wall.height;

          return !(
            targetLeft > wallRight ||
            targetRight < wallLeft ||
            targetTop > wallBottom ||
            targetBottom < wallTop
          );
        });
      }

      const ctx = sammyCanvasRef.current?.getContext("2d");
      if (ctx) {
        ctx.fillStyle = newTarget.color;
        ctx.fillRect(newTarget.x, newTarget.y, 10, 10);
      }

      setTarget(newTarget);
    }
  }, [level, setTarget, target]);

  const moveSammy = useCallback(() => {
    const newSammy = { ...sammy };

    if (newSammy.newDirection !== MoveState.NONE) {
      const isHorizontal =
        newSammy.newDirection === MoveState.LEFT ||
        newSammy.newDirection === MoveState.RIGHT;
      const isVertical =
        newSammy.newDirection === MoveState.UP ||
        newSammy.newDirection === MoveState.DOWN;

      // only change direction on a grid
      if (
        (isHorizontal && newSammy.y % 10 === 0) ||
        (isVertical && newSammy.x % 10 === 0)
      ) {
        newSammy.direction = newSammy.newDirection;
        newSammy.newDirection = MoveState.NONE;
      }
    }

    switch (newSammy.direction) {
      case MoveState.UP:
        newSammy.y--;
        break;
      case MoveState.RIGHT:
        newSammy.x++;
        break;
      case MoveState.DOWN:
        newSammy.y++;
        break;
      case MoveState.LEFT:
        newSammy.x--;
        break;
    }

    const newSegment = { x: newSammy.x, y: newSammy.y };
    newSammy.segments = [newSegment].concat(newSammy.segments);

    if (newSammy.segments.length > newSammy.length) {
      newSammy.segments.pop();
    }

    setSammy(newSammy);
  }, [sammy, setSammy]);

  const checkCollisions = useCallback(() => {
    // wall collisions
    const hitWall = LevelMaps[level].some((wall) => {
      const sammyLeft = sammy.x;
      const sammyRight = sammy.x + 10;
      const sammyTop = sammy.y;
      const sammyBottom = sammy.y + 10;

      // adjust padding to allow wall sliding
      const wallLeft = wall.x1 + 1;
      const wallRight = wall.x1 + wall.width - 2;
      const wallTop = wall.y1 + 1;
      const wallBottom = wall.y1 + wall.height - 2;

      return !(
        sammyLeft > wallRight ||
        sammyRight < wallLeft ||
        sammyTop > wallBottom ||
        sammyBottom < wallTop
      );
    });

    // self collision
    const hitSelf = sammy.segments
      .slice(1)
      .some((segment) => segment.x === sammy.x && segment.y === sammy.y);

    if (hitWall || hitSelf) {
      setGameState(GameState.DEAD);
    }

    // target collision
    if (target.exists && sammy.x === target.x && sammy.y === target.y) {
      if (target.num < NUM_TARGETS_PER_LEVEL) {
        setSammy((prev) => ({
          ...prev,
          length: prev.length + (10 * target.num * target.num) / 2,
        }));
        setScore((prev) => ({
          points: getStartingScore(levelRef.current),
          total: prev.total + prev.points,
        }));
        setTarget((prev) => ({ ...prev, exists: false }));
      } else {
        if (level === NumberOfMaps) {
          setGameState(GameState.WON);
        } else {
          setScore((prev) => ({
            points: getStartingScore(levelRef.current + 1, true),
            total: prev.total + prev.points,
          }));
          setGameState(GameState.AWAITINGNEXTLEVEL);
        }
      }
    }
  }, [
    level,
    sammy,
    setSammy,
    setGameState,
    setScore,
    getStartingScore,
    target,
  ]);

  const updateScore = useCallback(() => {
    const scoreCtx = scoreCanvasRef.current?.getContext("2d");
    if (scoreCtx) {
      scoreCtx.clearRect(0, 0, 500, 530);
      scoreCtx.font = "20px Pixelify Sans";
      scoreCtx.fillStyle = COLORS.black;
      scoreCtx.fillText(`Score: ${score.total}`, 10, 520);
      scoreCtx.fillText(`Points: ${score.points}`, 200, 520);
      scoreCtx.fillText(`Level: ${level}`, 400, 520);
    }
  }, [level, score]);

  const drawGame = useCallback(() => {
    if (gameState !== GameState.RUNNING) {
      return;
    }

    const ctx = sammyCanvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, 500, 520);

      // draw sammy
      ctx.fillStyle = COLORS.blue;
      sammy.segments.forEach((segment) => {
        ctx.fillRect(segment.x, segment.y, 10, 10);
      });

      // draw target if exists
      if (target.exists) {
        ctx.fillStyle = target.color;
        ctx.fillRect(target.x, target.y, 10, 10);
      }
    }

    // update score
    updateScore();
  }, [gameState, sammy, target, updateScore]);

  useGameLoop(() => {
    if (gameState === GameState.RUNNING) {
      moveSammy();
      checkCollisions();
      createTarget();
      drawGame();
      setScore((prev) => ({
        ...prev,
        points: Math.max(0, prev.points - (konami ? 1 : 2)),
      }));
    } else if (gameState === GameState.AWAITINGNEXTLEVEL) {
      updateScore();
    }
  }, [gameState, sammy, target, score]);

  const overlays = useMemo(() => {
    switch (gameState) {
      case GameState.INTRO:
      case GameState.PAUSED:
        return <Intro konami={konami} />;
      case GameState.WON:
      case GameState.DEAD:
        return (
          <Dead
            score={score.total}
            level={level}
            onGoToIntro={() => {
              updateGameState();
              setGameState(GameState.PAUSED);
            }}
            isWin={gameState === GameState.WON}
          />
        );
      case GameState.AWAITINGNEXTLEVEL:
        return <AwaitingNextLevel score={score.total} level={level} />;
      default:
        return null;
    }
  }, [gameState, konami, level, score.total, setGameState, updateGameState]);

  if (!scale) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="mt-1 mx-2">
      <div
        ref={containerRef}
        className="relative origin-top-left w-[500px] h-[520px]"
        style={{
          transform: `scale(${scale})`,
          marginBottom: `${-520 * (1 - scale)}px`,
        }}
      >
        <canvas
          ref={gameCanvasRef}
          id="gamestate"
          width={500}
          height={500}
          className="absolute top-0 left-0 z-4"
        />
        <canvas
          ref={mapCanvasRef}
          id="map"
          width={500}
          height={500}
          className="absolute top-0 left-0 z-3"
        />
        <canvas
          ref={sammyCanvasRef}
          id="sammy"
          width={500}
          height={500}
          className="absolute top-0 left-0 z-2"
        />
        <canvas
          ref={scoreCanvasRef}
          id="score"
          width={500}
          height={530}
          className="absolute top-0 left-0 z-1"
        />
        <HighScoresProvider>{overlays}</HighScoresProvider>
      </div>

      <div className="flex mt-6">
        <div className="flex flex-1 justify-center">
          <DPad
            onDirectionChange={(direction: number) => {
              setSammy((prev) => ({ ...prev, newDirection: direction }));
              updateSequence(direction);
            }}
          />
        </div>
        <div className="flex flex-1 relative">
          <ControlButtons
            gameState={gameState}
            handleMobileGameState={updateGameState}
          />
        </div>
      </div>
    </div>
  );
};

export default Sammy;
