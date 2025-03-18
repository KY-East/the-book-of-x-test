const fs = require('fs');
const path = require('path');

// 配置
const sourceDir = path.resolve(__dirname, '../../docs/src/content');
const targetDir = path.resolve(__dirname, '../public/src/content');

console.log('开始复制内容文件...');
console.log('源目录：', sourceDir);
console.log('目标目录：', targetDir);

// 确保目标目录存在
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 复制目录
function copyDir(src, dest) {
  // 创建目标目录
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // 读取源目录中的所有文件和子目录
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // 递归复制子目录
      copyDir(srcPath, destPath);
    } else {
      // 复制文件
      fs.copyFileSync(srcPath, destPath);
      console.log(`已复制: ${srcPath} -> ${destPath}`);
    }
  }
}

// 开始复制
try {
  copyDir(sourceDir, targetDir);
  console.log('内容文件复制完成！');
} catch (error) {
  console.error('复制过程中出现错误:', error);
  process.exit(1);
} 