import React,{useState,useEffect} from 'react'
import { LinkContainer} from 'react-router-bootstrap'
import {Table,Button} from 'react-bootstrap'
import { Alert } from 'react-bootstrap'
import {listUsers, Login} from '../actions/userActions'
import FormContainer from '../components/FormContainer'
import { useDispatch, useSelector } from 'react-redux'
import { Register } from '../actions/userActions'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'



const UserListScreen = () => {

    const dispatch = useDispatch()

  const userList = useSelector((state) => state.userList)
  const { loading, error, users } = userList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const navigate = useNavigate()



  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers())
    } else {
     navigate('/login')
    }
  }, [dispatch])


  const deleteHandler = async (id) => {
     if (window.confirm('Are you sure')) {
       //dispatch(deleteUser(id))
       const config ={
             headers:{
                     Authorization : `Bearer ${userInfo.token}`
             }
        }
       const {data} = await axios.delete(`/api/users/${id}`,config)
       dispatch(listUsers())
     }
  }

  return (
    <>
      <h1>Users</h1>
      {loading ? (
        <h1>Loading.....</h1>
      ) : error ? (
        <Alert variant='danger'>{error}</Alert>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <i className='fas fa-check' style={{ color: 'green' }}></i>
                  ) : (
                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant='light' className='btn-sm'>
                      <i className='fas fa-edit'></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(user._id)}
                  >
                    <i className='fas fa-trash'></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

  </>
  )
                  }

export default UserListScreen