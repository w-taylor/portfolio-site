import './globals.css';
import Header from '@/components/Header';
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
        <div style={{ height: '7em' }}></div>
        {children}
        <div style={{ height: '8em' }}></div>
        <Footer />
      </body>
    </html>
  );
}
