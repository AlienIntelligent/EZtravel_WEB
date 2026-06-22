import re

with open(r'D:\eztravel\docs\CRD_EZtravel.txt', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r'\n+', ' ', text)
text = re.sub(r'\s+', ' ', text)

with open(r'D:\eztravel\docs\CRD_EZtravel_Clean.txt', 'w', encoding='utf-8') as f:
    f.write(text)
