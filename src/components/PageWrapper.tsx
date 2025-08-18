import React from 'react';
import Header from './Header';

interface PageWrapperProps {
  title: string;
  children: React.ReactNode;
  maxContentWidth?: string;
}

export default function PageWrapper({ 
  title, 
  children, 
  maxContentWidth = "max-w-6xl" 
}: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <main className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-2">
          <h1 className="text-m font-medium text-gray-600">
            {title}
          </h1>
        </div>

        <div className={`${maxContentWidth} mx-auto`}>
          {children}
        </div>
      </main>
    </div>
  );
}
