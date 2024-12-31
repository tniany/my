// 添加页面加载动画效果
document.addEventListener('DOMContentLoaded', function() {
    const profile = document.querySelector('.profile');
    profile.style.opacity = '0';
    
    setTimeout(() => {
        profile.style.transition = 'opacity 0.5s ease-in-out';
        profile.style.opacity = '1';
    }, 100);
});

// 为QQ号和群号添加点击复制功能
document.querySelectorAll('.info-item .value').forEach(element => {
    element.style.cursor = 'pointer';
    element.addEventListener('click', function() {
        const text = this.textContent;
        navigator.clipboard.writeText(text).then(() => {
            alert('已复制到剪贴板：' + text);
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const avatar = document.querySelector('.avatar img');
    
    avatar.addEventListener('click', function() {
        this.classList.add('active');
        
        // 动画结束后移除active类，以便下次点击可以再次触发动画
        setTimeout(() => {
            this.classList.remove('active');
        }, 500);
    });
});

// 井字棋游戏逻辑优化
function initTicTacToe() {
    const board = document.getElementById('tic-tac-toe-board');
    const gameStatus = document.createElement('div');
    gameStatus.classList.add('game-status');
    board.parentElement.insertBefore(gameStatus, board);
    
    let currentPlayer = 'X';
    let boardState = Array(9).fill(null);
    let gameActive = true;

    // 清空棋盘
    board.innerHTML = '';
    gameStatus.textContent = '轮到玩家 X';
    
    // 创建棋盘格子
    const cells = Array.from({ length: 9 }, (_, i) => {
        const cell = document.createElement('div');
        cell.classList.add('tic-tac-toe-cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', () => handleCellClick(cell, i));
        board.appendChild(cell);
        return cell;
    });

    function handleCellClick(cell, index) {
        if (!gameActive || boardState[index]) return;

        boardState[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());
        
        // 添加动画效果
        cell.style.transform = 'scale(0)';
        setTimeout(() => {
            cell.style.transform = 'scale(1)';
        }, 50);

        if (checkWinner()) {
            gameActive = false;
            gameStatus.textContent = `玩家 ${currentPlayer} 获胜！`;
            gameStatus.classList.add('winner');
        } else if (boardState.every(cell => cell)) {
            gameActive = false;
            gameStatus.textContent = '平局！';
            gameStatus.classList.add('draw');
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            gameStatus.textContent = `轮到玩家 ${currentPlayer}`;
        }
    }

    function checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winPatterns.some(pattern =>
            boardState[pattern[0]] &&
            boardState[pattern[0]] === boardState[pattern[1]] &&
            boardState[pattern[0]] === boardState[pattern[2]]
        );
    }

    function resetGame() {
        boardState = Array(9).fill(null);
        gameActive = true;
        currentPlayer = 'X';
        gameStatus.textContent = '轮到玩家 X';
        gameStatus.classList.remove('winner', 'draw');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
    }

    // 添加重置按钮
    const resetButton = document.createElement('button');
    resetButton.textContent = '重新开始';
    resetButton.classList.add('game-button');
    resetButton.addEventListener('click', resetGame);
    board.parentElement.appendChild(resetButton);
}

// 小恐龙游戏逻辑优化
function initTRexGame() {
    const gameBoard = document.getElementById('t-rex-game-board');
    gameBoard.innerHTML = ''; // 清空之前的内容
    
    const dino = document.createElement('div');
    dino.classList.add('dino');
    gameBoard.appendChild(dino);
    
    const scoreDisplay = document.createElement('div');
    scoreDisplay.classList.add('score-display');
    scoreDisplay.textContent = '得分: 0';
    gameBoard.appendChild(scoreDisplay);
    
    const sun = document.createElement('div');
    sun.classList.add('sun');
    gameBoard.appendChild(sun);
    
    let isJumping = false;
    let position = 0;
    let score = 0;
    let gameSpeed = 5;
    let isGameOver = false;
    let obstacles = [];
    animationFrameId = null; // 确保使用全局变量
    
    // 创建背景元素
    function createBackground() {
        // 创建云朵
        for (let i = 0; i < 5; i++) {
            const cloud = document.createElement('div');
            cloud.classList.add('cloud');
            cloud.style.left = `${Math.random() * 100}%`;
            cloud.style.top = `${Math.random() * 40}%`;
            const duration = 10 + Math.random() * 5; // 10-15秒之间随机
            cloud.style.animationDuration = `${duration}s`;
            gameBoard.appendChild(cloud);
        }
        
        // 创建仙人掌
        for (let i = 0; i < 3; i++) {
            createCactus(600 + i * 300);
        }
    }
    
    function createCactus(leftPosition) {
        const cactus = document.createElement('div');
        cactus.classList.add('cactus');
        cactus.style.left = `${leftPosition}px`;
        gameBoard.appendChild(cactus);
        obstacles.push({
            element: cactus,
            position: leftPosition
        });
    }
    
    // 跳跃功能
    function jump() {
        if (isJumping || isGameOver) return;
        isJumping = true;
        let velocity = 20;
        const gravity = 0.8;
        
        function jumpStep() {
            if (velocity > 0) {
                position += velocity;
                velocity -= gravity;
                if (position >= 150) {
                    velocity = -velocity / 2;
                }
                dino.style.bottom = `${position}px`;
                animationFrameId = requestAnimationFrame(jumpStep);
            } else {
                position += velocity;
                velocity -= gravity;
                if (position <= 0) {
                    position = 0;
                    isJumping = false;
                    cancelAnimationFrame(animationFrameId);
                }
                dino.style.bottom = `${position}px`;
                animationFrameId = requestAnimationFrame(jumpStep);
            }
        }
        
        jumpStep();
    }
    
    // 障碍物移动
    function moveObstacles() {
        obstacles.forEach((obstacle, index) => {
            obstacle.position -= gameSpeed;
            obstacle.element.style.left = `${obstacle.position}px`;
            
            // 超出屏幕后重置位置
            if (obstacle.position < -50) {
                obstacle.position = gameBoard.offsetWidth + Math.random() * 300;
                score++;
                scoreDisplay.textContent = `得分: ${score}`;
                // 随着得分增加，适当增加游戏速度
                if (score % 5 === 0) {
                    gameSpeed += 0.5;
                }
            }
            
            // 碰撞检测
            if (checkCollision(obstacle.element)) {
                gameOver();
            }
        });
    }
    
    // 碰撞检测
    function checkCollision(obstacle) {
        const dinoRect = dino.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();
        
        return !(
            dinoRect.right < obstacleRect.left ||
            dinoRect.left > obstacleRect.right ||
            dinoRect.bottom < obstacleRect.top ||
            dinoRect.top > obstacleRect.bottom
        );
    }
    
    // 游戏结束
    function gameOver() {
        isGameOver = true;
        cancelAnimationFrame(animationFrameId);
        
        const gameOverText = document.createElement('div');
        gameOverText.classList.add('game-over');
        gameOverText.textContent = `游戏结束！得分：${score}`;
        gameBoard.appendChild(gameOverText);
        
        const restartButton = document.createElement('button');
        restartButton.textContent = '重新开始';
        restartButton.classList.add('game-button');
        restartButton.addEventListener('click', restartGame);
        gameBoard.appendChild(restartButton);
    }
    
    // 重启游戏
    function restartGame() {
        // 清理旧障碍物
        obstacles.forEach(obstacle => obstacle.element.remove());
        obstacles = [];
        
        // 重置游戏状态
        isGameOver = false;
        score = 0;
        gameSpeed = 5;
        position = 0;
        dino.style.bottom = '0px';
        scoreDisplay.textContent = `得分: ${score}`;
        
        // 移除游戏结束相关元素
        const gameOverText = gameBoard.querySelector('.game-over');
        const restartButton = gameBoard.querySelector('.game-button');
        if (gameOverText) gameOverText.remove();
        if (restartButton) restartButton.remove();
        
        // 重新创建障碍物
        createBackground();
        
        // 重新开始游戏循环
        gameLoop();
    }
    
    // 游戏循环
    function gameLoop() {
        if (!isGameOver) {
            moveObstacles();
            animationFrameId = requestAnimationFrame(gameLoop);
        }
    }
    
    // 初始化游戏
    createBackground();
    gameLoop();
    
    // 监听跳跃事件
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            event.preventDefault();
            jump();
        }
    });
    
    gameBoard.addEventListener('click', function() {
        jump();
    });
}

