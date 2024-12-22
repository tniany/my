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
    const dino = document.createElement('div');
    const scoreDisplay = document.createElement('div');
    scoreDisplay.classList.add('score-display');
    scoreDisplay.textContent = '得分: 0';
    gameBoard.appendChild(scoreDisplay);
    
    // 添加太阳
    const sun = document.createElement('div');
    sun.classList.add('sun');
    gameBoard.appendChild(sun);
    
    dino.classList.add('dino');
    gameBoard.appendChild(dino);

    let isJumping = false;
    let position = 0;
    let score = 0;
    let gameSpeed = 5;
    let isGameOver = false;
    let obstacles = [];
    let animationFrameId;
    let lastJumpTime = 0;  // 记录上次跳跃时间
    let jumpCount = 0;     // 跳跃次数计数
    let jumpResetTimer = null;  // 跳跃重置定时器
    const jumpCooldown = 30;    // 跳跃间隔时间（毫秒）
    const maxJumps = 3;         // 最大连续跳跃次数
    const jumpResetTime = 300;  // 跳跃次数重置时间（毫秒）

    // 创建背景元素
    function createBackgroundElements() {
        // 创建更多云朵
        for (let i = 0; i < 6; i++) {  // 增加到6朵云
            const cloud = document.createElement('div');
            cloud.classList.add('cloud');
            cloud.style.left = `${Math.random() * 100}%`;
            cloud.style.top = `${Math.random() * 40}%`;
            // 随机设置不同的动画持续时间
            const duration = 8 + Math.random() * 4; // 8-12秒之间随机
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

    // 跳跃逻辑优化
    function jump(event) {
        // 检查事件类型并阻止默认行为
        if (event) {
            event.preventDefault();
        }

        // 允许空格键、触摸和鼠标点击触发跳跃
        if (!isGameOver && (
            (event.code === 'Space') || 
            event.type === 'touchstart' || 
            event.type === 'click'
        )) {
            const currentTime = Date.now();
            
            // 检查跳跃间隔
            if (currentTime - lastJumpTime < jumpCooldown) {
                return;
            }

            // 检查跳跃次数
            if (jumpCount >= maxJumps) {
                return;
            }

            // 更新跳跃计数和时间
            jumpCount++;
            lastJumpTime = currentTime;

            // 清除之前的重置定时器
            if (jumpResetTimer) {
                clearTimeout(jumpResetTimer);
            }

            // 设置新的重置定时器
            jumpResetTimer = setTimeout(() => {
                jumpCount = 0;
            }, jumpResetTime);

            isJumping = true;
            let velocity = 20;  // 增加初始速度
            let gravity = 0.6;  // 减小重力，使跳跃更轻盈
            let maxHeight = 180;  // 增加最大高度
            let currentPosition = position;
            let targetHeight = Math.min(maxHeight, currentPosition + 150); // 增加每次跳跃的高度增量

            // 如果是连续跳跃，增加额外的速度和高度
            if (position > 0) {
                velocity += 5;  // 连续跳跃时增加额外的初始速度
                targetHeight = Math.min(maxHeight, currentPosition + 180); // 连续跳跃时增加更多高度
            }

            let lastTime = performance.now();

            function jumpAnimation(currentTime) {
                if (isGameOver) return;

                const deltaTime = (currentTime - lastTime) / 16; // 基于60fps标准化时间差
                lastTime = currentTime;

                position += velocity * deltaTime;
                velocity -= gravity * deltaTime;
                
                // 限制最大高度
                if (position >= targetHeight) {
                    position = targetHeight;
                    velocity = -gravity * 3; // 增加下落初始速度
                }
                
                // 着陆检测
                if (position <= 0) {
                    position = 0;
                    velocity = 0;
                    isJumping = false;
                }

                dino.style.bottom = `${position}px`;
                dino.style.transform = `rotate(${velocity * 2}deg)`; // 添加旋转效果

                if (isJumping) {
                    requestAnimationFrame(jumpAnimation);
                } else {
                    dino.style.transform = 'rotate(0deg)'; // 重置旋转
                }
            }

            requestAnimationFrame(jumpAnimation);
        }
    }

    // 障碍物移动逻辑优化
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

    // 优化碰撞检测
    function checkCollision(obstacle) {
        const dinoRect = dino.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();
        
        // 缩小碰撞判定区域，使游戏更友好
        const collisionBuffer = 10;
        
        return !(
            dinoRect.right - collisionBuffer < obstacleRect.left + collisionBuffer || 
            dinoRect.left + collisionBuffer > obstacleRect.right - collisionBuffer || 
            dinoRect.bottom - collisionBuffer < obstacleRect.top + collisionBuffer || 
            dinoRect.top + collisionBuffer > obstacleRect.bottom - collisionBuffer
        );
    }

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
        for (let i = 0; i < 3; i++) {
            createCactus(600 + i * 300);
        }
        
        // 重置跳跃相关状态
        jumpCount = 0;
        lastJumpTime = 0;
        if (jumpResetTimer) {
            clearTimeout(jumpResetTimer);
        }
        
        // 重新开始游戏循环
        gameLoop();
    }

    function gameLoop() {
        if (!isGameOver) {
            moveObstacles();
            animationFrameId = requestAnimationFrame(gameLoop);
        }
    }

    // 初始化游戏
    createBackgroundElements();
    
    // 添加所有事件监听器
    document.addEventListener('keydown', jump);
    gameBoard.addEventListener('touchstart', jump);
    gameBoard.addEventListener('click', jump);
    
    // 防止触摸事件的默认行为（如滚动）
    gameBoard.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, { passive: false });

    // 延迟开始游戏
    setTimeout(() => {
        gameLoop();
    }, 500);
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
    const isHidden = gameElement.style.display === 'none';
    
    // 如果是小恐龙游戏且正在进行中，则不允许隐藏
    if (gameId === 't-rex-game' && !isHidden && !isGameOver) {
        return;
    }
    
    if (isHidden) {
        gameElement.style.display = 'block';
    } else {
        // 如果是小恐龙游戏，确保游戏结束后再隐藏
        if (gameId === 't-rex-game') {
            isGameOver = true;
            cancelAnimationFrame(animationFrameId);
        }
        gameElement.style.display = 'none';
    }
}

// 修改事件监听器，阻止空格键的默认行为
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault(); // 阻止空格键的默认滚动行为
    }
}); 