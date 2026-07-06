import { useCallback } from 'react'
import api from '../api/axios'
import Layout from '../components/Layout'
import BrowseLectures from '../components/BrowseLectures'
import MyRequests from '../components/MyRequests'
import useListFetch from '../hooks/useListFetch'

const fetchMyRequests = () => api.get('/requests/mine', { skipErrorToast: true }).then(r => r.data)

export default function StudentDashboard() {
  // Owned here because two children need it: BrowseLectures marks lectures the
  // student already requested, MyRequests lists them.
  const { items: myRequests, status, refetch } = useListFetch(fetchMyRequests)

  // "Browse lectures" from the empty state: both sections live on this page,
  // so the action just scrolls the browse section into view.
  const scrollToBrowse = useCallback(() => {
    document.getElementById('browse-heading')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <Layout>
      <div className="space-y-10">
        <BrowseLectures myRequests={myRequests} onRequestMade={refetch} />
        <MyRequests
          requests={myRequests}
          status={status}
          onRetry={refetch}
          onBrowse={scrollToBrowse}
        />
      </div>
    </Layout>
  )
}
