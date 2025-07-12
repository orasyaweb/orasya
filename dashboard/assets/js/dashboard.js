// تفعيل السايد بار للموبايل
document.addEventListener('DOMContentLoaded', function() {
    // وظيفة نسخ رابط الإحالة
    const copyReferralBtn = document.getElementById('copyReferralBtn');
    if (copyReferralBtn) {
        copyReferralBtn.addEventListener('click', function() {
            const referralInput = document.querySelector('.referral-input');
            if (referralInput) {
                // استخدام واجهة برمجة التطبيقات الحديثة لنسخ النص
                navigator.clipboard.writeText(referralInput.value)
                    .then(() => {
                        // تغيير نص الزر مؤقتًا للإشارة إلى نجاح النسخ
                        const originalText = this.innerHTML;
                        this.innerHTML = '<i class="fas fa-check"></i> تم النسخ!';
                        this.classList.add('btn-success');
                        this.classList.remove('btn-primary');
                        
                        // إعادة النص الأصلي بعد ثانيتين
                        setTimeout(() => {
                            this.innerHTML = originalText;
                            this.classList.remove('btn-success');
                            this.classList.add('btn-primary');
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('حدث خطأ أثناء نسخ الرابط:', err);
                        alert('حدث خطأ أثناء نسخ الرابط. الرجاء المحاولة مرة أخرى.');
                    });
            }
        });
    }

    // تفعيل السايد بار للموبايل
    document.getElementById('mobileSidebarToggle').addEventListener('click', function() {
        document.getElementById('sidebar').classList.add('show');
        document.getElementById('mobileOverlay').classList.add('show');
    });

    document.getElementById('sidebarToggle').addEventListener('click', function() {
        document.getElementById('sidebar').classList.remove('show');
        document.getElementById('mobileOverlay').classList.remove('show');
    });

    document.getElementById('mobileOverlay').addEventListener('click', function() {
        document.getElementById('sidebar').classList.remove('show');
        document.getElementById('mobileOverlay').classList.remove('show');
    });

    // معالجة القوائم المنسدلة في السايد بار
    const dropdownToggles = document.querySelectorAll('.sidebar .nav-link[data-bs-toggle="collapse"]');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const arrow = this.querySelector('.dropdown-arrow');
            if (arrow) {
                arrow.classList.toggle('rotated');
            }
            
            const targetId = this.getAttribute('href');
            const targetCollapse = document.querySelector(targetId);
            if (targetCollapse) {
                const bsCollapse = new bootstrap.Collapse(targetCollapse, {
                    toggle: false
                });
                bsCollapse.toggle();
            }
        });
    });
});