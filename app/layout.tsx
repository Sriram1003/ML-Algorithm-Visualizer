import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { GlobalBackButton } from '@/components/GlobalBackButton';
import GlobalErrorBoundary from '@/components/GlobalErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ML Algorithm Visualizer',
  description: 'Interactive visualization platform for machine learning algorithms',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-6 focus:py-3 focus:bg-purple-600 focus:text-white focus:rounded-xl focus:font-bold focus:shadow-2xl"
          >
            Skip to main content
          </a>
          <GlobalBackButton />
          <main id="main-content" tabIndex={-1}>
            <GlobalErrorBoundary>
              {children}
            </GlobalErrorBoundary>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}