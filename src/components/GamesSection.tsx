import React, { useState, useEffect, useRef, useCallback } from 'react';
import contentData from '../data/contentData.json';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  Play, 
  Gift, 
  Copy, 
  Check, 
  Gamepad2, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Printer,
  Clock
} from 'lucide-react';

declare global {
  interface Window {
    onFlappyVoucherWin?: (data: { score: number; voucherCode: string; reward: string; timestamp: string }) => void;
    onFlappyVoucherLose?: (data: { score: number; timestamp: string }) => void;
  }
}

export const GamesSection: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<'flappy' | 'snake'>('flappy');
  const [copiedCode, setCopiedCode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Stored vouchers from localStorage
  const [lastFlappyVoucher, setLastFlappyVoucher] = useState<string | null>(null);
  const [flappyHighScore, setFlappyHighScore] = useState<number>(0);
  const [snakeHighScore, setSnakeHighScore] = useState<number>(0);

  useEffect(() => {
    const savedVoucher = localStorage.getItem('vb_last_flappy_voucher');
    const savedFlappyHigh = localStorage.getItem('vb_flappy_high_score');
    const savedSnakeHigh = localStorage.getItem('vb_snake_high_score');
    if (savedVoucher) setLastFlappyVoucher(savedVoucher);
    if (savedFlappyHigh) setFlappyHighScore(parseInt(savedFlappyHigh, 10));
    if (savedSnakeHigh) setSnakeHighScore(parseInt(savedSnakeHigh, 10));
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00529C', '#ED1C24', '#0099DA', '#F59E0B']
      });
    } catch {
      // Ignore if confetti not supported
    }
  };

  /* =========================================================================
   * GAME 1: FLAPPY BIRD ("Chờ vui – Chơi hay – Nhận quà liền tay")
   * ========================================================================= */
  const flappyCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [flappyState, setFlappyState] = useState<'start' | 'playing' | 'win' | 'lost'>('start');
  const [flappyScore, setFlappyScore] = useState(0);
  const [flappyVoucher, setFlappyVoucher] = useState<string | null>(null);

  // Configuration constants
  const WIN_SCORE = 20;
  const GRAVITY = 0.32;
  const JUMP_FORCE = -5.8;
  const PIPE_SPEED = 2.2;
  const PIPE_GAP = 145; // generous gap for normal bank customers
  const PIPE_INTERVAL = 110;
  const VOUCHER_TEXT = "Voucher 2 lít xăng";

  const flappyGameRef = useRef<{
    birdY: number;
    birdVelocity: number;
    pipes: Array<{ x: number; topH: number; bottomY: number; passed: boolean }>;
    frame: number;
    animationId: number | null;
  }>({
    birdY: 150,
    birdVelocity: 0,
    pipes: [],
    frame: 0,
    animationId: null
  });

  const getFlappyMotivation = (score: number) => {
    if (score < 5) return "Khởi động nhẹ nhàng!";
    if (score < 10) return "Tốt lắm, tiếp tục nào!";
    if (score < 15) return "Một nửa chặng đường rồi!";
    if (score < 20) return "Sắp nhận quà rồi!";
    return "Xuất sắc!";
  };

  const generateVoucherCode = (): string => {
    const num = Math.floor(100000 + Math.random() * 900000);
    return `VB-${num}`;
  };

  const copyVoucher = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const winFlappy = useCallback((scoreVal: number) => {
    const code = generateVoucherCode();
    setFlappyVoucher(code);
    setFlappyState('win');
    localStorage.setItem('vb_last_flappy_voucher', code);
    setLastFlappyVoucher(code);
    if (scoreVal > flappyHighScore) {
      setFlappyHighScore(scoreVal);
      localStorage.setItem('vb_flappy_high_score', scoreVal.toString());
    }
    triggerConfetti();

    if (typeof window.onFlappyVoucherWin === 'function') {
      window.onFlappyVoucherWin({
        score: scoreVal,
        voucherCode: code,
        reward: VOUCHER_TEXT,
        timestamp: new Date().toISOString()
      });
    }
  }, [flappyHighScore]);

  const loseFlappy = useCallback((scoreVal: number) => {
    setFlappyState('lost');
    if (scoreVal > flappyHighScore) {
      setFlappyHighScore(scoreVal);
      localStorage.setItem('vb_flappy_high_score', scoreVal.toString());
    }

    if (typeof window.onFlappyVoucherLose === 'function') {
      window.onFlappyVoucherLose({
        score: scoreVal,
        timestamp: new Date().toISOString()
      });
    }
  }, [flappyHighScore]);

  const flappyJump = useCallback(() => {
    if (flappyState === 'start') {
      setFlappyState('playing');
      flappyGameRef.current.birdVelocity = JUMP_FORCE;
    } else if (flappyState === 'playing') {
      flappyGameRef.current.birdVelocity = JUMP_FORCE;
    }
  }, [flappyState]);

  // Keyboard control for Flappy
  useEffect(() => {
    if (selectedGame !== 'flappy') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        flappyJump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flappyJump, selectedGame]);

  // Main Flappy Loop
  useEffect(() => {
    if (selectedGame !== 'flappy') return;
    const canvas = flappyCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (flappyState !== 'playing') {
      if (flappyGameRef.current.animationId) {
        cancelAnimationFrame(flappyGameRef.current.animationId);
      }
      return;
    }

    let currentScore = 0;

    const loop = () => {
      const g = flappyGameRef.current;
      g.frame++;

      // Update Bird Physics
      g.birdVelocity += GRAVITY;
      g.birdY += g.birdVelocity;

      // Spawn pipes
      if (g.frame % PIPE_INTERVAL === 0) {
        const minTop = 40;
        const maxTop = canvas.height - PIPE_GAP - 60;
        const topH = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;
        g.pipes.push({
          x: canvas.width,
          topH,
          bottomY: topH + PIPE_GAP,
          passed: false
        });
      }

      // Move pipes
      for (let i = g.pipes.length - 1; i >= 0; i--) {
        const p = g.pipes[i];
        p.x -= PIPE_SPEED;

        // Check score
        const birdX = 65;
        if (!p.passed && p.x + 48 < birdX) {
          p.passed = true;
          currentScore++;
          setFlappyScore(currentScore);

          if (currentScore >= WIN_SCORE) {
            winFlappy(WIN_SCORE);
            return;
          }
        }

        // Remove offscreen pipes
        if (p.x < -60) {
          g.pipes.splice(i, 1);
        }
      }

      // Check collision
      const birdRadius = 14;
      const birdX = 65;
      const birdY = g.birdY;

      // Ground / Ceiling collision
      if (birdY - birdRadius <= 0 || birdY + birdRadius >= canvas.height - 20) {
        loseFlappy(currentScore);
        return;
      }

      // Pipe collisions
      for (const p of g.pipes) {
        if (
          birdX + birdRadius > p.x &&
          birdX - birdRadius < p.x + 48
        ) {
          if (birdY - birdRadius < p.topH || birdY + birdRadius > p.bottomY) {
            loseFlappy(currentScore);
            return;
          }
        }
      }

      // Render Frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sky background gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#E0F2FE');
      skyGrad.addColorStop(1, '#F8FAFC');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Distant clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(80 + (g.frame * 0.2) % 450, 60, 24, 0, Math.PI * 2);
      ctx.arc(105 + (g.frame * 0.2) % 450, 55, 28, 0, Math.PI * 2);
      ctx.arc(135 + (g.frame * 0.2) % 450, 60, 22, 0, Math.PI * 2);
      ctx.fill();

      // Render Pipes (VietinBank themed blue/cyan pillars)
      for (const p of g.pipes) {
        // Top pipe
        const pipeGrad = ctx.createLinearGradient(p.x, 0, p.x + 48, 0);
        pipeGrad.addColorStop(0, '#00529C');
        pipeGrad.addColorStop(0.7, '#0099DA');
        pipeGrad.addColorStop(1, '#003B70');

        ctx.fillStyle = pipeGrad;
        ctx.fillRect(p.x, 0, 48, p.topH);
        // Top pipe lip
        ctx.fillStyle = '#003B70';
        ctx.fillRect(p.x - 3, p.topH - 12, 54, 12);

        // Bottom pipe
        ctx.fillStyle = pipeGrad;
        ctx.fillRect(p.x, p.bottomY, 48, canvas.height - p.bottomY - 20);
        // Bottom pipe lip
        ctx.fillStyle = '#003B70';
        ctx.fillRect(p.x - 3, p.bottomY, 54, 12);
      }

      // Ground strip
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(0, canvas.height - 20, canvas.width, 3);

      // Render Mascot: Flying VietinBank Credit Card
      ctx.save();
      ctx.translate(birdX, birdY);
      const angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, g.birdVelocity * 0.08));
      ctx.rotate(angle);

      // Card body
      ctx.fillStyle = '#00529C';
      ctx.beginPath();
      ctx.roundRect(-20, -13, 40, 26, 4);
      ctx.fill();

      // Red accent stripe on card
      ctx.fillStyle = '#ED1C24';
      ctx.fillRect(-20, 2, 40, 4);

      // Gold chip
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.roundRect(-14, -8, 8, 7, 2);
      ctx.fill();

      // Little wing
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(-2, Math.sin(g.frame * 0.3) * 3, 7, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      g.animationId = requestAnimationFrame(loop);
    };

    flappyGameRef.current.animationId = requestAnimationFrame(loop);

    return () => {
      if (flappyGameRef.current.animationId) {
        cancelAnimationFrame(flappyGameRef.current.animationId);
      }
    };
  }, [flappyState, selectedGame, winFlappy, loseFlappy]);

  const startFlappy = () => {
    const canvas = flappyCanvasRef.current;
    if (!canvas) return;
    flappyGameRef.current = {
      birdY: canvas.height / 2,
      birdVelocity: -2,
      pipes: [],
      frame: 0,
      animationId: null
    };
    setFlappyScore(0);
    setFlappyState('playing');
  };

  /* =========================================================================
   * GAME 2: VIETINBANK SNAKE CHALLENGE
   * ========================================================================= */
  const snakeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snakeState, setSnakeState] = useState<'idle' | 'running' | 'ended'>('idle');
  const [snakeScore, setSnakeScore] = useState(0);
  const [snakeRewardText, setSnakeRewardText] = useState<string>("Chưa đạt mốc thưởng");
  const [snakeFinishedReport, setSnakeFinishedReport] = useState<{
    score: number;
    reward: string;
    time: string;
    voucherCode: string;
  } | null>(null);

  const GRID_SIZE = 18;
  const snakeGameRef = useRef<{
    snake: Array<{ x: number; y: number }>;
    food: { x: number; y: number };
    dx: number;
    dy: number;
    nextDx: number;
    nextDy: number;
    intervalId: any;
    currentRewardTier: number; // 0, 20, 40
  }>({
    snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
    food: { x: 15, y: 10 },
    dx: 1,
    dy: 0,
    nextDx: 1,
    nextDy: 0,
    intervalId: null,
    currentRewardTier: 0
  });

  const changeSnakeDirection = (newDx: number, newDy: number) => {
    const g = snakeGameRef.current;
    if (newDx !== 0 && g.dx === 0) {
      g.nextDx = newDx;
      g.nextDy = 0;
    } else if (newDy !== 0 && g.dy === 0) {
      g.nextDx = 0;
      g.nextDy = newDy;
    }
  };

  const endSnakeGame = useCallback((finalScore: number) => {
    const g = snakeGameRef.current;
    if (g.intervalId) clearInterval(g.intervalId);
    setSnakeState('ended');

    let reward = "Chưa đạt mốc voucher (Cần tối thiểu 20 điểm)";
    if (finalScore >= 40) {
      reward = "02 voucher xăng (mỗi voucher 2 lít - Tổng 4 lít)";
      triggerConfetti();
    } else if (finalScore >= 20) {
      reward = "01 voucher xăng 2 lít";
      triggerConfetti();
    }

    setSnakeRewardText(reward);

    const report = {
      score: finalScore,
      reward,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      voucherCode: finalScore >= 20 ? generateVoucherCode() : "N/A"
    };
    setSnakeFinishedReport(report);

    if (finalScore > snakeHighScore) {
      setSnakeHighScore(finalScore);
      localStorage.setItem('vb_snake_high_score', finalScore.toString());
    }
  }, [snakeHighScore]);

  const startSnake = () => {
    const g = snakeGameRef.current;
    g.snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    g.food = { x: 15, y: 10 };
    g.dx = 1;
    g.dy = 0;
    g.nextDx = 1;
    g.nextDy = 0;
    g.currentRewardTier = 0;

    setSnakeScore(0);
    setSnakeRewardText("Chưa đạt mốc thưởng");
    setSnakeFinishedReport(null);
    setSnakeState('running');

    if (g.intervalId) clearInterval(g.intervalId);

    g.intervalId = setInterval(() => {
      // Advance snake
      g.dx = g.nextDx;
      g.dy = g.nextDy;

      const head = { x: g.snake[0].x + g.dx, y: g.snake[0].y + g.dy };

      // Wall collision (Grid is 24 x 20)
      if (head.x < 0 || head.x >= 24 || head.y < 0 || head.y >= 20) {
        endSnakeGame(g.snake.length - 3);
        return;
      }

      // Self collision
      for (const segment of g.snake) {
        if (segment.x === head.x && segment.y === head.y) {
          endSnakeGame(g.snake.length - 3);
          return;
        }
      }

      g.snake.unshift(head);

      // Check food
      if (head.x === g.food.x && head.y === g.food.y) {
        const newScore = g.snake.length - 3;
        setSnakeScore(newScore);

        // Check milestone alerts without interruption
        if (newScore >= 40 && g.currentRewardTier < 40) {
          g.currentRewardTier = 40;
          setSnakeRewardText("Đã đạt 02 voucher xăng (2x 2L)!");
          triggerConfetti();
        } else if (newScore >= 20 && g.currentRewardTier < 20) {
          g.currentRewardTier = 20;
          setSnakeRewardText("Đã đạt 01 voucher xăng 2 lít!");
          triggerConfetti();
        }

        // Spawn new food
        g.food = {
          x: Math.floor(Math.random() * 24),
          y: Math.floor(Math.random() * 20)
        };
      } else {
        g.snake.pop();
      }

      // Draw Snake on Canvas
      const canvas = snakeCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle grid bg
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Food (VietinBank Red Coin/Gas Token)
      ctx.fillStyle = '#ED1C24';
      ctx.beginPath();
      ctx.arc(
        g.food.x * GRID_SIZE + GRID_SIZE / 2,
        g.food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2 - 1,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Token center dot
      ctx.fillStyle = '#FEE2E2';
      ctx.beginPath();
      ctx.arc(
        g.food.x * GRID_SIZE + GRID_SIZE / 2,
        g.food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 5,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Snake Body
      g.snake.forEach((seg, i) => {
        if (i === 0) {
          // Head: Deep VietinBank Blue with eyes
          ctx.fillStyle = '#00529C';
          ctx.beginPath();
          ctx.roundRect(seg.x * GRID_SIZE, seg.y * GRID_SIZE, GRID_SIZE, GRID_SIZE, 5);
          ctx.fill();

          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(seg.x * GRID_SIZE + 4, seg.y * GRID_SIZE + 4, 2, 0, Math.PI * 2);
          ctx.arc(seg.x * GRID_SIZE + 14, seg.y * GRID_SIZE + 4, 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Body: Gradient Cyan to Blue
          ctx.fillStyle = i % 2 === 0 ? '#0099DA' : '#0284C7';
          ctx.beginPath();
          ctx.roundRect(seg.x * GRID_SIZE + 1, seg.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2, 3);
          ctx.fill();
        }
      });
    }, 115);
  };

  useEffect(() => {
    return () => {
      if (snakeGameRef.current.intervalId) clearInterval(snakeGameRef.current.intervalId);
    };
  }, []);

  // Keyboard navigation for Snake
  useEffect(() => {
    if (selectedGame !== 'snake') return;
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        changeSnakeDirection(0, -1);
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        changeSnakeDirection(0, 1);
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        changeSnakeDirection(-1, 0);
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        changeSnakeDirection(1, 0);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedGame]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title & Game Selector Tabs */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-3 border border-amber-200">
          <Gift className="w-3.5 h-3.5 text-[#ED1C24]" />
          <span>Giải trí tại quầy · Chơi game săn voucher xăng miễn phí</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {contentData.games.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          {contentData.games.subtitle}
        </p>

        {/* Game Switcher Tabs */}
        <div className="mt-6 inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setSelectedGame('flappy')}
            className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedGame === 'flappy'
                ? 'bg-white text-[#00529C] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Game 1: Thẻ Bay VietinBank (Flappy)
          </button>
          <button
            onClick={() => setSelectedGame('snake')}
            className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedGame === 'snake'
                ? 'bg-white text-[#00529C] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Game 2: VietinBank Snake Challenge
          </button>
        </div>
      </div>

      {/* =========================================================================
       * GAME 1 DISPLAY: FLAPPY BIRD
       * ========================================================================= */}
      {selectedGame === 'flappy' && (
        <div id="flappy-voucher-game" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {contentData.games.flappy.title}
              </h3>
              <p className="text-xs text-slate-500">
                Mục tiêu: Đạt <span className="font-bold text-[#ED1C24]">20 điểm</span> để nhận ngay Voucher 2 lít xăng
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                  Điểm cao nhất
                </span>
                <span className="font-mono text-base font-bold text-[#00529C]">
                  {flappyHighScore} / 20
                </span>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                title="Bật / Tắt hiệu ứng âm thanh"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Motivational Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="text-slate-500">
                Tiến độ: <strong className="text-slate-900 font-mono">{flappyScore}/20</strong>
              </span>
              <span className="font-semibold text-[#00529C]">
                {getFlappyMotivation(flappyScore)}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#00529C] to-[#0099DA] h-full transition-all duration-200"
                style={{ width: `${Math.min(100, (flappyScore / 20) * 100)}%` }}
              />
            </div>
          </div>

          {/* Game Canvas Container */}
          <div className="relative mx-auto max-w-[480px] aspect-4/3 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-50 shadow-inner select-none">
            <canvas
              ref={flappyCanvasRef}
              width={480}
              height={360}
              className="w-full h-full block cursor-pointer"
              onClick={flappyJump}
            />

            {/* Start Overlay */}
            {flappyState === 'start' && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xs flex flex-col items-center justify-center p-6 text-center text-white">
                <div className="w-14 h-14 rounded-2xl bg-[#00529C] border border-blue-400/40 flex items-center justify-center mb-3 shadow-lg">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-extrabold mb-1">Chờ vui – Chơi hay – Nhận quà liền tay</h4>
                <p className="text-xs text-blue-100 mb-6 max-w-xs">
                  Vượt qua 20 chướng ngại vật để nhận voucher 2 lít xăng tại quầy
                </p>
                <button
                  onClick={startFlappy}
                  className="px-6 py-3 bg-[#ED1C24] hover:bg-[#C4131A] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Bắt đầu chơi</span>
                </button>
                <p className="mt-4 text-[11px] text-slate-300">
                  Chạm màn hình hoặc nhấn phím <strong>Space</strong> để bay
                </p>
              </div>
            )}

            {/* Win Overlay */}
            {flappyState === 'win' && (
              <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
                <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-3 shadow-lg animate-bounce">
                  <Trophy className="w-9 h-9" />
                </div>
                <h4 className="text-xl font-extrabold text-amber-300 mb-1">Chúc Mừng Quý Khách!</h4>
                <p className="text-xs text-slate-200 mb-4 max-w-xs">
                  Bạn đã vượt qua 20 thử thách và đủ điều kiện nhận <strong>Voucher 2 lít xăng</strong>.
                </p>

                {flappyVoucher && (
                  <div className="p-3 bg-white/10 rounded-xl border border-white/20 mb-4 w-full max-w-xs flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-[10px] uppercase text-amber-200 block">Mã nhận quà của bạn</span>
                      <span className="font-mono text-lg font-black text-amber-300 tracking-wider">
                        {flappyVoucher}
                      </span>
                    </div>
                    <button
                      onClick={() => copyVoucher(flappyVoucher)}
                      className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? "Đã sao chép" : "Sao chép mã"}</span>
                    </button>
                  </div>
                )}

                <p className="text-[11px] text-amber-200 mb-5 max-w-xs">
                  Vui lòng chụp màn hình hoặc đưa mã này cho nhân viên để nhận quà.
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={startFlappy}
                    className="px-5 py-2.5 bg-white text-slate-900 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Chơi lại</span>
                  </button>
                </div>
              </div>
            )}

            {/* Lose Overlay */}
            {flappyState === 'lost' && (
              <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
                <h4 className="text-lg font-bold text-white mb-1">Rất tiếc!</h4>
                <p className="text-xs text-slate-200 mb-1">
                  Bạn đã vượt qua <strong>{flappyScore}/20</strong> thử thách
                </p>
                <p className="text-xs text-amber-300 font-medium mb-5">
                  Chỉ còn một chút nữa thôi, hãy thử lại nhé!
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={startFlappy}
                    className="px-5 py-2.5 bg-[#ED1C24] hover:bg-[#C4131A] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Chơi lại ngay</span>
                  </button>
                  <button
                    onClick={() => setFlappyState('start')}
                    className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Về màn hình chính
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Touch / Click Hint */}
          <div className="mt-4 text-center">
            <button
              onClick={flappyJump}
              className="w-full max-w-xs py-3 px-4 bg-blue-50 hover:bg-blue-100 text-[#00529C] font-bold text-xs sm:text-sm rounded-xl border border-blue-200 transition-all active:scale-98 cursor-pointer"
            >
              Chạm vào đây (hoặc Canvas) để Bay ✈️
            </button>
          </div>

          {/* Stored Recent Voucher Code Banner */}
          {lastFlappyVoucher && (
            <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-amber-900">
                <Gift className="w-4 h-4 text-[#ED1C24]" />
                <span>
                  <strong>Mã gần nhất của bạn:</strong>{' '}
                  <span className="font-mono font-bold text-[#00529C]">{lastFlappyVoucher}</span> (Voucher 2 lít xăng)
                </span>
              </div>
              <button
                onClick={() => copyVoucher(lastFlappyVoucher)}
                className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-amber-900 font-semibold hover:bg-amber-100 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>Sao chép</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
       * GAME 2 DISPLAY: SNAKE CHALLENGE
       * ========================================================================= */}
      {selectedGame === 'snake' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {contentData.games.snake.title}
              </h3>
              <p className="text-xs text-slate-500">
                {contentData.games.snake.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                  Kỷ lục
                </span>
                <span className="font-mono text-base font-bold text-[#00529C]">
                  {snakeHighScore} điểm
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                  Điểm hiện tại
                </span>
                <span className="font-mono text-xl font-extrabold text-[#ED1C24]">
                  {snakeScore}
                </span>
              </div>
            </div>
          </div>

          {/* Reward Status Banner */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2 mb-4 text-xs">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-[#ED1C24]" />
              <span className="text-slate-600">
                Trạng thái quà:{' '}
                <strong className={snakeScore >= 20 ? "text-emerald-600 font-bold" : "text-slate-700"}>
                  {snakeRewardText}
                </strong>
              </span>
            </div>
            <div className="text-slate-500 text-[11px]">
              Mốc 20: 01 voucher 2L · Mốc 40: 02 voucher 2L
            </div>
          </div>

          {/* Snake Canvas */}
          <div className="relative mx-auto max-w-[432px] aspect-6/5 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-50 shadow-inner">
            <canvas
              ref={snakeCanvasRef}
              width={432}
              height={360}
              className="w-full h-full block"
            />

            {/* Snake Idle Screen */}
            {snakeState === 'idle' && (
              <div className="absolute inset-0 bg-slate-900/65 backdrop-blur-2xs flex flex-col items-center justify-center p-6 text-center text-white">
                <h4 className="text-lg font-bold mb-2">VietinBank Snake Challenge</h4>
                <p className="text-xs text-slate-200 mb-5 max-w-xs leading-relaxed">
                  Dùng các phím mũi tên hoặc nút cảm ứng để điều khiển rắn ăn điểm thưởng VietinBank.
                </p>
                <button
                  onClick={startSnake}
                  className="px-6 py-3 bg-[#00529C] hover:bg-[#003B70] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Bắt đầu chơi</span>
                </button>
              </div>
            )}
          </div>

          {/* Touch D-Pad for Mobile / Counter Touchscreens */}
          <div className="mt-5 flex flex-col items-center">
            <p className="text-[11px] text-slate-400 mb-2">Phím điều khiển cảm ứng</p>
            <div className="grid grid-cols-3 gap-2 w-44">
              <div />
              <button
                onClick={() => changeSnakeDirection(0, -1)}
                className="p-3 bg-slate-100 active:bg-blue-100 rounded-xl flex items-center justify-center text-slate-700 hover:text-[#00529C] cursor-pointer"
                aria-label="Lên"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <div />

              <button
                onClick={() => changeSnakeDirection(-1, 0)}
                className="p-3 bg-slate-100 active:bg-blue-100 rounded-xl flex items-center justify-center text-slate-700 hover:text-[#00529C] cursor-pointer"
                aria-label="Trái"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => changeSnakeDirection(0, 1)}
                className="p-3 bg-slate-100 active:bg-blue-100 rounded-xl flex items-center justify-center text-slate-700 hover:text-[#00529C] cursor-pointer"
                aria-label="Xuống"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              <button
                onClick={() => changeSnakeDirection(1, 0)}
                className="p-3 bg-slate-100 active:bg-blue-100 rounded-xl flex items-center justify-center text-slate-700 hover:text-[#00529C] cursor-pointer"
                aria-label="Phải"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Phiếu xác nhận quà tặng (Gift Voucher Certificate Modal as required by PDF) */}
          {snakeFinishedReport && (
            <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl border-2 border-dashed border-[#00529C]/40 max-w-md mx-auto shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-blue-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#00529C] text-white flex items-center justify-center font-black text-xs">
                    VB
                  </div>
                  <span className="font-bold text-sm text-[#00529C] uppercase tracking-wide">
                    Phiếu Xác Nhận Quà Tặng
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {snakeFinishedReport.time}
                </span>
              </div>

              <div className="py-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Điểm số đạt được:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{snakeFinishedReport.score} điểm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mức quà tặng:</span>
                  <span className="font-bold text-[#ED1C24] text-sm text-right">{snakeFinishedReport.reward}</span>
                </div>
                {snakeFinishedReport.voucherCode !== "N/A" && (
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-slate-500">Mã voucher:</span>
                    <span className="font-mono font-extrabold text-[#00529C] bg-white px-2 py-1 rounded border border-blue-200 text-sm">
                      {snakeFinishedReport.voucherCode}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-white rounded-xl border border-blue-100 text-[11px] text-slate-600 font-medium mb-4">
                ⭐ <strong>Lưu ý:</strong> Vui lòng chụp màn hình hoặc thông báo với giao dịch viên VietinBank tại quầy để nhận quà!
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={startSnake}
                  className="flex-1 py-2.5 px-4 bg-[#00529C] hover:bg-[#003B70] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Chơi lại</span>
                </button>
                {snakeFinishedReport.voucherCode !== "N/A" && (
                  <button
                    onClick={() => copyVoucher(snakeFinishedReport.voucherCode)}
                    className="py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép mã</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
