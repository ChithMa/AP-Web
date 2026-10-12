/**
 * App.js - Main Application Logic
 */

// DOM Elements
const views = document.querySelectorAll('.view');
const navLinks = document.querySelectorAll('.nav-links li');
const modal = document.getElementById('modal');
const addTransactionBtn = document.getElementById('add-transaction-btn');
const closeModalBtn = document.querySelector('.close-modal');
const transactionForm = document.getElementById('transaction-form');
const pageTitle = document.getElementById('page-title');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const menuBtn = document.getElementById('menu-btn');
const closeSidebarBtn = document.getElementById('close-sidebar-btn');

// State
let balanceChartInstance = null;
let expenseChartInstance = null;
let currentYear = new Date().getFullYear();

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initYearSelector();
    initModal();
    initReports();
    initMobileSidebar();
    initGallery();
    // Default to current year or the latest available if current is empty
    renderAll();
});

function initMobileSidebar() {
    function openSidebar() {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    }

    menuBtn.addEventListener('click', openSidebar);
    closeSidebarBtn.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    // Auto-close when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });
}

function initYearSelector() {
    const yearSelect = document.getElementById('year-select');
    const addYearBtn = document.getElementById('add-year-btn');
    const years = store.getYears();

    // Populate Dropdown
    yearSelect.innerHTML = years.map(y => `<option value="${y}" ${y == currentYear ? 'selected' : ''}>${y}</option>`).join('');

    // Listen for changes
    yearSelect.addEventListener('change', (e) => {
        currentYear = e.target.value;
        renderAll();
    });

    // Add Year Button Logic
    // Remove old listener to prevent duplicates if init called multiple times
    const newBtn = addYearBtn.cloneNode(true);
    addYearBtn.parentNode.replaceChild(newBtn, addYearBtn);

    newBtn.addEventListener('click', () => {
        const newYear = prompt("Enter Year for New Pooja (e.g., 2026):");
        if (newYear && /^\d{4}$/.test(newYear)) {
            const added = store.addYear(newYear);
            if (added) {
                currentYear = newYear;
                initYearSelector(); // Refresh dropdown
                renderAll(); // Refresh view (likely empty)
            } else {
                alert("This year already exists!");
                currentYear = newYear; // Switch to it anyway if exists
                initYearSelector();
                renderAll();
            }
        } else if (newYear) {
            alert("Invalid Year! Please enter a 4-digit year.");
        }
    });
}

function renderAll() {
    const currentView = document.querySelector('.view.active').id;
    if (currentView === 'dashboard') renderDashboard();
    if (currentView === 'donations') renderDonations();
    if (currentView === 'expenses') renderExpenses();
    if (currentView === 'seva') renderSeva();
    if (currentView === 'attendance') renderAttendance();
    if (currentView === 'gallery') renderGallery();
}

// Navigation Logic
function initNavigation() {
    const titles = {
        dashboard: 'Dashboard',
        donations: 'Donations',
        expenses: 'Expenses',
        seva: 'Seva (Duties)',
        attendance: 'Namelist',
        gallery: 'Photo Gallery',
        reports: 'Reports'
    };

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Update Active Link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Switch View
            const targetView = link.dataset.view;
            views.forEach(view => {
                view.classList.remove('active');
                if (view.id === targetView) {
                    view.classList.add('active');
                }
            });

            // Update Header Title
            if (pageTitle && titles[targetView]) {
                pageTitle.textContent = titles[targetView];
            }

            renderAll();
        });
    });
}

// Rendering Logic
function renderDashboard() {
    const stats = store.getStats(currentYear);

    // Update Cards
    document.getElementById('dash-total-donations').textContent = formatCurrency(stats.totalDonations);
    document.getElementById('dash-total-expenses').textContent = formatCurrency(stats.totalExpenses);
    document.getElementById('dash-balance').textContent = formatCurrency(stats.balance);

    // Update Charts
    updateCharts(stats);
}

function renderDonations() {
    const tbody = document.getElementById('donations-list');
    const donations = store.getDonations(currentYear);

    tbody.innerHTML = donations.map(d => `
        <tr>
            <td>${formatDate(d.date)}</td>
            <td><div style="font-weight:600">${d.name}</div></td>
            <td>${d.family}</td>
            <td style="color: var(--color-green); font-weight:600">+ ${formatCurrency(d.amount)}</td>
        </tr>
    `).join('');
}

