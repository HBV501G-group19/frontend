import { useState, useEffect } from 'react'
import { useGeolocation } from 'web-api-hooks'

export const useLocationCoords = ( init = [64.140099, -21.94755]) => {
	const location = useGeolocation()
	const [coords, setCoords] = useState(init)

	useEffect(() => {
		if (location) {
			const { coords } = location
			setCoords([coords.latitude, coords.longitude])
		}
	}, [location, setCoords])

	return coords
}
