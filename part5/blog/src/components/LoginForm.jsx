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
      <h1>Log in to application</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>username </label>
          <input
            type='text'
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <label>password </label>
          <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </>
  )
}

export default LoginForm

LoginForm.propTypes = {
  handleLogin: PropTypes.func,
  displayNotification: PropTypes.func,
}
