import React from 'react';
import classNames from 'classnames';
import { KeyCode } from './constants';
import styles from './styles.module.scss';

const text = 'Here is something to type';

class App extends React.Component {
  state = { activeCharachterIndex: 0, time: 0, countErrors: 0, errorsIndices: [] };

  componentDidMount() {
    setInterval(() => {
      this.setState({ time: this.state.time + 1 });
    }, 1000);
  }

  onCheck = (event) => {
    const keyCode = event.which || event.keyCode;

    if (event.key === text[this.state.activeCharachterIndex]) {
      this.setState({
        showErrorHighlight: false,
        activeCharachterIndex: this.state.activeCharachterIndex + 1
      });

      if (keyCode === KeyCode.SPACE) {
        event.nativeEvent.target.value = '';
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

    if (this.state.activeCharachterIndex === text.length) {
      return null;
    }
  };

  render() {
    const { activeCharachterIndex, errorsIndices } = this.state;
    const { countErrors } = this.state;
    const minutes = Math.floor(this.state.time / 60);
    const seconds = Math.floor(this.state.time % 60);

    return (
      <div className={styles.wrapper}>
        <div className={styles.timer}>
          Time:&nbsp;
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          &nbsp;&nbsp;&nbsp;
          <span className={styles.errors}>Errors:&nbsp;</span>
          <span className={styles.errorsNumber}> {countErrors}</span>
        </div>
        <div className={styles.sentence}>
          {Array.from(text, (letter, index) => (
            <span
              key={index}
              className={classNames(styles.letter, {
                [styles.active]: activeCharachterIndex === index,
                [styles.error]: errorsIndices.includes(index)
              })}>
              {letter}
            </span>
          ))}
        </div>
        <div className={styles.inputWrapper}>
          <input className={styles.input} onKeyDown={this.onCheck} />
        </div>
      </div>
    );
  }
}

export default App;
