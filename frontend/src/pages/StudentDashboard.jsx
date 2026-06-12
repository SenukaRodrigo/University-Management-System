import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import BrowseLectures from '../components/BrowseLectures'
import MyRequests from '../components/MyRequests'

export default function StudentDashboard() {
  const { logout } = useAuth()
  const navigate   = useNavigate()

  const [myRequests, setMyRequests]   = useState([])
  const [reqLoading, setReqLoading]   = useState(true)
  const [reqError,   setReqError]     = useState(null)

  const fetchMyRequests = useCallback(async () => {
    setReqLoading(true)
    setReqError(null)
    try {
      const { data } = await api.get('/requests/mine')
      setMyRequests(data)
    } catch {
      setReqError('Failed to load your requests')
    } finally {
      setReqLoading(false)
    }
  }, [])

  useEffect(() => { fetchMyRequests() }, [fetchMyRequests])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'sans-serif', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ margin: 0 }}>Student Dashboard</h1>
        <button onClick={handleLogout}>Log out</button>
      </div>

      <BrowseLectures myRequests={myRequests} onRequestMade={fetchMyRequests} />
      <hr />
      <MyRequests requests={myRequests} loading={reqLoading} error={reqError} />
    </div>
  )
}
