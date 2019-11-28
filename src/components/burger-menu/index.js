import React from 'react';
import TEXTS from '../../data/texts';
import { slide as Menu } from 'react-burger-menu';
import './styles.module.scss';

class BurgerMenu extends React.Component {
  render() {
    const { onPoemChange } = this.props;
    return (
      <Menu burgerBarClassName="bm-burger-bars" right>
        {Object.keys(TEXTS).map((name, index) => (
          <span onClick={(event) => onPoemChange(index)} key={index}>
            {name}
          </span>
        ))}
      </Menu>
    );
  }
}

export default BurgerMenu;
