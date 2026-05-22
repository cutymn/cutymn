App.background = {
    gradients: {
        gradient1: 'linear-gradient(135deg, #e8eaf6 0%, #f5f0e8 25%, #e8f0f5 50%, #f0e8f0 75%, #e8ecf5 100%)',
        gradient2: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #fecf9a 100%)',
        gradient3: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 50%, #e0f0ff 100%)',
        gradient4: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 50%, #c8f7c5 100%)',
        gradient5: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 50%, #e8d5f5 100%)',
        gradient6: 'linear-gradient(135deg, #2c3e50 0%, #4a5568 40%, #1a1a2e 100%)'
    },
apply: function() {
    const body = document.body;
    body.style.backgroundImage = '';
    body.style.background = '';
    body.classList.remove('has-custom-bg', 'dark-bg');   // 同时移除dark-bg

    if (App.state.bgType === 'gradient') {
        body.style.background = this.gradients[App.state.bgValue] || this.gradients.gradient1;
        body.style.backgroundSize = '400% 400%';
        body.style.animation = 'gradientShift 20s ease infinite';
        // 检测是否为深色预设
        if (App.state.bgValue === 'gradient6') {
            body.classList.add('dark-bg');
        }
    } else if (App.state.bgType === 'url' || App.state.bgType === 'base64') {
        body.classList.add('has-custom-bg');
        body.style.animation = 'none';
        body.style.backgroundImage = `url(${App.state.bgValue})`;
        body.style.backgroundSize = 'cover';
        body.style.backgroundPosition = 'center';
        body.style.backgroundRepeat = 'no-repeat';
        body.style.backgroundAttachment = 'fixed';
    }
},
    updatePresetSelection: function() {
        document.querySelectorAll('.preset-swatch').forEach(sw => {
            sw.classList.remove('selected');
            if (sw.dataset.preset === App.state.selectedPreset && App.state.bgType === 'gradient') {
                sw.classList.add('selected');
            }
        });
    },
    handleFileUpload: function(file) {
        if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
            App.showToast('请选择 JPG / PNG / WebP 格式的图片');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;

            App.state.pendingBgFileDataUrl = dataUrl;
            // 临时预览
            const body = document.body;
            body.classList.add('has-custom-bg');
            body.style.animation = 'none';
            body.style.backgroundImage = `url(${dataUrl})`;
            body.style.backgroundSize = 'cover';
            body.style.backgroundPosition = 'center';
            document.getElementById('bgUrlInput').value = '';
            App.state.selectedPreset = '';
            this.updatePresetSelection();
            App.showToast('✅ 图片已加载，点击保存生效');
        };
        reader.readAsDataURL(file);
    }
};

window.App = App;