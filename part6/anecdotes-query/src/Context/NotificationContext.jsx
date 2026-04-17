import { createContext, useRef, useState } from 'react'

const NotificationContext = createContext()

export default NotificationContext

export const NotificationContextProvider = (props) => {
  const [message, setMessage] = useState('')
  const timeoutId = useRef(null)

  const notify = (message) => {
    setMessage(message)
    clearTimeout(timeoutId.current)
    timeoutId.current = setTimeout(() => {
      setMessage('')
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={{ message, notify }}>
      {props.children}
    </NotificationContext.Provider>
  )
}
