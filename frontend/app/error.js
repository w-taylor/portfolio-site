'use client';

export default function Error({ error, reset }) {
  return (
    <div style={{ textAlign: 'center', padding: '4em 1em' }}>
      <h2>Something went wrong</h2>
      <br />
      <button onClick={reset}>&lt;Try Again&gt;</button>
    </div>
  );
}
