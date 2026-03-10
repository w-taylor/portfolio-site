import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '4em 1em', minHeight: '50vh' }}>
      <h2>Page not found</h2>
      <br />
      <Link href="/">&lt;Return to Home&gt;</Link>
    </div>
  );
}
