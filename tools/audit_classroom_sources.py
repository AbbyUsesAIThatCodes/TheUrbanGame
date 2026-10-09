"""Read-only check of preserved classroom files and recovered review content."""
from pathlib import Path
import hashlib,json,re,zipfile,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
proto=ROOT/'prototype-3d'
for row in json.loads((ROOT/'preservation/checksums.json').read_text())['files']:
    data=(ROOT/row['path']).read_bytes()
    assert len(data)==row['size_bytes'] and hashlib.sha256(data).hexdigest()==row['sha256'],row['path']
scripts=re.findall(r'<script>(.*?)</script>',(ROOT/'originals/Urban-Game.html').read_text(encoding='utf-8'),re.S)
assert scripts[2].encode()==(proto/'src/recovered/rules.js').read_bytes()
sources,_=json.JSONDecoder().raw_decode(scripts[1].split('globalThis.URBAN_SOURCES = ',1)[1])
assert sources==json.loads((proto/'src/recovered/sources.json').read_text(encoding='utf-8'))
normalize=lambda s:re.sub(r'\s+','',s)
checked=0
for index,deck in enumerate(sources):
    name=['NCH Copy of Urban Game for World History.pptx','NCH Copy of Urban Game Rounds 1-10.pptx'][index]
    with zipfile.ZipFile(ROOT/'originals'/name) as archive:
        assert archive.testzip() is None
        for slide in deck['slides']:
            xml=ET.fromstring(archive.read(f'ppt/slides/slide{slide["number"]}.xml'))
            text=' '.join(n.text or '' for n in xml.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}t'))
            assert normalize(text)==normalize(slide['text']),(name,slide['number'])
            checked+=1
assert checked==53
for name in ['buildings.png','valley.png']:
    assert (proto/'assets'/name).read_bytes()==(ROOT/'docs/assets'/name).read_bytes()
print(json.dumps({'status':'passed','original_files':4,'original_slide_texts':checked,'rules_script':'byte-identical','original_art_pngs':'byte-identical'},indent=2))