function renderExpenses() {
    const tbody = document.getElementById('expenses-list');
    const expenses = store.getExpenses(currentYear);

    tbody.innerHTML = expenses.map(e => `
        <tr>
            <td>${formatDate(e.date)}</td>
            <td><span style="background: var(--color-primary-light); color: var(--color-primary); padding: 0.2rem 0.6rem; border-radius: 1rem; font-size: 0.85rem;">${e.category}</span></td>
            <td>${e.description}</td>
            <td style="color: var(--color-primary); font-weight:600">- ${formatCurrency(e.amount)}</td>
        </tr>
    `).join('');
}

function renderSeva() {
    const tbody = document.getElementById('seva-list');
    const tasks = store.getAssignments(currentYear);

    tbody.innerHTML = tasks.map(t => `
        <tr>
            <td><div style="font-weight:600">${t.member}</div></td>
            <td>${t.task}</td>
            <td><span style="background: ${t.status === 'Completed' ? 'var(--color-green)' : '#F59E0B'}; color: white; padding: 0.2rem 0.6rem; border-radius: 1rem; font-size: 0.85rem;">${t.status}</span></td>
        </tr>
    `).join('');
}

function renderAttendance() {
    const tbody = document.getElementById('attendance-list');
    const list = store.getAttendance(currentYear);

    // Calculate Stats
    const totalPax = list.reduce((acc, curr) => {
        return curr.status === 'Coming' ? acc + Number(curr.pax) : acc;
    }, 0);
    document.getElementById('total-pax-count').textContent = totalPax;

    tbody.innerHTML = list.map(item => `
        <tr>
            <td><div style="font-weight:600">${item.name}</div></td>
            <td>${item.family}</td>
            <td>${item.pax}</td>
            <td>
                <label style="display:flex; align-items:center; cursor:pointer;">
                    <input type="checkbox" 
                        onchange="toggleAttendance(${item.id}, this.checked)"
                        ${item.status === 'Coming' ? 'checked' : ''}
                        style="width:1.2rem; height:1.2rem; margin-right:0.5rem; accent-color:var(--color-green);">
                    <span style="font-weight:600; color:${item.status === 'Coming' ? 'var(--color-green)' : 'var(--color-text-muted)'}">
                        ${item.status}
                    </span>
                </label>
            </td>
        </tr>
    `).join('');
}

// Global scope for inline onchange
window.toggleAttendance = function (id, isChecked) {
    const status = isChecked ? 'Coming' : 'Not Coming';
    store.updateAttendance(id, { status });
    renderAttendance(); // Re-render to update text color
};

