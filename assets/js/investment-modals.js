/**
 * نورسينا للاستثمار المالي - ملف JavaScript لمودل الاستثمار
 */

// انتظار تحميل المستند بالكامل
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // تهيئة أدوات Bootstrap للتلميح
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // إعداد أزرار الاستثمار
  initInvestmentButtons();
  
  // إعداد حاسبة الاستثمار
  initInvestmentCalculator();
});

/**
 * تهيئة أزرار الاستثمار لفتح المودل المناسب
 */
function initInvestmentButtons() {
  // افتراض أن المستخدم الحالي هو زائر (غير مسجل دخول)
  const isLoggedIn = false; // تغيير هذا لاختبار الحالة المختلفة
  
  // الحصول على جميع أزرار "استثمر الآن"
  const investButtons = document.querySelectorAll('.btn-invest');
  
  if (investButtons.length) {
    investButtons.forEach(function(button, index) {
      // إضافة معالج حدث النقر
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // الحصول على اسم الباقة (يمكن تعديله لاستخدام البيانات من الزر)
        const packageName = button.closest('.investment-plan').querySelector('.plan-title').textContent;
        
        // الحصول على بيانات الباقة
        const packageData = getPackageData(packageName);
        
        // تعيين الباقة المحددة في المودل
        if (document.getElementById('selectedPackage')) {
          document.getElementById('selectedPackage').textContent = 'الباقة: ' + packageName;
        }
        
        // تحديد نوع المودل حسب الباقة
        if (packageName === 'الباقة الفضية') {
          // للباقة الفضية فقط، نستخدم مودل المستخدم المسجل
          const userModal = new bootstrap.Modal(document.getElementById('investmentModalUser'));
          
          // تعيين الحد الأدنى والأقصى للاستثمار في المودل
          const minValueElement = document.querySelector('#investmentModalUser .min-value');
          const maxValueElement = document.querySelector('#investmentModalUser .max-value');
          const hintElement = document.querySelector('#investmentModalUser .investment-amount-hint');
          
          if (minValueElement && packageData) {
            minValueElement.textContent = '$' + packageData.minAmount.toLocaleString();
          }
          
          if (maxValueElement && packageData) {
            maxValueElement.textContent = '$' + packageData.maxAmount.toLocaleString();
          }
          
          if (hintElement && packageData) {
            hintElement.textContent = 'يرجى إدخال مبلغ بين $' + packageData.minAmount.toLocaleString() + ' و $' + packageData.maxAmount.toLocaleString();
          }
          
          // تعيين حقل المبلغ فارغًا
          const amountInput = document.getElementById('userInvestmentAmount');
          // إخفاء ملخص الاستثمار عند فتح المودل
          const summaryElement = document.querySelector('.investment-summary');
          if (summaryElement) {
            summaryElement.style.display = 'none';
          }
          
          if (amountInput) {
            amountInput.value = '';
          }
          
          userModal.show();
        } else {
          // للباقات الأخرى (البرونزية والذهبية والماسية)، نستخدم مودل تسجيل الدخول
          const guestModal = new bootstrap.Modal(document.getElementById('investmentModalGuest'));
          guestModal.show();
        }
      });
    });
  }
}

/**
 * الحصول على بيانات الباقة الاستثمارية
 * @param {string} packageName - اسم الباقة
 * @returns {Object} - بيانات الباقة
 */
function getPackageData(packageName) {
  // بيانات الباقات الاستثمارية (يمكن تحديثها لاحقًا من قاعدة البيانات)
  const packages = {
    'الباقة البرونزية': {
      dailyRate: 0.5, // 0.5% يوميًا
      duration: 180, // 180 يوم
      minAmount: 100,
      maxAmount: 999
    },
    'الباقة الفضية': {
      dailyRate: 1, // 1% يوميًا
      duration: 220, // 220 يوم
      minAmount: 1000,
      maxAmount: 10000
    },
    'الباقة الذهبية': {
      dailyRate: 1.5, // 1.5% يوميًا
      duration: 250, // 250 يوم
      minAmount: 10001,
      maxAmount: 50000
    },
    'الباقة البلاتينية': {
      dailyRate: 2, // 2% يوميًا
      duration: 300, // 300 يوم
      minAmount: 50001,
      maxAmount: 100000
    }
  };
  
  // إرجاع بيانات الباقة المطلوبة أو الباقة الفضية كافتراضي
  return packages[packageName] || packages['الباقة الفضية'];
}

/**
 * تهيئة حاسبة الاستثمار
 */
function initInvestmentCalculator() {
  // الحصول على حقل إدخال مبلغ الاستثمار
  const investmentInput = document.getElementById('userInvestmentAmount');
  
  if (investmentInput) {
    // إضافة معالج حدث تغيير القيمة
    investmentInput.addEventListener('input', function() {
      // الحصول على اسم الباقة المحددة
      const packageName = document.getElementById('selectedPackage').textContent.replace('الباقة: ', '');
      
      // الحصول على بيانات الباقة
      const packageData = getPackageData(packageName);
      
      // الحصول على المبلغ المدخل
      let amount = parseFloat(this.value);
      
      // الحصول على عنصر الرسالة التوضيحية
      const hintElement = document.querySelector('#investmentModalUser .investment-amount-hint');
      // الحصول على عنصر ملخص الاستثمار
      const summaryElement = document.querySelector('.investment-summary');
      
      // التحقق من صحة المبلغ
      if (isNaN(amount) || amount < packageData.minAmount || amount > packageData.maxAmount) {
        // إخفاء ملخص الاستثمار
        if (summaryElement) {
          summaryElement.style.display = 'none';
        }
        
        // إظهار رسالة خطأ بلون أحمر
        if (hintElement) {
          hintElement.textContent = 'يرجى إدخال مبلغ بين $' + packageData.minAmount.toLocaleString() + ' و $' + packageData.maxAmount.toLocaleString();
          hintElement.classList.add('text-danger');
        }
      } else {
        // إظهار ملخص الاستثمار
        if (summaryElement) {
          summaryElement.style.display = 'block';
        }
        
        // إعادة تنسيق الرسالة التوضيحية
        if (hintElement) {
          hintElement.textContent = 'يرجى إدخال مبلغ بين $' + packageData.minAmount.toLocaleString() + ' و $' + packageData.maxAmount.toLocaleString();
          hintElement.classList.remove('text-danger');
        }
        
        // تحديث ملخص الاستثمار
        updateInvestmentSummary(packageData, amount);
      }
    });
  }
}

/**
 * تحديث ملخص الاستثمار
 * @param {Object} packageData - بيانات الباقة
 * @param {number} amount - مبلغ الاستثمار
 */
function updateInvestmentSummary(packageData, amount) {
  // حساب الأرباح
  const dailyProfit = amount * (packageData.dailyRate / 100);
  const totalProfit = dailyProfit * packageData.duration;
  const totalReturn = amount + totalProfit;
  
  // تحديث عناصر ملخص الاستثمار
  document.getElementById('summaryAmount').textContent = '$' + Math.round(amount).toLocaleString();
  document.getElementById('summaryRate').textContent = packageData.dailyRate + '% اليومي';
  document.getElementById('summaryDuration').textContent = packageData.duration + ' يوم';
  document.getElementById('summaryDailyProfit').textContent = '$' + Math.round(dailyProfit).toLocaleString();
  document.getElementById('summaryNetProfit').textContent = '$' + Math.round(totalProfit).toLocaleString();
  document.getElementById('summaryTotalReturn').textContent = '$' + Math.round(totalReturn).toLocaleString();
}
