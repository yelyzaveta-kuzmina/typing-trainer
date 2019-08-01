import React from 'react';
import Submarine from './components/submarine';
import classNames from 'classnames';
import TEXTS from './texts';
import ConfirmationDialog from './components/confirmation-dialog';
import { KeyCode } from './constants';
import styles from './styles.module.scss';

class App extends React.Component {
  timerId = null;
  state = {
    textNumber: 0,
    activeCharachterIndex: 0,
    time: 0,
    countErrors: 0,
    isConfirmationDialogVisible: false,
    errorsIndices: []
  };

  componentDidMount() {
    window.addEventListener('keypress', (event) => {
      console.log(event.ctrlKey, event.keyCode);
    });
  }

  onTimerStart = () => {
    this.timerId = setInterval(() => {
      this.setState({ time: this.state.time + 1 });
    }, 1000);
  };

  onTimerStop = () => {
    clearInterval(this.timerId);
    this.timerId = null;
  };

  onCheck = (event) => {
    const text = TEXTS[this.state.textNumber];
    const keyCode = event.which || event.keyCode;
    const activeChar = text[this.state.activeCharachterIndex];

    if (!this.timerId) {
      this.onTimerStart();
    }

    if (event.key === activeChar || (keyCode === KeyCode.ENTER && activeChar === '\n')) {
      this.setState({
        showErrorHighlight: false,
        activeCharachterIndex: this.state.activeCharachterIndex + 1
      });

      if (keyCode === KeyCode.ENTER) {
        event.nativeEvent.target.value = '';
      }

      if (this.state.activeCharachterIndex + 1 === text.length) {
        this.onTimerStop();
        this.setState({
          isConfirmationDialogVisible: true,
          textNumber: this.state.textNumber + 1,
          activeCharachterIndex: 0
        });
      }

      return;
    }

    if (event.shiftKey || event.ctrlKey || event.altKey) {
      return;
    }

    event.preventDefault();

    this.setState({
      countErrors: this.state.countErrors + 1,
      errorsIndices: [...this.state.errorsIndices, this.state.activeCharachterIndex]
    });
  };

  render() {
    const {
      time,
      textNumber,
      activeCharachterIndex,
      errorsIndices,
      countErrors,
      isConfirmationDialogVisible
    } = this.state;

    const text = TEXTS[textNumber];
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    const progress = (activeCharachterIndex / text.length) * 100;
    const speed = (activeCharachterIndex / time) * 60;

    return (
      <div className={styles.wrapper}>
        {isConfirmationDialogVisible && <ConfirmationDialog />}
        <div className={styles.timer}>
          Time:&nbsp;
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          &nbsp;&nbsp;&nbsp;
          <span className={styles.errors}>Errors:&nbsp;</span>
          <span className={styles.errorsNumber}> {countErrors}</span>
          &nbsp;&nbsp;&nbsp; Speed:&nbsp;{Math.round(speed)}
        </div>

        <div className={styles.sentence}>
          {Array.from(text, (letter, index) => (
            <span
              key={index}
              className={classNames(styles.letter, {
                [styles.active]: activeCharachterIndex === index,
                [styles.error]: errorsIndices.includes(index)
              })}>
              {letter === '\n' && <span className={styles.arrow}>↩</span>}
              {letter}
            </span>
          ))}
        </div>
        <div className={styles.inputWrapper}>
          <input
            autoFocus
            className={classNames(styles.input, {
              [styles.error]: errorsIndices.includes(activeCharachterIndex)
            })}
            onKeyDown={this.onCheck}
          />
        </div>
        <Submarine position={progress} />
      </div>
    );
  }
}

export default App;
