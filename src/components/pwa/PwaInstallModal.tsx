import React from 'react';
import {
  Download,
  Share,
  PlusSquare,
  CheckCircle2,
  Laptop,
  Smartphone,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ModalDialog } from '../ui/OverlayPrimitives';
import BrandLogo from '../ui/BrandLogo';
import { PwaPlatform } from '../../lib/usePwaInstall';

interface PwaInstallModalProps {
  open: boolean;
  onClose: () => void;
  platform: PwaPlatform;
  canInstallNatively: boolean;
  isStandalone: boolean;
  onNativeInstall: () => Promise<string>;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  open,
  onClose,
  platform,
  canInstallNatively,
  isStandalone,
  onNativeInstall,
}) => {
  const [installing, setInstalling] = React.useState(false);

  const handleInstallClick = async () => {
    setInstalling(true);
    try {
      const outcome = await onNativeInstall();
      if (outcome === 'accepted') {
        onClose();
      }
    } finally {
      setInstalling(false);
    }
  };

  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      title="تثبيت يقين على جهازك"
      subtitle="تجربة تطبيق كاملة وسريعة بدون شريط المتصفح وتعمل دون اتصال"
      maxWidthClass="max-w-lg"
    >
      <div className="flex flex-col gap-5 p-1 sm:p-2 font-tajawal text-ink" dir="rtl">
        {/* Header App Card */}
        <div className="tactile-card p-4 sm:p-5 flex items-center gap-4">
          <div className="shrink-0">
            <BrandLogo size="md" showTagline={false} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-black font-cairo text-ink">
              منصة يقين — تجربة التطبيق المكتملة
            </h3>
            <p className="text-xs text-ink-secondary mt-0.5 leading-relaxed">
              وصول سريع من الشاشة الرئيسية، تشغيل صوتي بالخلفية، وخطوط قرآنية أصيلة محفوظة محلياً.
            </p>
          </div>
        </div>

        {isStandalone ? (
          <div className="recessed-box p-6 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full amber-glow-dot text-white flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <h4 className="text-base font-extrabold font-cairo">التطبيق مثبت بالفعل</h4>
            <p className="text-xs text-ink-secondary max-w-sm">
              أنت تستخدم يقين حالياً كتطبيق مستقل على جهازك. تمتع بتلاوات مستمرة وقراءة خالية من أي تشويش.
            </p>
          </div>
        ) : (
          <>
            {/* Native Install Action if Browser Supports it */}
            {canInstallNatively && (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  disabled={installing}
                  onClick={handleInstallClick}
                  className="w-full tactile-pill active-ayah-glow p-3.5 text-sm sm:text-base font-extrabold text-glow flex items-center justify-center gap-2.5 transition-transform active:scale-[0.98] disabled:opacity-60"
                >
                  <Download size={18} />
                  <span>{installing ? 'جاري التثبيت...' : 'تثبيت يقين بنقرة واحدة'}</span>
                </button>
                <p className="text-[11px] text-center text-ink-muted">
                  سيتم إضافة أيقونة يقين إلى جهازك وفتحها في نافذة تطبيق مستقلة
                </p>
              </div>
            )}

            {/* Platform Tailored Instructions */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-ink-muted px-1">
                {platform === 'ios' ? (
                  <>
                    <Smartphone size={15} />
                    <span>خطوات التثبيت على آيفون وآيباد (Safari)</span>
                  </>
                ) : platform === 'android' ? (
                  <>
                    <Smartphone size={15} />
                    <span>خطوات التثبيت على أندرويد</span>
                  </>
                ) : platform === 'windows' ? (
                  <>
                    <Laptop size={15} />
                    <span>خطوات التثبيت على ويندوز (Windows)</span>
                  </>
                ) : (
                  <>
                    <Laptop size={15} />
                    <span>خطوات التثبيت على ماك (macOS)</span>
                  </>
                )}
              </div>

              {platform === 'ios' ? (
                <div className="recessed-box p-4 flex flex-col gap-3.5 text-xs text-ink-secondary">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full tactile-pill flex items-center justify-center font-bold text-ink shrink-0">
                      ١
                    </span>
                    <p className="leading-relaxed">
                      اضغط على زر <strong className="text-ink">المشاركة (Share)</strong>{' '}
                      <Share size={13} className="inline mx-1 text-glow" /> في شريط أدوات متصفح Safari بالأسفل (أو بالأعلى على آيباد).
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full tactile-pill flex items-center justify-center font-bold text-ink shrink-0">
                      ٢
                    </span>
                    <p className="leading-relaxed">
                      مرر القائمة لأسفل ثم اضغط على{' '}
                      <strong className="text-ink">"إضافة إلى الشاشة الرئيسية"</strong>{' '}
                      <PlusSquare size={13} className="inline mx-1 text-glow" /> (Add to Home Screen).
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full tactile-pill flex items-center justify-center font-bold text-ink shrink-0">
                      ٣
                    </span>
                    <p className="leading-relaxed">
                      اضغط على زر <strong className="text-ink">"إضافة" (Add)</strong> في أعلى يمين الشاشة، وسيظهر تطبيق يقين على شاشتك الرئيسية فوراً.
                    </p>
                  </div>
                </div>
              ) : platform === 'android' && !canInstallNatively ? (
                <div className="recessed-box p-4 flex flex-col gap-3 text-xs text-ink-secondary">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full tactile-pill flex items-center justify-center font-bold text-ink shrink-0">
                      ١
                    </span>
                    <p className="leading-relaxed">
                      اضغط على قائمة خيارات المتصفح <strong className="text-ink">(⋮)</strong> بأعلى الشاشة.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full tactile-pill flex items-center justify-center font-bold text-ink shrink-0">
                      ٢
                    </span>
                    <p className="leading-relaxed">
                      اختر <strong className="text-ink">"تثبيت التطبيق"</strong> أو{' '}
                      <strong className="text-ink">"إضافة إلى الشاشة الرئيسية"</strong>.
                    </p>
                  </div>
                </div>
              ) : platform === 'windows' && !canInstallNatively ? (
                <div className="recessed-box p-4 flex flex-col gap-3 text-xs text-ink-secondary">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full tactile-pill flex items-center justify-center font-bold text-ink shrink-0">
                      ١
                    </span>
                    <p className="leading-relaxed">
                      انقر على أيقونة التثبيت <Download size={13} className="inline mx-1 text-glow" /> الموجودة في شريط عنوان المتصفح (Address Bar) بجانب رابط الموقع.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full tactile-pill flex items-center justify-center font-bold text-ink shrink-0">
                      ٢
                    </span>
                    <p className="leading-relaxed">
                      أو افتح قائمة المتصفح <strong className="text-ink">(...)</strong> ثم اختر <strong className="text-ink">"تطبيقات" (Apps)</strong> ثم <strong className="text-ink">"تثبيت يقين كـ تطبيق"</strong>.
                    </p>
                  </div>
                </div>
              ) : platform === 'mac' && !canInstallNatively ? (
                <div className="recessed-box p-4 flex flex-col gap-3 text-xs text-ink-secondary">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full tactile-pill flex items-center justify-center font-bold text-ink shrink-0">
                      ١
                    </span>
                    <p className="leading-relaxed">
                      في متصفح Safari، افتح قائمة <strong className="text-ink">"ملف" (File)</strong> بالأعلى.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full tactile-pill flex items-center justify-center font-bold text-ink shrink-0">
                      ٢
                    </span>
                    <p className="leading-relaxed">
                      اختر <strong className="text-ink">"إضافة إلى شريط Dock" (Add to Dock)</strong> لتشغيله كتطبيق أصيل بنقرة واحدة.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            {/* App Features Checklist */}
            <div className="pt-2 border-t border-[var(--glass-border-subtle)] grid grid-cols-2 gap-2 text-[11px] text-ink-muted">
              <span className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-glow shrink-0" />
                <span>حجم خفيف جداً وسرعة فائقة</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-glow shrink-0" />
                <span>لا يستهلك مساحة التخزين</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-glow shrink-0" />
                <span>تشغيل تلاوات بالخلفية بدون توقف</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-glow shrink-0" />
                <span>تحديث تلقائي مستمر للمحتوى</span>
              </span>
            </div>
          </>
        )}
      </div>
    </ModalDialog>
  );
};

export default PwaInstallModal;

