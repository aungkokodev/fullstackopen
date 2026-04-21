import { Button, TextField } from '@mui/material'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useNotificationActions } from '../stores/notification'
import useField from '../hooks/useField'

const LoginForm = ({ handleLogin }) => {
  const { reset: resetUsername, ...username } = useField('text')
  const { reset: resetPassword, ...password } = useField('password')
  const { notify } = useNotificationActions()

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await handleLogin(username.value, password.value)
      resetUsername('')
      resetPassword('')
      navigate('/')
      notify('Login successful')
    } catch (error) {
      notify(error.response.data.error, true)
    }
  }

  return (
    <>
      <h2>Log in to application</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <TextField variant="standard" label="username" {...username} />
        </div>
        <div>
          <TextField variant="standard" label="password" {...password} />
        </div>
        <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
          login
        </Button>
      </form>
    </>
  )
}

export default LoginForm

LoginForm.propTypes = {
  handleLogin: PropTypes.func,
  displayNotification: PropTypes.func,
}
