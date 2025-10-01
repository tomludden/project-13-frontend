export const initialState = {
  dogImages: [],
  correctBreed: '',
  score: 0,
  lives: 5,
  gameOver: false,
  timer: 5,
  started: false
}

export const gameReducer = (state, action) => {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, started: true }

    case 'SET_DOGS':
      return {
        ...state,
        dogImages: action.payload.images,
        correctBreed: action.payload.correctBreed,
        timer: 5
      }

    case 'GUESS_CORRECT':
      return { ...state, score: state.score + 1, timer: 5 }

    case 'GUESS_WRONG':
      const newLives = state.lives - 1
      return {
        ...state,
        lives: newLives,
        gameOver: newLives <= 0,
        timer: 5
      }

    case 'TICK':
      return { ...state, timer: state.timer - 1 }

    case 'RESET_GAME':
      return { ...initialState, started: true }

    case 'LOAD_STATE':
      return { ...state, ...action.payload }

    default:
      return state
  }
}
