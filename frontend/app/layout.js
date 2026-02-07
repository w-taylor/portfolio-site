import './globals.css';
import Header from '@/components/Header';
import HalftoneDivider from '@/components/HalftoneDivider';
import HalftoneDividerBottom from '@/components/HalftoneDividerBottom';
import Footer from '@/components/Footer';

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
