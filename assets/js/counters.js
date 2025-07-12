/**
 * نورسينا للاستثمار المالي - العدادات التفاعلية
 * تحريك العدادات عند الوصول إليها في الصفحة
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // تحديد جميع عناصر العدادات
    const counters = document.querySelectorAll('.achievement-number[data-counter]');
    let hasAnimated = false; // للتأكد من تشغيل الانيميشن مرة واحدة فقط
    
    // دالة لتنسيق الأرقام
    function formatNumber(num) {
        if (num >= 1000000) {
            return '$' + (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            if (num.toString().indexOf('45365000') !== -1 || num.toString().indexOf('25125000') !== -1) {
                return '$' + num.toLocaleString();
            }
            return '+' + num.toLocaleString();
        }
        return '+' + num;
    }
    
    // دالة لتحريك العدادات
    function animateCounters() {
        if (hasAnimated) return;
        hasAnimated = true;
        
        // مدة الانيميشن الثابتة لجميع العدادات (2.5 ثانية)
        const duration = 2500;
        const frameRate = 16; // 60 FPS تقريباً
        const totalFrames = Math.round(duration / frameRate);
        let currentFrame = 0;
        
        // جمع معلومات جميع العدادات
        const counterData = [];
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-counter'));
            counterData.push({
                element: counter,
                target: target,
                increment: target / totalFrames
            });
        });
        
        const timer = setInterval(() => {
            currentFrame++;
            
            counterData.forEach(data => {
                const current = Math.floor(data.increment * currentFrame);
                
                if (currentFrame >= totalFrames) {
                    // عرض القيمة النهائية بالتنسيق الصحيح
                    if (data.target === 1000) {
                        data.element.textContent = '+1,000';
                    } else if (data.target === 45365000) {
                        data.element.textContent = '$45,365,000';
                    } else if (data.target === 25125000) {
                        data.element.textContent = '$25,125,000';
                    } else if (data.target === 15) {
                        data.element.textContent = '+15';
                    } else {
                        data.element.textContent = formatNumber(data.target);
                    }
                } else {
                    // عرض القيمة الحالية مع التنسيق
                    if (data.target === 45365000 || data.target === 25125000) {
                        data.element.textContent = '$' + current.toLocaleString();
                    } else if (data.target >= 1000) {
                        data.element.textContent = '+' + current.toLocaleString();
                    } else {
                        data.element.textContent = '+' + current;
                    }
                }
            });
            
            // إنهاء الانيميشن عندما تصل جميع العدادات للنهاية
            if (currentFrame >= totalFrames) {
                clearInterval(timer);
            }
        }, frameRate);
    }
    
    // دالة للتحقق من وصول المستخدم لقسم الإنجازات
    function checkScroll() {
        const achievementsSection = document.querySelector('.achievements-section');
        if (!achievementsSection) return;
        
        const sectionTop = achievementsSection.offsetTop;
        const sectionHeight = achievementsSection.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // تشغيل الانيميشن عند وصول 50% من القسم للعرض
        if (scrollTop + windowHeight >= sectionTop + (sectionHeight * 0.3)) {
            animateCounters();
        }
    }
    
    // مراقبة التمرير
    window.addEventListener('scroll', checkScroll);
    
    // تحقق عند تحميل الصفحة (في حالة كان القسم مرئياً من البداية)
    checkScroll();
    
    // تشغيل الانيميشن تلقائياً بعد 2 ثانية كبديل
    setTimeout(() => {
        if (!hasAnimated) {
            animateCounters();
        }
    }, 2000);
});