function renderPreviousYears() {
    const container = document.getElementById('previous-years-container');
    const records = store.getPreviousPoojas();

    container.innerHTML = `<h3 style="margin-bottom:1rem; font-family:var(--font-heading)">Historical Records</h3>`;

    container.innerHTML += records.map(record => `
        <div class="stat-card" style="margin-bottom: 1.5rem; --accent-color: var(--color-gold);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                <h3 style="margin:0; font-size:1.2rem; color:var(--color-primary);">${record.year} - ${record.description}</h3>
                <span style="font-weight:700; font-size:1.2rem;">${formatCurrency(record.total_expenses)}</span>
            </div>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap:1rem;">
                ${record.details.map(d => `
                    <div style="background:var(--color-bg); padding:0.8rem; border-radius:var(--radius-md);">
                        <div style="font-size:0.8rem; color:var(--color-text-muted);">${d.category}</div>
                        <div style="font-weight:600;">${formatCurrency(d.amount)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Chart.js Logic
function updateCharts(stats) {
    const ctxBalance = document.getElementById('balanceChart').getContext('2d');
    const ctxExpense = document.getElementById('expenseChart').getContext('2d');

    // Destroy existing charts to avoid memory leaks/glitches
    if (balanceChartInstance) balanceChartInstance.destroy();
    if (expenseChartInstance) expenseChartInstance.destroy();

    // Balance Chart (Doughnut)
    balanceChartInstance = new Chart(ctxBalance, {
        type: 'doughnut',
        data: {
            labels: ['Expenses', 'Balance'],
            datasets: [{
                data: [stats.totalExpenses, stats.balance],
                backgroundColor: ['#B91C1C', '#059669'], // Brand Colors
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    // Expense Breakdown Chart (Bar)
    const categories = Object.keys(stats.expensesByCategory);
    const amounts = Object.values(stats.expensesByCategory);

    expenseChartInstance = new Chart(ctxExpense, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Expenses',
                data: amounts,
                backgroundColor: '#D97706', // Brand Gold
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Modal & Form Logic
function initModal() {
    // Open Modal
    addTransactionBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        // Set default date to today
        document.getElementById('date').valueAsDate = new Date();
    });

    // Close Modal
    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Toggle Form Fields
    const typeInputs = document.querySelectorAll('input[name="type"]');
    typeInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const val = e.target.value;
            const isDonation = val === 'donation';
            const isExpense = val === 'expense';
            const isSeva = val === 'seva';
            const isAttendance = val === 'attendance';

            document.getElementById('donation-fields').classList.toggle('hidden', !isDonation);
            document.getElementById('expense-fields').classList.toggle('hidden', !isExpense);
            document.getElementById('seva-fields').classList.toggle('hidden', !isSeva);
            document.getElementById('attendance-fields').classList.toggle('hidden', !isAttendance);

            // Toggle Common Fields
            // Amount/Date hidden for Seva AND Attendance
            const hideCommon = isSeva || isAttendance;
            document.getElementById('amount-group').classList.toggle('hidden', hideCommon);
            document.getElementById('date-group').classList.toggle('hidden', hideCommon);

            // Toggle Required attributes
            document.getElementById('amount').required = !hideCommon;
            document.getElementById('date').required = !hideCommon;

            document.getElementById('donor-name').required = isDonation;
            document.getElementById('category').required = isExpense;

            document.getElementById('seva-member').required = isSeva;
            document.getElementById('seva-task').required = isSeva;

            document.getElementById('att-name').required = isAttendance;
            document.getElementById('att-family').required = isAttendance;
            document.getElementById('att-pax').required = isAttendance;
        });
    });

    // Submssion
    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const type = document.querySelector('input[name="type"]:checked').value;
        const amount = document.getElementById('amount').value;
        const date = document.getElementById('date').value;

        if (type === 'donation') {
            store.addDonation({
                name: document.getElementById('donor-name').value,
                family: document.getElementById('family-name').value,
                amount,
                date
            });
        } else if (type === 'expense') {
            store.addExpense({
                category: document.getElementById('category').value,
                description: document.getElementById('description').value,
                amount,
                date
            });
        } else if (type === 'seva') {
            store.addAssignment({
                year: currentYear,
                member: document.getElementById('seva-member').value,
                task: document.getElementById('seva-task').value,
                status: 'Pending'
            });
        } else if (type === 'attendance') {
            store.addAttendance({
                year: currentYear,
                name: document.getElementById('att-name').value,
                family: document.getElementById('att-family').value,
                pax: Number(document.getElementById('att-pax').value),
                status: 'Coming' // Default to Coming when adding
            });
        }

        modal.classList.add('hidden');
        transactionForm.reset();

        // Reset visibility to default (Donation) for next open
        document.querySelector('input[name="type"][value="donation"]').click();

        // Refresh Current View & Years List (in case new year added)
        initYearSelector();
        renderAll();
    });
}

// Reports & Export Logic
function initReports() {
    document.getElementById('export-donations-btn').addEventListener('click', () => {
        const data = store.getDonations(currentYear);
        if (data.length === 0) return alert('No donations to export for ' + currentYear);

        const headers = [['Date', 'Name', 'Family', 'Amount']];
        const rows = data.map(d => [formatDate(d.date), d.name, d.family, formatCurrency(d.amount)]);

        downloadPDF(`Donations Report - ${currentYear}`, headers, rows, `Donations_${currentYear}.pdf`);
    });

    document.getElementById('export-expenses-btn').addEventListener('click', () => {
        const data = store.getExpenses(currentYear);
        if (data.length === 0) return alert('No expenses to export for ' + currentYear);

        const headers = [['Date', 'Category', 'Description', 'Amount']];
        const rows = data.map(d => [formatDate(d.date), d.category, d.description, formatCurrency(d.amount)]);

        downloadPDF(`Expenses Report - ${currentYear}`, headers, rows, `Expenses_${currentYear}.pdf`);
    });
}

function downloadPDF(title, headers, rows, filename) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(185, 28, 28); // Theme Primary Color
    doc.text("Muluthan Pooja Finance", 14, 22);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(title, 14, 32);

    // Table
    doc.autoTable({
        head: headers,
        body: rows,
        startY: 40,
        theme: 'grid',
        headStyles: { fillColor: [185, 28, 28], textColor: 255 },
        styles: { font: "helvetica", fontSize: 10 },
        alternateRowStyles: { fillColor: [253, 251, 247] } // Theme creamish
    });

    // Save
    doc.save(filename);
}

// Utility Helpers
function formatCurrency(num) {
    return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        maximumFractionDigits: 0
    }).format(num);
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
    });
}

