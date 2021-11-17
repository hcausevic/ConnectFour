import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
// import { decrementCounter, incrementCounter } from './counterSlice'
// import { useDispatch, useSelector } from 'react-redux';

export function Counter() {
  // const count = useSelector((state) => state.loading)
  // const user = useSelector((state) => state.user)

  const something = useSelector((state) => { console.log(state); return state });

  const dispatch = useDispatch()

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          // onClick={() => dispatch(incrementCounter())}
        >
          Increment
        </button>
        {/*<span>{count}</span>*/}
        <button
          aria-label="Decrement value"
          // onClick={() => dispatch(decrementCounter())}
        >
          Decrement
        </button>
      </div>
    </div>
  )
}

export default Counter;