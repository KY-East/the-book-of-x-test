# 音乐播放器使用说明

## 添加音乐文件

1. 将你的音乐文件（MP3格式）放在此文件夹中
2. 建议使用以下命名方式：
   - 用户原创歌曲: 直接使用歌曲名称，如`燃烧.mp3`
   - Daft Punk的Tron Legacy原声带: `daftpunk_tron_曲目名.mp3`
   - 后摇音乐: `postrock_乐队名_曲目名.mp3`

## 当前播放列表

### 用户原创歌曲
- 燃烧 (燃烧.mp3)
- 《Metaphysics》 (Remastered) (Metaphysics_Remastered.mp3)
- Budapest (Cover) (Remastered) (Budapest_Cover_Remastered.mp3)
- Moonfall (Moonfall.mp3)

### 示例音乐
- Algorithms (电子音乐)
- Shipping Lanes (电子音乐)
- Contention (后摇风格)

## 推荐音乐列表

### Daft Punk - Tron Legacy 原声带
- The Grid
- Son of Flynn
- Recognizer
- Derezzed
- End of Line
- Solar Sailer
- Adagio for Tron
- Tron Legacy (End Titles)

### 后摇推荐
- Godspeed You! Black Emperor - East Hastings
- Explosions in the Sky - Your Hand in Mine
- Mogwai - Auto Rock
- Sigur Rós - Untitled #3 (Samskeyti)
- This Will Destroy You - The Mighty Rio Grande
- God Is An Astronaut - All Is Violent, All Is Bright

## 更新播放列表

在`static-page.html`文件中找到`musicPlayer`对象的`playlist`数组，更新音乐文件的路径和标题：

```javascript
playlist: [
  {
    title: "燃烧",
    url: "music/燃烧.mp3"
  },
  // 添加更多音乐...
]
```

## 注意事项

- 请确保你有权使用这些音乐文件
- 音乐文件大小会影响页面加载速度，建议使用压缩后的MP3文件
- 默认音量设置为0.3（30%），可以在代码中调整 