// ============================================
// Gallery Module Logic
// ============================================

let currentSelectedImageData = null;

function initGallery() {
    const openBtn = document.getElementById('open-photo-modal-btn');
    const emptyAddBtn = document.getElementById('empty-add-photo-btn');
    const closeBtn = document.getElementById('close-photo-modal-btn');
    const modal = document.getElementById('photo-modal');
    const form = document.getElementById('photo-form');
    const dropzone = document.getElementById('gallery-dropzone');
    const dropzoneInput = document.getElementById('dropzone-file-input');
    const fileInput = document.getElementById('photo-file-input');
    const urlInput = document.getElementById('photo-url-input');
    const fileGroup = document.getElementById('photo-file-group');
    const urlGroup = document.getElementById('photo-url-group');
    const previewContainer = document.getElementById('photo-preview-container');
    const previewImg = document.getElementById('photo-preview-img');
    const removePreviewBtn = document.getElementById('remove-preview-btn');
    const sourceRadios = document.querySelectorAll('input[name="photo-source-type"]');
    const photoDate = document.getElementById('photo-date');

    // Lightbox Elements
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxClose = document.getElementById('lightbox-close');

    // Open Modal Handlers
    function openModal() {
        if (!modal) return;
        modal.classList.remove('hidden');
        if (photoDate) photoDate.valueAsDate = new Date();
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (emptyAddBtn) emptyAddBtn.addEventListener('click', openModal);

    // Close Modal Handler
    function closeModal() {
        if (!modal) return;
        modal.classList.add('hidden');
        if (form) form.reset();
        clearPreview();
        const fileRadio = document.querySelector('input[name="photo-source-type"][value="file"]');
        if (fileRadio) fileRadio.checked = true;
        if (fileGroup) fileGroup.classList.remove('hidden');
        if (urlGroup) urlGroup.classList.add('hidden');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Toggle File vs URL
    sourceRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const isFile = e.target.value === 'file';
            fileGroup.classList.toggle('hidden', !isFile);
            urlGroup.classList.toggle('hidden', isFile);
            clearPreview();
        });
    });

    function setPreview(src) {
        currentSelectedImageData = src;
        if (previewImg) previewImg.src = src;
        if (previewContainer) previewContainer.classList.remove('hidden');
    }

    function clearPreview() {
        currentSelectedImageData = null;
        if (previewImg) previewImg.src = '';
        if (previewContainer) previewContainer.classList.add('hidden');
        if (fileInput) fileInput.value = '';
        if (urlInput) urlInput.value = '';
    }

    if (removePreviewBtn) {
        removePreviewBtn.addEventListener('click', clearPreview);
    }

    // File Input change
    if (fileInput) {
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            try {
                const optimizedDataUrl = await compressImageFile(file);
                setPreview(optimizedDataUrl);
                // Auto-fill title if empty
                const titleInput = document.getElementById('photo-title');
                if (titleInput && !titleInput.value) {
                    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
                    titleInput.value = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
                }
            } catch (err) {
                console.error(err);
                alert('Could not process this image. Please try another file.');
            }
        });
    }

    // URL input preview on blur/input
    if (urlInput) {
        urlInput.addEventListener('input', () => {
            const val = urlInput.value.trim();
            if (val) {
                setPreview(val);
            } else {
                clearPreview();
            }
        });
    }

    // Dropzone Quick Upload
    if (dropzone && dropzoneInput) {
        dropzone.addEventListener('click', () => {
            dropzoneInput.click();
        });

        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('drag-active');
        });

        ['dragleave', 'dragend'].forEach(evt => {
            dropzone.addEventListener(evt, () => {
                dropzone.classList.remove('drag-active');
            });
        });

        dropzone.addEventListener('drop', async (e) => {
            e.preventDefault();
            dropzone.classList.remove('drag-active');
            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
                handleQuickUploadFiles(files);
            }
        });

        dropzoneInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) {
                handleQuickUploadFiles(e.target.files);
            }
        });
    }

    // Quick upload multiple / single files dropped directly
    async function handleQuickUploadFiles(fileList) {
        let addedCount = 0;
        for (const file of fileList) {
            if (!file.type.startsWith('image/')) continue;
            try {
                const optimizedUrl = await compressImageFile(file);
                const title = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
                store.addPhoto({
                    year: currentYear,
                    title: title.charAt(0).toUpperCase() + title.slice(1),
                    caption: 'Uploaded to ' + currentYear + ' Pooja Album',
                    url: optimizedUrl,
                    date: new Date().toISOString().split('T')[0]
                });
                addedCount++;
            } catch (err) {
                console.error('Failed to upload file:', file.name, err);
            }
        }
        if (addedCount > 0) {
            renderGallery();
        }
    }

    // Form Submit
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('photo-title').value.trim();
            const caption = document.getElementById('photo-caption').value.trim();
            const date = document.getElementById('photo-date').value;

            if (!currentSelectedImageData) {
                alert('Please choose an image file or provide a valid image URL.');
                return;
            }

            store.addPhoto({
                year: currentYear,
                title,
                caption,
                url: currentSelectedImageData,
                date
            });

            closeModal();
            renderGallery();
        });
    }

    // Lightbox Close Handlers
    function closeLightbox() {
        if (lightboxModal) lightboxModal.classList.add('hidden');
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            if (modal && !modal.classList.contains('hidden')) closeModal();
        }
    });
}

