'use client';

import React, { useEffect, useRef, useMemo, useState, DependencyList, useCallback } from 'react';
import { useOpenUrl, useNotification } from "@coinbase/onchainkit";
import { Transaction, TransactionButton, TransactionResponse, TransactionToast, TransactionToastAction, TransactionToastIcon, TransactionToastLabel, TransactionError } from "@coinbase/onchainkit/transaction";
import { ConnectWallet, ConnectWalletText } from "@coinbase/onchainkit/wallet";
import { Name, Identity } from "@coinbase/onchainkit/identity";
import { getTopScores, addScore, MAX_SCORES } from "@/lib/scores-client";
import { Score } from "@/lib/scores";
import { useAccount } from "wagmi";
import { encodeAbiParameters } from "viem";
import ArrowSvg from "../svg/ArrowSvg";
import MiniKitLogo from '../svg/MiniKitLogo';

const NUM_TARGETS_PER_LEVEL = 10;

const GameState = {
  INTRO: 0,
  PAUSED: 1,
  RUNNING: 2,
  WON: 3,
  DEAD: 4,
  AWAITINGNEXTLEVEL: 5
};

const MoveState = {
  NONE: 0,
  UP: 1,
  RIGHT: 2,
  DOWN: 3,
  LEFT: 4
};

const LevelMaps: { [key: number]: { x1: number, y1: number, width: number, height: number }[] } = {
  1: [
    { x1: 0, y1: 0, width: 10, height: 500 },
    { x1: 0, y1: 0, width: 500, height: 10 },
    { x1: 490, y1: 0, width: 10, height: 500 },
    { x1: 0, y1: 490, width: 500, height: 10 }
  ],
  2: [
    { x1: 0, y1: 0, width: 10, height: 500 },
    { x1: 0, y1: 0, width: 500, height: 10 },
    { x1: 490, y1: 0, width: 10, height: 500 },
    { x1: 0, y1: 490, width: 500, height: 10 },
    { x1: 250, y1: 0, width: 10, height: 200 },
    { x1: 250, y1: 300, width: 10, height: 200 }
  ],
  3: [
    { x1: 0, y1: 0, width: 10, height: 500 },
    { x1: 0, y1: 0, width: 500, height: 10 },
    { x1: 490, y1: 0, width: 10, height: 500 },
    { x1: 0, y1: 490, width: 500, height: 10 },
    { x1: 250, y1: 0, width: 10, height: 200 },
    { x1: 250, y1: 300, width: 10, height: 200 },
    { x1: 0, y1: 250, width: 200, height: 10 },
    { x1: 300, y1: 250, width: 200, height: 10 }
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
    { x1: 400, y1: 300, width: 10, height: 200 }
  ],
};

const NumberOfMaps = Object.keys(LevelMaps).length;

type DPadProps = {
  gameState: number;
  onDirectionChange: (direction: number) => void;
  handleMobileGameState: () => void;
};

const DPad = ({ gameState, onDirectionChange, handleMobileGameState }: DPadProps) => {
  return (
    <div className="flex">
      <div className="grid grid-cols-3 gap-1">
        <div className="h-12 w-12" />
        <button 
          className="h-12 w-12 bg-black/20 rounded-t-lg hover:bg-black/30 active:bg-black/40"
          onClick={() => onDirectionChange(MoveState.UP)}
        />
        <div className="h-12 w-12" />
        <button 
          className="h-12 w-12 bg-black/20 rounded-l-lg hover:bg-black/30 active:bg-black/40"
          onClick={() => onDirectionChange(MoveState.LEFT)}
        />
        <button 
          className="h-12 w-12 bg-black/20 hover:bg-black/30 active:bg-black/40"
          onClick={handleMobileGameState}
        >
          {gameState === GameState.RUNNING ? '⏸️' : '▶️'}
        </button>
        <button 
          className="h-12 w-12 bg-black/20 rounded-r-lg hover:bg-black/30 active:bg-black/40"
          onClick={() => onDirectionChange(MoveState.RIGHT)}
        />
        <div className="h-12 w-12" />
        <button 
          className="h-12 w-12 bg-black/20 rounded-b-lg hover:bg-black/30 active:bg-black/40"
          onClick={() => onDirectionChange(MoveState.DOWN)}
        />
        <div className="h-12 w-12" />
      </div>
    </div>
  );
};

type AwaitingNextLevelProps = {
  score: number;
  level: number;
};

function AwaitingNextLevel({score, level}: AwaitingNextLevelProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-20">
      <h1 className="text-2xl mb-4">Level Complete!</h1>
      <p className="text-lg mb-4">Score: {score}</p>
      <p className="text-lg mb-4">Level: {level}</p>
    </div>
  )
}


