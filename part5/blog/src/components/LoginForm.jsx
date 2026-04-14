import { Button, TextField } from '@mui/material'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginForm = ({ handleLogin, displayNotification }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await handleLogin(username, password)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch (error) {
      displayNotification(error.response.data.error, true)
    }
  }

  return (
    <>
      <h2>Log in to application</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            type='text'
            variant='standard'
            label='username'
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            type='password'
            variant='standard'
            label='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <Button type='submit' variant='contained' sx={{ marginTop: 2 }}>
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
