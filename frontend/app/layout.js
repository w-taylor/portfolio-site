import { Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import HalftoneDivider from '@/components/layout/HalftoneDivider';
import HalftoneDividerBottom from '@/components/layout/HalftoneDividerBottom';
import Footer from '@/components/layout/Footer';

const geistMono = Geist_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export const metadata = {
  title: 'wtaylor.xyz',
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geistMono.className} suppressHydrationWarning>
        <Header />
        <HalftoneDivider />
        <div style={{ height: '3em' }}></div>
        {children}
        <div style={{ height: '3em' }}></div>
        <HalftoneDividerBottom />
        <Footer />
      </body>
    </html>
  );
}
