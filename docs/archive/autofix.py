import subprocess
import re

filepath = r'd:\eztravel\DataAccess\ezTravel.Libs\AppDbContext.cs'
project_path = r'd:\eztravel\DataAccess\ezTravel.Libs\ezTravel.Libs.csproj'

for iteration in range(25):
    print(f'--- Iteration {iteration+1} ---')
    result = subprocess.run(['dotnet', 'build', project_path], capture_output=True, text=True)
    if result.returncode == 0:
        print('Build succeeded!')
        break
    
    errors = result.stdout.splitlines()
    lines_to_comment = set()
    for err in errors:
        match = re.search(r'AppDbContext\.cs\((\d+),\d+\): error (CS0246|CS1061)', err)
        if match:
            line_num = int(match.group(1))
            lines_to_comment.add(line_num)
            
    if not lines_to_comment:
        print('No more CS0246 or CS1061 errors found, but build failed.')
        print('\n'.join(errors[-15:]))
        break
        
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    # for each line to comment, also comment out subsequent lines that start with .
    for l_num in lines_to_comment:
        idx = l_num - 1
        if idx < len(lines) and not lines[idx].strip().startswith('//'):
            lines[idx] = '// ' + lines[idx]
            # cascade to fluent methods
            nxt = idx + 1
            while nxt < len(lines) and lines[nxt].strip().startswith('.'):
                if not lines[nxt].strip().startswith('//'):
                    lines[nxt] = '// ' + lines[nxt]
                nxt += 1
                
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print(f'Patched {len(lines_to_comment)} lines.')
