# Mutiganda Yvan VPN — Complete Source Code Architecture & Export Hub

Provide the complete, exhaustive source code that builds the Mutiganda Yvan VPN application across both the native Android platform (Kotlin/Java, VpnService, Gradle) and the React/TypeScript web client, equipped with an interactive in-app Code Explorer and 1-click ZIP export.

> [!IMPORTANT]
> The source code will cover **both** development targets:
> 1. **Complete Android Studio Native Project**: Full Gradle setup, AndroidManifest.xml, `MyvVpnService.kt`, DNS-tunneling / SNI / HTTP proxy engines, and Material 3 UI.
> 2. **Complete React & TypeScript Web Project**: All application components, simulator state engines, cryptography/payload generators, and styling.
> 3. **Export Package**: Instant 1-click ZIP generation using JSZip allowing immediate extraction and compilation in Android Studio and Node.js.

---

## 1. Overview & Core Concept

- **What It Delivers**: A centralized, dual-tab **Source Code Hub** embedded directly into the application header and side navigation. Users can inspect every file, copy individual classes/scripts with one click, search files dynamically, and download complete ready-to-run ZIP archives for Android Studio or web deployment.
- **Target Audience**: Developers, network administrators, and students who need the complete source code to build, customize, or inspect the Mutiganda Yvan VPN client.
- **Language & Accessibility**: Fully accessible in English and Kinyarwanda, with step-by-step setup instructions for Android Studio (compiling APK) and Node.js (running web client).

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Accessing the Code Hub**:
   - The user clicks **"Code z'Iyi App / View Source Code"** in the top navigation bar or the drawer menu.
   - An expanded modal/workspace opens with a clean split-pane code explorer.
2. **Browsing Files**:
   - Left sidebar lists project files organized by target:
     - 📁 **Android Native Project** (`app/src/main/java`, `res/layout`, `build.gradle`, `AndroidManifest.xml`).
     - 📁 **React Web Application** (`src/components`, `src/services`, `src/types`, `package.json`, `vite.config.ts`).
   - Center pane displays formatted syntax-highlighted code with line numbers, file size, language badge, and a **"Copy Code"** button.
3. **Exporting Code**:
   - Dedicated action buttons: **"Download Android Studio ZIP"** and **"Download Web Source ZIP"** bundle all files on-the-fly and save them directly to the user's device.

### Visual Identity & Theme
- **Theme Support**: Seamless compatibility with both light and dark modes matching the existing orange brand accent (`#f97316`).
- **Typography**: Clean display typography (`Plus Jakarta Sans`) paired with monospace font (`JetBrains Mono`) for all code viewers, file paths, and build commands.
- **Layout Math**: High-density code viewer with comfortable 16px container padding, zero horizontal overflow jitter, and responsive touch controls for mobile and desktop screens.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual Android + Web Source Bundles**
  - *Chosen Approach*: Expose both the Android native VPN engine files and the React web application files in the code explorer.
  - *Why*: Satisfies users who want to build the native Android `.apk` in Android Studio as well as developers inspecting the React/Tailwind frontend.
- **Decision 2: Client-side ZIP Generation with JSZip**
  - *Chosen Approach*: Leverage existing `jszip` dependency to create self-contained ZIP packages in browser memory without requiring backend servers.
  - *Why*: Fast, hermetic, works offline, and requires no external network dependencies.
- **Decision 3: Multi-Language Build Guide**
  - *Chosen Approach*: Provide a comprehensive README and build instructions tab in both English and Kinyarwanda (Inzira yo gukora APK muri Android Studio).
  - *Why*: Directly addresses the user's prompt language ("ima code zose zubaste iriya app").

---

## 4. Technical Architecture & Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│                   TopAppBar & SideMenu                      │
│      [ "Code z'Iyi App / Source Code" Button ]              │
└──────────────────────────────┬──────────────────────────────┘
                               │ Opens
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              SourceCodeExplorerModal (Dual View)            │
│  ┌───────────────────────┬───────────────────────────────┐  │
│  │ Target Switcher:      │ Header:                       │  │
│  │ [Android Studio]      │ • File path & size            │  │
│  │ [React Web Client]    │ • [Copy Code] [Download ZIP]  │  │
│  ├───────────────────────┼───────────────────────────────┤  │
│  │ Tree Navigation:      │ Code Viewport (Monospace):    │  │
│  │ • AndroidManifest.xml │ • Syntax-colored lines        │  │
│  │ • MyvVpnService.kt    │ • Line numbers & scrollbar    │  │
│  │ • TunnelEngine.kt     │ • Complete working files      │  │
│  │ • build.gradle.kts    │ • Setup instructions tab      │  │
│  │ • App.tsx / Services  │                               │  │
│  └───────────────────────┴───────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Components & Modules to Enhance
1. `src/data/androidProjectSource.ts`: Verify all Android native files are complete (Manifest, Service, Network Config, Gradle, Layouts, Assets).
2. `src/data/webProjectSource.ts`: Structured collection of all web application files (App.tsx, components, services, types, styling, configuration).
3. `src/components/AndroidCodeModal.tsx`: Elevate into a unified `SourceCodeExplorerModal` supporting both Android & Web projects, file tree navigation, search, and instant ZIP downloading.
4. `src/components/TopAppBar.tsx` & `src/components/SideMenuDrawer.tsx`: Ensure prominent, localized entry points ("Code zose / Source Code") accessible on mobile and desktop.
