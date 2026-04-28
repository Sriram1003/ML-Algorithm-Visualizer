import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { GlobalBackButton } from '@/components/GlobalBackButton';
import GlobalErrorBoundary from '@/components/GlobalErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'AlgoVista | ML Visualizer',
    template: '%s | AlgoVista',
  },
  description: 'Interactive visualization platform for mastering machine learning algorithms. Deep dive into SVMs, Neural Networks, and Clustering.',
  openGraph: {
    title: 'AlgoVista | ML Visualizer',
    description: 'Interactive visualization platform for machine learning algorithms',
    type: 'website',
    url: 'https://algovista.ai', // Replace with your final Netlify/custom domain
    siteName: 'AlgoVista',
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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