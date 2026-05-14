import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sage Quest Kids Skills',
  description: 'Educational games for keyboard, mouse, reading, and STEM skills.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
