/**
 * 音乐播放器替换脚本
 * 用于批量替换第三章及第四章的HTML文件中的音乐播放器代码
 * 替换为统一的全局播放器脚本引用
 */

const fs = require('fs');
const path = require('path');

// 目标目录
const targetDirs = [
  path.join(__dirname, 'chapter3'),
  path.join(__dirname, 'chapter4')
];

// 需要被替换的HTML文件
let filesToProcess = [];

// 收集所有HTML文件
targetDirs.forEach(dir => {
  try {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      if (file.endsWith('.html')) {
        filesToProcess.push(path.join(dir, file));
      }
    });
  } catch (err) {
    console.error(`读取目录 ${dir} 出错:`, err);
  }
});

console.log(`找到 ${filesToProcess.length} 个HTML文件需要处理`);

// 处理每个文件
filesToProcess.forEach(filePath => {
  try {
    console.log(`处理文件: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 查找并移除内嵌的音乐播放器脚本
    const oldPlayerScriptPattern = /<!-- 注入的音乐播放器脚本 -->[\s\S]*?<script>([\s\S]*?)<\/script>/g;
    const oldPlayerImportPattern = /<script src="[\.\/]*?add-music-player\.js"><\/script>/g;
    
    // 检查是否包含音乐播放器代码
    const hasInlinePlayer = oldPlayerScriptPattern.test(content);
    const hasImportedPlayer = oldPlayerImportPattern.test(content);
    
    if (hasInlinePlayer || hasImportedPlayer) {
      console.log(`  文件包含播放器代码，准备替换...`);
      
      // 替换内嵌播放器脚本
      content = content.replace(oldPlayerScriptPattern, '');
      
      // 替换导入的播放器脚本
      content = content.replace(oldPlayerImportPattern, '');
      
      // 在</body>标签前添加全局播放器引用
      const bodyCloseTag = '</body>';
      const globalPlayerScript = `
    <!-- 全局音乐播放器 -->
    <script src="../global-music-player.js"></script>
${bodyCloseTag}`;
      
      content = content.replace(bodyCloseTag, globalPlayerScript);
      
      // 写回文件
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  成功更新文件: ${filePath}`);
    } else {
      console.log(`  文件不包含播放器代码，跳过`);
    }
  } catch (err) {
    console.error(`处理文件 ${filePath} 出错:`, err);
  }
});

console.log('所有文件处理完成!'); 