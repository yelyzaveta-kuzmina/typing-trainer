import React from 'react';
import Submarine from './components/submarine';
import classNames from 'classnames';
import TEXTS from './texts';
import Modal from './components/modal-window';
import ResultsTable from './components/results-table';
import { KeyCode } from './constants';
import styles from './styles.module.scss';
import { formatTime } from './helpers/format-time';
import { onFormatSpeed } from './helpers/format-speed';
import { addResult, getResults, removeResults } from './helpers/local-storage';

const INITIAL_STATE = {
  textNumber: 0,
  activeCharachterIndex: 100,
  time: 0,
  countErrors: 0,
  isModalVisible: false,
  errorsIndices: [],
  results: getResults()
};

class App extends React.Component {
  timerId = null;
  inputRef = React.createRef();
  state = INITIAL_STATE;

  getSpeed = () => onFormatSpeed(this.state.activeCharachterIndex, this.state.time);

  onFetchResults = () => {
    this.setState({
      results: getResults()
    });
  };

  onResultsClear = () => {
    this.setState({ results: [] });
    removeResults();
  };

  onTimerStart = () => {
    this.timerId = setInterval(() => {
      this.setState({ time: this.state.time + 1 });
    }, 1000);
  };

  onTimerStop = () => {
    clearInterval(this.timerId);
    this.timerId = null;
  };

  onModalOpen = () => {
    this.setState({
      isModalVisible: true
    });
  };

  onModalClose = () => {
    this.setState({
      isModalVisible: false
    });
  };

  onGameContinue = () => {
    this.onCleanInput();
    this.onModalClose();
    this.setState(
      {
        ...INITIAL_STATE,
        textNumber: this.state.textNumber + 1,
        results: getResults()
      },
      this.onFocusTextInput
    );
  };

  onCleanInput = () => {
    this.inputRef.current.value = '';
  };

  onFocusTextInput() {
    this.inputRef.current.focus();
  }

  onCheck = (event) => {
    const text = TEXTS[this.state.textNumber];
    const keyCode = event.which || event.keyCode;
    const activeChar = text[this.state.activeCharachterIndex];

    if (!this.timerId) {
      this.onTimerStart();
    }

    if (event.key === activeChar || (keyCode === KeyCode.ENTER && activeChar === '\n')) {
      this.setState(
        {
          showErrorHighlight: false,
          activeCharachterIndex: this.state.activeCharachterIndex + 1
        },
        () => {
          if (this.state.activeCharachterIndex === text.length) {
            this.onTimerStop();
            this.onModalOpen();
            addResult({
              speed: this.getSpeed(),
              time: formatTime(this.state.time),
              errors: this.state.countErrors
            });
            this.onFetchResults();
            this.onCleanInput();
          }
        }
      );

      if (keyCode === KeyCode.ENTER) {
        this.onCleanInput();
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
      results,
      isModalVisible
    } = this.state;

    const text = TEXTS[textNumber];
    const progress = (activeCharachterIndex / text.length) * 100;

    return (
      <div className={styles.wrapper}>
        <ResultsTable results={results.slice(-3)} onResultsClear={this.onResultsClear} />
        {isModalVisible && (
          <Modal onGameContinue={this.onGameContinue} onModalClose={this.onModalClose} />
        )}
        <div className={styles.timer}>
          Time:&nbsp;
          {formatTime(time)}
          &nbsp;&nbsp;&nbsp;
          <span className={styles.errors}>Errors:&nbsp;</span>
          <span className={styles.errorsNumber}> {countErrors}</span>
          &nbsp;&nbsp;&nbsp; Speed:&nbsp;
          {this.getSpeed()}
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
            ref={this.inputRef}
            className={classNames(styles.input, {
              [styles.error]: errorsIndices.includes(activeCharachterIndex)
            })}
            onKeyPress={this.onCheck}
          />
        </div>
        <Submarine position={progress} />
      </div>
    );
  }
}

export default App;
