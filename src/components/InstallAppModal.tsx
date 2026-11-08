import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  Check, 
  Share2, 
  Copy, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  FileCode2, 
  ArrowRight,
  QrCode,
  Globe
} from 'lucide-react';
import { usePWAInstall } from '../services/usePWAInstall';
import { MyvLogo } from './MyvLogo';
import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectSource';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSourceCode?: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ 
  isOpen, 
  onClose,
  onOpenSourceCode
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadingApk, setDownloadingApk] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://mutiganda-yvan-vpn.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const handleInstallPWA = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        setInstallSuccess(false);
        onClose();
      }, 2500);
    }
  };

  // Generate an Android package installer (.apk / package bundle)
  const handleDownloadApk = async () => {
    try {
      setDownloadingApk(true);
      const zip = new JSZip();

      // Put the complete Android Studio project and install instructions
      ANDROID_PROJECT_FILES.forEach(f => {
        zip.file(f.path, f.content);
      });

      zip.file(
        'gradle/wrapper/gradle-wrapper.properties',
        'distributionBase=GRADLE_USER_HOME\ndistributionPath=wrapper/dists\ndistributionUrl=https\\://services.gradle.org/distributions/gradle-8.9-bin.zip\nzipStoreBase=GRADLE_USER_HOME\nzipStorePath=wrapper/dists\n'
      );

      zip.file(
        'settings.gradle.kts',
        'rootProject.name = "MutigandaYvanVPN"\ninclude(":app")\n'
      );

      zip.file(
        'AMABWIRIZA_INSTALL_APK.txt',
        `====================================================
MUTIGANDA YVAN VPN — UBURYO BWO GUKORESHA IYI APP
====================================================

1. UBURYO BWA 1: SHYIRA KURI TELEFONI MU ISECONDA RIMWE (PWA)
   Fungura uru rubuga muri Google Chrome kuri telefoni yawe:
   ${currentUrl}
   Maze ukande: "Install App" cyangwa "Add to Home screen".
   Application izahita yicara kuri telefoni yawe nk'izindi porogaramu zose z'ukuri (Standalone App).

2. UBURYO BWA 2: KUBAKA APK MURI ANDROID STUDIO
   - Fungura uyu mushinga muri Android Studio.
   - Kanda: Build > Build Bundle(s) / APK(s) > Build APK(s).
   - Dosiye ya APK (.apk) izahita iboneka muri:
     app/build/outputs/apk/debug/app-debug.apk
   - Shyira iyo dosiye kuri telefoni yawe maze uyikandeho uyishyiremo (Install).

Murakoze gukoresha Mutiganda Yvan VPN!`
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'MutigandaYvanVPN-v2.4.0-Package.apk.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create APK bundle:', err);
    } finally {
      setDownloadingApk(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150 overflow-hidden max-h-[92vh]">
        
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white p-5 relative overflow-hidden shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/15 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md p-1 flex items-center justify-center border border-white/20 shadow-md">
              <MyvLogo size={42} monochrome />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white leading-tight">
                  Mutiganda Yvan VPN
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
                  v2.4.0
                </span>
              </div>
              <p className="text-xs text-orange-100 mt-0.5">
                Shyira iyi App muri Telefoni yawe / Install App on Phone
              </p>
            </div>
          </div>
        </div>

        {/* Body Options */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-slate-800 dark:text-slate-100">
          
          {/* Primary Action 1: 1-Click Install to Phone (PWA Native-like) */}
          <div className="p-4 rounded-2xl bg-orange-50/70 dark:bg-orange-950/20 border-2 border-orange-500/40 relative">
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    1. Shyira kuri Telefoni / Install App
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Koresha nka porogaramu isanzwe ya telefoni (Standalone Icon)
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 px-2 py-0.5 rounded-full uppercase">
                Birihuta cyane
              </span>
            </div>

            {isInstalled ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 rounded-xl flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Iyi App yamaze kwicara kuri telefoni yawe! (Already Installed)</span>
              </div>
            ) : isInstallable ? (
              <button
                onClick={handleInstallPWA}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-extrabold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>{installSuccess ? 'Byakunze / Installing...' : 'Kanda Hano Ushyire App Muri Telefoni'}</span>
              </button>
            ) : isIOS ? (
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                <span className="font-bold text-slate-900 dark:text-slate-100 block">
                  Uburyo bwo kuyishyira kuri iPhone / iPad (Safari):
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  1. Kanda kuri buto ya <strong>Share</strong> (igishushanyo cy'akazu gafite akambi) munsi muri Safari.<br />
                  2. Kanda ahitwa <strong>"Add to Home Screen"</strong>.<br />
                  3. Itegeko ry'iyi App rizahita ryicara ku mbuga ya telefoni yawe!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handleInstallPWA}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-extrabold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Kanda Hano Ushyire App Muri Telefoni (Install)</span>
                </button>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center">
                  Cyangwa muri Google Chrome: Kanda ku matone 3 yo hejuru iburyo <strong>(⋮)</strong> &gt; Hitamo <strong>"Install App"</strong> cyangwa <strong>"Add to Home screen"</strong>.
                </p>
              </div>
            )}
          </div>

          {/* Action 2: Download APK Installer Package */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center shadow-xs">
                  <Download className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    2. Kura APK Muri Telefoni / Download APK
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Dosiye ya Android APK Package hamwe n'amabwiriza yo kuyicaza
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadApk}
              disabled={downloadingApk}
              className="w-full py-2.5 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-orange-400" />
              <span>{downloadingApk ? 'Irimo gukurwamo...' : 'Kuramo Dosiye ya APK Package (.ZIP/.APK)'}</span>
            </button>
          </div>

          {/* Action 3: Web App Link & Sharing */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-500" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  3. Ifungure Kuri Mudasobwa cyangwa Telefoni (Direct Web Link)
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 px-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 truncate select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Koporora'}</span>
              </button>
            </div>
          </div>

          {/* Action 4: Android Studio Kotlin Project Link */}
          {onOpenSourceCode && (
            <div className="pt-1 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">
                Ushaka kureba no guhindura code zose?
              </span>
              <button
                onClick={() => {
                  onClose();
                  onOpenSourceCode();
                }}
                className="font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Fungura Source Code</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
