import re, sys
tpl = open('main.template.ts').read()
ground = open('ground.txt').read().rstrip('\n')
src = tpl.replace('@@GROUND@@', ground)
for kv in sys.argv[1:]:
    k, v = kv.split('=', 1)
    if k == 'EXTRA':
        src += '\n' + open(v).read()
    else:
        src, n = re.subn(r'(let %s = )\d+' % k, r'\g<1>' + v, src)
        if not n:
            src, n = re.subn(r'game\.onUpdateInterval\(%s,' % k, 'game.onUpdateInterval(%s,' % v, src)
        assert n, 'no match for ' + k
open('main.ts', 'w').write(src)
print('variant:', ' '.join(sys.argv[1:]) or 'default')