const SCHEMA_UID = "0xf58b8b212ef75ee8cd7e8d803c37c03e0519890502d5e99ee2412aae1456cafe";
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
          { name: "data", type: "tuple", 
            components: [
              { name: "recipient", type: "address" },
              { name: "expirationTime", type: "uint64" },
              { name: "revocable", type: "bool" },
              { name: "refUID", type: "bytes32" },
              { name: "data", type: "bytes" },
              { name: "value", type: "uint256" }
            ]
          }
        ]
      }
    ],
    outputs: [{ name: "", type: "bytes32" }]
  }
];

const checkIsHighScore = async (currentScore: number) => {
  const scores = await getTopScores();

  // if less than MAX_SCORES scores or current score is higher than lowest score
  if ((scores?.length ?? 0) < MAX_SCORES || currentScore > (scores?.[scores.length - 1]?.score ?? 0)) {
    return true;
  }
  return false;
};

type DeadProps = {
  score: number;
  level: number;
  onGoToIntro: () => void;
  isWin: boolean;
};

export function Dead({score, level, onGoToIntro, isWin}: DeadProps) {
  const sendNotification = useNotification();

  const [isHighScore, setIsHighScore] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    const checkHighScore = async () => {
      const isHighScore = await checkIsHighScore(score);
      setIsHighScore(isHighScore);
    }
    checkHighScore();
  }, [score]);

  const handleAttestationSuccess = async (response: TransactionResponse) => {
    if (!address) {
      return null;
    }

    await addScore({
      address,
      score,
      attestationUid: response.transactionReceipts[0].logs[0].data,
      transactionHash: response.transactionReceipts[0].transactionHash
    });

    await sendNotification({
      title: 'Congratulations!',
      body: `You scored a new high score of ${score} on minikit!`,
    })
  }

  const transactionButton = useMemo(() => {
    if (!address) {
      return (
        <ConnectWallet>
          <ConnectWalletText>Connect Wallet to save your high score</ConnectWalletText>
        </ConnectWallet>
      )
    }

    return (
      <Transaction
        calls={[{
          address: EAS_CONTRACT,
          abi: easABI,
          functionName: 'attest',
          args: [{
            schema: SCHEMA_UID,
            data: {
              recipient: '0x0000000000000000000000000000000000000000',
              expirationTime: 0,
              revocable: false,
              refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
              data: encodeAbiParameters(
                [{ type: 'string' }],
                [`${address} scored ${score} on minikit`]
              ),
              value: 0
            }
          }]
        }]}
        onSuccess={handleAttestationSuccess}
        onError={(error: TransactionError) => console.error("Attestation failed:", error)}
      >
        <TransactionButton 
          text="Sign Attestation to Save your High Score" 
          className="mx-auto w-[60%]"
          successOverride={{
            text: "View High Scores",
            onClick: onGoToIntro
          }}
        />
        <TransactionToast>
          <TransactionToastIcon />
          <TransactionToastLabel />
          <TransactionToastAction />
        </TransactionToast>
      </Transaction>      
    )
  }, [onGoToIntro, address, score]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-20">
      {isWin ? (
        <h1 className="text-2xl mb-4">You Won!</h1>
      ) : (
        <h1 className="text-2xl mb-4">Game Over</h1>
      )}
      <p className="text-lg mb-4">Level: {level}</p>
      <p className="text-lg mb-4">Score: {score}</p>
      <p className="text-lg mb-4">Play again?</p>
      {isHighScore && (
        <>
          <p className="text-lg mb-4">High Score!</p>
          {transactionButton}
        </>
      )}
    </div>
  )
}

function HighScores() {
  const [highScores, setHighScores] = useState<Score[]>([]);
  const openUrl = useOpenUrl();

  useEffect(() => {
    const fetchScores = async () => {
      const scores = await getTopScores();
      setHighScores(scores ?? []);
    }
    fetchScores();
  }, []);
 
  const handleHighScoreClick = (score: Score) => {
    openUrl(`https://basescan.org/tx/${score.transactionHash}`);
  }

  return (
    <div className="flex flex-col items-center justify-center absolute top-48 w-[80%]">
      <h1 className="text-2xl mb-4">High Scores</h1>
      {highScores.sort((a, b) => b.score - a.score).map((score, index) => (
        <button type="button" key={score.attestationUid} className="flex items-center w-full" onClick={() => handleHighScoreClick(score)}>
          <span className="text-black w-8">{index + 1}.</span>
          <div className="flex items-center flex-grow">
            <Identity
              className="!bg-inherit space-x-1 px-0 [&>div]:space-x-2"
              address={score.address}
            >
              <Name className="text-black"/>
            </Identity>
            <div className="px-2">
              <ArrowSvg />
            </div>
          </div>
          <div className="text-black text-right flex-grow">{score.score}</div>
        </button>
      ))}
    </div>
  )
}

