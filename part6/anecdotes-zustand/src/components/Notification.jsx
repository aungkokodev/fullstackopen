import { useNotification } from '../stores/notification'

const Notification = () => {
  const notification = useNotification()

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
  }

  return !notification ? null : <div style={style}>{notification}</div>
}

export default Notification