// 页面加载时初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    initTicTacToe();
    initTRexGame();
    
    // 为小恐龙游戏按钮添加事件监听
    const trexToggleBtn = document.getElementById('trex-toggle-btn');
    trexToggleBtn.addEventListener('click', function(event) {
        event.preventDefault();
        toggleGame('t-rex-game');
        // 更新按钮文本
        const gameElement = document.getElementById('t-rex-game');
        this.textContent = gameElement.style.display === 'none' ? 
            '开始谷歌小恐龙游戏' : '结束游戏';
    });
});

function toggleGame(gameId) {
    const gameElement = document.getElementById(gameId);
    const button = gameId === 't-rex-game' ? 
        document.getElementById('trex-toggle-btn') : 
        document.querySelector(`button[onclick="toggleGame('${gameId}')"]`);

    if (!gameElement) return;

    if (gameElement.style.display === 'none') {
        gameElement.style.display = 'block';
        button.textContent = `结束${gameId === 't-rex-game' ? '小恐龙游戏' : '九宫格井字棋'}`;
        if (gameId === 't-rex-game') {
            initTRexGame();
        } else {
            initTicTacToe();
        }
    } else {
        gameElement.style.display = 'none';
        button.textContent = `开始${gameId === 't-rex-game' ? '小恐龙游戏' : '九宫格井字棋'}`;
        if (gameId === 't-rex-game') {
            stopTRexGame();
        }
    }
}

// 修改停止游戏的函数
function stopTRexGame() {
    const gameBoard = document.getElementById('t-rex-game-board');
    if (gameBoard) {
        gameBoard.innerHTML = '';
        // 清除所有相关的定时器和动画
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }
}

// 修改页面加载时的初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化游戏按钮状态
    const ticTacToeBtn = document.querySelector('button[onclick="toggle(\'tic-tac-toe\')"]');
    const trexBtn = document.getElementById('trex-toggle-btn');
    
    if (ticTacToeBtn) {
        ticTacToeBtn.textContent = '开始九宫格井字棋';
    }
    if (trexBtn) {
        trexBtn.textContent = '开始小恐龙游戏';
    }
});

// 修改事件监听器，阻止空格键的默认行为
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault(); // 阻止空格键的默认滚动行为
    }
}); 