import { useContext } from 'react'
import NotificationContext from '../Context/NotificationContext'

const useNotify = () => useContext(NotificationContext)

export default useNotify
