App.ui = {
    init: function() {
        // 下拉菜单
        this.settingsBtn = document.getElementById('settingsBtn');
        this.dropdown = document.getElementById('dropdownMenu');
        this.bgModal = document.getElementById('bgModalOverlay');
        this.editModal = document.getElementById('editModalOverlay');
        this.toast = document.getElementById('toast');
        this.toastTimer = null;

        this.bindEvents();
        this.createParticles();
    },
    bindEvents: function() {
        // 设置按钮
        this.settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        // 菜单项
        document.getElementById('menuBg').addEventListener('click', () => this.openBgModal());
        document.getElementById('menuEdit').addEventListener('click', () => this.openEditModal());

        // 关闭模态框按钮
        document.getElementById('bgModalClose').addEventListener('click', () => this.closeBgModal());
        document.getElementById('editModalClose').addEventListener('click', () => this.closeEditModal());

        // 模态框遮罩关闭
        this.bgModal.addEventListener('click', (e) => { if (e.target === this.bgModal) this.closeBgModal(); });
        this.editModal.addEventListener('click', (e) => { if (e.target === this.editModal) this.closeEditModal(); });

        // 背景相关事件
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');
        uploadZone.addEventListener('click', () => fileInput.click());
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = 'var(--accent)';
            uploadZone.style.background = 'rgba(91,127,255,0.05)';
        });
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.style.borderColor = 'var(--input-border)';
            uploadZone.style.background = 'var(--input-bg)';
        });
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = 'var(--input-border)';
            uploadZone.style.background = 'var(--input-bg)';
            const file = e.dataTransfer.files[0];
            if (file) App.background.handleFileUpload(file);
        });
        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (file) App.background.handleFileUpload(file);
        });

        // 预设色块
        document.getElementById('presetGrid').addEventListener('click', (e) => {
            const swatch = e.target.closest('.preset-swatch');
            if (!swatch) return;
            const preset = swatch.dataset.preset;
            App.state.selectedPreset = preset;
            App.state.pendingBgFileDataUrl = null;
            document.getElementById('bgUrlInput').value = '';
            fileInput.value = '';
            App.state.bgType = 'gradient';
            App.state.bgValue = preset;
            App.background.apply();
            App.background.updatePresetSelection();
            App.showToast('🎨 预设背景已预览，点击保存生效');
        });

        // 保存背景
        document.getElementById('bgSaveBtn').addEventListener('click', () => {
            if (App.state.pendingBgFileDataUrl) {
                App.state.bgType = 'base64';
                App.state.bgValue = App.state.pendingBgFileDataUrl;
                App.state.selectedPreset = '';
            } else if (document.getElementById('bgUrlInput').value.trim()) {
                const url = document.getElementById('bgUrlInput').value.trim();
                if (!url.match(/^https?:\/\/.+/)) {
                    App.showToast('⚠️ 请输入有效的图片URL');
                    return;
                }
                App.state.bgType = 'url';
                App.state.bgValue = url;
                App.state.selectedPreset = '';
            }
            App.background.apply();
            App.saveToStorage();
            App._bgSnapshot = null;
            this.closeBgModal();
            App.showToast('✅ 背景已保存');
        });

        // 重置背景
        document.getElementById('bgResetBtn').addEventListener('click', () => {
            App.state.bgType = 'gradient';
            App.state.bgValue = 'gradient1';
            App.state.selectedPreset = 'gradient1';
            App.background.apply();
            App.saveToStorage();
            App.background.updatePresetSelection();
            App._bgSnapshot = null;
            this.closeBgModal();
            App.showToast('🔄 背景已重置');
        });

        // 编辑快捷方式保存/取消
        document.getElementById('editSaveBtn').addEventListener('click', () => {
            App.shortcuts.saveFromForm();
            this.closeEditModal();
            App.showToast('✅ 快捷方式已更新');
        });
        document.getElementById('editCancelBtn').addEventListener('click', () => this.closeEditModal());

        // 全局点击关闭下拉菜单
        document.addEventListener('click', (e) => {
            if (!this.dropdown.contains(e.target) && e.target !== this.settingsBtn && !this.settingsBtn.contains(e.target)) {
                this.closeDropdown();
            }
        });

        // ESC关闭所有弹窗
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    },
    toggleDropdown: function() {
        const isActive = this.dropdown.classList.contains('active');
        this.closeAllModals();
        if (!isActive) {
            this.dropdown.classList.add('active');
        } else {
            this.dropdown.classList.remove('active');
        }
    },
    closeDropdown: function() { this.dropdown.classList.remove('active'); },
   openBgModal: function() {
    document.body.classList.add('modal-open');
    this.closeDropdown();
    // 保存当前背景快照（用于取消时恢复）
    App._bgSnapshot = {
        type: App.state.bgType,
        value: App.state.bgValue,
        preset: App.state.selectedPreset
    };
    document.getElementById('bgUrlInput').value = '';
    document.getElementById('fileInput').value = '';
    App.state.pendingBgFileDataUrl = null;
    App.background.updatePresetSelection();
    this.bgModal.classList.add('active');
},
closeBgModal: function() {
    this.bgModal.classList.remove('active');
    // 恢复背景到打开前的状态
    if (App._bgSnapshot) {
        App.state.bgType = App._bgSnapshot.type;
        App.state.bgValue = App._bgSnapshot.value;
        App.state.selectedPreset = App._bgSnapshot.preset;
        App.state.pendingBgFileDataUrl = null;
        App.background.apply();
        App.background.updatePresetSelection();
        App._bgSnapshot = null;
        document.body.classList.remove('modal-open');
    }
},
    openEditModal: function() {
        document.body.classList.add('modal-open');
        this.closeDropdown();
        App.shortcuts.renderEditForm();
        this.editModal.classList.add('active');
    },
    closeEditModal: function() {
        this.editModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    },
    closeAllModals: function() {
        this.closeDropdown();
        this.bgModal.classList.remove('active');
        this.editModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    },
    createParticles: function() {
        const container = document.getElementById('bgParticles');
        container.innerHTML = '';
        const count = 25;
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'bg-particle';
            const size = Math.random() * 8 + 3;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = Math.random() * 18 + 12 + 's';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.opacity = Math.random() * 0.4 + 0.15;
            fragment.appendChild(particle);
        }
        container.appendChild(fragment);
    }
};

App.showToast = function(msg) {
    clearTimeout(this.ui.toastTimer);
    this.ui.toast.textContent = msg;
    this.ui.toast.classList.add('show');
    this.ui.toastTimer = setTimeout(() => {
        this.ui.toast.classList.remove('show');
    }, 2200);
};

window.App = App;