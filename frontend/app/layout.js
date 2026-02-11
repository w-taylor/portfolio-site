import './globals.css';
import Header from '@/components/layout/Header';
import HalftoneDivider from '@/components/layout/HalftoneDivider';
import HalftoneDividerBottom from '@/components/layout/HalftoneDividerBottom';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'wtaylor.xyz',
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
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
