# light-scrap-vidZ — mobile (Android & iOS)

Mobile version of [light-scrap-vidZ](../light-scrap-vidZ). Same idea — download
videos from TikTok, Instagram, YouTube, Facebook and any site supported by
`yt-dlp`, as MP4 or MP3 — but for phones.

## Why client-server?

`yt-dlp` is a Python binary. It **cannot run inside an iOS app** (Apple's sandbox
forbids spawning arbitrary processes, and the App Store bans video-downloader
apps). To get the *same* experience on both iOS and Android, the heavy lifting
runs on a small server you host; the app is a thin client.

```
┌─────────────────────────┐        HTTP / WebSocket        ┌──────────────────────────┐
│  Mobile app (Expo / RN)  │  ───────────────────────────▶ │  Server (Rust + axum)      │
│  iOS + Android           │   URL, quality, audio, count   │  runs yt-dlp, streams       │
│                          │ ◀───────────────────────────  │  progress, serves files     │
│  saves to Photos / Files │     progress + file download    │                            │
└─────────────────────────┘                                 └──────────────────────────┘
```

The server reuses the desktop app's `yt-dlp` command-building and progress-parsing
logic (`builder.rs`, `parser.rs`, `finder.rs`) almost verbatim.

```
light-scrap-vidZ-mobile/
├── server/   Rust (axum) — runs yt-dlp, HTTP + WebSocket API
└── app/      Expo / React Native (TypeScript) — the mobile client
```

---

## 1. Server

Requirements: Rust (stable) and `yt-dlp` + `ffmpeg` installed and on `PATH`
(or set `YTDLP_PATH`).

```bash
cd server
cargo run --release        # listens on 0.0.0.0:8787 by default
```

Environment variables:

| Var          | Default                    | Purpose                                  |
|--------------|----------------------------|------------------------------------------|
| `PORT`       | `8787`                     | Listen port                              |
| `OUTPUT_DIR` | system temp `/light-scrap-vidz` | Where downloads are stored (per-job folder) |
| `YTDLP_PATH` | auto-detected              | Explicit path to the `yt-dlp` binary     |

API:

| Method | Route                          | Purpose                                   |
|--------|--------------------------------|-------------------------------------------|
| GET    | `/api/health`                  | Liveness check (used by the app's Settings)|
| GET    | `/api/info?url=`               | Single-video metadata                     |
| GET    | `/api/playlist?url=`           | Playlist / profile metadata               |
| POST   | `/api/download`                | Start a download → `{ download_id }`      |
| GET    | `/api/download/:id/ws`         | WebSocket: `progress` / `complete` / `error` |
| POST   | `/api/download/:id/cancel`     | Cancel a running download                 |
| GET    | `/api/download/:id/files`      | List produced files                       |
| GET    | `/files/:id/:name`             | Download a produced file                  |

> **Auth / private content:** browser-cookie auth (the desktop feature) does not
> exist on mobile. If you need it, configure cookies **on the server** — pass a
> server-side browser name via the `cookies` query/body field, or extend the
> server to use `--cookies <file>`.

> **Note:** the server keeps downloaded files under `OUTPUT_DIR`. Add a cleanup
> job / cron if you run it long-term.

---

## 2. Mobile app

Requirements: Node 18+, the Expo tooling, and either a physical device with
**Expo Go** or a simulator/emulator.

```bash
cd app
npm install
npx expo install --fix     # reconcile native module versions to the SDK
npx expo start             # then press i (iOS) / a (Android), or scan the QR
```

On first launch, open **⚙ Settings** and enter your server address, e.g.
`http://192.168.1.20:8787` (the phone and server must reach each other — same
Wi-Fi/LAN, or a public/tunnelled URL). Use **Test connection** to verify.

You can also bake a default in `app.json` → `expo.extra.defaultServerUrl`.

### Features (parity with desktop, adapted for mobile)

- Single video or playlist/profile download
- Audio-only extraction (MP3)
- Quality selector (best / 1080p / 720p / 480p)
- Live progress over WebSocket
- Download queue for batch processing
- Local history (AsyncStorage)
- Completion notifications (`expo-notifications`)
- Videos saved to the photo library; audio/other shared via the system sheet

### Building installables

```bash
npm install -g eas-cli
eas build --platform android      # APK / AAB
eas build --platform ios          # requires an Apple Developer account
```

> iOS distribution through the App Store is not viable for a video downloader
> (App Store policy). Use it via a development build, ad-hoc/TestFlight, or
> personal signing.

---

## 3. Development

### Linting & tests

| Where     | Command                              | What it does                                 |
|-----------|--------------------------------------|----------------------------------------------|
| `app/`    | `npm run lint`                       | ESLint (TypeScript + react-hooks)            |
| `app/`    | `npm run tsc`                        | TypeScript typecheck (`tsc --noEmit`)        |
| `app/`    | `npm test`                           | Jest unit tests (lib helpers)                |
| `app/`    | `npm run format`                     | Prettier (write)                             |
| `server/` | `cargo fmt --check`                  | rustfmt check                                |
| `server/` | `cargo clippy --all-targets -- -D warnings` | Clippy (warnings are errors)         |
| `server/` | `cargo test`                         | Unit + HTTP integration tests                |

### Continuous integration

`.github/workflows/ci.yml` runs on every push to `main`/`develop` and on pull
requests, with two jobs: **App** (lint + typecheck + test) and **Server**
(fmt + clippy + test).

### Releases

Push a `vX.Y.Z` tag to cut a release:

```bash
git tag v0.1.0 && git push origin v0.1.0
```

- `release.yml` builds the **server** binary for Linux x86_64 and macOS arm64
  and attaches the `.tar.gz` archives to the GitHub release.
- `android.yml` builds a debug-signed **APK** and attaches it to the release
  (also runnable on demand via *workflow_dispatch*).
