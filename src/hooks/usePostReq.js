import {useState, useEffect} from 'react'

const baseurl = process.env.REACT_APP_API_URL

export const usePostReq = (path) => {
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)
    const [body, setBody] = useState(null)

    const url = new URL(path, baseurl)
    useEffect(() => {
        const getData = async () => {
            setLoading(true)
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(body)
                })

                const json = await response.json()

                setData({
                    status: response.status,
                    item: json
                })

            } catch (e) {
                setData({
                    error: [{
                        field: 'fetching',
                        message: 'failed to fetch'
                    }]
                })
            } finally {
                if (mounted) {
                    setBody(null)
                    setLoading(false)
                }
            }
        }

        console.log('what what')
        let mounted = true
        if (mounted && !loading && body) {
            getData()
        }
        return () => {
            mounted = false
            setBody(null)
            setLoading(false)
        }
    }, [url, body, setData, setBody, setLoading])

    return { data, loading, setBody }
}
