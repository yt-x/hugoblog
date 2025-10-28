document.addEventListener('DOMContentLoaded', function() {
    // 添加阅读进度条
    addReadingProgress();

    // 图片点击放大
    enableImageLightbox();

    // 外部链接新标签页打开
    openExternalLinksInNewTab();

    // 平滑滚动
    enableSmoothScroll();
});

// ---------- 阅读进度条 ----------
function addReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(to right, #00c9ff, #92fe9d);
        z-index: 9999;
        transition: width 0.2s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// ---------- 图片点击放大 ----------
function enableImageLightbox() {
    const images = document.querySelectorAll('.post-content img');

    images.forEach(img => {
        img.style.cursor = 'zoom-in';

        img.addEventListener('click', function() {
            const lightbox = document.createElement('div');
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                cursor: zoom-out;
                animation: fadeIn 0.2s;
            `;

            const lightboxImg = document.createElement('img');
            lightboxImg.src = this.src;
            lightboxImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                border-radius: 8px;
                box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
            `;

            lightbox.appendChild(lightboxImg);
            document.body.appendChild(lightbox);

            lightbox.addEventListener('click', () => {
                document.body.removeChild(lightbox);
            });
        });
    });
}

// ---------- 外部链接新标签页打开 ----------
function openExternalLinksInNewTab() {
    const links = document.querySelectorAll('a[href^="http"]');

    links.forEach(link => {
        const linkHost = new URL(link.href).hostname;
        if (linkHost !== window.location.hostname) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
}

// ---------- 平滑滚动 ----------
function enableSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// CSS 动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);