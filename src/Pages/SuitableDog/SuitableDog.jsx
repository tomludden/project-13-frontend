import './SuitableDog.css'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import mergedDogsFull from '/public/mergedDogsFull.json'
import DogLoader from '../../components/DogLoader/DogLoader'

const STORAGE_KEY = 'suitableDogProgress'

export default function SuitableDog() {
  const [dogs] = useState(() => mergedDogsFull.filter((dog) => dog.id !== null))
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [finished, setFinished] = useState(false)
  const [results, setResults] = useState([])
  const [selectedDog, setSelectedDog] = useState(null)

  const questions = useMemo(
    () => [
      {
        id: 'good_with_children',
        text: 'Do you have children at home?',
        options: [
          { value: 5, label: 'Yes, young kids' },
          { value: 3, label: 'Yes, older kids' },
          { value: 1, label: 'No children' }
        ]
      },
      {
        id: 'good_with_other_dogs',
        text: 'Do you already have other dogs or pets?',
        options: [
          { value: 5, label: 'Yes, very social' },
          { value: 3, label: 'Sometimes territorial' },
          { value: 1, label: 'No other pets' }
        ]
      },
      {
        id: 'grooming',
        text: 'How much grooming are you okay with?',
        options: [
          { value: 1, label: 'Minimal grooming' },
          { value: 3, label: 'Occasional grooming' },
          { value: 5, label: 'Regular grooming is fine' }
        ]
      },
      {
        id: 'energy',
        text: 'How active should your dog be?',
        options: [
          { value: 5, label: 'Very energetic (over 1 hr exercise)' },
          { value: 3, label: 'Moderately active (30–60 mins)' },
          { value: 1, label: 'Low energy (less than 30 mins)' }
        ]
      },
      {
        id: 'good_with_strangers',
        text: 'Do you prefer a protective or friendly dog?',
        options: [
          { value: 1, label: 'Very friendly with strangers' },
          { value: 3, label: 'Balanced' },
          { value: 5, label: 'Highly protective' }
        ]
      },
      {
        id: 'playfulness',
        text: 'How playful should your dog be?',
        options: [
          { value: 5, label: 'Very playful' },
          { value: 3, label: 'Moderately playful' },
          { value: 1, label: 'Calm/relaxed' }
        ]
      },
      {
        id: 'shedding',
        text: 'How fussy are you about shedding hair?',
        options: [
          { value: 1, label: "I don't like dog hairs" },
          { value: 3, label: "I don't mind some shedding" },
          { value: 5, label: "I don't mind at all about shedding" }
        ]
      }
    ],
    []
  )

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const { answers, current, finished, results } = JSON.parse(saved)
        setAnswers(answers || {})
        setCurrent(current || 0)
        setFinished(finished || false)
        setResults(results || [])
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  useEffect(() => {
    const data = { answers, current, finished, results }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [answers, current, finished, results])

  const matchDogs = useCallback(
    (answers) => {
      return dogs
        .map((dog) => {
          let totalScore = 0
          let count = 0
          let breakdown = []

          for (let q of questions) {
            const userVal = answers[q.id]
            const dogVal = dog[q.id]

            if (userVal !== undefined && dogVal != null) {
              count += 1
              const diff = Math.abs(userVal - dogVal)
              let match = Math.max(0, 100 - diff * 20)
              totalScore += match
              breakdown.push({ trait: q.text, match })
            }
          }

          const percent = count > 0 ? Math.round(totalScore / count) : 0
          return { ...dog, score: percent, breakdown }
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
    },
    [dogs, questions]
  )

  const handleAnswer = useCallback(
    (qId, value) => {
      const newAnswers = { ...answers, [qId]: value }
      setAnswers(newAnswers)

      if (current < questions.length - 1) {
        setCurrent(current + 1)
      } else {
        setResults(matchDogs(newAnswers))
        setFinished(true)
      }
    },
    [answers, current, questions.length, matchDogs]
  )

  const handleBack = useCallback(() => {
    if (current > 0) setCurrent(current - 1)
  }, [current])

  const resetQuiz = useCallback(() => {
    setAnswers({})
    setCurrent(0)
    setFinished(false)
    setResults([])
    setSelectedDog(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const openPopup = useCallback((dog) => setSelectedDog(dog), [])
  const closePopup = useCallback(() => setSelectedDog(null), [])

  if (!dogs.length) return <DogLoader />

  if (finished) {
    return (
      <div>
        <h2>Top 10 Matching Dogs</h2>
        <p className='resultsText'>
          Click on the cards to learn more about each dog!
        </p>
        <div className='cardDiv'>
          {results.map((dog, index) => (
            <div
              key={`${dog.name}-${index}`}
              className='dogCard'
              onClick={() => openPopup(dog)}
            >
              {dog.image_link && (
                <img src={dog.image_link} alt={dog.name} className='dogImg' />
              )}
              <h3 style={{ fontSize: dog.name.length > 19 ? '16px' : '20px' }}>
                {dog.name}
              </h3>
              <p>
                <strong>Total Match:</strong> {dog.score}%
              </p>
            </div>
          ))}
        </div>

        <div className='repeat'>
          <button className='repeatButton' onClick={resetQuiz}>
            Repeat
          </button>
        </div>

        {selectedDog && <DogPopup dog={selectedDog} onClose={closePopup} />}
      </div>
    )
  }

  const question = questions[current]

  return (
    <div className='questionnaire'>
      <h1>Which dog is going to be your new best friend?</h1>
      <h2>
        Question {current + 1} of {questions.length}
      </h2>
      <p>{question.text}</p>

      <div className='options'>
        {question.options.map((opt) => (
          <button
            key={`${question.id}-${opt.value}`}
            className='optionInput'
            onClick={() => handleAnswer(question.id, opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <button
        className='questionnaire-back-btn'
        onClick={handleBack}
        disabled={current === 0}
      >
        Back
      </button>
    </div>
  )
}

function DogPopup({ dog, onClose }) {
  return (
    <div className='popup' role='dialog' aria-modal='true' onClick={onClose}>
      <div className='popup-content' onClick={(e) => e.stopPropagation()}>
        <button className='close-btn' onClick={onClose}>
          &times;
        </button>
        <h2>{dog.name}</h2>
        {dog.image_link && (
          <img src={dog.image_link} alt={dog.name} className='dogImgLarge' />
        )}
        {dog.weight && (
          <p>
            <strong>Weight:</strong> {dog.weight} kg
          </p>
        )}
        {dog.height && (
          <p>
            <strong>Height:</strong> {dog.height} cm
          </p>
        )}
        {dog.temperament && (
          <p>
            <strong>Temperament:</strong> {dog.temperament}
          </p>
        )}
        {dog.life_span && (
          <p>
            <strong>Life Span:</strong> {dog.life_span} years
          </p>
        )}
      </div>
    </div>
  )
}
