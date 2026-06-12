import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import MyLectures from '../components/MyLectures'
import IncomingRequests from '../components/IncomingRequests'

export default function LecturerDashboard() {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'sans-serif', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ margin: 0 }}>Lecturer Dashboard</h1>
        <button onClick={handleLogout}>Log out</button>
      </div>

      <MyLectures />
      <hr />
      <IncomingRequests />
    </div>
  )
}
