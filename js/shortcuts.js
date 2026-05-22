// shortcuts.js - 快捷方式管理（支持 emoji 或图片 URL 作为图标）
App.shortcuts = {
    container: document.getElementById('shortcutsContainer'),

    escapeHtml: function(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    // 渲染主页面卡片
    render: function() {
        this.container.innerHTML = '';
        App.state.shortcuts.forEach(shortcut => {
            const card = document.createElement('a');
            card.className = 'shortcut-card';
            card.href = shortcut.url || '#';
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
            card.title = shortcut.name + ' - ' + shortcut.url;

            if (!shortcut.url || shortcut.url.trim() === '') {
                card.href = 'javascript:void(0)';
                card.classList.add('placeholder');
                card.title = '尚未设置网址';
                card.onclick = (e) => {
                    e.preventDefault();
                    App.showToast('💡 请在设置中编辑此快捷方式的网址');
                };
            }

            const iconValue = shortcut.icon || '🌐';
            const iconContent = (iconValue.startsWith('http'))
                ? `<img src="${this.escapeHtml(iconValue)}" class="card-icon-img" alt="">`
                : `<span>${this.escapeHtml(iconValue)}</span>`;

            card.innerHTML = `
                <div class="card-icon">${iconContent}</div>
                <div class="card-name">${this.escapeHtml(shortcut.name || '未命名')}</div>
                <div class="card-hint">点击跳转</div>
            `;
            this.container.appendChild(card);
        });
    },

    // 渲染编辑表单（可以手动输入 emoji 或图片链接）
    renderEditForm: function() {
        const form = document.getElementById('editFormFields');
        form.innerHTML = '';
        App.state.shortcuts.forEach((shortcut, index) => {
            const iconValue = shortcut.icon || '🌐';
            const iconPreview = (iconValue.startsWith('http'))
                ? `<img src="${this.escapeHtml(iconValue)}" style="width:100%;height:100%;object-fit:contain;" alt="">`
                : this.escapeHtml(iconValue);

            const group = document.createElement('div');
            group.className = 'form-group';
            group.innerHTML = `
                <label>📌 快捷方式 ${index + 1}</label>
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                    <div class="card-icon" style="width:40px;height:40px;flex-shrink:0;border-radius:50%;overflow:hidden;background:#f0f3ff;display:flex;align-items:center;justify-content:center;">
                        ${iconPreview}
                    </div>
                    <input type="text" class="edit-icon-input" placeholder="图标(emoji 或图片URL)" value="${this.escapeHtml(iconValue)}" data-index="${index}" data-field="icon" style="flex:1;">
                </div>
                <input type="text" class="edit-name-input" placeholder="网站名称" value="${this.escapeHtml(shortcut.name || '')}" data-index="${index}" data-field="name" style="margin-bottom:6px;">
                <input type="url" class="edit-url-input" placeholder="网址 (https://...)" value="${this.escapeHtml(shortcut.url || '')}" data-index="${index}" data-field="url">
            `;
            form.appendChild(group);
        });
    },

    // 从表单收集数据并保存
    saveFromForm: function() {
        const icons = document.querySelectorAll('.edit-icon-input');
        const names = document.querySelectorAll('.edit-name-input');
        const urls = document.querySelectorAll('.edit-url-input');
        const newShortcuts = [];
        for (let i = 0; i < 3; i++) {
            newShortcuts.push({
                icon: icons[i].value.trim() || '🌐',
                name: names[i].value.trim() || '未命名',
                url: urls[i].value.trim() || ''
            });
        }
        App.state.shortcuts = newShortcuts;
        this.render();
        App.saveToStorage();
    }
};