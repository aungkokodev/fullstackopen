import { List, ListItem, ListItemText } from '@mui/material'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  return (
    <>
      <h2>Blogs</h2>
      {blogs.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        <List>
          {blogs.map((blog) => (
            <ListItem key={blog.id} sx={{ paddingLeft: 0 }}>
              <ListItemText>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      )}
    </>
  )
}

export default BlogList

BlogList.propTypes = {
  blogs: PropTypes.arrayOf(PropTypes.object).isRequired,
}
