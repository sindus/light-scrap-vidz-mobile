use std::path::{Path, PathBuf};

const FALLBACK_PATHS: &[&str] = &[
    "/usr/local/bin/yt-dlp",
    "/usr/bin/yt-dlp",
    "/opt/homebrew/bin/yt-dlp",
    "/opt/local/bin/yt-dlp",
];

pub struct YtDlpBinary {
    path: PathBuf,
}

impl YtDlpBinary {
    pub fn find() -> Result<Self, String> {
        // 1. Explicit env var override
        if let Ok(p) = std::env::var("YTDLP_PATH") {
            let path = PathBuf::from(&p);
            if path.is_file() {
                return Ok(Self { path });
            }
        }

        // 2. Search $PATH
        if let Ok(path_var) = std::env::var("PATH") {
            for dir in path_var.split(':') {
                let candidate = PathBuf::from(dir).join("yt-dlp");
                if candidate.is_file() {
                    return Ok(Self { path: candidate });
                }
            }
        }

        // 3. ~/.local/bin/yt-dlp (pip --user installs)
        if let Ok(home) = std::env::var("HOME") {
            let candidate = PathBuf::from(home).join(".local/bin/yt-dlp");
            if candidate.is_file() {
                return Ok(Self { path: candidate });
            }
        }

        // 4. Hardcoded fallbacks
        for p in FALLBACK_PATHS {
            let candidate = Path::new(p);
            if candidate.is_file() {
                return Ok(Self {
                    path: candidate.to_path_buf(),
                });
            }
        }

        Err(
            "yt-dlp not found. Install it (https://github.com/yt-dlp/yt-dlp) or set YTDLP_PATH."
                .to_string(),
        )
    }

    pub fn path(&self) -> &Path {
        &self.path
    }
}
