import './SuitableDog.css'
import React, { useState } from 'react'
import mergedDogsFull from '/public/mergedDogsFull.json'
import DogLoader from '../../components/DogLoader/DogLoader'

export default function SuitableDog() {
  const [dogs] = useState(mergedDogsFull.filter((dog) => dog.id !== null))
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [finished, setFinished] = useState(false)
  const [results, setResults] = useState([])
  const [selectedDog, setSelectedDog] = useState(null)

  const questions = [
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
  ]

  const matchDogs = (answers) => {
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
            let match = 100 - diff * 20
            if (match < 0) match = 0
            totalScore += match
            breakdown.push({ trait: q.text, match })
          }
        }

        const percent = count > 0 ? Math.round(totalScore / count) : 0
        return { ...dog, score: percent, breakdown }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
  }

  const handleAnswer = (qId, value) => {
    const newAnswers = { ...answers, [qId]: value }
    setAnswers(newAnswers)

    if (current < questions.length - 1) {
      setCurrent(current + 1)
    } else {
      const matches = matchDogs(newAnswers)
      setResults(matches)
      setFinished(true)
    }
  }

  const handleBack = () => {
    if (current > 0) setCurrent(current - 1)
  }

  const openPopup = (dog) => setSelectedDog(dog)
  const closePopup = () => setSelectedDog(null)

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
          <button
            className='repeatButton'
            onClick={() => {
              setAnswers({})
              setCurrent(0)
              setFinished(false)
              setResults([])
              setSelectedDog(null)
            }}
          >
            Repeat
          </button>
        </div>

        {selectedDog && (
          <div
            className='popup'
            role='dialog'
            aria-modal='true'
            onClick={closePopup}
          >
            <div className='popup-content' onClick={(e) => e.stopPropagation()}>
              <button className='close-btn' onClick={closePopup}>
                &times;
              </button>
              <h2>{selectedDog.name}</h2>
              {selectedDog?.image_link && (
                <img
                  src={selectedDog.image_link}
                  alt={selectedDog.name}
                  className='dogImgLarge'
                />
              )}
              {selectedDog?.weight && (
                <p>
                  <strong>Weight:</strong> {selectedDog.weight} kg
                </p>
              )}
              {selectedDog?.height && (
                <p>
                  <strong>Height:</strong> {selectedDog.height} cm
                </p>
              )}
              {selectedDog?.temperament && (
                <p>
                  <strong>Temperament:</strong> {selectedDog.temperament}
                </p>
              )}
              {selectedDog?.life_span && (
                <p>
                  <strong>Life Span:</strong> {selectedDog.life_span} years
                </p>
              )}
            </div>
          </div>
        )}
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
