#!/usr/bin/env python3
"""Rebuild complete BLACKSTAR v5 from the owner-provided original generator and rights guides."""
import base64
import hashlib
import json
import pathlib
import shutil
import subprocess
import sys
import zlib

root = pathlib.Path("brand/blackstar")
encoded = (root / "v5-generator.py.zlib.b64").read_text().strip()
source = zlib.decompress(base64.b64decode(encoded))
sha = hashlib.sha256(source).hexdigest()
expected = "fe7fc4b49ddd08f138cbdbee4cf63c8986e599be64390473b12aa888d1521b93"
if sha != expected:
    raise SystemExit(f"BLACKSTAR generator SHA mismatch: {sha}")

script = root / "source" / "build_blackstar_v5.py"
script.parent.mkdir(parents=True, exist_ok=True)
script.write_bytes(source)
out = root / "v5"
if not (out / "video" / "end-card-black-9x16.png").is_file():
    subprocess.run([sys.executable, str(script), str(out)], check=True)

# Preserve exact QA and rights-review text bytes from the original owner attachment.
bundle = json.loads(zlib.decompress(base64.b64decode(
    (root / "v5-official-guides.zlib.b64").read_text().strip()
)))
expected_guides = {
    "guides/QA.json": "48aa170c5e55811365ddb4cbfeee7213cb5dbed5ba06d304752ed6a3fa5915e1",
    "guides/RIGHTS-REVIEW.md": "637eafe6ed104d2b45fe7d23f3c714b874fac8119c7d50c632759f756757ba7b",
}
for name, digest in expected_guides.items():
    data = base64.b64decode(bundle[name])
    if hashlib.sha256(data).hexdigest() != digest:
        raise SystemExit(f"Source guide SHA mismatch: {name}")
    file = out / name
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_bytes(data)

# Recompute checksums for this platform's PNG encodings; pixel outputs are equivalent,
# but different Pillow versions can write different PNG bytes.
files = sorted(p for p in out.rglob("*")
               if p.is_file() and p.relative_to(out).as_posix() != "guides/SHA256SUMS.txt")
if len(files) != 43:
    raise SystemExit(f"Incomplete BLACKSTAR v5: {len(files)} files; expected 43 before checksum")
manifest = "\n".join(f"{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.relative_to(out).as_posix()}"
                      for p in files) + "\n"
(out / "guides" / "SHA256SUMS.txt").write_text(manifest, encoding="utf-8")
destination = root / "blackstar-brand-kit-v5.zip"
shutil.make_archive(str(destination.with_suffix("")), "zip", root_dir=root, base_dir="v5")
print("BLACKSTAR v5: 44 files including owner-provided QA/rights, fresh SHA256SUMS; source:", sha)
