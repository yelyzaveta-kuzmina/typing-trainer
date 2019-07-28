import React from "react";

const text = "Here is something to type";

class App extends React.Component {
  state = { activeCharachterIndex: 0, time: 0 };

  componentDidMount() {
    setInterval(() => {
      this.setState({ time: this.state.time + 1 });
    }, 1000);
  }

  onCheck = event => {
    if (event.key === text[this.state.activeCharachterIndex]) {
      this.setState({
        activeCharachterIndex: this.state.activeCharachterIndex + 1
      });
    }

    if (this.state.activeCharachterIndex === text.length) {
      alert("Nice");
    }
  };

  render() {
    const { activeCharachterIndex } = this.state;
    const { time } = this.state;

    return (
      <div>
        <div>{time}</div>
        <span>{text.slice(0, activeCharachterIndex)}</span>
        <span className="slicedLetter">{text[activeCharachterIndex]}</span>
        <span>{text.slice(activeCharachterIndex + 1)}</span>
        <div>
          <input onKeyDown={this.onCheck} />
        </div>
      </div>
    );
  }
}

export default App;
