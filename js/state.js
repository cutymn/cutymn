// state.js - 全局状态管理 & localStorage读写
const App = window.App || {};

App.DEFAULT_SHORTCUTS = [
    { name: 'Google', url: 'https://www.google.com', icon: '' },
    { name: 'GitHub', url: 'https://www.github.com', icon: '' },
    { name: 'YouTube', url: 'https://www.youtube.com', icon: '' }
];

App.DEFAULT_BG_TYPE = 'gradient';
App.DEFAULT_BG_VALUE = 'gradient1';

// 当前状态
App.state = {
    bgType: App.DEFAULT_BG_TYPE,
    bgValue: App.DEFAULT_BG_VALUE,
    shortcuts: [...App.DEFAULT_SHORTCUTS],
    selectedPreset: 'gradient1',
    pendingBgFileDataUrl: null
};

App.loadFromStorage = async function() {
    try {
        const saved = localStorage.getItem('mynav_settings');
        if (saved) {
            const data = JSON.parse(saved);
            App.state.bgType = data.bgType || App.DEFAULT_BG_TYPE;
            App.state.bgValue = data.bgValue || App.DEFAULT_BG_VALUE;
            App.state.shortcuts = (data.shortcuts && data.shortcuts.length === 3) ? data.shortcuts : [...App.DEFAULT_SHORTCUTS];
            if (data.bgType === 'gradient') App.state.selectedPreset = data.bgValue || 'gradient1';
        }
        // 如果背景是 base64，从 IndexedDB 加载
        if (App.state.bgType === 'base64') {
            const base64 = await App.db.loadBg();
            if (base64) {
                App.state.bgValue = base64;
            } else {
                // 数据库里没有，回退默认
                App.state.bgType = 'gradient';
                App.state.bgValue = 'gradient1';
                App.state.selectedPreset = 'gradient1';
            }
        }
    } catch (e) {
        console.warn('读取设置失败', e);
    }
};

App.saveToStorage = async function() {
    try {
        const data = {
            bgType: App.state.bgType,
            bgValue: (App.state.bgType === 'base64') ? '' : App.state.bgValue,  // 不存长字符串
            shortcuts: App.state.shortcuts
        };
        localStorage.setItem('mynav_settings', JSON.stringify(data));
        // 如果是 base64，存到 IndexedDB
        if (App.state.bgType === 'base64' && App.state.bgValue) {
            await App.db.saveBg(App.state.bgValue);
        } else {
            await App.db.deleteBg();
        }
    } catch (e) {
        App.showToast('⚠️ 存储空间不足，已重置为默认背景');
        App.state.bgType = 'gradient';
        App.state.bgValue = 'gradient1';
        App.state.selectedPreset = 'gradient1';
        App.background.apply();
        App.saveToStorage();
    }
};

window.App = App;