import os, glob

search_text = 'process.env.NEXT_PUBLIC_API_SERVER_URL || "http://localhost:8092"'
replace_text = '(typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_API_SERVER_URL || "http://localhost:8092"))'

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()
            if search_text in content:
                content = content.replace(search_text, replace_text)
                with open(path, 'w') as f:
                    f.write(content)
                print(f"Fixed {path}")

search_text2 = 'process.env.NEXT_PUBLIC_API_SERVER_URL ?? "http://localhost:8092"'
replace_text2 = '(typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_API_SERVER_URL ?? "http://localhost:8092"))'
for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()
            if search_text2 in content:
                content = content.replace(search_text2, replace_text2)
                with open(path, 'w') as f:
                    f.write(content)
                print(f"Fixed {path}")

