import { useEffect, useRef } from 'react'

export const GameTimer = ({
  started,
  gameOver,
  timer,
  dispatch,
  fetchDogs
}) => {
  const timerRef = useRef(null)

  useEffect(() => {
    if (!started || gameOver) return

    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      dispatch({ type: 'TICK' })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [started, gameOver, dispatch])

  useEffect(() => {
    if (timer <= 0 && started && !gameOver) {
      dispatch({ type: 'GUESS_WRONG' })
      fetchDogs()
    }
  }, [timer, started, gameOver, dispatch, fetchDogs])
}
