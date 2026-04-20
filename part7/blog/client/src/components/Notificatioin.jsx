import { Alert } from '@mui/material'
import PropTypes from 'prop-types'
import { useNotification } from '../stores/notification'

const Notification = () => {
  const notification = useNotification()

  if (!notification.message) return null

  return (
    <Alert
      style={{ marginBottom: 8, marginTop: 8 }}
      severity={notification.isError ? 'error' : 'success'}
    >
      {notification.message}
    </Alert>
  )
}

export default Notification

Notification.propTypes = {
  message: PropTypes.string,
  isError: PropTypes.bool,
}
