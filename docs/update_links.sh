#!/bin/bash
find public -name "*.html" -type f | while read file; do
  sed -i "" "s|network-hermit.html|seoul-sol.html|g" "$file"
  sed -i "" "s|碎片3.3：投资才是真正的修行|碎片3.3：首尔太阳|g" "$file"
  sed -i "" "s|quantum-minimalism.html|spacetime-trial.html|g" "$file"
  sed -i "" "s|碎片3.2：算法寡欲主义|碎片3.2：超时空裁判|g" "$file"
done
echo "链接更新完成!"
