'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './AsciiW.module.css';

const COLS = 80;
const ROWS = 40;
const DEPTH = 6;
const STROKE_T = 4.5;
const ROTATION_SPEED = (2 * Math.PI) / 9;
const BOB_AMPLITUDE = 2;
const BOB_SPEED = (2 * Math.PI) / 4;
const SHADE_CHARS = '.:-=+*#';

const LIGHT = (() => {
  const l = [0.4, -0.3, 1.0];
  const len = Math.sqrt(l[0] * l[0] + l[1] * l[1] + l[2] * l[2]);
  return l.map(v => v / len);
})();

function buildGeometry() {
  const strokes = [
    [[-15, -11], [-31, 1]],
    [[-31, -1], [-15, 11]],
    [[-12, -11], [-7, 11]],
    [[-7, 11], [0, -3]],
    [[0, -3], [7, 11]],
    [[7, 11], [12, -11]],
    [[15, -11], [31, 1]],
    [[31, -1], [15, 11]],
  ];

  const vertices = [];
  const faces = [];

  for (const [[x0, y0], [x1, y1]] of strokes) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = (-dy / len) * (STROKE_T / 2);
    const ny = (dx / len) * (STROKE_T / 2);

    const fi = vertices.length;
    // Front face vertices (z = +DEPTH)
    vertices.push([x0 + nx, y0 + ny, DEPTH]);   // fi+0
    vertices.push([x0 - nx, y0 - ny, DEPTH]);   // fi+1
    vertices.push([x1 - nx, y1 - ny, DEPTH]);   // fi+2
    vertices.push([x1 + nx, y1 + ny, DEPTH]);   // fi+3
    // Back face vertices (z = -DEPTH)
    const bi = fi + 4;
    vertices.push([x0 + nx, y0 + ny, -DEPTH]);  // bi+0
    vertices.push([x0 - nx, y0 - ny, -DEPTH]);  // bi+1
    vertices.push([x1 - nx, y1 - ny, -DEPTH]);  // bi+2
    vertices.push([x1 + nx, y1 + ny, -DEPTH]);  // bi+3

    // Faces with outward-facing CCW winding
    faces.push([fi, fi + 1, fi + 2, fi + 3]);             // front
    faces.push([bi + 3, bi + 2, bi + 1, bi]);             // back
    faces.push([fi, fi + 3, bi + 3, bi]);                 // top (positive-normal side)
    faces.push([fi + 2, fi + 1, bi + 1, bi + 2]);         // bottom (negative-normal side)
    faces.push([fi + 1, fi, bi, bi + 1]);                 // start cap
    faces.push([fi + 3, fi + 2, bi + 2, bi + 3]);         // end cap
  }

  return { vertices, faces };
}

function rotateY(verts, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return verts.map(([x, y, z]) => [
    x * cos - z * sin,
    y,
    x * sin + z * cos,
  ]);
}

function cross(v0, v1, v2) {
  const ax = v1[0] - v0[0], ay = v1[1] - v0[1], az = v1[2] - v0[2];
  const bx = v2[0] - v0[0], by = v2[1] - v0[1], bz = v2[2] - v0[2];
  return [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
}

function fillConvexPoly(grid, pts, ch, w, h) {
  const ys = pts.map(p => p[1]);
  const minY = Math.max(0, Math.floor(Math.min(...ys)));
  const maxY = Math.min(h - 1, Math.ceil(Math.max(...ys)));
  const n = pts.length;

  for (let y = minY; y <= maxY; y++) {
    let minX = Infinity, maxX = -Infinity;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const [x0, y0] = pts[i];
      const [x1, y1] = pts[j];
      if ((y0 <= y && y1 > y) || (y1 <= y && y0 > y)) {
        const t = (y - y0) / (y1 - y0);
        const x = x0 + t * (x1 - x0);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
    }
    if (minX <= maxX) {
      const sx = Math.max(0, Math.round(minX));
      const ex = Math.min(w - 1, Math.round(maxX));
      for (let x = sx; x <= ex; x++) {
        grid[y][x] = ch;
      }
    }
  }
}

function rasterize(rotated, faceIndices, w, h, time) {
  const grid = Array.from({ length: h }, () => Array(w).fill(' '));

  const cx = w / 2;
  const cy = h / 2 + Math.sin(time * BOB_SPEED) * BOB_AMPLITUDE;
  const projected = rotated.map(([x, y, z]) => {
    const s = 1 + z * 0.018;
    return [cx + x * s, cy + y * s];
  });

  const visibleFaces = [];
  for (const verts of faceIndices) {
    const n = cross(rotated[verts[0]], rotated[verts[1]], rotated[verts[2]]);
    // Backface cull: camera looks down -z, so visible faces have normal.z > 0
    if (n[2] <= 0) continue;

    const avgZ = (rotated[verts[0]][2] + rotated[verts[1]][2] +
      rotated[verts[2]][2] + rotated[verts[3]][2]) / 4;

    const nLen = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);
    const dot = (n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]) / nLen;
    const brightness = 0.15 + 0.85 * Math.max(0, dot);
    const idx = Math.min(SHADE_CHARS.length - 1, Math.floor(brightness * SHADE_CHARS.length));

    visibleFaces.push({ verts, avgZ, ch: SHADE_CHARS[idx] });
  }

  // Painter's algorithm: draw back-to-front
  visibleFaces.sort((a, b) => a.avgZ - b.avgZ);

  for (const { verts, ch } of visibleFaces) {
    const pts = verts.map(i => projected[i]);
    fillConvexPoly(grid, pts, ch, w, h);
  }

  return grid.map(row => row.join('')).join('\n');
}

const { vertices: BASE_VERTICES, faces: FACES } = buildGeometry();

function renderFrame(angle, time) {
  const rotated = rotateY(BASE_VERTICES, angle);
  return rasterize(rotated, FACES, COLS, ROWS, time);
}

export default function AsciiW() {
  const [frame, setFrame] = useState(() => renderFrame(0, 0));
  const angleRef = useRef(0);
  const timeRef = useRef(0);
  const lastTimeRef = useRef(null);
  const rafRef = useRef(null);

  const animate = useCallback((timestamp) => {
    if (lastTimeRef.current === null) {
      lastTimeRef.current = timestamp;
    }
    const dt = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;
    angleRef.current += ROTATION_SPEED * dt;
    timeRef.current += dt;

    setFrame(renderFrame(angleRef.current, timeRef.current));
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
        lastTimeRef.current = null;
      } else {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [animate]);

  return (
    <pre className={styles.ascii} aria-label="Rotating 3D ASCII art of <w>">
      {frame}
    </pre>
  );
}
