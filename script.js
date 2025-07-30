// Enhanced CSS Animation Studio with GSAP Only

class EnhancedAnimationStudio {
    constructor() {
        this.currentAnimation = 'bounce';
        this.animationProperties = {
            duration: 1,
            delay: 0,
            iterations: 1,
            direction: 'normal',
            fillMode: 'none',
            timingFunction: 'ease',
            infinite: false,
            scale: 1,
            rotation: 0,
            opacity: 1
        };
        this.animatedElement = document.getElementById('animatedElement');
        this.cssCodeElement = document.getElementById('cssCode');
        this.timingCanvas = document.getElementById('timingGraph');
        this.ctx = this.timingCanvas.getContext('2d');
        this.init();
    }

    init() {
        this.initGSAP();
        this.bindEvents();
        this.updateAnimation();
        this.generateCSS();
        this.drawTimingGraph();
        this.initParticles();
    }

    initGSAP() {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Initial page animations
        gsap.set(['.sidebar', '.preview-area'], { opacity: 0, y: 50 });
        gsap.set('.header', { y: -100 });

        // Header entrance
        gsap.to('.header', {
            y: 0,
            duration: 1,
            ease: 'power3.out'
        });

        // Sidebar entrance with stagger
        gsap.to('.sidebar', {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            delay: 0.3
        });

        // Preview area entrance
        gsap.to('.preview-area', {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            delay: 0.5
        });

        // Stagger control sections
        gsap.fromTo('.control-section',
            { opacity: 0, x: -30 },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out',
                delay: 0.8
            }
        );

        // Animation buttons entrance
        gsap.fromTo('.animation-btn',
            { scale: 0, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.6,
                stagger: 0.05,
                ease: 'back.out(1.7)',
                delay: 1
            }
        );

        // Floating particles animation
        this.animateFloatingElements();

