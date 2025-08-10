import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import { SeedButton } from './SeedButton'
import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Ласкаво просимо до вашої панелі керування!</h4>
      </Banner>
      Ось що робити далі:
      <ul className={`${baseClass}__instructions`}>
        <li>
          <SeedButton />
          {
            ' з кількома сторінками, публікаціями та проєктами, щоб швидко запустити ваш сайт, потім '
          }
          <a href="/" target="_blank">
            відвідати ваш вебсайт
          </a>
          {' щоб побачити результати.'}
        </li>
        <li>
          Якщо ви створили цей репозиторій за допомогою Payload Cloud, перейдіть до GitHub і
          клонюйте його на свій локальний комп’ютер. Він буде в межах <i>GitHub Scope</i>, який ви
          обрали під час створення цього проєкту.
        </li>
        <li>
          {'Змініть свої '}
          <a
            href="https://payloadcms.com/docs/configuration/collections"
            rel="noopener noreferrer"
            target="_blank"
          >
            колекції
          </a>
          {' і додайте більше '}
          <a
            href="https://payloadcms.com/docs/fields/overview"
            rel="noopener noreferrer"
            target="_blank"
          >
            полів
          </a>
          {' за потреби. Якщо ви новачок у Payload, також радимо переглянути розділ '}
          <a
            href="https://payloadcms.com/docs/getting-started/what-is-payload"
            rel="noopener noreferrer"
            target="_blank"
          >
            Початок роботи
          </a>
          {' документації.'}
        </li>
        <li>
          Зробіть коміт і відправте зміни до репозиторію, щоб запустити повторне розгортання вашого
          проєкту.
        </li>
      </ul>
      {'Порада: цей блок — це '}
      <a
        href="https://payloadcms.com/docs/custom-components/overview"
        rel="noopener noreferrer"
        target="_blank"
      >
        кастомний компонент
      </a>
      , ви можете прибрати його будь-коли, оновивши ваш <strong>payload.config</strong>.
    </div>
  )
}

export default BeforeDashboard
