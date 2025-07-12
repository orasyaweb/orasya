/*
* نورسينا للاستثمار المالي - ملف JavaScript لحاسبة الأرباح
*/

/**
 * تفعيل حاسبة الأرباح بالتصميم الجديد
 */
function initProfitCalculator() {
  // الحصول على عناصر المودال
  const calculatorModal = document.getElementById('calculatorModal');
  const selectPlan = document.getElementById('selectPlan');
  const investmentAmount = document.getElementById('investmentAmount');
  const investmentLimits = document.getElementById('investmentLimits');
  const amountError = document.getElementById('amountError');
  const planTitle = document.getElementById('planTitle');
  const calculateBtn = document.getElementById('calculateBtn');
  const recalculateBtn = document.getElementById('recalculateBtn');
  const calculatorInputs = document.getElementById('calculatorInputs');
  const calculatorResults = document.getElementById('calculatorResults');
  const dailyProfit = document.getElementById('dailyProfit');
  const totalProfit = document.getElementById('totalProfit');
  const totalReturn = document.getElementById('totalReturn');
  
  // التأكد من وجود العناصر قبل التنفيذ
  if (calculatorModal) {
    // تفعيل زر الإغلاق المخصص
    const closeButton = calculatorModal.querySelector('.close-button');
    if (closeButton) {
      closeButton.addEventListener('click', function() {
        const modalInstance = bootstrap.Modal.getInstance(calculatorModal);
        if (modalInstance) {
          modalInstance.hide();
        }
      });
    }
    
    // تحديث عنوان الباقة عند اختيار باقة جديدة
    if (selectPlan) {
      // تحديث حدود الاستثمار عند تغيير الباقة
      selectPlan.addEventListener('change', function() {
        const selectedOption = selectPlan.options[selectPlan.selectedIndex];
        const planName = getPlanNameInArabic(selectPlan.value);
        const percentage = selectedOption.getAttribute('data-percentage');
        const minAmount = selectedOption.getAttribute('data-min');
        const maxAmount = selectedOption.getAttribute('data-max');
        
        // تحديث عنوان الحاسبة
        if (planTitle) {
          planTitle.textContent = `احسب أرباحك من الباقة ${planName}`;
        }
        
        // تحديث حدود الاستثمار مع فاصلة الألفية
        if (investmentLimits) {
          // استخدام toLocaleString لإضافة فواصل الألفية
          const minFormatted = parseFloat(minAmount).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
          const maxFormatted = parseFloat(maxAmount).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
          investmentLimits.textContent = `حدود الباقة: $${minFormatted} - $${maxFormatted}`;
          investmentLimits.style.color = ''; // إعادة اللون الافتراضي
          investmentLimits.style.fontWeight = ''; // إعادة الوزن الافتراضي
        }
        
        // إعادة تعيين رسالة الخطأ
        if (investmentAmount) {
          investmentAmount.classList.remove('is-invalid');
        }
        if (amountError) {
          amountError.textContent = '';
          amountError.style.display = 'none';
        }
      });
      
      // تنفيذ تحديث أولي للباقة المختارة
      const initialEvent = new Event('change');
      selectPlan.dispatchEvent(initialEvent);
    }
    
    // تحديث الباقة والمعلومات عند فتح المودال
    calculatorModal.addEventListener('show.bs.modal', function(event) {
      // الزر الذي فتح المودال
      const button = event.relatedTarget;
      
      if (button) {
        // الحصول على معلومات الباقة
        const planType = button.getAttribute('data-plan');
        const percentage = button.getAttribute('data-percentage');
        
        // تحديد الباقة في القائمة المنسدلة
        if (selectPlan) {
          for (let i = 0; i < selectPlan.options.length; i++) {
            if (selectPlan.options[i].value === planType) {
              selectPlan.selectedIndex = i;
              break;
            }
          }
          
          // تنفيذ حدث التغيير لتحديث معلومات الباقة
          const changeEvent = new Event('change');
          selectPlan.dispatchEvent(changeEvent);
        }
      }
      
      // إعادة تعيين حالة الحاسبة
      resetCalculator();
    });
    
    // تنفيذ الحساب عند النقر على زر "احسب الربح"
    if (calculateBtn) {
      calculateBtn.addEventListener('click', function() {
        performCalculation();
      });
    }
    
    // تنفيذ إعادة الحساب عند النقر على زر "احسب الربح مرة أخرى"
    if (recalculateBtn) {
      recalculateBtn.addEventListener('click', function() {
        resetCalculator();
      });
    }
    
    // تنفيذ الحساب عند الضغط على Enter في حقل المبلغ
    if (investmentAmount) {
      investmentAmount.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          performCalculation();
        }
      });
      
      // إخفاء رسالة الخطأ عند تغيير المبلغ
      investmentAmount.addEventListener('input', function() {
        if (this.classList.contains('is-invalid')) {
          this.classList.remove('is-invalid');
          if (amountError) {
            amountError.textContent = '';
            amountError.style.display = 'none';
          }
          
          // إعادة لون حدود الباقة إلى الطبيعي
          if (investmentLimits) {
            investmentLimits.style.color = '';
            investmentLimits.style.fontWeight = '';
          }
        }
      });
    }
  }
  
  /**
   * تنفيذ عملية حساب الأرباح
   */
  function performCalculation() {
    if (!investmentAmount || !investmentAmount.value || isNaN(investmentAmount.value)) {
      showValidationError(investmentAmount, amountError, 'يرجى إدخال مبلغ استثمار صحيح');
      return;
    }
    
    // تحويل المبلغ إلى رقم
    const amount = parseFloat(investmentAmount.value);
    
    // الحصول على حدود الباقة المحددة
    const selectedOption = selectPlan.options[selectPlan.selectedIndex];
    const minAmount = parseFloat(selectedOption.getAttribute('data-min'));
    const maxAmount = parseFloat(selectedOption.getAttribute('data-max'));
    const percentage = parseFloat(selectedOption.getAttribute('data-percentage'));
    
    // التحقق من أن المبلغ ضمن حدود الباقة
    if (amount < minAmount || amount > maxAmount) {
      // استخدام toLocaleString لإضافة فواصل الألفية
      const minFormatted = minAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
      const maxFormatted = maxAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
      showValidationError(investmentAmount, amountError, `مبلغ الاستثمار يجب أن يكون بين $${minFormatted} و $${maxFormatted}`);
      return;
    }
    
    // حساب الأرباح
    const days = 120; // مدة الاستثمار الثابتة
    const rate = percentage / 100;
    const dailyProfitAmount = amount * rate;
    const totalProfitAmount = dailyProfitAmount * days;
    const totalReturnAmount = amount + totalProfitAmount;
    
    // عرض النتائج مع فواصل الألفية
    if (dailyProfit) {
      dailyProfit.textContent = `$${dailyProfitAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    if (totalProfit) {
      totalProfit.textContent = `$${totalProfitAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    if (totalReturn) {
      totalReturn.textContent = `$${totalReturnAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    
    // تبديل العرض من الإدخال إلى النتائج
    if (calculatorInputs && calculatorResults) {
      calculatorInputs.classList.add('d-none');
      calculatorResults.classList.remove('d-none');
    }
  }
  
  /**
   * إعادة تعيين حالة الحاسبة إلى وضع الإدخال
   */
  function resetCalculator() {
    // مسح قيمة المبلغ
    if (investmentAmount) {
      investmentAmount.value = '';
      investmentAmount.classList.remove('is-invalid');
    }
    
    // إخفاء أي رسائل خطأ
    if (amountError) {
      amountError.textContent = '';
      amountError.style.display = 'none';
    }
    
    // إعادة تنسيق حدود الباقة إلى الطبيعي
    if (investmentLimits) {
      investmentLimits.style.color = '';
      investmentLimits.style.fontWeight = '';
    }
    
    // العودة إلى نموذج الإدخال
    if (calculatorInputs && calculatorResults) {
      calculatorInputs.classList.remove('d-none');
      calculatorResults.classList.add('d-none');
    }
  }
  
  /**
   * عرض خطأ التحقق في النموذج
   * @param {HTMLElement} inputElement - عنصر الإدخال
   * @param {HTMLElement} errorElement - عنصر عرض الخطأ
   * @param {string} message - رسالة الخطأ
   */
  function showValidationError(inputElement, errorElement, message) {
    if (inputElement) {
      inputElement.classList.add('is-invalid');
      // إضافة تأثير الاهتزاز للتنبيه
      inputElement.classList.add('shake');
      
      // إزالة تأثير الاهتزاز بعد 500 مللي ثانية
      setTimeout(() => {
        inputElement.classList.remove('shake');
      }, 500);
    }
    
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block'; // إظهار رسالة الخطأ بشكل صريح
    } else {
      alert(message);
    }
  }
  
  /**
   * الحصول على اسم الباقة باللغة العربية
   * @param {string} planType - نوع الباقة
   * @returns {string} - اسم الباقة باللغة العربية
   */
  function getPlanNameInArabic(planType) {
    const planNames = {
      'bronze': 'البرونزية',
      'silver': 'الفضية',
      'gold': 'الذهبية',
      'diamond': 'الماسية'
    };
    
    return planNames[planType] || '';
  }
}

// عند تحميل المستند، تهيئة حاسبة الأرباح
document.addEventListener('DOMContentLoaded', function() {
  'use strict';
  initProfitCalculator();
});
