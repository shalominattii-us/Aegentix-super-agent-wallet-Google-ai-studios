with open('/home/aegentix/gaianet/bin/gaianet', 'r') as f:
    text = f.read()

target = r'\"What is your name?\"}], \"model\"'
replacement = r'\"What is your name?\"}], \"max_tokens\": 5, \"max_completion_tokens\": 5, \"model\"'

if target in text:
    text = text.replace(target, replacement)
    with open('/home/aegentix/gaianet/bin/gaianet', 'w') as f:
        f.write(text)
    print("SUCCESS: patched gaianet startup probe with 5-token limit!")
else:
    print("INFO: target pattern still not matched.")
