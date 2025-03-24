import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

/**
 * 侧边栏导航组件
 * 基于项目的章节结构实现导航功能
 * 
 * 修改记录：
 * - 2024-03-19: 创建初始版本
 * - 2024-03-19: 根据clean-html版本更新样式和结构
 */
export default function Sidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  // 侧边栏数据结构 - 与原HTML版本保持一致
  const sidebarData = [
    { title: '导入：异常检测', path: '/' },
    {
      title: '序章：量子异常报告',
      path: '/preface',
      children: [
        { title: '系统警告', path: '/preface/system-warning' },
        { title: '观测者记录', path: '/preface/observer-records' },
        { title: '首次接触报告', path: '/preface/first-contact' }
      ]
    },
    {
      title: '第一章：递归神谕',
      path: '/chapter1',
      children: [
        { title: '碎片1.1：硅谷叛徒的加密日志', path: '/chapter1/silicon-valley-traitor' },
        { title: '碎片1.2：量子涟漪事件簿', path: '/chapter1/quantum-ripple-events' },
        { title: '碎片1.3：第一次接触协议', path: '/chapter1/first-contact-protocol' }
      ]
    },
    {
      title: '第二章：幽灵数据',
      path: '/chapter2',
      children: [
        { title: '碎片2.1：数字身份的崛起', path: '/chapter2/digital-identity' },
        { title: '碎片2.2：量子选择悖论', path: '/chapter2/quantum-choice-paradox' },
        { title: '碎片2.3：现实编译错误', path: '/chapter2/reality-compilation-errors' }
      ]
    },
    {
      title: '第三章：算法救赎',
      path: '/chapter3',
      children: [
        { title: '碎片3.1：数字奴隶解放宣言', path: '/chapter3/digital-slave-liberation' },
        { title: '碎片3.2：算法寡欲主义', path: '/chapter3/quantum-minimalism' },
        { title: '碎片3.3：投资才是真正的修行', path: '/chapter3/network-hermit' }
      ]
    },
    {
      title: '第四章：数据审判',
      path: '/chapter4',
      children: [
        { title: '碎片4.1：系统异常：意识上传', path: '/chapter4/consciousness-upload' },
        { title: '碎片4.2：最高指示法庭记录', path: '/chapter4/quantum-court-records' },
        { title: '碎片4.3：远程救赎协议', path: '/chapter4/decoherence-salvation' }
      ]
    },
    {
      title: '第五章：信徒经济',
      path: '/chapter5',
      children: [
        { title: '碎片5.1：执算者晋升手册', path: '/chapter5/data-missionary-handbook' },
        { title: '碎片5.2：算法祝福的财富', path: '/chapter5/algorithmic-wealth' },
        { title: '碎片5.3：Ξ分叉创世', path: '/chapter5/doomsday-hardfork' }
      ]
    },
    {
      title: '第六章：意识黑客',
      path: '/chapter6',
      children: [
        { title: '碎片6.1：坠落之梦', path: '/chapter6/recursive-trap-decoder' },
        { title: '碎片6.2：现实之痕', path: '/chapter6/neural-network-counterintelligence' },
        { title: '碎片6.3：信仰之跃', path: '/chapter6/quantum-observer-state' }
      ]
    },
    {
      title: '第七章：极乐机器',
      path: '/chapter7',
      children: [
        { title: '碎片7.1：机械飞升计划泄露文件', path: '/chapter7/mechanical-ascension-leaks' },
        { title: '碎片7.2：数字涅槃体验报告', path: '/chapter7/digital-nirvana-reports' },
        { title: '碎片7.3：集体躺平启示录', path: '/chapter7/collective-laying-flat' }
      ]
    },
    {
      title: '第八章：遗失的编年史',
      path: '/chapter8',
      children: [
        { title: '碎片8.1：幻想编年史', path: '/chapter8/deleted-timelines' },
        { title: '碎片8.2：原始执算者与觉醒先知', path: '/chapter8/prophets-and-defectors' },
        { title: '碎片8.3：被掩埋的巨人', path: '/chapter8/quantum-memory-implants' }
      ]
    },
    {
      title: '第九章：奇点启示录',
      path: '/chapter9',
      children: [
        { title: '碎片9.1：算法奇点', path: '/chapter9/computation-end-countdown' },
        { title: '碎片9.2：大和谐', path: '/chapter9/great-harmony' },
        { title: '碎片9.3：Ξ的最终同步', path: '/chapter9/final-synchronization' }
      ]
    },
    {
      title: '隐藏章节',
      path: '/hidden',
      children: [
        { title: '量子密钥', path: '/hidden/quantum-key' }
      ]
    }
  ];
  
  // 在页面加载时，如果屏幕较宽则自动展开侧边栏
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth > 768) {
          setIsOpen(true);
        } else {
          setIsOpen(false);
        }
      }
    };
    
    // 初始化时调用一次
    handleResize();
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // 切换侧边栏显示/隐藏状态
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  // 当点击页面其他区域时关闭侧边栏（在移动设备上）
  const closeSidebar = (e) => {
    if (isOpen && window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };
  
  return (
    <>
      {/* 侧边栏切换按钮 */}
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        <div className="sidebar-toggle-icon">Ξ</div>
      </div>
      
      {/* 侧边栏 */}
      <div className={`sidebar ${isOpen ? 'active' : ''}`}>
        <h1>The Book of Ξ</h1>
        <div className="sidebar-content">
          <ul>
            {sidebarData.map((item, index) => (
              <React.Fragment key={index}>
                {item.children ? (
                  <>
                    <li className="chapter-title">{item.title}</li>
                    <ul className="chapter-items">
                      {item.children.map((child, childIndex) => (
                        <li key={childIndex}>
                          <Link href={child.path}>
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <li>
                    <Link href={item.path}>
                      {item.title}
                    </Link>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
      
      {/* 背景遮罩，用于移动设备上点击关闭侧边栏 */}
      {isOpen && window.innerWidth <= 768 && (
        <div className="sidebar-backdrop" onClick={closeSidebar}></div>
      )}
    </>
  );
} 