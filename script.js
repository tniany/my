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