'use client';

import LeftContent from './components/LeftContent';
import RightContent from './components/RightContent';

export default function HomePage() {
  return (
    <div className="flex h-full min-h-0 w-full gap-4">
      {/* Left: beach / random memory / post button */}
      <LeftContent />
      {/* Right: today memories */}
      <RightContent />
    </div>
  );
}
