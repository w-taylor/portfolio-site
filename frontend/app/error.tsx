'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '4em 1em', minHeight: '50vh' }}>
      <h2>Something went wrong</h2>
      <br />
      <button type="button" onClick={reset}>&lt;Try Again&gt;</button>
    </div>
  );
}
