filepath = r'd:\eztravel\DataAccess\ezTravel.Libs\AppDbContext.cs'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

text = __import__('re').sub(r'//.*', '', text)
text = __import__('re').sub(r'\"[^\"\\]*(\\.[^\"\\]*)*\"', '\"\"', text)

stack = []
for i, c in enumerate(text):
    if c == '{':
        stack.append(i)
    elif c == '}':
        if stack:
            stack.pop()
        else:
            print(f'Extra }} at {i}')

if stack:
    print(f'Missing {len(stack)} closing braces. Openings at:')
    for i in stack:
        lines = text[:i].count('\n') + 1
        print(f'Line {lines}')
else:
    print('Braces are balanced.')
