/**
 * AudioManager.js
 * مسؤل عن إدارة العمليات المتقدمة للصوت مثل التحميل المسبق والتأكد من التزامن
 */

class AudioManager {
    constructor() {
        this.cache = new Map();
    }

    // التحميل المسبق للملفات الصوتية لضمان سرعة التشغيل
    preload(url) {
        if (this.cache.has(url)) return;
        const audio = new Audio();
        audio.src = url;
        audio.preload = 'auto';
        this.cache.set(url, audio);
    }

    // وظيفة افتراضية لتطبيع الصوت (Normalization) - يتم التعامل معها غالباً عبر WaveSurfer
    normalize() {
        // WaveSurfer handles this with 'normalize: true' option
    }
}

export const audioManager = new AudioManager();
