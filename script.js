// HTML'den gerekli elementleri seçiyoruz
const ball = document.getElementById('ball');
const leftPaddle = document.getElementById('leftPaddle');
const rightPaddle = document.getElementById('rightPaddle');
const gameArea = document.querySelector('.game-area');
const startButton = document.getElementById('startButton');
const leftScoreDisplay = document.getElementById('leftScore');
const rightScoreDisplay = document.getElementById('rightScore');
const gameOverMessage = document.getElementById('gameOverMessage');
const playAgainButton = document.getElementById('playAgainButton');
const gameOverContainer = document.getElementById('gameOverContainer');

// Topun başlangıç pozisyonları ve hızları
let ballX = 400;
let ballY = 200;
let ballSpeedX = -4;
let ballSpeedY = 4;

// Raketlerin başlangıç pozisyonları
let leftPaddleY = 150;
let rightPaddleY = 150;

// Oyuncu skorları
let leftScore = 0;
let rightScore = 0;

// Oyunun başlangıç durumu (başlamamış olarak ayarlanıyor)
let gameStarted = false;

// Oyunun güncellenmesi için kullanılan fonksiyon
function update() {
    // Oyun başlamamışsa güncelleme yapma
    if (!gameStarted) return;

    // Topun pozisyonunu güncelle
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Topun ekran sınırlarına çarpma kontrolü
    if (ballY <= 0 || ballY >= gameArea.clientHeight - ball.clientHeight) {
        ballSpeedY = -ballSpeedY; // Dikey hızı tersine çevir
    }

    // Topun sağ veya sol sınırlara çarpma kontrolü ve skor güncelleme
    if (ballX <= 0) {
        ballSpeedX = -ballSpeedX; // Yatay hızı tersine çevir
        resetBall('right'); // Topu sağ tarafa sıfırla ve skoru güncelle
    } else if (ballX >= gameArea.clientWidth - ball.clientWidth) {
        ballSpeedX = -ballSpeedX; // Yatay hızı tersine çevir
        resetBall('left'); // Topu sol tarafa sıfırla ve skoru güncelle
    }

    // Raketlerle çarpışma kontrolü
    if (
        ballX <= leftPaddle.clientWidth &&
        ballY + ball.clientHeight >= leftPaddleY &&
        ballY <= leftPaddleY + leftPaddle.clientHeight
    ) {
        ballSpeedX = -ballSpeedX; // Yatay hızı tersine çevir
    }

    if (
        ballX + ball.clientWidth >= gameArea.clientWidth - rightPaddle.clientWidth &&
        ballY + ball.clientHeight >= rightPaddleY &&
        ballY <= rightPaddleY + rightPaddle.clientHeight
    ) {
        ballSpeedX = -ballSpeedX; // Yatay hızı tersine çevir
    }

    // Elementlerin pozisyonlarını güncelleme
    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';

    leftPaddle.style.top = leftPaddleY + 'px';
    rightPaddle.style.top = rightPaddleY + 'px';

    // Skor farkını kontrol edip oyunu bitirme
    const scoreDifference = Math.abs(leftScore - rightScore);
    if (scoreDifference >= 50) {
        endGame(); // Oyunu bitir
    }
}

// Topun pozisyonunu ve skorları sıfırlama
function resetBall(side) {
    ballX = 400;
    ballY = 200;
    ballSpeedX = -4;
    ballSpeedY = 4;

    // Skorları güncelleme
    if (side === 'left') {
        leftScore += 10; // 1. oyuncu skorunu arttır
        leftScoreDisplay.textContent = `1. Oyuncu: ${leftScore}`; // 1. oyuncu skorunu göster
    } else if (side === 'right') {
        rightScore += 10; // 2. oyuncu skorunu arttır
        rightScoreDisplay.textContent = `2. Oyuncu: ${rightScore}`; // 2. oyuncu skorunu göster
    }

    // Skor farkını kontrol edip oyunu bitirme
    const scoreDifference = Math.abs(leftScore - rightScore);
    if (scoreDifference >= 50) {
        endGame(); // Oyunu bitir
    }
}

// Oyunu bitirme ve kazananı belirleme
function endGame() {
    gameStarted = false; // Oyunu durdur
    const winner = leftScore > rightScore ? '1. Oyuncu' : '2. Oyuncu'; // Kazananı belirle
    gameOverMessage.textContent = `${winner} Kazandı!`; // Kazananı göster
    gameOverContainer.style.display = 'block'; // Oyun bitiş ekranını göster
}

// Oyunu başlatma butonu tıklama olayı
startButton.addEventListener('click', function() {
    gameStarted = true; // Oyunu başlat
    startButton.style.display = 'none'; // Başlat butonunu gizle
});

// Tekrar oyna butonu tıklama olayı
playAgainButton.addEventListener('click', function() {
    // Skorları ve oyun durumunu sıfırla
    leftScore = 0;
    rightScore = 0;
    leftScoreDisplay.textContent = '1. Oyuncu: 0';
    rightScoreDisplay.textContent = '2. Oyuncu: 0';
    gameOverContainer.style.display = 'none'; // Oyun bitiş ekranını gizle
    gameStarted = true; // Oyunu başlat
});

// Klavye tuşlarına basıldığında raketlerin hareketi
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp' && rightPaddleY > 0) {
        rightPaddleY -= 10;
    } else if (event.key === 'ArrowDown' && rightPaddleY < gameArea.clientHeight - rightPaddle.clientHeight) {
        rightPaddleY += 10;
    } else if (event.key === 'w' && leftPaddleY > 0) {
        leftPaddleY -= 10;
    } else if (event.key === 's' && leftPaddleY < gameArea.clientHeight - leftPaddle.clientHeight) {
        leftPaddleY += 10;
    }
});

// Oyunun sürekli güncellenmesi (60 FPS)
setInterval(update, 1000 / 60);
