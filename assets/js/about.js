/*
* نورسينا للاستثمار المالي - ملف JavaScript لصفحة من نحن
*/

// انتظار تحميل المستند بالكامل
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // تنشيط وظيفة عداد الإنجازات
  initAchievementCounters();

  // تنشيط التحقق من ظهور العناصر على الشاشة
  initScrollObserver();
});

/**
 * تنشيط عداد الأرقام عند الظهور على الشاشة
 */
function initAchievementCounters() {
  const achievementSection = document.querySelector('.achievements-section');
  if (!achievementSection) return;

  const numbers = achievementSection.querySelectorAll('.achievement-number');
  
  // إذا كانت الأرقام موجودة على الشاشة، قم بتشغيل العداد
  function checkVisibility() {
    const sectionPosition = achievementSection.getBoundingClientRect();
    const isVisible = 
      sectionPosition.top < window.innerHeight && 
      sectionPosition.bottom >= 0;
    
    if (isVisible) {
      animateCounters();
      window.removeEventListener('scroll', checkVisibility);
    }
  }
  
  // أضف مراقب حدث التمرير للتحقق من الرؤية
  window.addEventListener('scroll', checkVisibility);
  
  // تحقق من الظهور عند تحميل الصفحة
  checkVisibility();
  
  // وظيفة تحريك العداد
  function animateCounters() {
    numbers.forEach(counter => {
      const targetValue = counter.innerText;
      const cleanValue = targetValue.replace(/[^\d.]/g, '');
      const isMonetary = targetValue.includes('$');
      const suffix = targetValue.includes('+') ? '+' : '';
      
      // البداية من الصفر
      let startValue = 0;
      let duration = 2500;
      let step = 50;
      let increment = parseInt(cleanValue) / (duration / step);
      
      // دالة تحديث القيمة
      function updateCounter() {
        startValue += increment;
        
        if (startValue < parseInt(cleanValue)) {
          // تنسيق العرض
          if (isMonetary) {
            counter.innerText = '$' + Math.floor(startValue).toLocaleString() + suffix;
          } else {
            counter.innerText = Math.floor(startValue).toLocaleString() + suffix;
          }
          
          // استمر في التحديث
          setTimeout(updateCounter, step);
        } else {
          // القيمة النهائية
          counter.innerText = targetValue;
        }
      }
      
      // بدء العد
      updateCounter();
    });
  }
}

/**
 * مراقبة ظهور العناصر عند التمرير
 */
function initScrollObserver() {
  if (!window.IntersectionObserver) return;
  
  // العناصر التي نريد تفعيلها عند الظهور
  const elementsToAnimate = [
    '.values-card',
    '.feature-about-card',
    '.investment-area-card',
    '.team-card',
    '.security-card'
  ];
  
  // إنشاء فاصل زمني للتحريك
  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.15 // عندما يظهر 15% من العنصر
  };
  
  // إنشاء دالة المراقبة
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        // إلغاء المراقبة بعد التحريك
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // تطبيق المراقبة على كل العناصر
  elementsToAnimate.forEach(selector => {
    document.querySelectorAll(selector).forEach((element, index) => {
      // إضافة تأخير متزايد للعناصر المتسلسلة
      element.style.transitionDelay = `${index * 0.1}s`;
      // إضافة فئة لإخفاء العنصر قبل ظهوره
      element.classList.add('reveal-element');
      // مراقبة العنصر
      observer.observe(element);
    });
  });
}
