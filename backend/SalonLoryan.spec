from pathlib import Path

from PyInstaller.utils.hooks import collect_all

backend_directory = Path(SPECPATH)
project_root = backend_directory.parent
frontend_dist = project_root / "frontend" / "dist"

if not frontend_dist.exists():
    raise FileNotFoundError(
        "No se encontró frontend/dist. "
        "Ejecuta 'npm run build' dentro de frontend antes de empaquetar."
    )

datas = [
    (
        str(frontend_dist),
        "frontend/dist",
    ),
]

hiddenimports = []

for package_name in (
    "uvicorn",
    "fastapi",
    "starlette",
    "pydantic",
    "pydantic_settings",
    "sqlalchemy",
    "multipart",
):
    package_datas, package_binaries, package_hiddenimports = collect_all(
        package_name,
    )
    datas += package_datas
    hiddenimports += package_hiddenimports

a = Analysis(
    ["run_local.py"],
    pathex=[str(backend_directory)],
    binaries=[],
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name="SalonLoryan",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name="SalonLoryan",
)

app = BUNDLE(
    coll,
    name="Salon Loryan.app",
    icon=None,
    bundle_identifier="com.salonloryan.manager",
)
