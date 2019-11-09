import { BASEURL } from '../api/utils'

export const getGeocode = async (geocode, token) => {
		const url = new URL(`ors/geocode?geocode=${geocode}`, BASEURL)
		const res = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			}
    })
  const payload = await res.json()
  return {
    status: res.status,
    payload
  }
}
