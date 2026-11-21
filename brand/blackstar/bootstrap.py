#!/usr/bin/env python3
"""Restore exact owner-supplied BLACKSTAR v5 generator from its compressed source and regenerate export kit."""
import base64, hashlib, pathlib, subprocess, sys, zlib, zipfile
root=pathlib.Path("brand/blackstar")
encoded=(root/"v5-generator.py.zlib.b64").read_text().strip()
source=zlib.decompress(base64.b64decode(encoded))
sha=hashlib.sha256(source).hexdigest()
expected="fe7fc4b49ddd08f138cbdbee4cf63c8986e599be64390473b12aa888d1521b93"
if sha!=expected: raise SystemExit(f"BLACKSTAR generator SHA mismatch: {sha}")
src=root/"source"/"build_blackstar_v5.py"
src.parent.mkdir(parents=True,exist_ok=True)
src.write_bytes(source)
out=root/"v5"
if not (out/"video"/"end-card-black-9x16.png").is_file():
    subprocess.run([sys.executable,str(src),str(out)],check=True)
    import shutil
    destination=root/"blackstar-brand-kit-v5.zip"
    shutil.make_archive(str(destination.with_suffix("")),"zip",root_dir=root,base_dir="v5")
assets=list(out.rglob("*"))
if len([p for p in assets if p.is_file()])<34: raise SystemExit("Incomplete BLACKSTAR kit.")
print("BLACKSTAR v5 generated, SHA256 source:",sha)
