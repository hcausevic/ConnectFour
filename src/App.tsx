import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {useSelector, useDispatch} from "react-redux";
import {initGame, makeMove, selectMoves} from "./reducers/gameSlice";
import {Player} from "./constants";
import {Point} from "./interfaces/point";
import Board from "./components/Board";

function App() {
  return (
    <Board />
  );
}

export default App;
