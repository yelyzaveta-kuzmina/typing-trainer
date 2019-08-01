import React from 'react';
import submarine from './images/submarine.png';
import styles from './styles.module.scss';

const Submarine = ({ position }) => {
  return (
    <div className={styles.submarineWrapper}>
      <div className={styles.submarineTrack}>
        <img
          style={{
            left: `${position}%`
          }}
          src={submarine}
          alt={''}
        />
      </div>
    </div>
  );
};

export default Submarine;