// Compress & resize image to safe dimensions (<1280px) and JPEG 0.8 quality
function compressImageFile(file, maxWidth = 1280, maxHeight = 1280, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    if (width / height > maxWidth / maxHeight) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    } else {
                        width = Math.round((width * maxHeight) / height);
                        maxHeight = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    const emptyState = document.getElementById('gallery-empty-state');
    const photoCountBadge = document.getElementById('gallery-photo-count');
    const subtitle = document.getElementById('gallery-subtitle');

    if (!grid) return;

    const photos = store.getPhotos(currentYear);

    if (photoCountBadge) {
        photoCountBadge.textContent = `${photos.length} Photo${photos.length === 1 ? '' : 's'}`;
    }

    if (subtitle) {
        subtitle.textContent = `Sacred moments, ritual memories, and festivities for ${currentYear}.`;
    }

    if (photos.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    grid.innerHTML = photos.map(photo => `
        <div class="gallery-card" onclick="openLightbox(${photo.id})">
            <div class="gallery-img-wrapper">
                <img src="${photo.url}" alt="${escapeHtml(photo.title)}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'">
                <div class="gallery-hover-overlay">
                    <span class="gallery-zoom-icon">🔍 View Full Photo</span>
                </div>
                <button class="gallery-delete-btn" title="Delete Photo" onclick="event.stopPropagation(); deleteGalleryPhoto(${photo.id});">
                    &times;
                </button>
            </div>
            <div class="gallery-card-body">
                <div class="gallery-card-header">
                    <h4 class="gallery-card-title">${escapeHtml(photo.title)}</h4>
                    <span class="gallery-card-date">${formatDate(photo.date || photo.createdAt)}</span>
                </div>
                ${photo.caption ? `<p class="gallery-card-caption">${escapeHtml(photo.caption)}</p>` : ''}
            </div>
        </div>
    `).join('');
}

// Lightbox Open Trigger
window.openLightbox = function (photoId) {
    const photos = store.getPhotos(currentYear);
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;

    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-image');
    const title = document.getElementById('lightbox-title');
    const caption = document.getElementById('lightbox-caption');
    const date = document.getElementById('lightbox-date');
    const download = document.getElementById('lightbox-download');

    if (!modal) return;

    if (img) img.src = photo.url;
    if (title) title.textContent = photo.title;
    if (caption) caption.textContent = photo.caption || '';
    if (date) date.textContent = formatDate(photo.date || photo.createdAt);
    if (download) {
        download.href = photo.url;
        download.download = `${photo.title.replace(/\s+/g, '_')}_${currentYear}.jpg`;
    }

    modal.classList.remove('hidden');
};

// Delete Trigger
window.deleteGalleryPhoto = function (photoId) {
    if (confirm('Are you sure you want to delete this photo from the gallery?')) {
        const deleted = store.deletePhoto(photoId);
        if (deleted) {
            renderGallery();
        }
    }
};

// HTML Escaping Helper
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

