import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { MessageSquare } from 'lucide-react'
import './chatButton.css'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const onSubmit = (data) => {
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      reset()
      setIsOpen(false)
    }, 3000)
  }

  return (
    <div className='chat-widget-root'>
      {!isOpen && (
        <button
          className='chat-fab'
          onClick={() => setIsOpen(true)}
          aria-label='Open chat'
        >
          <MessageSquare size={22} />
        </button>
      )}

      {isOpen && (
        <div className='chat-panel' role='dialog' aria-modal='true'>
          {isSubmitted ? (
            <div className='chat-success'>
              <p className='chat-success-title'>Message received</p>
              <p>We will be in contact as soon as possible!</p>
            </div>
          ) : (
            <form className='chat-form' onSubmit={handleSubmit(onSubmit)}>
              <input
                {...register('name', { required: true })}
                placeholder='Name'
              />
              <input
                type='email'
                {...register('email', { required: true })}
                placeholder='Email'
              />
              <textarea
                rows={5}
                {...register('message', { required: true })}
                placeholder='Write your message here'
              />
              <button type='submit' className='chat-submit'>
                Submit
              </button>
              <button
                type='button'
                className='chat-cancel'
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
