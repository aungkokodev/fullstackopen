import { createContext, useState } from 'react'

const NotificationContext = createContext()

export default NotificationContext

export const NotificationContextProvider = (props) => {
  const [message, setMessage] = useState('')

  const notify = (message) => {
    setMessage(message)
    setTimeout(() => {
      setMessage('')
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={{ message, notify }}>
      {props.children}
    </NotificationContext.Provider>
  )
}
