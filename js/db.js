// db.js - IndexedDB 操作
App.db = {
    DB_NAME: 'mynav_bg_db',
    STORE_NAME: 'backgrounds',
    _db: null,

    // 打开数据库
    open: function() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, 1);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                    db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
                }
            };
            request.onsuccess = (e) => {
                this._db = e.target.result;
                resolve(this._db);
            };
            request.onerror = (e) => reject(e.target.error);
        });
    },

    // 保存背景图数据
    saveBg: function(base64) {
        if (!this._db) return Promise.reject('DB not opened');
        return new Promise((resolve, reject) => {
            const tx = this._db.transaction(this.STORE_NAME, 'readwrite');
            const store = tx.objectStore(this.STORE_NAME);
            store.put({ id: 'mainBg', data: base64 });
            tx.oncomplete = () => resolve();
            tx.onerror = (e) => reject(e.target.error);
        });
    },

    // 读取背景图数据
    loadBg: function() {
        if (!this._db) return Promise.reject('DB not opened');
        return new Promise((resolve, reject) => {
            const tx = this._db.transaction(this.STORE_NAME, 'readonly');
            const store = tx.objectStore(this.STORE_NAME);
            const req = store.get('mainBg');
            req.onsuccess = () => resolve(req.result ? req.result.data : null);
            req.onerror = (e) => reject(e.target.error);
        });
    },

    // 删除背景图
    deleteBg: function() {
        if (!this._db) return Promise.reject('DB not opened');
        return new Promise((resolve, reject) => {
            const tx = this._db.transaction(this.STORE_NAME, 'readwrite');
            const store = tx.objectStore(this.STORE_NAME);
            store.delete('mainBg');
            tx.oncomplete = () => resolve();
            tx.onerror = (e) => reject(e.target.error);
        });
    }
};