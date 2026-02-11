export default function HalftoneDivider() {
  const width = 1200;
  const dotSpacing = 6.5;
  const rows = [
    { y: 3.5, r: 0.5, fill: '#000000' },
    { y: 9, r: 0.75, fill: '#000000' },
    { y: 15, r: 1.25, fill: '#000000' },
    { y: 21, r: 1.75, fill: '#000000' },
    { y: 27, r: 2.25, fill: '#000000' },
    { y: 33.5, r: 2.625, fill: '#000000' },
    { y: 40, r: 3, fill: '#000000' },
    { y: 46.5, r: 3.375, fill: '#000000' },
    { y: 53.5, r: 3.75, fill: '#000000' },
    { y: 60.5, r: 4.125, fill: '#000000' },
    { y: 67.5, r: 4.5, fill: '#000000' },
    { y: 74.5, r: 4.5, fill: '#000000' },
  ];

  const dots = [];
  rows.forEach(({ y, r, fill }, rowIndex) => {
    const offset = 0;
    for (let x = dotSpacing / 2 + offset; x < width + dotSpacing; x += dotSpacing) {
      dots.push({ cx: x, cy: y, r, fill });
    }
  });

  return (
    <div style={{ width: '100%', lineHeight: 0, background: 'linear-gradient(to bottom, white 90%, black 90%)', marginTop: '-0.6em' }}>
      <svg
        viewBox={`0 0 ${width} 83`}
        preserveAspectRatio="xMidYMin slice"
        style={{ width: '100%', height: 'clamp(83px, 8vw, 160px)', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {dots.map((dot, i) => (
          <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.fill} />
        ))}
        <rect x="0" y="74" width={width} height="10" fill="black" />
      </svg>
    </div>
  );
}
