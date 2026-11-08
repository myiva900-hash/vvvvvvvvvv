import React, { useState, useMemo } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  Folder, 
  Search, 
  Sparkles, 
  Layers, 
  BookOpen, 
  Smartphone, 
  Globe, 
  FileArchive, 
  ChevronRight,
  Info
} from 'lucide-react';
import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES, AndroidFile } from '../data/androidProjectSource';
import { WEB_PROJECT_FILES, WebFile } from '../data/webProjectSource';

export type UnifiedCodeFile = {
  id: string;
  category: 'android' | 'web' | 'guide';
  path: string;
  filename: string;
  language: string;
  content: string;
  description: string;
};

interface AndroidCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'android' | 'web' | 'guide';
}

export const AndroidCodeModal: React.FC<AndroidCodeModalProps> = ({ 
  isOpen, 
  onClose,
  initialTab = 'android'
}) => {
  const [activeCategory, setActiveCategory] = useState<'android' | 'web' | 'guide'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [zipStatus, setZipStatus] = useState<string | null>(null);

  // Normalize files into unified collection
  const allFiles: UnifiedCodeFile[] = useMemo(() => {
    const androidList: UnifiedCodeFile[] = ANDROID_PROJECT_FILES.map(f => ({
      ...f,
      id: `android:${f.path}`,
      category: 'android' as const,
    }));

    const webList: UnifiedCodeFile[] = WEB_PROJECT_FILES.map(f => ({
      ...f,
      id: `web:${f.path}`,
      category: 'web' as const,
    }));

    const guideFile: UnifiedCodeFile = {
      id: 'guide:setup',
      category: 'guide' as const,
      path: 'AMABWIRIZA_SETUP_GUIDE.md',
      filename: 'Inzira yo Kubaka / Setup Guide.md',
      language: 'markdown',
      description: 'Amabwiriza yuzuye mu Kinyarwanda no mu Cyongereza yo gukora APK muri Android Studio no gutangiza Web App',
      content: `# Mutiganda Yvan VPN — Amabwiriza yo Kubaka no Gukoresha Code Zose
(Full Android Studio & Web Client Build Guide)

Mwaramutse! Hano hari amabwiriza arambuye yerekana uburyo bwo gukoresha code zose z'iyi application ya Mutiganda Yvan VPN:

---

## IGICE CYA 1: UBURYO BWO KUBAKA ANDROID APK (Android Studio)

1. Kanda kuri buto yo hejuru yitwa **"Download Android (.ZIP)"** cyangwa **"Download All Source (.ZIP)"**.
2. Fungura dosiye ya ZIP kuri mudasobwa yawe (Extract to Folder).
3. Fungura **Android Studio** (verisiyo nshya nka Ladybug, Iguana cyangwa Hedgehog).
4. Kanda **File > Open**, maze ushake aho washyinguye dosiye zafunguwe.
5. Android Studio izahita itangira guhuza dependencies ukoresheje Gradle (\`build.gradle.kts\`).
6. **Aho guhindurira Server ya VPN**:
   - Fungura \`app/src/main/java/com/mutigandayvan/vpn/service/MyvVpnService.kt\`.
   - Reba ahanditse \`serverHost = "node-auto.myv-vpn.net"\` maze ushyiremo aderesi cyangwa IP ya server yawe nyakuri ya VPN.
7. **Gukora APK cyangwa gushyira kuri telefoni**:
   - Huza telefoni yawe ya Android na mudasobwa ukoresheje umugozi wa USB (wabanje gufungura USB Debugging muri Developer Options).
   - Kanda buto y'icyatsi yitwa **Run 'app' (Shift + F10)**.
   - Niba ushaka kubika dosiye ya APK: Kanda **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

---

## IGICE CYA 2: UBURYO BWO GUTANGIZA REACT WEB APP (Frontend)

1. Fungura terminal cyangwa command prompt mu buhagarikero bw'umushinga wa Web.
2. Shyiramo ibikoresho byose bikenewe:
\`\`\`bash
npm install
\`\`\`
3. Tangiza seriveri y'iterambere (Local Dev Server):
\`\`\`bash
npm run dev
\`\`\`
4. Fungura muri browser yawe: \`http://localhost:3000\`
5. Niba ushaka kubaka verisiyo izajya ku murongo (Production Build):
\`\`\`bash
npm run build
\`\`\`

---

## IGICE CYA 3: IBYEREKEYE IYI APPLICATION (Technical Overview)

- **VpnService**: Ikoresha API ya leta ya Android ifungura interifasi ya virtual TUN (\`tun0\`) yo kohereza amakuru mu muyoboro wizewe.
- **Payload Engine**: Ifasha gushyiramo ibimenyetso nka \`[crlf]\`, \`[host]\`, \`[split]\`, n'ibindi mu gihe cyo gukoresha HTTP Proxy.
- **Config Encryption**: Amadosiye ya \`.myv\` afungirwa hamwe n'umwirondoro wa telefoni (Hardware ID) n'ijambo ry'ibanga ryihariye (Password).
`
    };

    return [...androidList, ...webList, guideFile];
  }, []);

  // Filtered list based on active category and search
  const visibleFiles = useMemo(() => {
    let list = allFiles;
    if (activeCategory === 'android') {
      list = allFiles.filter(f => f.category === 'android');
    } else if (activeCategory === 'web') {
      list = allFiles.filter(f => f.category === 'web');
    } else if (activeCategory === 'guide') {
      list = allFiles.filter(f => f.category === 'guide');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(f => 
        f.filename.toLowerCase().includes(q) ||
        f.path.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allFiles, activeCategory, searchQuery]);

  const [selectedFile, setSelectedFile] = useState<UnifiedCodeFile>(() => allFiles[0]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadAndroidZip = async () => {
    try {
      setZipStatus('Zipping Android Studio project...');
      const zip = new JSZip();

      ANDROID_PROJECT_FILES.forEach(file => {
        zip.file(file.path, file.content);
      });

      // Add Gradle wrapper
      zip.file(
        'gradle/wrapper/gradle-wrapper.properties',
        'distributionBase=GRADLE_USER_HOME\ndistributionPath=wrapper/dists\ndistributionUrl=https\\://services.gradle.org/distributions/gradle-8.9-bin.zip\nzipStoreBase=GRADLE_USER_HOME\nzipStorePath=wrapper/dists\n'
      );

      zip.file(
        'settings.gradle.kts',
        'pluginManagement {\n    repositories {\n        google()\n        mavenCentral()\n        gradlePluginPortal()\n    }\n}\ndependencyResolutionManagement {\n    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)\n    repositories {\n        google()\n        mavenCentral()\n    }\n}\nrootProject.name = "MutigandaYvanVPN"\ninclude(":app")\n'
      );

      zip.file(
        'build.gradle.kts',
        '// Top-level build file for Mutiganda Yvan VPN\nplugins {\n    alias(libs.plugins.android.application) apply false\n    alias(libs.plugins.kotlin.android) apply false\n}\n'
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mutiganda-yvan-vpn-android-project.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating android zip:', err);
    } finally {
      setZipStatus(null);
    }
  };

  const handleDownloadWebZip = async () => {
    try {
      setZipStatus('Zipping React Web project...');
      const zip = new JSZip();

      WEB_PROJECT_FILES.forEach(file => {
        zip.file(file.path, file.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mutiganda-yvan-vpn-web-project.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating web zip:', err);
    } finally {
      setZipStatus(null);
    }
  };

  const handleDownloadAllZip = async () => {
    try {
      setZipStatus('Generating complete source bundle...');
      const zip = new JSZip();

      // Android folder
      const androidFolder = zip.folder('android-project');
      if (androidFolder) {
        ANDROID_PROJECT_FILES.forEach(file => {
          androidFolder.file(file.path, file.content);
        });
        androidFolder.file(
          'gradle/wrapper/gradle-wrapper.properties',
          'distributionBase=GRADLE_USER_HOME\ndistributionPath=wrapper/dists\ndistributionUrl=https\\://services.gradle.org/distributions/gradle-8.9-bin.zip\nzipStoreBase=GRADLE_USER_HOME\nzipStorePath=wrapper/dists\n'
        );
        androidFolder.file(
          'settings.gradle.kts',
          'pluginManagement {\n    repositories {\n        google()\n        mavenCentral()\n        gradlePluginPortal()\n    }\n}\ndependencyResolutionManagement {\n    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)\n    repositories {\n        google()\n        mavenCentral()\n    }\n}\nrootProject.name = "MutigandaYvanVPN"\ninclude(":app")\n'
        );
        androidFolder.file(
          'build.gradle.kts',
          '// Top-level build file for Mutiganda Yvan VPN\nplugins {\n    alias(libs.plugins.android.application) apply false\n    alias(libs.plugins.kotlin.android) apply false\n}\n'
        );
      }

      // Web folder
      const webFolder = zip.folder('web-project');
      if (webFolder) {
        WEB_PROJECT_FILES.forEach(file => {
          webFolder.file(file.path, file.content);
        });
      }

      // Root README
      zip.file(
        'README_START_HERE.md',
        '# Mutiganda Yvan VPN — Complete Source Code\n\nThis archive contains both projects:\n- `android-project/`: Full Android Studio Kotlin project with VpnService implementation.\n- `web-project/`: Full React & TypeScript Vite application.\n\nCreated for Mutiganda Yvan VPN.'
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mutiganda-yvan-vpn-full-source-bundle.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating all zip:', err);
    } finally {
      setZipStatus(null);
    }
  };

  const lineCount = selectedFile ? selectedFile.content.split('\n').length : 0;
  const byteCount = selectedFile ? new Blob([selectedFile.content]).size : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 select-none">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-5xl w-full h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150 overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-orange-50/80 dark:bg-orange-950/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                  Code zose z'Iyi App / Complete Source Code
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold border border-orange-500/20">
                  {allFiles.length} Dosiye / Files
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Official Android Studio Kotlin Engine + React Web Client + Setup Guide
              </p>
            </div>
          </div>

          {/* Export Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button
              onClick={handleDownloadAndroidZip}
              disabled={Boolean(zipStatus)}
              title="Download Android Studio Project as ZIP"
              className="px-2.5 sm:px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-orange-500" />
              <span className="hidden sm:inline">Android Studio (.ZIP)</span>
              <span className="sm:hidden">Android ZIP</span>
            </button>

            <button
              onClick={handleDownloadWebZip}
              disabled={Boolean(zipStatus)}
              title="Download React Web Project as ZIP"
              className="px-2.5 sm:px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-sky-500" />
              <span className="hidden sm:inline">Web Client (.ZIP)</span>
              <span className="sm:hidden">Web ZIP</span>
            </button>

            <button
              onClick={handleDownloadAllZip}
              disabled={Boolean(zipStatus)}
              title="Download Complete Source Bundle with All Projects"
              className="px-3 sm:px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileArchive className="w-3.5 h-3.5" />
              <span>{zipStatus || 'Download All (.ZIP)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Switcher Tabs */}
        <div className="px-4 py-2 bg-slate-100/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 p-0.5 bg-slate-200 dark:bg-slate-800/80 rounded-lg">
            <button
              onClick={() => {
                setActiveCategory('android');
                const first = allFiles.find(f => f.category === 'android');
                if (first) setSelectedFile(first);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeCategory === 'android'
                  ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android Kotlin ({ANDROID_PROJECT_FILES.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveCategory('web');
                const first = allFiles.find(f => f.category === 'web');
                if (first) setSelectedFile(first);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeCategory === 'web'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Web React ({WEB_PROJECT_FILES.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveCategory('guide');
                const guide = allFiles.find(f => f.category === 'guide');
                if (guide) setSelectedFile(guide);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors ${
                activeCategory === 'guide'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Inzira yo Kubaka (Guide)</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-48 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Shakisha dosiye / Search files..."
              className="w-full pl-8 pr-3 py-1 text-xs rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Workspace Body: Left File Tree & Right Code View */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          
          {/* File Explorer Tree */}
          <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 overflow-y-auto shrink-0 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-orange-500" />
                  <span>Dosiye z'Umushinga ({visibleFiles.length})</span>
                </span>
                <span className="text-[9px] font-mono text-slate-400">
                  {activeCategory.toUpperCase()}
                </span>
              </div>

              <div className="space-y-0.5 mt-1">
                {visibleFiles.map(file => (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono transition-colors flex items-center justify-between gap-2 ${
                      selectedFile.id === file.id
                        ? 'bg-orange-500 text-white font-bold shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="truncate flex items-center gap-1.5">
                      <ChevronRight className={`w-3 h-3 shrink-0 ${selectedFile.id === file.id ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{file.filename}</span>
                    </span>
                    <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded shrink-0 font-sans ${
                      selectedFile.id === file.id
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {file.language}
                    </span>
                  </button>
                ))}

                {visibleFiles.length === 0 && (
                  <div className="p-4 text-center text-xs text-slate-400">
                    Nta dosiye ibonetse ijyanye na "{searchQuery}".
                  </div>
                )}
              </div>
            </div>

            {/* Explanatory footer banner */}
            <div className="mt-4 p-2.5 bg-orange-100/60 dark:bg-orange-950/30 rounded-xl text-[10px] text-slate-600 dark:text-slate-400 leading-normal border border-orange-200/50 dark:border-orange-900/50">
              <span className="font-bold text-orange-700 dark:text-orange-400 block mb-0.5 flex items-center gap-1">
                <Info className="w-3 h-3" />
                <span>Ubusobanuro bwa Code:</span>
              </span>
              Izi code zose zubaka umuyoboro w'ukuri wa VPN (Virtual TUN interface) ku bakoresha Android, zikanafatanya na payload generator ikora mu buryo bwa HTTP CONNECT & TLS SNI.
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col min-w-0 bg-slate-950 text-slate-100 overflow-hidden">
            
            {/* Code Header Bar */}
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-2 truncate">
                <span className="font-mono text-orange-400 text-[11px] truncate font-semibold">
                  {selectedFile.path}
                </span>
                <span className="text-slate-600 hidden sm:inline">·</span>
                <span className="text-slate-400 text-[10px] hidden sm:inline truncate">
                  {selectedFile.description}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono text-slate-400 hidden md:inline">
                  {lineCount} lines · {(byteCount / 1024).toFixed(1)} KB
                </span>

                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-[11px] font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Yanakiriwe / Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Koporora / Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Code Content */}
            <div className="flex-1 p-4 font-mono text-[11px] leading-relaxed overflow-y-auto select-text text-slate-200 bg-[#0b0f19]">
              <pre className="whitespace-pre font-mono">
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
