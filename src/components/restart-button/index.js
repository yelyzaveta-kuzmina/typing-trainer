import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './styles.module.scss';

const RestartButton = ({ onClick }) => (
  <button test-handle={'restart-button'} onClick={onClick} className={styles.restartButton}>
    <FontAwesomeIcon icon={faRedoAlt} />
  </button>
);

export default RestartButton;
