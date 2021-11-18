import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import {RiComputerLine, IoMan} from 'react-icons/all';
import './GameType.css';
import {MouseEventHandler} from 'react';

interface GameTypeProps {
  onVsPlayerClick: MouseEventHandler<HTMLElement>;
  onVsComputerClick: MouseEventHandler<HTMLElement>;
}

const GameType = ({onVsPlayerClick, onVsComputerClick}: GameTypeProps) => {
  return (
    <div>
      <ButtonGroup>
        <div className="game-type__option">
          <Button variant="light" onClick={onVsPlayerClick}><IoMan size="6em"/></Button>
          <div className="game-type__option-label">Player vs Player</div>
        </div>
        <hr className="game-type__divider"/>
        <div className="game-type__option">
          <Button variant="light" onClick={onVsComputerClick}><RiComputerLine size="6em"/></Button>
          <div className="game-type__option-label">Player vs Computer</div>
        </div>
      </ButtonGroup>
    </div>
  );
};

export default GameType;