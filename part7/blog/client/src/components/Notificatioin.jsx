import { Alert } from '@mui/material'
import PropTypes from 'prop-types'

const Notification = ({ message, isError }) => {
  if (!message) return null

  return (
    <Alert
      style={{ marginBottom: 8, marginTop: 8 }}
      severity={isError ? 'error' : 'success'}
    >
      {message}
    </Alert>
  )
}

export default Notification

Notification.propTypes = {
  message: PropTypes.string,
  isError: PropTypes.bool,
}
