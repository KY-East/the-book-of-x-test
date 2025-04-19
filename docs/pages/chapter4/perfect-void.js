import dynamic from 'next/dynamic';

// 动态导入MainWrapper组件，它会整合所有故事章节
const PerfectVoidMainWrapper = dynamic(
  () => import('../../public/chapter4/perfect-void-main.jsx'),
  { ssr: false }
);

export default function PerfectVoidPage() {
  return <PerfectVoidMainWrapper />;
} 