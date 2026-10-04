"""Prepare a static Pages artifact; never edit the preserved original."""
from pathlib import Path
from datetime import datetime, timezone
import base64, hashlib, html, json, os, shutil, subprocess

ROOT = Path(__file__).resolve().parents[1]
def sha(data):
    return hashlib.sha256(data).hexdigest()
def write_json(path, value):
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + '\n', encoding='utf-8', newline='\n')
def git(*args):
    return subprocess.check_output(['git', '-C', str(ROOT), *args]).decode().strip()

def main():
    release = json.loads((ROOT / 'build/release.json').read_text(encoding='utf-8'))
    original = (ROOT / 'originals/Urban-Game.html').read_bytes()
    assert sha(original) == release['original_html_sha256'], 'Original HTML changed'
    source = original.decode('utf-8')
    prefix = 'globalThis.URBAN_EMBEDDED='
    assets, _ = json.JSONDecoder().raw_decode(source.split(prefix, 1)[1])
    extracted = {}
    for name, expected in {
        'assets/buildings.png': 'fb0774fc6b25ff4a128ab6dfbf30ece9d7772cfea98c237e0df84366baa44ab8',
        'assets/valley.png': 'af21300f02d81e2175f08184e06b253870decf3aba4d66b11c07422819b8d9de'
    }.items():
        value = assets[name]
        data = base64.b64decode(value.split(',', 1)[1], validate=True)
        assert sha(data) == expected, name
        extracted[name] = data
        old = json.dumps(value)
        assert source.count(old) == 1
        source = source.replace(old, json.dumps(name), 1)
    inputs = ['originals/Urban-Game.html', 'build/release.json', 'tools/prepare_pages.py']
    fingerprint = sha(b''.join(p.encode() + b'\0' + (ROOT / p).read_bytes() + b'\0' for p in inputs))
    revision = git('rev-parse', 'HEAD')
    dirty = bool(git('status', '--porcelain', '--', *inputs))
    lock = ROOT / 'build/.identity.lock'
    # Exclusive creation makes concurrent allocators fail instead of reusing an ordinal.
    fd = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
    try:
        ledger_path = ROOT / 'build/ledger.json'
        ledger = json.loads(ledger_path.read_text(encoding='utf-8')) if ledger_path.exists() else {'scope': release['scope'], 'next_ordinal': 1, 'attempts': []}
        assert ledger['scope'] == release['scope']
        ordinal = ledger['next_ordinal']
        now = datetime.now(timezone.utc)
        timestamp = now.strftime('%Y%m%dT%H%M%SZ')
        identifier = f"{release['version']}_{release['codename_slug']}_{release['scope']}_build-{ordinal:03d}_{timestamp}_g{revision[:12]}" + (f'_dirty-{fingerprint[:12]}' if dirty else '') + '_' + release['target']
        attempt = {'ordinal': ordinal, 'identifier': identifier, 'built_at_utc': now.isoformat(), 'status': 'reserved'}
        ledger['next_ordinal'] += 1
        ledger['attempts'].append(attempt)
        write_json(ledger_path, ledger)
        print('BUILD ' + identifier, flush=True)
        try:
            manifest = {
                **release, 'ordinal': ordinal, 'build_time_utc': now.isoformat(),
                'source_revision': revision, 'source_dirty': dirty,
                'source_fingerprint_sha256': fingerprint, 'build_input_paths': inputs,
                'identifier': identifier,
                'adaptation': 'Extract two identical PNGs to relative URLs for browser CSS backgrounds; add build identity footer. Gameplay scripts and source narratives unchanged.',
                'assets': {name: {'size_bytes': len(data), 'sha256': sha(data)} for name, data in extracted.items()}
            }
            encoded = json.dumps(manifest, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c')
            source = source.replace('</head>', '<script type="application/json" id="urban-build-manifest">' + encoded + '</script>\n</head>', 1)
            footer = '<footer id="buildIdentity" style="padding:7px 18px;background:#173c3d;color:#fff4d9;font:11px/1.4 system-ui;overflow-wrap:anywhere;user-select:text">Build ' + html.escape(identifier) + '</footer>\n'
            source = source.replace('</body>', footer + '</body>', 1)
            distribution = ROOT / '.builds' / identifier
            distribution.mkdir(parents=True, exist_ok=False)
            (distribution / 'assets').mkdir()
            for name, data in extracted.items():
                (distribution / name).write_bytes(data)
            (distribution / 'index.html').write_bytes(source.encode('utf-8'))
            (distribution / 'Urban-Game.html').write_bytes(original)
            (distribution / '.nojekyll').write_bytes(b'')
            write_json(distribution / 'build-manifest.json', manifest)
            payload = {str(p.relative_to(distribution)).replace('\\', '/'): sha(p.read_bytes()) for p in distribution.rglob('*') if p.is_file()}
            write_json(distribution / 'payload-checksums.json', payload)
            docs = ROOT / 'docs'
            docs.mkdir(exist_ok=True)
            shutil.copytree(distribution, docs, dirs_exist_ok=True)
            assert sha((docs / 'Urban-Game.html').read_bytes()) == release['original_html_sha256']
            assert all(sha((docs / name).read_bytes()) == digest for name, digest in payload.items())
            write_json(ROOT / 'build/current.json', {'identifier': identifier, 'manifest': '../docs/build-manifest.json', 'payload_sha256': payload})
            attempt['status'] = 'succeeded'
            attempt['payload_sha256'] = payload
            print('SUCCESS ' + identifier, flush=True)
        except Exception as error:
            attempt['status'] = 'failed'
            attempt['error'] = str(error)
            print('FAILURE ' + identifier, flush=True)
            raise
        finally:
            write_json(ledger_path, ledger)
    finally:
        os.close(fd)
        lock.unlink()

if __name__ == '__main__':
    main()
