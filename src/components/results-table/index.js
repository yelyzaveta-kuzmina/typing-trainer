import React from 'react';
import mopImage from './images/mop.svg';
import styles from './styles.module.scss';

const ResultsTable = ({ results, onResultsClear }) => (
  <div className={styles.results}>
    <table className={styles.table}>
      <thead>
        <tr className={styles.tableHeader}>
          <th>Time</th>
          <th>Errors</th>
          <th>Speed</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result, index) => (
          <tr className={styles.tableContent} key={index}>
            <td>{result.time}</td>
            <td>{result.errors}</td>
            <td>{result.speed}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <img
      onClick={onResultsClear}
      className={styles.clearStorageButton}
      src={mopImage}
      alt="Clear button"
    />
  </div>
);

export default ResultsTable;
