import React from 'react';
import { INITIAL_STATE } from '../../initial-state';
import { addResult, getResults, removeResults } from '../../utils/local-storage';
import { formatSpeed, formatTime } from '../../utils/formating';
import { KeyCode } from '../../utils/constants';
import TEXTS from '../../data/texts';
import BurgerMenu from '../../components/burger-menu';
import RestartButton from '../../components/restart-button';
import ResultsTable from '../../components/results-table';
import LiveResultContainer from '../../components/live-results-container';
import Modal from '../../components/modal-window';
import Submarine from '../../components/submarine';
import classNames from 'classnames';
import styles from './styles.module.scss';

class App extends React.Component {
  timerId = null;
  inputRef = React.createRef();
  state = INITIAL_STATE;

  getSpeed = () => formatSpeed(this.state.activeCharachterIndex, this.state.time);

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

  onGameRestart = () => {
    this.onTimerStop();
    this.onCleanInput();
    this.setState(
      {
        ...INITIAL_STATE,
        poemNumber: this.state.poemNumber,
        textNumber: this.state.textNumber,
        results: getResults()
      },
      this.onFocusTextInput
    );
  };

  onGameContinue = () => {
    this.onCleanInput();
    this.setState(
      {
        ...INITIAL_STATE,
        poemNumber: this.state.poemNumber,
        textNumber: this.state.textNumber + 1,
        results: getResults()
      },
      this.onFocusTextInput
    );
  };

  onCleanInput = () => {
    setTimeout(() => {
      this.inputRef.current.value = '';
    }, 0);
  };

  onFocusTextInput() {
    this.inputRef.current.focus();
  }

  onPoemChange = (poemNumber) => {
    this.onCleanInput();
    this.onTimerStop();
    this.setState({
      ...INITIAL_STATE,
      poemNumber,
      textNumber: 0,
      time: 0,
      results: getResults()
    });
  };

  onCheck = (event) => {
    const text = Object.values(TEXTS)[this.state.poemNumber][this.state.textNumber];
    const poemFullContent = Object.values(TEXTS)[this.state.poemNumber];
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
          if (this.state.activeCharachterIndex >= text.length) {
            this.onTimerStop();
            if (this.state.textNumber + 1 !== poemFullContent.length) {
              this.onModalOpen();
            }
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
      poemNumber,
      textNumber,
      activeCharachterIndex,
      errorsIndices,
      countErrors,
      results,
      isModalVisible
    } = this.state;

    const text = Object.values(TEXTS)[poemNumber][textNumber];
    const poemName = Object.keys(TEXTS)[poemNumber];
    const progress = (activeCharachterIndex / text.length) * 100;
    return (
      <>
        <BurgerMenu onPoemChange={this.onPoemChange} />
        <div className={styles.wrapper}>
          <ResultsTable results={results.slice(-3)} onResultsClear={this.onResultsClear} />
          <RestartButton onClick={this.onGameRestart} />
          {isModalVisible && (
            <Modal
              onGameRestart={this.onGameRestart}
              onGameContinue={this.onGameContinue}
              onModalClose={this.onModalClose}
            />
          )}
          <div test-handle={'results-live'} className={styles.resultsLive}>
            <LiveResultContainer
              name={'Timer'}
              content={formatTime(time)}
              testHandle={'timer'}></LiveResultContainer>
            <LiveResultContainer
              className={styles.errorsNumber}
              name={'Errors'}
              content={countErrors}
              testHandle={'errors'}></LiveResultContainer>
            <LiveResultContainer
              name={'Speed'}
              content={this.getSpeed() === Infinity ? '0' : this.getSpeed()}
              testHandle={'speed'}></LiveResultContainer>
          </div>
          <div test-handle={'poem-name'} className={styles.poemName}>
            {poemName}
          </div>
          <div test-handle={'text'} className={styles.sentence}>
            {Array.from(text, (letter, index) => (
              <span
                test-handle={activeCharachterIndex === index ? 'active-letter' : null}
                key={index}
                className={classNames(styles.letter, {
                  [styles.active]: activeCharachterIndex === index,
                  [styles.error]: errorsIndices.includes(index)
                })}>
                {letter === '\n' && (
                  <span test-handle={'arrow'} className={styles.arrow}>
                    {'↩'}
                  </span>
                )}
                {letter}
              </span>
            ))}
          </div>
          <div className={styles.inputWrapper}>
            <input
              autoFocus
              test-handle={'input'}
              ref={this.inputRef}
              placeholder={'insert text here'}
              className={classNames(styles.input, {
                [styles.error]: errorsIndices.includes(activeCharachterIndex)
              })}
              onKeyPress={this.onCheck}
            />
          </div>
          <Submarine position={progress} />
        </div>
      </>
    );
  }
}

export default App;
