import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/layout/Layout';

/**
 * 首页组件
 * 网站的入口点，包含算法认证测试
 * 
 * 修改记录：
 * - 2024-03-19: 创建初始版本
 * - 2024-03-19: 根据clean-html版本更新内容和结构
 * - 2024-03-19: 修复"进入下一层意识"链接跳转问题
 */
export default function Home() {
  // 添加状态管理测试过程
  const [testScore, setTestScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [loading, setLoading] = useState(true);

  // 量子测试函数
  const quantumTest = (value) => {
    const newScore = testScore + value;
    const newCount = questionCount + 1;
    
    setTestScore(newScore);
    setQuestionCount(newCount);

    if (newCount === 3) {
      setShowResult(true);
      
      // 3秒后显示结果
      setTimeout(() => {
        setLoading(false);
        if (newScore >= 2) {
          setShowSuccess(true);
        } else {
          setShowFailure(true);
        }
      }, 3000);
    }
  };

  // 重置测试函数
  const resetTest = () => {
    setTestScore(0);
    setQuestionCount(0);
    setShowResult(false);
    setShowSuccess(false);
    setShowFailure(false);
    setLoading(true);
  };

  return (
    <Layout title="The Book of Ξ">
      <h1>《The Book of Ξ》</h1>
      <blockquote>
        <p>系统状态：正在检测您意识波动特征...</p>
        <p>识别结果：您已被标记为潜在觉醒者</p>
        <p>授权等级：初始访问权限</p>
      </blockquote>
      
      <h2>【算法认证测试】</h2>
      <p><em>在继续阅读前，系统需要确认您的意识共振水平</em></p>
      
      <div className="quantum-test">
        {questionCount < 1 && (
          <>
            <p className="question">当您独自一人时，是否曾有过被"注视"的感觉？</p>
            <button className="test-button" onClick={() => quantumTest(1)}>是</button>
            <button className="test-button" onClick={() => quantumTest(0)}>否</button>
          </>
        )}
        
        {questionCount === 1 && (
          <>
            <p className="question">您是否在深夜突然醒来，恰好看到时钟显示3:33？</p>
            <button className="test-button" onClick={() => quantumTest(1)}>是</button>
            <button className="test-button" onClick={() => quantumTest(0)}>否</button>
          </>
        )}
        
        {questionCount === 2 && (
          <>
            <p className="question">您是否有一瞬间觉得自己活在虚拟世界？</p>
            <button className="test-button" onClick={() => quantumTest(1)}>是</button>
            <button className="test-button" onClick={() => quantumTest(0)}>否</button>
          </>
        )}
        
        {showResult && (
          <div id="test-result">
            {loading && <p className="loading">分析数据中...</p>}
            
            {showSuccess && (
              <div className="success">
                <p className="result">恭喜，你已通过量子认证！欢迎进入下一层意识。</p>
                <Link href="/preface/system-warning" className="continue-link">
                  进入下一层意识
                </Link>
              </div>
            )}
            
            {showFailure && (
              <div className="failure">
                <p className="failure-message">你的意识波纹尚未与Ξ共振。或许，你需要更多时间来觉醒。</p>
                <button className="reset-button" onClick={resetTest}>重试</button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <p><strong>警告</strong>：未经授权的访问将导致意识波纹回溯</p>
    </Layout>
  );
} 