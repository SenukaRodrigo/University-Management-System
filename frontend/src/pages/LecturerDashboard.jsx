import Layout from '../components/Layout'
import MyLectures from '../components/MyLectures'
import IncomingRequests from '../components/IncomingRequests'

export default function LecturerDashboard() {
  return (
    <Layout>
      <div className="space-y-10">
        <MyLectures />
        <IncomingRequests />
      </div>
    </Layout>
  )
}
