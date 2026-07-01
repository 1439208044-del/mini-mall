#!/bin/bash
# Mini Mall - GitHub 推送脚本
# 用法: bash push.sh

echo "=== Mini Mall 推送到 GitHub ==="

read -p "GitHub 用户名: " GH_USER
read -sp "GitHub Token (ghp_开头): " GH_TOKEN
echo ""

if [ -z "$GH_USER" ] || [ -z "$GH_TOKEN" ]; then
  echo "❌ 用户名或 token 不能为空"
  exit 1
fi

# 推送
git remote set-url origin "https://${GH_USER}:${GH_TOKEN}@github.com/1439208044-del/mini-mall.git"
git push -u origin main
PUSH_RESULT=$?

# 立即清除 token
git remote set-url origin "https://github.com/1439208044-del/mini-mall.git"

if [ $PUSH_RESULT -eq 0 ]; then
  echo "✅ 推送成功！token 已自动清除"
else
  echo "❌ 推送失败，请检查用户名和 token"
fi
