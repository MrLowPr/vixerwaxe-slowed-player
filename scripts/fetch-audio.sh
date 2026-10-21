#!/usr/bin/env bash
# Refresh the local MP3s in audio/ from the channel's own YouTube uploads.
# Requires: yt-dlp, ffmpeg
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p audio

fetch () {
  local id="$1" name="$2"
  echo ">> $name  (https://youtu.be/${id})"
  yt-dlp -f "bestaudio[ext=m4a]/bestaudio" -x --audio-format mp3 --audio-quality 128K \
         -o "audio/${name}.%(ext)s" "https://youtu.be/${id}"
}

fetch "p-0ZWqiu-LI" "9mm-slowed"
fetch "Jk2gAZQXtxs" "one-chance-slowed"
fetch "tMFVAOcW6iQ" "demons-in-my-soul-slowed"

echo ">> done"
ls -lh audio
