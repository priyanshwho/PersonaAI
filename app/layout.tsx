import type { Metadata } from 'next';
import { Lora, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../components/theme-provider';

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI Mentor - Learn Next.js, Architecture & System Design',
  description: 'Simulate learning from top engineering mentors like Hitesh Choudhary, Piyush Garg, Suraj Jha, and Anirudh Jwala. Guided step-by-step engineering lessons.',
  keywords: ['Next.js', 'React', 'AI SDK', 'Gemini', 'Prisma', 'PostgreSQL', 'System Design'],
  authors: [{ name: 'Antigravity' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${lora.variable} ${jakarta.variable}`}>
      <body className="antialiased min-h-screen bg-background text-foreground transition-colors duration-200 font-sans">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
