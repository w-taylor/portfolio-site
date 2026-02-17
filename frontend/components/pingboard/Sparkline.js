'use client';

export default function Sparkline({ data = [], width = 200, height = 40, color = '#00b300', showAxes = false }) {
  if (!data || data.length === 0) return null;

  const filtered = data.filter(v => v != null);
  if (filtered.length === 0) return null;

  const min = Math.min(...filtered);
  const max = Math.max(...filtered);
  const avg = filtered.reduce((a, b) => a + b, 0) / filtered.length;
  const range = max - min || 1;

  // When showing axes, reserve space on the left for labels
  const labelWidth = showAxes ? 45 : 0;
  const totalWidth = width + labelWidth;
  const padding = 4;
  const chartHeight = height - padding * 2;

  if (filtered.length === 1) {
    return (
      <svg width={totalWidth} height={height} viewBox={`0 0 ${totalWidth} ${height}`}>
        <circle cx={labelWidth + width / 2} cy={height / 2} r={3} fill={color} />
        {showAxes && (
          <text x={labelWidth - 4} y={height / 2 + 4} textAnchor="end" fill="#888" fontSize={10}>
            {Math.round(filtered[0])}ms
          </text>
        )}
      </svg>
    );
  }

  const stepX = (width - padding * 2) / (filtered.length - 1);

  const toY = (val) => padding + chartHeight - ((val - min) / range) * chartHeight;

  const points = filtered
    .map((val, i) => {
      const x = labelWidth + padding + i * stepX;
      const y = toY(val);
      return `${x},${y}`;
    })
    .join(' ');

  const avgY = toY(avg);
  const chartLeft = labelWidth + padding;
  const chartRight = labelWidth + width - padding;

  return (
    <svg width={totalWidth} height={height} viewBox={`0 0 ${totalWidth} ${height}`}>
      {showAxes && (
        <>
          {/* Dashed average baseline */}
          <line
            x1={chartLeft} y1={avgY}
            x2={chartRight} y2={avgY}
            stroke="#888"
            strokeWidth={0.75}
            strokeDasharray="4 3"
          />
          {/* Max label */}
          <text x={labelWidth - 4} y={padding + 4} textAnchor="end" fill="#888" fontSize={10}>
            {Math.round(max)}ms
          </text>
          {/* Avg label */}
          <text x={labelWidth - 4} y={avgY + 3} textAnchor="end" fill="#aaa" fontSize={9}>
            avg
          </text>
          {/* Min label */}
          <text x={labelWidth - 4} y={height - padding + 1} textAnchor="end" fill="#888" fontSize={10}>
            {Math.round(min)}ms
          </text>
        </>
      )}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
