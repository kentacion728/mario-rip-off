const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ゲームエリア
const groundY = 200;
const gravity = 0.8;

// キャラクター
let player = {
  x: 40,
  y: groundY - 32,
  width: 32,
  height: 32,
  vy: 0,
  isJumping: false,
  isRunning: false
};

// 障害物
let obstacles = [
  { x: 320, y: groundY - 24, width: 24, height: 24 }
];
const obstacleSpeed = 3;
let obstacleTimer = 0;
const obstacleInterval = 150; // フレーム数（間隔を広く）
let isGameOver = false;
let life = 3;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 地面
  ctx.fillStyle = '#8d6e63';
  ctx.fillRect(0, groundY, canvas.width, 40);
  // 障害物
  ctx.fillStyle = '#ff7043';
  obstacles.forEach(obs => {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });
  // キャラクター（青い四角）
  ctx.fillStyle = '#1976d2';
  ctx.fillRect(player.x, player.y, player.width, player.height);
  // GAME OVER表示
  if (isGameOver) {
    ctx.save();
    ctx.font = 'bold 40px sans-serif';
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, canvas.height/2 - 50, canvas.width, 100);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 + 15);
    ctx.restore();
  }
  // ライフ表示
  ctx.save();
  ctx.font = 'bold 24px sans-serif';
  ctx.fillStyle = '#d32f2f';
  ctx.textAlign = 'left';
  ctx.fillText('LIFE: ' + life, 16, 36);
  ctx.restore();
}

function update() {
  if (isGameOver) return;
  // 走る
  if (player.isRunning) {
    player.x += 2;
  }
  // ジャンプ
  if (player.isJumping) {
    player.vy += gravity;
    player.y += player.vy;
    if (player.y >= groundY - player.height) {
      player.y = groundY - player.height;
      player.vy = 0;
      player.isJumping = false;
    }
  }

  // 障害物の移動・削除
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= obstacleSpeed;
    // 枠外に出たら削除
    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1);
    }
  }

  // 新しい障害物の生成
  obstacleTimer++;
  if (obstacleTimer > obstacleInterval) {
    obstacleTimer = 0;
    // 高さ・大きさをランダムに
    const height = 24 + Math.floor(Math.random() * 32); // 24~56
    obstacles.push({
      x: canvas.width,
      y: groundY - height,
      width: 24,
      height: height
    });
  }

  // 障害物との簡易衝突判定（止まる）
  obstacles.forEach(obs => {
    if (
      player.x + player.width > obs.x &&
      player.x < obs.x + obs.width &&
      player.y + player.height > obs.y &&
      player.y < obs.y + obs.height
    ) {
      player.x = obs.x - player.width;
      player.isRunning = false;
    }
  });

  // 枠外に出たらライフを減らす
  if (player.x + player.width < 0 || player.x > canvas.width) {
    life--;
    if (life <= 0) {
      isGameOver = true;
    } else {
      // キャラ位置・状態を初期化
      player.x = 40;
      player.y = groundY - player.height;
      player.vy = 0;
      player.isJumping = false;
      player.isRunning = false;
    }
  }
}

function gameLoop() {
  update();
  draw();
  if (!isGameOver) {
    requestAnimationFrame(gameLoop);
  }
}

document.getElementById('runBtn').onclick = () => {
  player.isRunning = true;
};
document.getElementById('stopBtn').onclick = () => {
  player.isRunning = false;
};
document.getElementById('jumpBtn').onclick = () => {
  if (!player.isJumping) {
    player.isJumping = true;
    player.vy = -12;
  }
};

gameLoop(); 