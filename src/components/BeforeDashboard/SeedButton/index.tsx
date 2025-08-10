'use client'

import React, { Fragment, useCallback, useState } from 'react'
import { toast } from '@payloadcms/ui'

import './index.scss'

const SuccessMessage: React.FC = () => (
  <div>
    Базу даних заповнено! Тепер ви можете{' '}
    <a target="_blank" href="/">
      відвідати ваш вебсайт
    </a>
  </div>
)

export const SeedButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (seeded) {
        toast.info('База даних уже заповнена.')
        return
      }
      if (loading) {
        toast.info('Заповнення вже триває.')
        return
      }
      if (error) {
        toast.error(`Сталася помилка, оновіть сторінку й спробуйте ще раз.`)
        return
      }

      setLoading(true)

      try {
        toast.promise(
          new Promise((resolve, reject) => {
            try {
              fetch('/next/seed', { method: 'POST', credentials: 'include' })
                .then((res) => {
                  if (res.ok) {
                    resolve(true)
                    setSeeded(true)
                  } else {
                    reject('Сталася помилка під час заповнення.')
                  }
                })
                .catch((error) => {
                  reject(error)
                })
            } catch (error) {
              reject(error)
            }
          }),
          {
            loading: 'Заповнення даними...',
            success: <SuccessMessage />,
            error: 'Сталася помилка під час заповнення.',
          },
        )
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err)
        setError(error)
      }
    },
    [loading, seeded, error],
  )

  let message = ''
  if (loading) message = ' (заповнення...)'
  if (seeded) message = ' (готово!)'
  if (error) message = ` (помилка: ${error})`

  return (
    <Fragment>
      <button className="seedButton" onClick={handleClick}>
        Заповнити базу даних
      </button>
      {message}
    </Fragment>
  )
}
