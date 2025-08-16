import './App.css'
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Home from './Pages/Home/Home.jsx'
import GuessTheDog from './Pages/GuessTheDog/GuessTheDog.jsx'
import FunDogFacts from './Pages/FunDogFacts/FunDogFacts.jsx'
import ChatWidget from './components/chatButton/chatButton.jsx'

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/guess-the-dog' element={<GuessTheDog />} />
        <Route path='/fun-dog-facts' element={<FunDogFacts />} />
      </Routes>
      <ChatWidget />
    </div>
  )
}

export default App
