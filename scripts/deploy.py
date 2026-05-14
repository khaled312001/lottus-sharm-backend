#!/usr/bin/env python3
"""
Lottus Sharm — Backend deploy fallback script.

Builds locally and uploads to Hostinger via SSH. Use this when GitHub Actions
is unavailable. Requires `paramiko` + `scp` Python packages.

Usage:
    python scripts/deploy.py --target backend
    python scripts/deploy.py --target frontend --frontend-dir ../lottus-sharm-frontend
"""
from __future__ import annotations

import argparse
import os
import subprocess
import sys
import tarfile
import tempfile
from pathlib import Path

try:
    import paramiko
    from scp import SCPClient
except ImportError:
    print("Missing deps. Run: pip install paramiko scp", file=sys.stderr)
    sys.exit(1)

SSH_HOST = os.environ.get("HOSTINGER_HOST", "145.79.20.56")
SSH_PORT = int(os.environ.get("HOSTINGER_PORT", "65002"))
SSH_USER = os.environ.get("HOSTINGER_USER", "u405809647")
SSH_PASS = os.environ.get("HOSTINGER_PASS", "")


def run(cmd: list[str], cwd: str | None = None) -> None:
    print(f"$ {' '.join(cmd)}")
    subprocess.run(cmd, cwd=cwd, check=True, shell=False)


def build_backend(repo_dir: Path) -> Path:
    run(["npm", "ci"], cwd=str(repo_dir))
    run(["npx", "prisma", "generate"], cwd=str(repo_dir))
    run(["npm", "run", "build"], cwd=str(repo_dir))
    out = Path(tempfile.gettempdir()) / "lottus-backend.tar.gz"
    with tarfile.open(out, "w:gz") as tar:
        for name in ("dist", "prisma", "package.json", "package-lock.json", "ecosystem.config.js"):
            p = repo_dir / name
            if p.exists():
                tar.add(p, arcname=name)
        tpl = repo_dir / "templates"
        if tpl.exists():
            tar.add(tpl, arcname="templates")
    print(f"📦 Archive: {out}")
    return out


def build_frontend(repo_dir: Path) -> Path:
    run(["npm", "ci"], cwd=str(repo_dir))
    run(["npm", "run", "build"], cwd=str(repo_dir))
    out = Path(tempfile.gettempdir()) / "lottus-frontend.tar.gz"
    with tarfile.open(out, "w:gz") as tar:
        for name in (".next", "public", "messages", "package.json", "package-lock.json", "next.config.ts"):
            p = repo_dir / name
            if p.exists():
                tar.add(p, arcname=name)
    print(f"📦 Archive: {out}")
    return out


def deploy(archive: Path, remote_app_dir: str, post_cmds: list[str]) -> None:
    print(f"🔌 Connecting to {SSH_USER}@{SSH_HOST}:{SSH_PORT}")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(SSH_HOST, port=SSH_PORT, username=SSH_USER, password=SSH_PASS, look_for_keys=False, allow_agent=False)

    remote_tmp = f"/home/{SSH_USER}/deploy/{archive.name}"
    ssh.exec_command(f"mkdir -p /home/{SSH_USER}/deploy {remote_app_dir}")

    with SCPClient(ssh.get_transport()) as scp:
        print(f"⬆️  Uploading {archive.name}...")
        scp.put(str(archive), remote_tmp)

    cmds = [
        f"mkdir -p {remote_app_dir}",
        f"tar -xzf {remote_tmp} -C {remote_app_dir}",
        f"cd {remote_app_dir}",
    ] + post_cmds + [f"rm -f {remote_tmp}"]
    cmd = " && ".join(cmds)
    print(f"🔧 Running remote: {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    for line in stdout:
        print(line.rstrip())
    for line in stderr:
        print("STDERR:", line.rstrip(), file=sys.stderr)
    code = stdout.channel.recv_exit_status()
    ssh.close()
    if code != 0:
        sys.exit(f"❌ Remote command exited with {code}")
    print("✅ Deploy finished.")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--target", choices=["backend", "frontend"], required=True)
    parser.add_argument("--backend-dir", default=".")
    parser.add_argument("--frontend-dir", default="../lottus-sharm-frontend")
    args = parser.parse_args()

    if not SSH_PASS:
        sys.exit("Set HOSTINGER_PASS env var first.")

    if args.target == "backend":
        archive = build_backend(Path(args.backend_dir).resolve())
        deploy(
            archive,
            remote_app_dir=f"/home/{SSH_USER}/lottus-backend",
            post_cmds=[
                "[ -f .env ] || (echo 'Missing .env'; exit 1)",
                "npm ci --omit=dev",
                "npx prisma migrate deploy",
                "pm2 reload ecosystem.config.js --update-env || pm2 start ecosystem.config.js",
                "pm2 save",
            ],
        )
    else:
        archive = build_frontend(Path(args.frontend_dir).resolve())
        deploy(
            archive,
            remote_app_dir=f"/home/{SSH_USER}/lottus-frontend",
            post_cmds=[
                "[ -f .env ] || (echo 'Missing .env'; exit 1)",
                "npm ci --omit=dev",
                "pm2 reload ecosystem.config.js --update-env || pm2 start ecosystem.config.js",
                "pm2 save",
            ],
        )


if __name__ == "__main__":
    main()
