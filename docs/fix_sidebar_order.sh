#!/bin/bash
echo "开始修复侧边栏章节顺序..."
FILES=$(grep -l "碎片3.2：超时空裁判" public/**/*.html)
for file in $FILES; do
  echo "修复文件: $file"
  sed -i "" "s|碎片3.2：超时空裁判</a>|碎片3.2：首尔太阳</a>|g" "$file"
  sed -i "" "s|碎片3.3：首尔太阳</a>|碎片3.3：超时空裁判</a>|g" "$file"
done
echo "修复完成！"
