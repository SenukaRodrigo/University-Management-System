import { useState, useEffect, useCallback } from 'react'

// Tiny fetch state machine for list endpoints.
//
//   loading -> success  (data.length > 0)
//   loading -> empty    (data.length === 0)
//   loading -> error    (request failed)
//
// Every refetch goes back through "loading" first, so empty/error are never
// shown while a request is in flight. `fetcher` must be referentially stable
// (define it with useCallback or at module scope) or the effect will loop.
export default function useListFetch(fetcher) {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  // Bumping this re-runs the fetch effect; the effect itself never sets
  // "loading" synchronously (initial state already is, refetch sets it below).
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => {
    setStatus('loading')
    setTick(t => t + 1)
  }, [])

  useEffect(() => {
    // The cancelled flag makes stale responses no-ops: if a refetch starts (or
    // the component unmounts) while a request is in flight, the older request
    // can't overwrite the newer one's result.
    let cancelled = false
    fetcher()
      .then(data => {
        if (cancelled) return
        setItems(data)
        setStatus(data.length === 0 ? 'empty' : 'success')
      })
      .catch(() => {
        // The inline ErrorState reports this — no toast for load failures.
        if (!cancelled) setStatus('error')
      })
    return () => { cancelled = true }
  }, [fetcher, tick])

  return { items, status, refetch }
}
