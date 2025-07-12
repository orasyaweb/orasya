/*
* نورسينا للاستثمار المالي - ملف JavaScript لنموذج الرد في صفحة التذكرة
*/

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // تفعيل وظائف نموذج الرد
    initReplyForm();
});

/**
 * تفعيل وظائف نموذج الرد
 */
function initReplyForm() {
    const replyTextarea = document.getElementById('replyMessage');
    const attachmentsInput = document.getElementById('attachments');
    const fileDropZone = document.querySelector('.file-drop-zone');
    const selectedFilesDiv = document.getElementById('selectedFiles');
    const filesListDiv = document.getElementById('filesList');
    const replyForm = document.querySelector('.reply-form');
    
    if (!replyTextarea || !attachmentsInput || !fileDropZone) return;
    
    // عداد الحروف
    initCharacterCounter(replyTextarea);
    
    // وظائف رفع الملفات
    initFileUpload(attachmentsInput, fileDropZone, selectedFilesDiv, filesListDiv);
    
    // تفعيل السحب والإفلات
    initDragAndDrop(fileDropZone, attachmentsInput);
    
    // تفعيل إرسال النموذج
    initFormSubmission(replyForm);
}

/**
 * تفعيل عداد الحروف
 */
function initCharacterCounter(textarea) {
    const maxLength = 1000;
    const counterElement = document.querySelector('.character-count small');
    
    if (!counterElement) return;
    
    textarea.addEventListener('input', function() {
        const currentLength = this.value.length;
        counterElement.textContent = `${currentLength} / ${maxLength} حرف`;
        
        // تغيير لون العداد عند الاقتراب من الحد الأقصى
        if (currentLength >= maxLength * 0.9) {
            counterElement.classList.add('text-warning');
        } else if (currentLength >= maxLength) {
            counterElement.classList.remove('text-warning');
            counterElement.classList.add('text-danger');
        } else {
            counterElement.classList.remove('text-warning', 'text-danger');
            counterElement.classList.add('text-muted');
        }
    });
    
    // تحديد الحد الأقصى للحروف
    textarea.setAttribute('maxlength', maxLength);
}

/**
 * تفعيل وظائف رفع الملفات
 */
function initFileUpload(input, dropZone, selectedFilesDiv, filesListDiv) {
    let selectedFiles = [];
    const maxFiles = 5;
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/zip'];
    
    input.addEventListener('change', function(e) {
        handleFileSelection(e.target.files);
    });
    
    function handleFileSelection(files) {
        // التحقق من عدد الملفات
        if (selectedFiles.length + files.length > maxFiles) {
            showMessage(`يمكنك رفع حد أقصى ${maxFiles} ملفات فقط`, 'error');
            return;
        }
        
        Array.from(files).forEach(file => {
            // التحقق من حجم الملف
            if (file.size > maxFileSize) {
                showMessage(`الملف "${file.name}" كبير جداً. الحد الأقصى 5 ميجابايت`, 'error');
                return;
            }
            
            // التحقق من نوع الملف
            if (!allowedTypes.includes(file.type)) {
                showMessage(`نوع الملف "${file.name}" غير مدعوم`, 'error');
                return;
            }
            
            // التحقق من عدم وجود الملف مسبقاً
            if (selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                showMessage(`الملف "${file.name}" موجود بالفعل`, 'warning');
                return;
            }
            
            selectedFiles.push(file);
        });
        
        updateFilesList();
    }
    
    function updateFilesList() {
        if (selectedFiles.length === 0) {
            selectedFilesDiv.style.display = 'none';
            return;
        }
        
        selectedFilesDiv.style.display = 'block';
        filesListDiv.innerHTML = '';
        
        selectedFiles.forEach((file, index) => {
            const fileItem = createFileItem(file, index);
            filesListDiv.appendChild(fileItem);
        });
    }
    
    function createFileItem(file, index) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const fileIcon = getFileIcon(file.type);
        const fileSize = formatFileSize(file.size);
        
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-icon">
                    <i class="${fileIcon}"></i>
                </div>
                <div class="file-details">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${fileSize}</div>
                </div>
            </div>
            <button type="button" class="file-remove" onclick="removeFile(${index})" title="حذف الملف">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        return fileItem;
    }
    
    // جعل دالة removeFile متاحة عالمياً
    window.removeFile = function(index) {
        selectedFiles.splice(index, 1);
        updateFilesList();
    };
    
    function getFileIcon(fileType) {
        if (fileType.startsWith('image/')) return 'fas fa-image';
        if (fileType === 'application/pdf') return 'fas fa-file-pdf';
        if (fileType.includes('word')) return 'fas fa-file-word';
        if (fileType === 'text/plain') return 'fas fa-file-alt';
        if (fileType === 'application/zip') return 'fas fa-file-archive';
        return 'fas fa-file';
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 بايت';
        const k = 1024;
        const sizes = ['بايت', 'كيلوبايت', 'ميجابايت'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
}

/**
 * تفعيل السحب والإفلات
 */
function initDragAndDrop(dropZone, input) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });
    
    dropZone.addEventListener('drop', handleDrop, false);
    
    function highlight() {
        dropZone.classList.add('drag-over');
    }
    
    function unhighlight() {
        dropZone.classList.remove('drag-over');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        // تحديث قيمة input
        input.files = files;
        
        // تشغيل حدث التغيير
        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
    }
}

/**
 * تفعيل إرسال النموذج
 */
function initFormSubmission(form) {
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const textarea = document.getElementById('replyMessage');
        
        // التحقق من وجود محتوى
        if (!textarea.value.trim()) {
            showMessage('يرجى كتابة نص الرد', 'error');
            textarea.focus();
            return;
        }
        
        // تعطيل زر الإرسال أثناء المعالجة
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>جارٍ الإرسال...';
        
        // محاكاة إرسال البيانات
        setTimeout(() => {
            showMessage('تم إرسال ردكم بنجاح', 'success');
            
            // إعادة تعيين النموذج
            form.reset();
            document.getElementById('selectedFiles').style.display = 'none';
            document.querySelector('.character-count small').textContent = '0 / 1000 حرف';
            
            // إعادة تفعيل الزر
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 2000);
    });
}

/**
 * عرض رسائل التنبيه
 */
function showMessage(message, type = 'info') {
    // إنشاء عنصر التنبيه
    const alert = document.createElement('div');
    alert.className = `alert alert-${type === 'error' ? 'danger' : type === 'warning' ? 'warning' : type === 'success' ? 'success' : 'info'} alert-dismissible fade show`;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.zIndex = '9999';
    alert.style.minWidth = '300px';
    
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // إزالة التنبيه تلقائياً بعد 5 ثوانٍ
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}
