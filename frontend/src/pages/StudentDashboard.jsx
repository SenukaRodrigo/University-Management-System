import { useState, useEffect, useCallback } from 'react'
import api from '../api/axios'
import Layout from '../components/Layout'
import BrowseLectures from '../components/BrowseLectures'
import MyRequests from '../components/MyRequests'

export default function StudentDashboard() {
  const [myRequests, setMyRequests] = useState([])
  const [reqLoading, setReqLoading] = useState(true)
  const [reqError,   setReqError]   = useState(null)

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

  return (
    <Layout>
      <div className="space-y-10">
        <BrowseLectures myRequests={myRequests} onRequestMade={fetchMyRequests} />
        <MyRequests requests={myRequests} loading={reqLoading} error={reqError} />
      </div>
    </Layout>
  )
}
