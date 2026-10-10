#!/usr/bin/env bash
curl -s --max-time 45 -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d @- << 'JSON'
{"model":"Llama-3.2-3B-Instruct","messages":[{"role":"user","content":"Reply: OK"}],"max_tokens":5,"temperature":0.1}
JSON
echo ""
echo "--- DONE ---"
