"""Generate a test variant from the delivered starter, in a scratch directory."""
import re
import sys
from pathlib import Path

tools_dir = Path(__file__).resolve().parent
source = tools_dir.parent / "swoop" / "main.ts"
output = Path.cwd() / "main.ts"
if output.resolve() == source.resolve() or Path.cwd().resolve() in (tools_dir, tools_dir.parent):
    raise SystemExit("Run from a scratch MakeCode project, not the delivered project or tools directory.")
src = source.read_text()
for argument in sys.argv[1:]:
    key, value = argument.split("=", 1)
    if key == "EXTRA":
        extra = Path(value)
        if not extra.exists():
            extra = tools_dir / value
        src += "\n" + extra.read_text()
    else:
        number = int(value)
        src, count = re.subn(r"(let " + re.escape(key) + r" = )\d+", lambda match: match[1] + str(number), src)
        if not count:
            raise SystemExit("Unknown setting: " + key)
output.write_text(src)
print("Variant written:", output)
