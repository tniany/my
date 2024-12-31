// 创建雪花效果
function createSnowflakes() {
    const snowContainer = document.querySelector('.snow-container');
    const snowflakes = ['❄', '❅', '❆'];
    
    setInterval(() => {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
        snowflake.style.opacity = Math.random();
        snowflake.innerHTML = snowflakes[Math.floor(Math.random() * snowflakes.length)];
        
        snowContainer.appendChild(snowflake);
        
        // 清除雪花
        setTimeout(() => {
            snowflake.remove();
        }, 5000);
    }, 200);
}

// 创建烟花效果
function createFirework(x, y) {
    const fireworksContainer = document.querySelector('.fireworks-container');
    const colors = ['#ff0000', '#ffff00', '#ffd700', '#ff69b4'];
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        const angle = (i / 30) * Math.PI * 2;
        const velocity = 15;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        fireworksContainer.appendChild(particle);
        
        let posX = x;
        let posY = y;
        let opacity = 1;
        
        const animate = () => {
            if (opacity <= 0) {
                particle.remove();
                return;
            }
            
            posX += vx;
            posY += vy;
            opacity -= 0.02;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;
            
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }
}

// 随机生成烟花
function randomFireworks() {
    setInterval(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * (window.innerHeight / 2);
        createFirework(x, y);
    }, 2000);
}

// 添加灯笼点击效果
function initLanternEffects() {
    const lanterns = document.querySelectorAll('.lantern');
    
    lanterns.forEach(lantern => {
        lantern.addEventListener('click', (e) => {
            // 阻止事件冒泡
            e.stopPropagation();
            
            // 灯笼掉落效果
            lantern.style.animation = 'lanternFall 2s ease-in forwards';
            
            // 创建彩带
            createRibbons();
            
            // 显示新年祝福
            showNewYearWish();
            
            // 移除点击事件
            lantern.style.pointerEvents = 'none';
        });
    });
}

// 创建彩带效果
function createRibbons() {
    const container = document.querySelector('.festival-decorations');
    const ribbonCount = 15;
    
    for (let i = 0; i < ribbonCount; i++) {
        const ribbon = document.createElement('div');
        ribbon.className = 'ribbon';
        
        // 随机位置和角度
        const left = Math.random() * 100;
        ribbon.style.left = `${left}vw`;
        ribbon.style.animation = `ribbonDrop 1s ease-out forwards`;
        ribbon.style.animationDelay = `${Math.random() * 0.5}s`;
        
        container.appendChild(ribbon);
        
        // 动画结束后延迟移除
        setTimeout(() => {
            ribbon.style.transition = 'opacity 0.5s ease';
            ribbon.style.opacity = '0';
            setTimeout(() => ribbon.remove(), 500);
        }, 2000);
    }
}

// 显示新年祝福
function showNewYearWish() {
    const wishes = [
        "新年快乐",
        "恭喜发财",
        "万事如意",
        "心想事成"
    ];
    
    const container = document.querySelector('.festival-decorations');
    const wish = document.createElement('div');
    wish.className = 'new-year-wish';
    wish.textContent = wishes[Math.floor(Math.random() * wishes.length)];
    
    container.appendChild(wish);
    
    // 添加抖动效果
    wish.style.animation = 'wishAppear 0.5s ease-out forwards, shake 0.8s ease-in-out infinite';
    
    // 3秒后移除祝福语
    setTimeout(() => {
        wish.style.animation = 'wishAppear 0.5s ease-out reverse forwards';
        setTimeout(() => wish.remove(), 500);
    }, 3000);
}

// 更新对联内容
function updateCouplets() {
    const coupletPairs = [
        {
            left: "新年纳福迎春至",
            right: "佳节开门送喜来",
            horizontal: "万事如意庆有余"
        },
        {
            left: "春回大地万象新",
            right: "福满人间百业兴",
            horizontal: "喜迎新春"
        },
        {
            left: "金玉满堂增福禄",
            right: "财源广进纳祥瑞",
            horizontal: "四季平安"
        }
    ];
    
    let currentIndex = 0;
    const leftCouplet = document.querySelector('.couplet.left');
    const rightCouplet = document.querySelector('.couplet.right');
    const horizontalCouplet = document.querySelector('.couplet.horizontal');
    
    function updateText() {
        // 先淡出
        leftCouplet.style.opacity = '0';
        rightCouplet.style.opacity = '0';
        horizontalCouplet.style.opacity = '0';
        
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % coupletPairs.length;
            leftCouplet.textContent = coupletPairs[currentIndex].left;
            rightCouplet.textContent = coupletPairs[currentIndex].right;
            horizontalCouplet.textContent = coupletPairs[currentIndex].horizontal;
            
            // 再淡入
            leftCouplet.style.opacity = '1';
            rightCouplet.style.opacity = '1';
            horizontalCouplet.style.opacity = '1';
        }, 500);
    }
    
    // 每10秒更换一次对联
    setInterval(updateText, 10000);
}

// 页面加载时初始化所有效果
document.addEventListener('DOMContentLoaded', () => {
    createSnowflakes();
    randomFireworks();
    initLanternEffects();
    updateCouplets();
    
    // 点击页面任意位置触发烟花
    document.addEventListener('click', (e) => {
        createFirework(e.clientX, e.clientY);
    });
}); 