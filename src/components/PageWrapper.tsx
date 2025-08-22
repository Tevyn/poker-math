import React from 'react';
import Header from './Header';

interface PageWrapperProps {
  title: string;
  children: React.ReactNode;
  maxContentWidth?: string;
  fullWidth?: boolean;
  fullWidthSections?: React.ReactNode[];
}

export default function PageWrapper({ 
  title, 
  children, 
  maxContentWidth = "max-w-6xl",
  fullWidth = false,
  fullWidthSections = []
}: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <main className={`${fullWidth ? 'w-full' : 'max-w-7xl mx-auto'} py-4 ${fullWidth ? '' : 'px-4 sm:px-6 lg:px-8'}`}>
        <div className={`text-left mb-2 ${fullWidth ? 'px-4 sm:px-6 lg:px-8' : ''}`}>
          <h1 className="text-m font-medium text-gray-600">
            {title}
          </h1>
        </div>

        <div className={`${fullWidth ? 'w-full' : maxContentWidth + ' mx-auto'}`}>
          {children}
        </div>
      </main>

      {/* Full-width sections that break out of the normal container */}
      {fullWidthSections.map((section, index) => (
        <div key={index} className="w-full md:max-w-6xl md:mx-auto md:px-4 lg:px-6 xl:px-8">
          {section}
        </div>
      ))}
    </div>
  );
}
