'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './ConwayGrid.module.css';
import { createEmptyGrid, computeNextGrid } from './conwayLogic';

export default function ConwayGrid() {
  const [simGrid, setSimGrid] = useState(createEmptyGrid);
  const [cycleNum, setCycleNum] = useState(0);
  const [running, setRunning] = useState(false);
  const [startBtnTxt, setStartBtnTxt] = useState("Start");
  const [modalDisplay, setModalDisplay] = useState("none");
  const simLoopRef = useRef(null);

  useEffect(() => {
    if (running) {
      simLoopRef.current = setInterval(() => {
        setSimGrid(prev => computeNextGrid(prev));
        setCycleNum(prev => prev + 1);
      }, 500);
      return () => clearInterval(simLoopRef.current);
    }
  }, [running]);

  useEffect(() => {
    return () => {
      if (simLoopRef.current) {
        clearInterval(simLoopRef.current);
      }
    };
  }, []);

  function toggleCell(rIdx, cIdx) {
    setSimGrid(prev =>
      prev.map((row, ri) =>
        row.map((cell, ci) => (ri === rIdx && ci === cIdx ? !cell : cell))
      )
    );
  }

  function resetGrid() {
    if (!running) {
      setSimGrid(createEmptyGrid());
      setCycleNum(0);
    }
  }

  function cycleOneStep() {
    if (!running) {
      setSimGrid(prev => computeNextGrid(prev));
      setCycleNum(prev => prev + 1);
    }
  }

  function runContinuous() {
    if (running) {
      setRunning(false);
      setStartBtnTxt("Start");
    } else {
      setRunning(true);
      setStartBtnTxt("Stop");
    }
  }

  function toggleModal() {
    setModalDisplay(prev => prev === "none" ? "block" : "none");
  }

  return (
    <div className={styles['conway-content']}>
      <div className={styles['conway-title']}>Conway&apos;s&nbsp;<i>Game of Life</i></div>
      <br />

      <div className={styles['grid-buttons']}>
        <button className={styles['conway-btn']} onClick={toggleModal}>Instructions</button>
      </div>

      <br />
      <div className={styles['conway-modal']} style={{ display: modalDisplay }}>
        <div className={styles['modal-content']}>
          <div onClick={toggleModal} style={{ float: 'right', fontSize: '2em', cursor: 'pointer' }}>&times;</div>
          <br />
          <p>
            This is a simple implementation of British mathematician John Conway&apos;s <i>Game of Life</i>.
          </p>
          <p>
            Each square in the grid represents a cell that can either be dead (blank white square) or alive (filled with a black circle). You can click on a square to toggle its starting state between alive or dead. After hitting &quot;Start&quot;, the simulation will proceed and cells will change between alive or dead based on its 8 neighboring cells according to the following rules:
          </p>
          <ul>
            <li>A live cell dies due to underpopulation if it has less than two living neighbors</li>
            <li>A live cell dies due to overpopulation if it has more than three living neighbors</li>
            <li>A live cell with two or three living neighbors is stable and survives to the next cycle</li>
            <li>A dead cell with exactly three living neighbors becomes a live cell due to reproduction</li>
          </ul>
          <p>
            In this implementation, any imaginary cells beyond the grid are considered uninhabitable and can never support life. So, for example, the cell in the top right of the grid will always have at least five dead neighbors due to the cells above and to the right of it being uninhabitable.
          </p>
          <p>
            After clicking on some initial live cells, click the &quot;Start&quot; button to begin the simulation. The counter under the grid will track the progression of cycles. You can hit the &quot;Stop&quot; button to pause the simulation and make changes to the grid or hit the &quot;Reset&quot; button to return the grid to a blank slate and return the cycle counter to 0.
          </p>
          <p>
            If you want to let the simulation proceed for only a single cycle, you can hit the &quot;Step 1 Cycle&quot; button.
          </p>
          <p>
            You can read more about Conway&apos;s <i>Game of Life</i> and find some starting patterns to play with <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank" rel="noopener noreferrer">&lt;here&gt;</a>
          </p>
        </div>
      </div>
      <div className={styles['conway-grid']}>
        {simGrid.map((gridRow, rowIdx) => (
          <div className={styles.row} key={rowIdx}>
            {gridRow.map((gridCell, colIdx) => (
              <div
                key={colIdx}
                onClick={() => toggleCell(rowIdx, colIdx)}
                className={gridCell ? styles['alive-cell'] : styles['dead-cell']}
              >
                <div className={styles.dot}></div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={styles['grid-buttons']}>
        <button className={`${styles['conway-start']} ${styles['conway-btn']}`} onClick={runContinuous}>{startBtnTxt}</button>
        <button className={`${styles['conway-step']} ${styles['conway-btn']}`} onClick={cycleOneStep}>Step 1 Cycle</button>
        <button className={`${styles['conway-reset']} ${styles['conway-btn']}`} onClick={resetGrid}>Reset</button>
        <div className={`${styles['conway-counter']} ${styles['conway-btn']}`}>{cycleNum} Cycles</div>
      </div>
    </div>
  );
}
