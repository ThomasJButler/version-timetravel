#!/usr/bin/env bash
#
# Crop and convert a version's screenshots to the exact aspect ratios the plate uses.
#
#   ./scripts/prepare-shots.sh <id> <desktop.png> <mobile.png>
#   ./scripts/prepare-shots.sh v3.5 ../repo/shots/home-desktop-matrix.png ../repo/shots/home-mobile-webkit.png
#
# Writes public/shots/<id>-desktop.jpg and <id>-mobile.jpg.
#
# JPEG rather than WebP because sips reads WebP but cannot write it, and this deliberately
# has no dependencies. At these sizes, on dark UI screenshots, the difference is not visible.
#
# The supplied captures are full-page, so they are far taller than the plate and would be
# cropped arbitrarily by object-fit at render time. Cropping here instead makes the result
# deterministic and cuts multi-megabyte PNGs down to something a repo should carry.
#
# Uses sips, which ships with macOS, so this needs no dependency. It is a local authoring
# tool: the outputs are committed, nothing in the build runs it.

set -euo pipefail

if [ $# -ne 3 ]; then
  sed -n '3,12p' "$0" | sed 's/^# \{0,1\}//'
  exit 1
fi

ID="$1"
DESKTOP_SRC="$2"
MOBILE_SRC="$3"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/shots"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

mkdir -p "$OUT"

for f in "$DESKTOP_SRC" "$MOBILE_SRC"; do
  [ -f "$f" ] || { echo "missing: $f" >&2; exit 1; }
done

# Desktop: the plate is 16/10 and the design specifies 1440x900, so take the top of the page.
sips -c 900 1440 --cropOffset 0 0 "$DESKTOP_SRC" --out "$TMP/d.png" >/dev/null
sips -s format jpeg -s formatOptions 85 "$TMP/d.png" --out "$OUT/$ID-desktop.jpg" >/dev/null

# Mobile: captures come in at device pixel ratio, so normalise to 390 wide first, then take
# the top 390x845, which is the 9/19.5 the mobile thumb expects.
sips --resampleWidth 390 "$MOBILE_SRC" --out "$TMP/m.png" >/dev/null
sips -c 845 390 --cropOffset 0 0 "$TMP/m.png" --out "$TMP/m2.png" >/dev/null
sips -s format jpeg -s formatOptions 85 "$TMP/m2.png" --out "$OUT/$ID-mobile.jpg" >/dev/null

for f in "$OUT/$ID-desktop.jpg" "$OUT/$ID-mobile.jpg"; do
  printf '%-40s %s  %s\n' "${f#"$ROOT"/}" \
    "$(sips -g pixelWidth -g pixelHeight "$f" | awk '/pixel/{printf "%sx", $2}' | sed 's/x$//')" \
    "$(du -h "$f" | cut -f1)"
done
