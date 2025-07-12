/*
* نورسينا للاستثمار المالي - ملف JavaScript للبريلودر
*/

/**
 * إدارة البريلودر - يتم عرض البريلودر عند تحميل الصفحة ثم إخفاؤه
 */
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  const preloaderBar = document.querySelector('.preloader-bar');
  
  if (!preloader || !preloaderBar) return;

  // تحديث شريط التقدم
  let width = 0;
  const interval = setInterval(() => {
    if (width >= 100) {
      clearInterval(interval);
    } else {
      const increment = Math.floor(Math.random() * 10) + 5; // زيادة عشوائية بين 5 و 15
      width = Math.min(width + increment, 95); // نضمن ألا يتجاوز 95 قبل اكتمال التحميل
      preloaderBar.style.width = width + '%';
    }
  }, 200);

  // عند اكتمال تحميل الصفحة
  window.addEventListener('load', () => {
    // اكتمال شريط التقدم
    preloaderBar.style.width = '100%';
    
    // تأخير قصير قبل إخفاء البريلودر
    setTimeout(() => {
      preloader.classList.add('hidden');
      
      // بعد إخفاء البريلودر، نزيله من DOM للتحسين من الأداء
      setTimeout(() => {
        preloader.remove();
      }, 500);
      
      // نزيل مستمع الحدث بعد استخدامه
      window.removeEventListener('load', arguments.callee);
    }, 300);
  });
  
  // احتياطي في حالة استغراق التحميل وقتًا طويلاً
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('hidden')) {
      preloaderBar.style.width = '100%';
      
      setTimeout(() => {
        preloader.classList.add('hidden');
        setTimeout(() => preloader.remove(), 500);
      }, 300);
    }
  }, 5000); // انتظار 5 ثوانٍ كحد أقصى
}

// تنفيذ البريلودر فوراً
document.addEventListener('DOMContentLoaded', initPreloader);
