#!/usr/bin/env python3
"""Isolated renderer benchmark. No credentials, no publishing."""
import fractions, hashlib, json, pathlib, platform, struct, subprocess, time, zipfile

root = pathlib.Path(__file__).resolve().parents[2]
project = pathlib.Path(__file__).resolve().parent
out = project / "out"
out.mkdir(exist_ok=True)
report = {"status": "running", "fixture": "blackstar-render-spike", "scope": "technical-only; no dialogue or manual QA", "results": {}, "environment": {"platform": platform.platform(), "python": platform.python_version()}}
def save():
    (out / "benchmark.json").write_text(json.dumps(report, indent=2) + "\n")
def cmd(*args):
    subprocess.run(args, cwd=root, check=True)
def capture(*args):
    return subprocess.check_output(args, cwd=root)
def hash_pixels(path):
    return hashlib.sha256(capture("ffmpeg", "-v", "error", "-i", str(path), "-f", "rawvideo", "-pix_fmt", "rgb24", "-")).hexdigest()

try:
    report["environment"]["revision"] = capture("git", "rev-parse", "HEAD").decode().strip()
    report["environment"]["node"] = capture("node", "--version").decode().strip()
    report["environment"]["ffmpeg"] = capture("ffmpeg", "-version").decode().splitlines()[0]
    archive = root / "brand/blackstar/blackstar-brand-kit-v5.zip"
    member = "v5/video/corner-watermark-white-512.png"
    with zipfile.ZipFile(archive) as z:
        info = z.getinfo(member)
        if not 0 < info.file_size <= 5_000_000:
            raise ValueError("Unexpected watermark size")
        data = z.read(info)
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("Not a PNG watermark")
    width, height = struct.unpack(">II", data[16:24])
    if width != 512 or height < 1: raise ValueError("Unexpected watermark dimensions")
    (out / "corner-watermark.png").write_bytes(data)
    report["brand"] = {"path": member, "sha256": hashlib.sha256(data).hexdigest(), "width": width, "height": height, "approval": "repository candidate; uploaded kit not reconciled"}
    cmd("ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "sine=frequency=220:sample_rate=48000:duration=6", "-af", "volume=0.06", str(out / "diagnostic.wav"))
    for name, width, height in (("portrait",1080,1920),("landscape",1920,1080)):
        size=f"{width}x{height}"
        a=out / (name+"-stills"); b=out / (name+"-repeat")
        cmd("node", "core/render/still.mjs", str(project), "0", "2.5", "4", "5.5", "--size", size, "--out", str(a))
        cmd("node", "core/render/still.mjs", str(project), "5.5", "4", "2.5", "0", "--size", size, "--out", str(b))
        jpeg_matches = {}
        for t in ("0","2.5","4","5.5"):
            h1=hash_pixels(a / f"t_{t}.jpg");h2=hash_pixels(b / f"t_{t}.jpg")
            jpeg_matches[t] = h1==h2
        report["results"][name]={"jpeg_frame_matches":jpeg_matches,"manual_review":"not run"}
        save()
        print(name, "JPEG decoded-pixel matches", jpeg_matches, flush=True)
        raw_report=out / (name+"-determinism.json")
        result=subprocess.run(["node",str(project/"determinism.mjs"),str(project),str(width),str(height),str(raw_report)],cwd=root)
        if raw_report.exists():
            report["results"][name]["determinism"]=json.loads(raw_report.read_text())
            save()
        result.check_returncode()
        # Do not waive the JPEG regression: both strict checks must pass.
        if not all(jpeg_matches.values()): raise ValueError(f"{name}: JPEG frame order mismatch")
        raw=out / (name+"-picture.mp4"); final=out / (name+".mp4")
        start=time.perf_counter()
        cmd("node", "core/render/video.mjs", str(project), "--fps", "24", "--workers", "2", "--size", size, "--out", str(raw))
        elapsed=time.perf_counter()-start
        cmd("sh", "core/render/mux.sh", str(raw), str(out/"diagnostic.wav"), str(final), "24", "0")
        details=json.loads(capture("ffprobe","-v","error","-count_frames","-show_streams","-show_format","-of","json",str(final)))
        v=next(s for s in details["streams"] if s["codec_type"]=="video")
        astream=next(s for s in details["streams"] if s["codec_type"]=="audio")
        assert (v["width"],v["height"],v["codec_name"],v["pix_fmt"])==(width,height,"h264","yuv420p"), v
        assert fractions.Fraction(v["avg_frame_rate"])==24 and int(v["nb_read_frames"])==144, v
        assert astream["codec_name"]=="aac", astream
        assert abs(float(details["format"]["duration"])-6)<=0.12, details
        cmd("ffmpeg","-v","error","-xerror","-i",str(final),"-f","null","-")
        report["results"][name].update({"automated_checks":"passed","capture_seconds":round(elapsed,3),"capture_fps":round(144/elapsed,3),"workers":2,"output_bytes":final.stat().st_size,"width":width,"height":height,"manual_review":"not run"})
        print("BENCHMARK",name,json.dumps(report["results"][name]),flush=True)
        save()
    report["status"]="automated_checks_passed"
except Exception as exc:
    report["status"]="failed";report["error"]=str(exc)
    raise
finally:
    save()
