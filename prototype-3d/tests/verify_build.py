from pathlib import Path
import hashlib,json,os,re,subprocess,html
ROOT=Path(__file__).resolve().parents[1]
current=json.loads((ROOT/'current-build.json').read_text())
manifest=json.loads((ROOT/'dist/build-manifest.json').read_text())
index=(ROOT/'dist/index.html').read_text(encoding='utf-8')
embedded=json.loads(re.search(r'<script type="application/json" id="review-build-manifest">(.*?)</script>',index,re.S).group(1))
assert embedded==manifest
assert current['identifier']==manifest['identifier']
release=json.loads((ROOT/'release.json').read_text())
assert all(manifest[k]==release[k] for k in ['version','codename','codename_slug','release_status'])
assert json.loads((ROOT/'package.json').read_text())['version']==release['version']
assert manifest['playable_scope']==['setup',*[f'round-{n}' for n in range(1,release['last_round']+1)]]
assert manifest['display_label']==f"{manifest['version']} {manifest['codename']} Build{manifest['ordinal']:03d}"
assert f'<p id="buildIdentity">{html.escape(manifest["display_label"])}</p>' in index
assert '<footer' not in index
for name,digest in current['payload_sha256'].items():
    data=(ROOT/'dist'/name).read_bytes()
    assert hashlib.sha256(data).hexdigest()==digest,name
    assert data==(ROOT/current['output_directory']/name).read_bytes(),name
source_paths=[ROOT/p for p in manifest['input_paths']]
vendor_paths=['build/three.module.js','build/three.core.js','examples/jsm/controls/OrbitControls.js','LICENSE']
fingerprint=hashlib.sha256(b''.join(str(p.relative_to(ROOT)).replace('\\','/').encode()+b'\0'+p.read_bytes()+b'\0' for p in source_paths)+b''.join(p.encode()+b'\0'+(ROOT/'node_modules/three'/p).read_bytes() for p in vendor_paths)).hexdigest()
assert fingerprint==manifest['source_fingerprint_sha256']
ledger_path=ROOT/'build-ledger.json';before=ledger_path.read_bytes();ledger=json.loads(before)
assert len(ledger['attempts'])>=2
assert len({a['identifier'] for a in ledger['attempts']})==len(ledger['attempts'])
assert [a['ordinal'] for a in ledger['attempts']]==list(range(1,ledger['next_ordinal']))
lock=ROOT/'.build.lock';fd=os.open(lock,os.O_CREAT|os.O_EXCL|os.O_WRONLY)
try:
    result=subprocess.run(['python','build.py'],cwd=ROOT,capture_output=True,text=True)
    assert result.returncode!=0 and 'FileExistsError' in result.stderr
    assert ledger_path.read_bytes()==before
finally:os.close(fd);lock.unlink()
assert json.loads((ROOT/'current-build.json').read_text())==current
accepted_diff=subprocess.check_output(['git','diff','--name-only','5059061dea9c106de5f70d25a6e238629ac76217','--','originals','docs','README.md'],cwd=ROOT.parent,text=True)
assert not accepted_diff.strip(),accepted_diff
print(json.dumps({'status':'passed','identifier':manifest['identifier'],'payload_files':len(current['payload_sha256']),'distinct_real_builds':len(ledger['attempts']),'allocator_collision':'rejected without mutation','reused_artifact':'same identity and bytes','source_fingerprint':'matches','accepted_pages_and_originals':'unchanged'},indent=2))
