"""Regressions for persistent dual-format cover delivery, gating and export."""
import copy
import json
from pathlib import Path

import jsonschema
import pytest
from PIL import Image
from pydantic import ValidationError

from lib.config_model import OpenMontageConfig
from lib.checkpoint import CheckpointValidationError, write_checkpoint
from schemas.artifacts import validate_artifact
from tools.publishers.export_bundle import ExportBundle


def package(root: Path) -> dict:
    root.mkdir(parents=True, exist_ok=True)
    assets=[]
    for name,ratio,size,role in [('portrait','3:4',(30,40),'primary'),('landscape','4:3',(40,30),'variant')]:
        Image.new('RGB',size,'#537F99').save(root/f'{name}.png')
        source={'kind':'codex_builtin_image_gen','source_tool':'image_gen','provider':'codex','path':f'{name}.png'}
        assets.append({'id':name,'path':f'{name}.png','format':'png','width':size[0],'height':size[1],
            'aspect_ratio':ratio,'role':role,'text_overlay':['Test'],'source_tool':'native','visual_source':source})
    return {'version':'1.2','status':'ready','source_video_path':'renders/final.mp4',
        'primary_cover':assets[0],'variants':[assets[1]],'generation_policy':'codex_generated_visual_native_text',
        'cover_approach':'composited','visual_source':assets[0]['visual_source'],
        'verification':{'file_exists':True,'dimensions_match':True,'text_checked':True,
            'mobile_readability_checked':True,'content_match':True,'issues':[]}}


def test_missing_and_partial_configs_keep_both_cover_outputs(tmp_path):
    for path in [tmp_path/'missing.yaml',tmp_path/'partial.yaml']:
        if path.name=='partial.yaml':path.write_text('cover_defaults:\n  exact_text_compositor: native\n')
        config=OpenMontageConfig.load(path)
        assert [(x.aspect_ratio,x.width,x.height) for x in config.cover_defaults.formats]==[
            ('3:4',1080,1440),('4:3',1440,1080)]


def test_bad_config_cannot_silently_omit_landscape_or_mislabel_portrait():
    settings=OpenMontageConfig().model_dump()
    settings['cover_defaults']['formats'].pop()
    with pytest.raises(ValidationError):OpenMontageConfig.model_validate(settings)
    settings=OpenMontageConfig().model_dump()
    settings['cover_defaults']['formats'][0]['width']=1920
    with pytest.raises(ValidationError):OpenMontageConfig.model_validate(settings)


@pytest.mark.parametrize('defect',['missing_landscape','wrong_ratio','same_file','missing_source'])
def test_v12_rejects_incomplete_or_rebadged_covers(tmp_path,defect):
    artifact=package(tmp_path)
    if defect=='missing_landscape':artifact['variants']=[]
    if defect=='wrong_ratio':artifact['variants'][0]['height']=40
    if defect=='same_file':artifact['variants'][0]['path']=artifact['primary_cover']['path']
    if defect=='missing_source':del artifact['variants'][0]['visual_source']
    with pytest.raises((jsonschema.ValidationError,ValueError)):validate_artifact('cover_package',artifact)


def test_dual_cover_checkpoint_checks_real_files_before_gate(tmp_path):
    root=tmp_path/'film';artifact=package(root)
    write_checkpoint(tmp_path,'film','cover','awaiting_human',{'cover_package':artifact},pipeline_type='animated-explainer')
    before=(root/'checkpoint_cover.json').read_bytes()
    Image.new('RGB',(40,40)).save(root/'landscape.png')
    with pytest.raises(CheckpointValidationError,match='actual dimensions'):
        write_checkpoint(tmp_path,'film','cover','awaiting_human',{'cover_package':artifact},pipeline_type='animated-explainer')
    assert (root/'checkpoint_cover.json').read_bytes()==before


def test_export_keeps_both_formats_and_compatibility_thumbnail(tmp_path):
    root=tmp_path/'film';artifact=package(root)
    video=root/'renders/final.mp4';video.parent.mkdir();video.write_bytes(b'fixture')
    out=tmp_path/'export'
    result=ExportBundle().execute({'video_path':str(video),'title':'Test','project_dir':str(root),
        'cover_package':artifact,'export_dir':str(out)})
    assert result.success,result.error
    assert (out/'thumbnails/cover-3x4.png').read_bytes()==(root/'portrait.png').read_bytes()
    assert (out/'thumbnails/cover-4x3.png').read_bytes()==(root/'landscape.png').read_bytes()
    assert (out/'thumbnails/thumbnail.png').read_bytes()==(root/'portrait.png').read_bytes()
    assert len(json.loads((out/'metadata/metadata.json').read_text())['covers'])==2
    (root/'landscape.png').unlink()
    result=ExportBundle().execute({'video_path':str(video),'title':'Test','project_dir':str(root),
        'cover_package':artifact,'export_dir':str(tmp_path/'incomplete-export')})
    assert not result.success
    assert not (tmp_path/'incomplete-export').exists()


def test_v11_history_is_still_readable(tmp_path):
    artifact=package(tmp_path);artifact['version']='1.1';artifact['variants']=[]
    validate_artifact('cover_package',artifact)
