import { useEffect } from 'react'
import { useUser, useUserActions } from '../stores/user'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'

const UserList = () => {
  const users = useUser()
  const userActions = useUserActions()

  useEffect(() => {
    userActions.initialize()
  }, [])

  const style = {
    fontWeight: 'bold',
  }

  return (
    <div>
      <h2>Users</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={style}>Name</TableCell>
              <TableCell style={style}>Username</TableCell>
              <TableCell style={style}>Blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default UserList
