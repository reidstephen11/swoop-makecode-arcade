import sys
tpl = open('main.template.ts').read()
ground = open('ground.txt').read().rstrip('\n')
open('main.ts','w').write(tpl.replace('@@GROUND@@', ground))
print('rendered main.ts')