        // Scroll-triggered animations
        this.initScrollTriggers();
    }

    initScrollTriggers() {
        // Animated element parallax effect
        gsap.to('.animated-element', {
            rotation: 360,
            scale: 1.2,
            ease: 'none',
            scrollTrigger: {
                trigger: '.preview-stage',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });

        // Background gradient animation on scroll
        ScrollTrigger.create({
            trigger: '.preview-stage',
            start: 'top center',
            end: 'bottom center',
            onUpdate: (self) => {
                const progress = self.progress;
                const opacity = 0.02 + (progress * 0.03);
                gsap.to('.preview-stage', {
                    background: `
                        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, ${opacity}) 0%, transparent 50%),
                        radial-gradient(circle at 70% 70%, rgba(255, 255, 255, ${opacity * 0.5}) 0%, transparent 50%),
                        var(--background-color)
                    `,
                    duration: 0.3
                });
            }
        });
    }

    createFloatingElements() {
        const container = document.querySelector('.particles-container');
        const elementCount = 8;
        
        for (let i = 0; i < elementCount; i++) {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.style.cssText = `
                position: absolute;
                width: ${Math.random() * 2 + 1}px;
                height: ${Math.random() * 2 + 1}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.1 + 0.05});
                border-radius: 1px;
                pointer-events: none;
            `;
            container.appendChild(element);
        }
    }

    animateFloatingElements() {
        // Create floating elements first
        this.createFloatingElements();

        gsap.utils.toArray('.floating-element').forEach((element, index) => {
            gsap.set(element, {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 0.8 + 0.2
            });

            gsap.to(element, {
                x: `+=${Math.random() * 200 - 100}`,
                y: `+=${Math.random() * 200 - 100}`,
                rotation: Math.random() * 360,
                duration: 20 + Math.random() * 15,
                ease: 'none',
                repeat: -1,
                yoyo: true,
                delay: index * 3
            });

            gsap.to(element, {
                opacity: 0.02,
                scale: '+=0.2',
                duration: 4 + Math.random() * 2,
                ease: 'power2.inOut',
                repeat: -1,
                yoyo: true,
                delay: index * 0.8
            });
        });
    }

    bindEvents() {
        // Animation type buttons with enhanced effects
        const animationBtns = document.querySelectorAll('.animation-btn');
        animationBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Ripple effect
                this.createRipple(e, btn);
                
                // Update active state with GSAP
                animationBtns.forEach(b => {
                    gsap.to(b, { scale: 1, duration: 0.2 });
                    b.classList.remove('active');
                });
                
                gsap.to(btn, { scale: 1.05, duration: 0.2 });
                btn.classList.add('active');
                
                this.currentAnimation = btn.dataset.animation;
                this.updateAnimation();
                this.generateCSS();
            });

            // Hover effects
            btn.addEventListener('mouseenter', () => {
                if (!btn.classList.contains('active')) {
                    gsap.to(btn, { scale: 1.02, duration: 0.2 });
                }
            });

            btn.addEventListener('mouseleave', () => {
                if (!btn.classList.contains('active')) {
                    gsap.to(btn, { scale: 1, duration: 0.2 });
                }
            });
        });

        // Enhanced slider controls
        this.bindEnhancedSlider('duration', (value) => {
            this.animationProperties.duration = parseFloat(value);
            this.updateAnimation();
            this.generateCSS();
        }, 's');

        this.bindEnhancedSlider('delay', (value) => {
            this.animationProperties.delay = parseFloat(value);
            this.updateAnimation();
            this.generateCSS();
        }, 's');

        this.bindEnhancedSlider('iterations', (value) => {
            this.animationProperties.iterations = parseInt(value);
            this.updateAnimation();
            this.generateCSS();
        });

        this.bindEnhancedSlider('scale', (value) => {
            this.animationProperties.scale = parseFloat(value);
            this.updateAnimation();
            this.generateCSS();
        });

        this.bindEnhancedSlider('rotation', (value) => {
            this.animationProperties.rotation = parseInt(value);
            this.updateAnimation();
            this.generateCSS();
        }, '°');

        this.bindEnhancedSlider('opacity', (value) => {
            this.animationProperties.opacity = parseFloat(value);
            this.updateAnimation();
            this.generateCSS();
        });

        // Enhanced select controls
        this.bindEnhancedSelect('direction', (value) => {
            this.animationProperties.direction = value;
            this.updateAnimation();
            this.generateCSS();
        });

        this.bindEnhancedSelect('fillMode', (value) => {
            this.animationProperties.fillMode = value;
            this.updateAnimation();
            this.generateCSS();
        });

        this.bindEnhancedSelect('timingFunction', (value) => {
            this.animationProperties.timingFunction = value;
            this.updateAnimation();
            this.generateCSS();
            this.animateTimingGraph();
        });

        // Enhanced checkbox
        const infiniteCheckbox = document.getElementById('infinite');
        infiniteCheckbox.addEventListener('change', (e) => {
            this.animationProperties.infinite = e.target.checked;
            const iterationsSlider = document.getElementById('iterations');
            
            gsap.to(iterationsSlider.parentElement, {
                opacity: e.target.checked ? 0.5 : 1,
                duration: 0.3
            });
            
            iterationsSlider.disabled = e.target.checked;
            this.updateAnimation();
            this.generateCSS();
        });

        // Enhanced action buttons
        this.bindEnhancedButton('playBtn', () => {
            this.playAnimationWithEffect();
        });

        this.bindEnhancedButton('playBtn2', () => {
            this.playAnimationWithEffect();
        });

        this.bindEnhancedButton('resetBtn', () => {
            this.resetAnimationWithEffect();
        });

        this.bindEnhancedButton('copyCodeBtn', () => {
            this.copyCSS();
        });

        this.bindEnhancedButton('minifyBtn', () => {
            this.toggleMinify();
        });

        // Enhanced element click
        this.animatedElement.addEventListener('click', () => {
            this.playAnimationWithEffect();
        });
    }

    createRipple(event, element) {
        const ripple = element.querySelector('.btn-ripple');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        gsap.set(ripple, {
            width: size,
            height: size,
            left: x,
            top: y,
            scale: 0,
            opacity: 0.3
        });

        gsap.to(ripple, {
            scale: 2,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out'
        });
    }

    bindEnhancedSlider(id, callback, unit = '') {
        const slider = document.getElementById(id);
        const valueDisplay = slider.parentElement.querySelector('.slider-value');
        const sliderFill = slider.parentElement.querySelector('.slider-fill');

        const updateSlider = () => {
            const percent = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
            gsap.to(sliderFill, {
                width: `${percent}%`,
                duration: 0.3,
                ease: 'power2.out'
            });
        };

        slider.addEventListener('input', (e) => {
            const value = e.target.value;
            valueDisplay.textContent = value + unit;
            updateSlider();
            callback(value);
        });

        // Initial update
        updateSlider();
    }

    bindEnhancedSelect(id, callback) {
        const select = document.getElementById(id);
        const container = select.parentElement;

        select.addEventListener('change', (e) => {
            gsap.to(container, {
                scale: 1.02,
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });
            callback(e.target.value);
        });
    }

    bindEnhancedButton(id, callback) {
        const button = document.getElementById(id);
        if (!button) return;

        button.addEventListener('click', (e) => {
            // Button press animation
            gsap.to(button, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            });
            callback(e);
        });
    }

    updateAnimation() {
        const element = this.animatedElement;
        const props = this.animationProperties;

        // Clear existing animation with GSAP
        gsap.killTweensOf(element);
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow

        // Apply base transforms with GSAP
        gsap.set(element, {
            scale: props.scale,
            rotation: props.rotation,
            opacity: props.opacity
        });

        // Apply CSS animation
        const iterationCount = props.infinite ? 'infinite' : props.iterations;
        element.style.animation = `${this.currentAnimation} ${props.duration}s ${props.timingFunction} ${props.delay}s ${iterationCount} ${props.direction} ${props.fillMode}`;

        // Add GSAP enhancement for glow effect
        gsap.to('.element-glow', {
            opacity: 0.8,
            duration: 0.3,
            yoyo: true,
            repeat: 1
        });
    }

    playAnimationWithEffect() {
        // Enhanced play animation with visual feedback
        const element = this.animatedElement;
        
        // Flash effect
        gsap.to('.preview-stage', {
            background: `
                radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
                var(--background-color)
            `,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                gsap.to('.preview-stage', {
                    background: `
                        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
                        radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
                        var(--background-color)
                    `,
                    duration: 0.5
                });
            }
        });

        // Reset and play animation
        element.style.animation = 'none';
        element.offsetHeight;
        this.updateAnimation();

        // Play button feedback
        const playBtns = document.querySelectorAll('#playBtn, #playBtn2');
        playBtns.forEach(playBtn => {
            if (playBtn) {
                const btnBg = playBtn.querySelector('.btn-bg');
                if (btnBg) {
                    gsap.to(btnBg, {
                        background: 'var(--text-primary)',
                        duration: 0.3,
                        yoyo: true,
                        repeat: 1
                    });
                }
            }
        });
    }

    resetAnimationWithEffect() {
        // Enhanced reset with staggered animation
        const controls = document.querySelectorAll('input[type="range"], select, input[type="checkbox"]');

        // Reset properties
        this.animationProperties = {
            duration: 1,
            delay: 0,
            iterations: 1,
            direction: 'normal',
            fillMode: 'none',
            timingFunction: 'ease',
            infinite: false,
            scale: 1,
            rotation: 0,
            opacity: 1
        };

        // Animate controls reset
        gsap.to(controls, {
            scale: 1.05,
            duration: 0.2,
            stagger: 0.05,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                // Reset UI controls
                document.getElementById('duration').value = 1;
                document.getElementById('delay').value = 0;
                document.getElementById('iterations').value = 1;
                document.getElementById('direction').value = 'normal';
                document.getElementById('fillMode').value = 'none';
                document.getElementById('timingFunction').value = 'ease';
                document.getElementById('infinite').checked = false;
                document.getElementById('scale').value = 1;
                document.getElementById('rotation').value = 0;
                document.getElementById('opacity').value = 1;

                // Update value displays and sliders
                const sliderValues = ['1.0s', '0.0s', '1', '1.0', '0°', '1.0'];
                document.querySelectorAll('.slider-value').forEach((display, index) => {
                    if (sliderValues[index]) display.textContent = sliderValues[index];
                });

                // Update slider fills
                document.querySelectorAll('.slider-fill').forEach(fill => {
                    gsap.set(fill, { width: '0%' });
                });

                // Reset animation buttons
                document.querySelectorAll('.animation-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.animation === 'bounce') {
                        btn.classList.add('active');
                    }
                });

                this.currentAnimation = 'bounce';
                this.updateAnimation();
                this.generateCSS();
                this.animateTimingGraph();
            }
        });
    }

    generateCSS() {
        const props = this.animationProperties;
        const iterationCount = props.infinite ? 'infinite' : props.iterations;
        const keyframeCSS = this.getKeyframeCSS();

        const animationCSS = `
.animated-element {
    animation-name: ${this.currentAnimation};
    animation-duration: ${props.duration}s;
    animation-timing-function: ${props.timingFunction};
    animation-delay: ${props.delay}s;
    animation-iteration-count: ${iterationCount};
    animation-direction: ${props.direction};
    animation-fill-mode: ${props.fillMode};
    transform: scale(${props.scale}) rotate(${props.rotation}deg);
    opacity: ${props.opacity};
}

${keyframeCSS}`;

        // Animate CSS code update
        gsap.to(this.cssCodeElement, {
            opacity: 0.5,
            duration: 0.2,
            onComplete: () => {
                this.cssCodeElement.textContent = animationCSS;
                gsap.to(this.cssCodeElement, {
                    opacity: 1,
                    duration: 0.2
                });
            }
        });
    }

    getKeyframeCSS() {
        const keyframes = {
            bounce: `@keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
        animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
        transform: translate3d(0,0,0);
    }
    40%, 43% {
        animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
        transform: translate3d(0, -30px, 0) scale(1.1);
    }
    70% {
        animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
        transform: translate3d(0, -15px, 0) scale(1.05);
    }
    90% {
        transform: translate3d(0,-4px,0) scale(1.02);
    }
}`,
            fadeIn: `@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}`,
            slideIn: `@keyframes slideIn {
    from { transform: translateX(-100%) scale(0.95); opacity: 0; }
    to { transform: translateX(0) scale(1); opacity: 1; }
}`,
            rotateIn: `@keyframes rotateIn {
    from { transform: rotate(-200deg) scale(0.5); opacity: 0; }
    to { transform: rotate(0) scale(1); opacity: 1; }
}`,
            scaleIn: `@keyframes scaleIn {
    from { transform: scale(0) rotate(-180deg); opacity: 0; }
    to { transform: scale(1) rotate(0); opacity: 1; }
}`,
            wobble: `@keyframes wobble {
    0% { transform: translateX(0%); }
    15% { transform: translateX(-25%) rotate(-5deg) scale(1.05); }
    30% { transform: translateX(20%) rotate(3deg) scale(0.95); }
    45% { transform: translateX(-15%) rotate(-3deg) scale(1.02); }
    60% { transform: translateX(10%) rotate(2deg) scale(0.98); }
    75% { transform: translateX(-5%) rotate(-1deg) scale(1.01); }
    100% { transform: translateX(0%) scale(1); }
}`,
            pulse: `@keyframes pulse {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
    50% { transform: scale(1.05); box-shadow: 0 0 20px 10px rgba(99, 102, 241, 0.3); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
}`,
            shake: `@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px) rotate(-1deg); }
    20%, 40%, 60%, 80% { transform: translateX(10px) rotate(1deg); }
}`,
            flip: `@keyframes flip {
    0% { transform: perspective(400px) rotateY(0) scale(1); }
    40% { transform: perspective(400px) rotateY(-180deg) scale(1.1); }
    60% { transform: perspective(400px) rotateY(-180deg) scale(1.1); }
    100% { transform: perspective(400px) rotateY(0) scale(1); }
}`,
            swing: `@keyframes swing {
    20% { transform: rotate(15deg) scale(1.05); }
    40% { transform: rotate(-10deg) scale(0.95); }
    60% { transform: rotate(5deg) scale(1.02); }
    80% { transform: rotate(-5deg) scale(0.98); }
    100% { transform: rotate(0deg) scale(1); }
}`,
            rubberBand: `@keyframes rubberBand {
    0% { transform: scale(1); }
    30% { transform: scaleX(1.25) scaleY(0.75); }
    40% { transform: scaleX(0.75) scaleY(1.25); }
    50% { transform: scaleX(1.15) scaleY(0.85); }
    65% { transform: scaleX(0.95) scaleY(1.05); }
    75% { transform: scaleX(1.05) scaleY(0.95); }
    100% { transform: scale(1); }
}`,
            heartBeat: `@keyframes heartBeat {
    0% { transform: scale(1); }
    14% { transform: scale(1.3); filter: hue-rotate(15deg); }
    28% { transform: scale(1); }
    42% { transform: scale(1.3); filter: hue-rotate(15deg); }
    70% { transform: scale(1); }
}`
        };

        return keyframes[this.currentAnimation] || '';
    }

    animateTimingGraph() {
        // Animate the timing graph drawing
        gsap.to('.graph-container', {
            scale: 1.02,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                this.drawTimingGraph();
            }
        });
    }

    drawTimingGraph() {
        const canvas = this.timingCanvas;
        const ctx = this.ctx;
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw grid with animation
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;

        // Vertical lines
        for (let i = 0; i <= 10; i++) {
            const x = (width / 10) * i;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // Horizontal lines
        for (let i = 0; i <= 5; i++) {
            const y = (height / 5) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw timing function curve with gradient
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.4)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();

        const timingFunction = this.animationProperties.timingFunction;

        for (let i = 0; i <= width; i++) {
            const t = i / width;
            let y;

            switch (timingFunction) {
                case 'linear':
                    y = t;
                    break;
                case 'ease':
                    y = this.cubicBezier(0.25, 0.1, 0.25, 1, t);
                    break;
                case 'ease-in':
                    y = this.cubicBezier(0.42, 0, 1, 1, t);
                    break;
                case 'ease-out':
                    y = this.cubicBezier(0, 0, 0.58, 1, t);
                    break;
                case 'ease-in-out':
                    y = this.cubicBezier(0.42, 0, 0.58, 1, t);
                    break;
                default:
                    const match = timingFunction.match(/cubic-bezier\(([^)]+)\)/);
                    if (match) {
                        const values = match[1].split(',').map(v => parseFloat(v.trim()));
                        y = this.cubicBezier(values[0], values[1], values[2], values[3], t);
                    } else {
                        y = t;
                    }
            }

            const canvasY = height - (y * height);

            if (i === 0) {
                ctx.moveTo(i, canvasY);
            } else {
                ctx.lineTo(i, canvasY);
            }
        }

        ctx.stroke();

        // Add glow effect
        ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw labels with better styling
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '10px Inter';
        ctx.fontWeight = '300';
        ctx.fillText('0', 5, height - 5);
        ctx.fillText('1', width - 15, height - 5);
        ctx.fillText('0', 5, 15);
        ctx.fillText('1', 5, height / 2);
    }

    cubicBezier(x1, y1, x2, y2, t) {
        const cx = 3 * x1;
        const bx = 3 * (x2 - x1) - cx;
        const ax = 1 - cx - bx;
        const cy = 3 * y1;
        const by = 3 * (y2 - y1) - cy;
        const ay = 1 - cy - by;

        function sampleCurveX(t) {
            return ((ax * t + bx) * t + cx) * t;
        }

        function sampleCurveY(t) {
            return ((ay * t + by) * t + cy) * t;
        }

        function solveCurveX(x) {
            let t0, t1, t2, x2, d2;
            for (t2 = x, t0 = 0; t0 < 8; t0++) {
                x2 = sampleCurveX(t2) - x;
                if (Math.abs(x2) < 1e-6) return t2;
                d2 = (3 * ax * t2 + 2 * bx) * t2 + cx;
                if (Math.abs(d2) < 1e-6) break;
                t2 = t2 - x2 / d2;
            }

            t0 = 0;
            t1 = 1;
            t2 = x;

            if (t2 < t0) return t0;
            if (t2 > t1) return t1;

            while (t0 < t1) {
                x2 = sampleCurveX(t2);
                if (Math.abs(x2 - x) < 1e-6) return t2;
                if (x > x2) t0 = t2;
                else t1 = t2;
                t2 = (t1 - t0) * 0.5 + t0;
            }

            return t2;
        }

        return sampleCurveY(solveCurveX(t));
    }

    copyCSS() {
        const cssText = this.cssCodeElement.textContent;
        
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(cssText).then(() => {
                this.showEnhancedToast('CSS copied to clipboard!');
            }).catch(() => {
                this.fallbackCopy(cssText);
            });
        } else {
            this.fallbackCopy(cssText);
        }
    }

    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showEnhancedToast('CSS copied to clipboard!');
        } catch (err) {
            this.showEnhancedToast('Failed to copy CSS', 'error');
        }
        
        document.body.removeChild(textArea);
    }

    showEnhancedToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = toast.querySelector('.toast-message');

        // Update content
        toastMessage.textContent = message;

        // Enhanced entrance animation
        gsap.fromTo(toast,
            {
                y: 100,
                scale: 0.8,
                opacity: 0,
                rotation: -2
            },
            {
                y: 0,
                scale: 1,
                opacity: 1,
                rotation: 0,
                duration: 0.6,
                ease: 'back.out(1.7)'
            }
        );

        toast.classList.add('show');

        // Auto hide with animation
        setTimeout(() => {
            gsap.to(toast, {
                y: 100,
                scale: 0.8,
                opacity: 0,
                rotation: 2,
                duration: 0.5,
                ease: 'back.in(1.7)',
                onComplete: () => {
                    toast.classList.remove('show');
                }
            });
        }, 3000);
    }

    toggleMinify() {
        const code = this.cssCodeElement.textContent;
        const isMinified = !code.includes('\n ');

        // Animate the toggle
        gsap.to(this.cssCodeElement.parentElement, {
            scaleY: 0.95,
            duration: 0.2,
            onComplete: () => {
                if (isMinified) {
                    const expanded = code
                        .replace(/\{/g, ' {\n    ')
                        .replace(/;/g, ';\n    ')
                        .replace(/\}/g, '\n}\n')
                        .replace(/    \n\}/g, '\n}')
                        .replace(/\n\n/g, '\n');
                    this.cssCodeElement.textContent = expanded;
                } else {
                    const minified = code
                        .replace(/\s+/g, ' ')
                        .replace(/;\s*/g, ';')
                        .replace(/\{\s*/g, '{')
                        .replace(/\}\s*/g, '}')
                        .trim();
                    this.cssCodeElement.textContent = minified;
                }

                gsap.to(this.cssCodeElement.parentElement, {
                    scaleY: 1,
                    duration: 0.2
                });
            }
        });
    }

    initParticles() {
        // Initialize any additional particle effects if needed
    }
}

// Initialize the enhanced application
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedAnimationStudio();
});







