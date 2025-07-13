// تفعيل السايد بار للموبايل
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة الرسوم البيانية
    initCharts();
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
    
    // دالة تهيئة الرسوم البيانية
    function initCharts() {
        const profitLossChart = document.getElementById('profitLossChart');
        const portfolioChart = document.getElementById('portfolioChart');
        
        // التحقق من وجود عناصر الرسوم البيانية
        if (!profitLossChart || !portfolioChart) return;
        
        // رسم بياني للأرباح والخسائر
        new Chart(profitLossChart, {
            type: 'line',
            data: {
                labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو'],
                datasets: [
                    {
                        label: 'الأرباح',
                        data: [1200, 1900, 1650, 2800, 2200, 3100, 4200],
                        backgroundColor: 'rgba(56, 188, 139, 0.1)',
                        borderColor: '#38bc8b',
                        borderWidth: 2,
                        pointBackgroundColor: '#38bc8b',
                        pointRadius: 4,
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'الخسائر',
                        data: [500, 700, 600, 950, 800, 750, 900],
                        backgroundColor: 'rgba(240, 125, 110, 0.1)',
                        borderColor: '#f07d6e',
                        borderWidth: 2,
                        pointBackgroundColor: '#f07d6e',
                        pointRadius: 4,
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        rtl: true,
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                family: '"Tajawal", sans-serif',
                                size: 13
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        padding: 10,
                        titleFont: {
                            family: '"Tajawal", sans-serif',
                            size: 14
                        },
                        bodyFont: {
                            family: '"Tajawal", sans-serif',
                            size: 13
                        },
                        displayColors: true,
                        rtl: true
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: '"Tajawal", sans-serif',
                                size: 12
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            borderDash: [2, 2],
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                family: '"Tajawal", sans-serif',
                                size: 12
                            },
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                }
            }
        });
        
        // رسم بياني دائري لتوزيع المحفظة
        new Chart(portfolioChart, {
            type: 'doughnut',
            data: {
                labels: ['الأسهم', 'العملات الرقمية', 'العقارات', 'السلع'],
                datasets: [{
                    data: [45, 30, 15, 10],
                    backgroundColor: [
                        'rgba(200, 150, 43, 0.8)',
                        'rgba(77, 119, 255, 0.8)',
                        'rgba(56, 188, 139, 0.8)',
                        'rgba(240, 125, 110, 0.8)'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        padding: 10,
                        titleFont: {
                            family: '"Tajawal", sans-serif',
                            size: 14
                        },
                        bodyFont: {
                            family: '"Tajawal", sans-serif',
                            size: 13
                        },
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.raw + '%';
                            }
                        },
                        rtl: true
                    }
                },
                cutout: '60%'
            }
        });
    }
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