function Intro() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-20 pb-6">
      <MiniKitLogo width="100%" height="100%" />
      <HighScores />
    </div>
  )
}

function Paused() {
  return (
    <div className="flex flex-col items-center justify-center bg-white/80 z-20">
      <h1 className="text-2xl mb-4 pt-20">Paused</h1>
      <HighScores />
    </div>
  )
}

const useGameLoop = (callback: () => void, dependencies: DependencyList) => {
  useEffect(() => {
    let frameId: number;
    const loop = () => {
      callback();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, dependencies);
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
    segments: []
  });
  const [target, setTarget] = useState({
    exists: false,
    num: 0,
    x: 0,
    y: 0,
    color: '#000000'
  });
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setScale(Math.min(window.document.body.clientWidth / 520, window.document.body.clientHeight / 520, 1));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    levelRef.current = level;
  }, [level]);

  const drawMap = useCallback(() => {
    const ctx = mapCanvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 500, 520);
      LevelMaps[level].forEach(wall => {
        ctx.fillStyle = '#000000';
        ctx.fillRect(wall.x1, wall.y1, wall.width, wall.height);
      });
    }
  }, [level]);

  useEffect(() => {
    if (mapCanvasRef.current) {
      drawMap();
    }
  }, [drawMap, level, scale])

  const createTarget = () => {
    if (!target.exists) {
      let isValidPosition = false;
      const newTarget = {
        x: 0,
        y: 0,
        exists: true,
        num: target.num + 1,
        color: '#000000'
      };

      while (!isValidPosition) {
        newTarget.x = Math.floor(Math.random() * 48) * 10 + 10;
        newTarget.y = Math.floor(Math.random() * 48) * 10 + 10;
        newTarget.color = `#${Math.floor(Math.random() * 12582912).toString(16).padStart(6, '0')}`;

        // check if target overlaps with any wall
        isValidPosition = !LevelMaps[level].some(wall => {
          const targetLeft = newTarget.x;
          const targetRight = newTarget.x + 10;
          const targetTop = newTarget.y;
          const targetBottom = newTarget.y + 10;
          
          const wallLeft = wall.x1;
          const wallRight = wall.x1 + wall.width;
          const wallTop = wall.y1;
          const wallBottom = wall.y1 + wall.height;

          return !(targetLeft > wallRight || 
                  targetRight < wallLeft || 
                  targetTop > wallBottom || 
                  targetBottom < wallTop);
        });
      }
      
      const ctx = sammyCanvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.fillStyle = newTarget.color;
        ctx.fillRect(newTarget.x, newTarget.y, 10, 10);
      }
      
      setTarget(newTarget);
    }
  };

  const moveSammy = () => {
    const newSammy = { ...sammy };
    
    if (newSammy.newDirection !== MoveState.NONE) {
      const isHorizontal = newSammy.newDirection === MoveState.LEFT || newSammy.newDirection === MoveState.RIGHT;
      const isVertical = newSammy.newDirection === MoveState.UP || newSammy.newDirection === MoveState.DOWN;
      
      // only change direction on a grid
      if ((isHorizontal && newSammy.y % 10 === 0) || (isVertical && newSammy.x % 10 === 0)) {
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
  };

  const checkCollisions = () => {
    // wall collisions
    const hitWall = LevelMaps[level].some(wall => {
      const sammyLeft = sammy.x;
      const sammyRight = sammy.x + 10;
      const sammyTop = sammy.y;
      const sammyBottom = sammy.y + 10;
      
      // adjust padding to allow wall sliding
      const wallLeft = wall.x1 + 1;
      const wallRight = wall.x1 + wall.width - 2;
      const wallTop = wall.y1 + 1;
      const wallBottom = wall.y1 + wall.height - 2;

      return !(sammyLeft > wallRight || 
              sammyRight < wallLeft || 
              sammyTop > wallBottom || 
              sammyBottom < wallTop);
    });

    // self collision
    const hitSelf = sammy.segments.slice(1).some(segment => 
      segment.x === sammy.x && segment.y === sammy.y
    );

    if (hitWall || hitSelf) {
      setGameState(GameState.DEAD);
    }

    // target collision
    if (target.exists && sammy.x === target.x && sammy.y === target.y) {
      if (target.num < NUM_TARGETS_PER_LEVEL) {
        setSammy(prev => ({
          ...prev,
          length: prev.length + 10 * target.num * target.num / 2
        }));
        setScore(prev => ({
          points: 2000,
          total: prev.total + prev.points
        }));
        setTarget(prev => ({ ...prev, exists: false }));
      } else {
        if (level === NumberOfMaps) {
          setGameState(GameState.WON);
        } else {
          setGameState(GameState.AWAITINGNEXTLEVEL);
        }
      }
    }
  };

  const drawGame = () => {
    if (gameState !== GameState.RUNNING) {
      return;
    }

    const ctx = sammyCanvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 500, 520);
    
      // draw sammy
      ctx.fillStyle = '#000000';
      sammy.segments.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, 10, 10);
      });

      // draw target if exists
      if (target.exists) {
        ctx.fillStyle = target.color;
        ctx.fillRect(target.x, target.y, 10, 10);
      }
    }

    // update score
    const scoreCtx = scoreCanvasRef.current?.getContext('2d');
    if (scoreCtx) {
      scoreCtx.clearRect(0, 0, 500, 530);
      scoreCtx.font = '20px Arial';
      scoreCtx.fillStyle = '#000000';
      scoreCtx.fillText(`Score: ${score.total}`, 10, 520);
      scoreCtx.fillText(`Points: ${score.points}`, 200, 520);
      scoreCtx.fillText(`Level: ${level}`, 400, 520);
    }
  };

  useGameLoop(() => {
    if (gameState === GameState.RUNNING) {
      moveSammy();
      checkCollisions();
      createTarget();
      drawGame();
      setScore(prev => ({
        ...prev,
        points: Math.max(0, prev.points - 2)
      }));
    }
  }, [gameState, sammy, target, score]);

  const updateGameState = () => {
    setGameState(prev => {
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
            segments: []
          });
          setScore({ points: 2000, total: 0 });
          setTarget({ exists: false, num: 0, x: 0, y: 0, color: '' });
          setLevel(1);
          return GameState.RUNNING;
        case GameState.AWAITINGNEXTLEVEL:
          setSammy({
            x: 50,
            y: 100,
            length: 10,
            direction: MoveState.DOWN,
            newDirection: MoveState.NONE,
            segments: []
          });
          setScore(prevScore => ({ ...prevScore, points: 2000 }));
          setTarget({ exists: false, num: 0, x: 0, y: 0, color: '' });
          setLevel(levelRef.current + 1);
          return GameState.RUNNING;
        default:
          return prev;
      }
    });
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.code === 'Space') {
        updateGameState();
      } else {
        setSammy(prev => ({
          ...prev,
          newDirection: {
            'ArrowUp': MoveState.UP,
            'ArrowRight': MoveState.RIGHT,
            'ArrowDown': MoveState.DOWN,
            'ArrowLeft': MoveState.LEFT,
            'KeyW': MoveState.UP,
            'KeyD': MoveState.RIGHT,
            'KeyS': MoveState.DOWN,
            'KeyA': MoveState.LEFT
          }[e.code] || prev.newDirection
        }));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const overlays = useMemo(() => {
    switch (gameState) {
      case GameState.INTRO:
        return <Intro />
      case GameState.PAUSED:
        return <Paused />
      case GameState.WON:
      case GameState.DEAD:
        return <Dead 
          score={score.total} 
          level={level} 
          onGoToIntro={() => setGameState(GameState.INTRO)} 
          isWin={gameState === GameState.WON} 
        />
      case GameState.AWAITINGNEXTLEVEL:
        return <AwaitingNextLevel 
          score={score.total} 
          level={level} 
        />
      default:
        return null;
    }
  }, [gameState, score.total, level, setGameState, Intro, Paused, Dead, AwaitingNextLevel]);

  if (!scale) {
    return null;
  }

  return (
    <div className="max-w-[500px]">
      <div 
        ref={containerRef}
        className="relative origin-top-left w-[500px] h-[520px]"
        style={{
          transform: `scale(${scale})`,
          marginBottom: `${-520 * (1 - scale)}px`
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
        {overlays}
      </div>

      <div className="flex justify-center mt-4">
        <DPad 
          gameState={gameState} 
          onDirectionChange={(direction: number) => {
            setSammy(prev => ({ ...prev, newDirection: direction }));
          }} 
          handleMobileGameState={updateGameState} 
        />
      </div>

      <div className="justify-center mt-4 hidden md:block text-center">
        <p className="text-sm">Control with the D-Pad or space and arrow keys</p>
      </div>
    </div>
  );
};


export default Sammy; 