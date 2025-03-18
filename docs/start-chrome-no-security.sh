#!/bin/bash
# 关闭所有Chrome实例
pkill -f "Google Chrome"
# 启动Chrome，禁用安全设置
open -a "Google Chrome" --args --disable-web-security --user-data-dir="/tmp/chrome_dev_test" 