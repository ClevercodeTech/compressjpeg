export async function compressJPEG(file, option, setProgress) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new window.Image();
            img.onload = function () {
                // Create canvas
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                // Set quality based on option
                let quality = 0.8;
                let maxSize = 500 * 1024;
                if (option === 'large') {
                    quality = 0.9;
                    maxSize = 1024 * 1024;
                } else if (option === 'medium') {
                    quality = 0.8;
                    maxSize = 500 * 1024;
                } else if (option === 'small') {
                    quality = 0.6;
                    maxSize = 250 * 1024;
                } else if (option === 'very small') {
                    quality = 0.4;
                    maxSize = 125 * 1024;
                }

                // Compress loop
                let currentQuality = quality;
                let blob = null;
                function compressLoop() {
                    canvas.toBlob(
                        (b) => {
                            if (b.size > maxSize && currentQuality > 0.1) {
                                currentQuality -= 0.05;
                                setProgress(Math.max(10, 100 - (b.size / maxSize) * 100));
                                canvas.toBlob(compressLoop, 'image/jpeg', currentQuality);
                            } else {
                                setProgress(100);
                                resolve(new File([b], 'compressed.jpg', { type: 'image/jpeg' }));
                            }
                        },
                        'image/jpeg',
                        currentQuality
                    );
                }
                compressLoop();
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}