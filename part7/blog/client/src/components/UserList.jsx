import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useBlog } from '../stores/blog'

const UserList = ({ users }) => {
  const blogs = useBlog()
  const style = {
    fontWeight: 'bold',
  }

  const userBlog = users.map((user) => ({
    ...user,
    blogs: blogs.filter((b) => b.user.id === user.id),
  }))

  return (
    <div>
      <h2>Users</h2>
      {users.length === 0 ? (
        <p>No users available.</p>
      ) : (
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
              {userBlog.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Link to={`/users/${user.id}`}>{user.name}</Link>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.blogs.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  )
}

export default UserList

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
}
