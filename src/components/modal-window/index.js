import React, { useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import styles from './styles.module.scss';
import { KeyCode } from '../../constants';

const Modal = (props) => {
  const yesButtonRef = useRef();
  const noButtonRef = useRef();

  useEffect(() => {
    window.addEventListener('keydown', (event) => {
      const keyCode = event.which || event.keyCode;
      if (keyCode === KeyCode.LEFT_ARROW) {
        yesButtonRef.current.focus();
      }
      if (keyCode === KeyCode.RIGHT_ARROW) {
        noButtonRef.current.focus();
      }
    });
  }, []);

  return (
    <Draggable positionOffset={{ x: '-50%', y: 0 }}>
      <div className={styles.confirmationDialog}>
        <div className={styles.wrapper}>
          <div className={styles.continueText}> Do you want continue? </div>
          <div className={styles.buttonsWrapper}>
            <button
              autoFocus
              ref={yesButtonRef}
              tabIndex="1"
              className={styles.yesButton}
              onClick={props.onGameContinue}>
              Yes
            </button>
            <button
              ref={noButtonRef}
              tabIndex="2"
              className={styles.noButton}
              onClick={props.onModalClose}>
              No
            </button>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default Modal;
