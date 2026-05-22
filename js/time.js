App.time = {
    elements: {
        time: document.getElementById('timeDisplay'),
        date: document.getElementById('dateDisplay'),
        welcome: document.getElementById('welcomeText')
    },
    update: function() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        this.elements.time.textContent = timeStr;

        const days = ['日', '一', '二', '三', '四', '五', '六'];
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const weekday = days[now.getDay()];
        this.elements.date.textContent = `${year}年${month}月${day}日 星期${weekday}`;

        let greeting;
        if (hours < 6) greeting = '夜深了 🌙';
        else if (hours < 9) greeting = '早上好 ☀️';
        else if (hours < 12) greeting = '上午好 🌤️';
        else if (hours < 14) greeting = '中午好 ☀️';
        else if (hours < 18) greeting = '下午好 🌈';
        else if (hours < 21) greeting = '傍晚好 🌅';
        else greeting = '晚上好 🌙';
        this.elements.welcome.textContent = greeting;
    },
    start: function() {
        this.update();
        setInterval(() => this.update(), 1000); // 每秒刷新
    }
};

window.App = App;