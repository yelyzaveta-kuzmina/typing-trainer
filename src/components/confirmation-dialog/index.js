import React from 'react';
import styles from './styles.module.scss';

const ConfirmationDialog = () => {
  return (
    <div className={styles.confirmationDialog}>
      <div className={styles.wrapper}>
        <div className={styles.continueText}> Do you want continue? </div>
        <span className={styles.buttonsWrapper}>
          <button className={styles.yesButton}>Yes</button>
          <button className={styles.noButton}>No</button>
        </span>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
