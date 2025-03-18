#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # 添加允许音频播放的CSP头
        self.send_header("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; media-src 'self' blob:; style-src 'self' 'unsafe-inline';")
        super().end_headers()

    def guess_type(self, path):
        # 确保MP3文件的MIME类型正确
        if path.endswith('.mp3'):
            return 'audio/mpeg'
        return super().guess_type(path)

Handler = CustomHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"服务器运行在 http://localhost:{PORT}")
    print("按 Ctrl+C 停止服务器")
    httpd.serve_forever() 