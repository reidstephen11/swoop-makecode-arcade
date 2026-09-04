N = 16

def blank():
    return [['.'] * N for _ in range(N)]

def ellipse(g, cx, cy, rx, ry, col):
    for y in range(N):
        for x in range(N):
            if ((x + .5 - cx) / rx) ** 2 + ((y + .5 - cy) / ry) ** 2 <= 1:
                g[y][x] = col

def poly(g, pts, col):
    for y in range(N):
        xs = []
        yy = y + .5
        for i in range(len(pts)):
            x1, y1 = pts[i]; x2, y2 = pts[(i + 1) % len(pts)]
            if (y1 <= yy < y2) or (y2 <= yy < y1):
                xs.append(x1 + (yy - y1) * (x2 - x1) / (y2 - y1))
        xs.sort()
        for i in range(0, len(xs) - 1, 2):
            for x in range(N):
                if xs[i] <= x + .5 <= xs[i + 1]:
                    g[y][x] = col

def outline(g):
    out = [row[:] for row in g]
    for y in range(N):
        for x in range(N):
            if g[y][x] != '.':
                continue
            for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
                ny, nx = y + dy, x + dx
                if 0 <= ny < N and 0 <= nx < N and g[ny][nx] not in '.f':
                    out[y][x] = 'f'; break
    return out

def bird(wing):
    g = blank()
    poly(g, [(4,7),(0.2,4.6),(1.6,8.5),(0.2,11.4),(4,10)], '1')          # forked tail
    if wing == 'up':
        poly(g, [(4.6,8.4),(9.6,1.4),(11.6,8.6)], '1')
    else:
        poly(g, [(4.6,8.4),(6.2,14.8),(10.4,8.6)], '1')
    ellipse(g, 7.4, 8.6, 5.2, 2.7, '1')                                   # body
    ellipse(g, 11.6, 7.4, 2.7, 2.6, '1')                                  # head
    for y in range(N):                                                    # underside shading
        for x in range(N):
            if g[y][x] == '1' and 10 <= y <= 11 and 3 <= x <= 11:
                g[y][x] = 'b'
    poly(g, [(13.5,6.4),(16,8.4),(13.5,10)], '4')                         # beak
    g[7][12] = '2'                                                        # eye
    return outline(g)

for w in ('up', 'down'):
    rows = [''.join(r) for r in bird(w)]
    assert all(len(r) == N for r in rows)
    print('--- ' + w)
    print('\n'.join(rows))
    open('crow_%s.txt' % w, 'w').write('\n'.join('        ' + r for r in rows))
