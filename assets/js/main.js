/*
* نورسينا للاستثمار المالي - ملف JavaScript الرئيسي
*/

// انتظار تحميل المستند بالكامل
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // تفعيل تأثير التمرير لشريط التنقل
  initNavbarScroll();
  
  // تفعيل السايد بار للشاشات الصغيرة
  initSidebar();
  
  // تفعيل عرض الإحصائيات
  displayStaticStats();
  
  // تفعيل الرابط النشط حسب الصفحة الحالية
  setActiveNavLink();
      
});

/**
 * تغيير مظهر شريط التنقل عند التمرير
 */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  
  if (navbar) {
    // التحقق من موضع التمرير الحالي عند تحميل الصفحة
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    }
    
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
    
    // تفعيل التمرير السلس عند النقر على روابط التنقل
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // التحقق من أن الرابط يشير إلى قسم في نفس الصفحة
        const targetId = this.getAttribute('href');
        
        if (targetId && targetId.startsWith('#') && targetId.length > 1) {
          e.preventDefault();
          const targetSection = document.querySelector(targetId);
          
          if (targetSection) {
            // إغلاق القائمة في الجوال عند النقر
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
              navbarCollapse.classList.remove('show');
              toggleSidebarOverlay(false);
            }
            
            // التمرير إلى القسم المطلوب
            window.scrollTo({
              top: targetSection.offsetTop - 80,
              behavior: 'smooth'
            });
            
            // تحديث الرابط النشط
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
          }
        }
      });
    });
  }
}

/**
 * تفعيل السايد بار للشاشات الصغيرة
 */
function initSidebar() {
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebarClose = document.querySelector('.sidebar-close');
  
  // تفعيل زر فتح السايد بار
  if (navbarToggler && sidebarOverlay) {
    // تفعيل فتح القائمة مباشرة عند النقر على الزر
    navbarToggler.addEventListener('click', function() {
      navbarCollapse.classList.add('show');
      toggleSidebarOverlay(true);
    });
    
    // إغلاق السايد بار عند النقر على الطبقة الخارجية
    sidebarOverlay.addEventListener('click', function() {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
        toggleSidebarOverlay(false);
      }
    });
  }
  
  // تفعيل زر إغلاق السايد بار
  if (sidebarClose) {
    sidebarClose.addEventListener('click', function() {
      navbarCollapse.classList.remove('show');
      toggleSidebarOverlay(false);
    });
  }
}

/**
 * تبديل حالة طبقة التظليل للسايد بار
 * @param {boolean} show - إظهار أو إخفاء الطبقة
 */
function toggleSidebarOverlay(show) {
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  
  if (sidebarOverlay) {
    if (show) {
      // إظهار طبقة التظليل فوراً
      sidebarOverlay.style.visibility = 'visible';
      sidebarOverlay.style.opacity = '1';
      sidebarOverlay.classList.add('show');
      document.body.style.overflow = 'hidden'; // منع التمرير في الصفحة
    } else {
      // إخفاء طبقة التظليل فوراً
      sidebarOverlay.style.opacity = '0';
      sidebarOverlay.classList.remove('show');
      document.body.style.overflow = ''; // إعادة تفعيل التمرير في الصفحة
      
      // إخفاء طبقة التظليل بعد انتهاء الانتقال
      setTimeout(function() {
        if (!sidebarOverlay.classList.contains('show')) {
          sidebarOverlay.style.visibility = 'hidden';
        }
      }, 500); // نفس مدة الانتقال في CSS
    }
  }
}

/**
 * عرض الإحصائيات بشكل ثابت بدون أنيميشن
 */
function displayStaticStats() {
  const statItems = document.querySelectorAll('.stat-item h3');
  
  if (statItems.length > 0) {
    statItems.forEach(item => {
      const countTo = parseInt(item.getAttribute('data-count'), 10);
      
      if (!isNaN(countTo)) {
        // عرض القيمة النهائية مباشرة بدون عداد
        item.textContent = countTo.toLocaleString('ar-SA');
      }
    });
  }
}

/**
 * تفعيل الرابط النشط في شريط التنقل بناءً على الصفحة الحالية
 */
function setActiveNavLink() {
  // الحصول على مسار الصفحة الحالية
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || 'index.html';
  
  // البحث عن الروابط في شريط التنقل
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  
  // إزالة الفئة النشطة من جميع الروابط
  navLinks.forEach(link => {
    link.classList.remove('active');
  });
  
  // تحديد الرابط الذي يجب أن يكون نشطاً
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // إذا كان رابط الصفحة الرئيسية وكنا في الصفحة الرئيسية
    if ((href === 'index.html' || href === './index.html' || href === '/index.html' || href === '/') && 
        (currentPage === 'index.html' || currentPage === '')) {
      link.classList.add('active');
    }
    // للصفحات الأخرى
    else if (href === currentPage) {
      link.classList.add('active');
    }
    // معالجة الروابط المنسدلة
    else if (link.classList.contains('custom-dropdown')) {
      const dropdownMenu = link.closest('.nav-item').querySelector('.dropdown-menu');
      if (dropdownMenu) {
        const dropdownLinks = dropdownMenu.querySelectorAll('.dropdown-item');
        let isActive = false;
        
        dropdownLinks.forEach(dropdownLink => {
          if (dropdownLink.getAttribute('href') === currentPage) {
            isActive = true;
          }
        });
        
        if (isActive) {
          link.classList.add('active');
        }
      }
    }
  });
}

// تم إزالة تبويبات المعاملات
