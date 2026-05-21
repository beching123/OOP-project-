from pathlib import Path
p = Path('src/main/java/com/company/ecommerce/app/DbConnection.java')
for i,line in enumerate(p.read_text(encoding='utf-8').splitlines()[:30], start=1):
    print(i, repr(line))
