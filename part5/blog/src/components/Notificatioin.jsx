const Notification = ({ message, isError }) => {
  if (!message) return null

  const className = `noti ${isError ? 'error' : 'success'}`

  return <div className={className}>{message}</div>
}

export default Notification
