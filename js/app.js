// app.js - 主初始化
(async function() {
    // 先打开数据库
    await App.db.open();
    // 再加载存储（需要数据库读取背景图）
    await App.loadFromStorage();
    // 应用背景
    App.background.apply();
    // 渲染快捷方式
    App.shortcuts.render();
    // 启动时间
    App.time.start();
    // 初始化UI
    App.ui.init();
    console.log('🚀 导航页已就绪 (IndexedDB 支持大图)');
})();