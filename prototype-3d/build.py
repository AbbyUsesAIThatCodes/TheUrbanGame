"""Build the isolated review only. This script never writes to ../docs/."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib,json,os,shutil,subprocess,html
ROOT=Path(__file__).resolve().parent
REPO=ROOT.parent
def sha(data):return hashlib.sha256(data).hexdigest()
def write(path,value):path.write_text(json.dumps(value,indent=2)+'\n',encoding='utf-8',newline='\n')
def main():
    source_paths=sorted([p for folder in ['src','assets'] for p in (ROOT/folder).rglob('*') if p.is_file()]+[ROOT/p for p in ['build.py','package.json','package-lock.json','source-provenance.json','release.json']])
    vendor_paths=['build/three.module.js','build/three.core.js','examples/jsm/controls/OrbitControls.js','LICENSE']
    for p in vendor_paths:
        if not (ROOT/'node_modules/three'/p).is_file():raise SystemExit('Run npm install in prototype-3d first.')
    fingerprint=sha(b''.join(str(p.relative_to(ROOT)).replace('\\','/').encode()+b'\0'+p.read_bytes()+b'\0' for p in source_paths)+b''.join(p.encode()+b'\0'+(ROOT/'node_modules/three'/p).read_bytes() for p in vendor_paths))
    release=json.loads((ROOT/'release.json').read_text())
    revision=subprocess.check_output(['git','rev-parse','HEAD'],cwd=REPO,text=True).strip()
    dirty=bool(subprocess.check_output(['git','status','--porcelain','--',*[str(p.relative_to(REPO)) for p in source_paths]],cwd=REPO,text=True).strip())
    lock=ROOT/'.build.lock';fd=os.open(lock,os.O_CREAT|os.O_EXCL|os.O_WRONLY)
    try:
        ledger_path=ROOT/'build-ledger.json';ledger=json.loads(ledger_path.read_text()) if ledger_path.exists() else {'scope':'local-3d-review','next_ordinal':1,'attempts':[]}
        ordinal=ledger['next_ordinal'];now=datetime.now(timezone.utc)
        identifier=f"{release['version']}_{release['codename_slug']}_{ledger['scope']}_build-{ordinal:03d}_{now:%Y%m%dT%H%M%SZ}_g{revision[:12]}"+(f'_dirty-{fingerprint[:12]}' if dirty else '')+'_3d-review'
        attempt={'ordinal':ordinal,'identifier':identifier,'status':'reserved'};ledger['attempts'].append(attempt);ledger['next_ordinal']+=1;write(ledger_path,ledger)
        print('BUILD '+identifier,flush=True)
        try:
            manifest={'version':release['version'],'release_status':release['release_status'],'codename':release['codename'],'codename_slug':release['codename_slug'],'scope':ledger['scope'],'ordinal':ordinal,'build_time_utc':now.isoformat(),'source_revision':revision,'source_dirty':dirty,'source_fingerprint_sha256':fingerprint,'target':'3d-review','identifier':identifier,'accepted_pages_commit':'5059061dea9c106de5f70d25a6e238629ac76217','rules_script_sha256':sha((ROOT/'src/recovered/rules.js').read_bytes()),'playable_scope':['setup',*[f'round-{n}' for n in range(1,release['last_round']+1)]],'input_paths':[p.relative_to(ROOT).as_posix() for p in source_paths]}
            manifest['display_label']=f"{manifest['version']} {manifest['codename']} Build{ordinal:03d}"
            distribution=ROOT/'.builds'/identifier;distribution.mkdir(parents=True,exist_ok=False)
            shutil.copytree(ROOT/'src',distribution,dirs_exist_ok=True);shutil.copytree(ROOT/'assets',distribution/'assets')
            (distribution/'vendor/addons/controls').mkdir(parents=True)
            for src,dest in [('build/three.module.js','three.module.js'),('build/three.core.js','three.core.js'),('examples/jsm/controls/OrbitControls.js','addons/controls/OrbitControls.js'),('LICENSE','THREE-LICENSE.txt')]:shutil.copyfile(ROOT/'node_modules/three'/src,distribution/'vendor'/dest)
            index=(distribution/'index.html').read_text(encoding='utf-8').replace('Local Development Session',html.escape(manifest['display_label']))
            index=index.replace('</head>','<script type="application/json" id="review-build-manifest">'+json.dumps(manifest).replace('<','\\u003c')+'</script>\n</head>')
            (distribution/'index.html').write_text(index,encoding='utf-8',newline='\n');write(distribution/'build-manifest.json',manifest)
            payload={p.relative_to(distribution).as_posix():sha(p.read_bytes()) for p in distribution.rglob('*') if p.is_file()};write(distribution/'payload-checksums.json',payload)
            shutil.copytree(distribution,ROOT/'dist',dirs_exist_ok=True)
            write(ROOT/'current-build.json',{'identifier':identifier,'manifest':'dist/build-manifest.json','output_directory':'.builds/'+identifier,'payload_sha256':payload})
            attempt['status']='succeeded';print('SUCCESS '+identifier,flush=True)
        except Exception as e:
            attempt['status']='failed';attempt['error']=str(e);print('FAILURE '+identifier,flush=True);raise
        finally:write(ledger_path,ledger)
    finally:os.close(fd);lock.unlink()
if __name__=='__main__':main()
