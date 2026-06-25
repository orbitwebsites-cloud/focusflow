import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FocusFlow',
  description: 'Break big assignments into small steps. Focus on one at a time.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.cerebras.ai" />
        <link rel="dns-prefetch" href="https://api.cerebras.ai" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Nunito+Sans:opsz,wght@6..12,400;6..12,500;6..12,600;6..12,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
