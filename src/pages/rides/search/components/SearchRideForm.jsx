import React, { useState, useEffect } from 'react'
import day from 'dayjs'
import { Grid } from '@material-ui/core'

import { GeocodeInput } from '../../../../components/map_components/GeocodeInput'
import { Button } from '../../../../components/styles'
import { TimeInput, Input, Form } from '../../../../components/forms/input'

export const SearchRideForm = ({ submitEndpoints, search }) => {
	const [origin, setOrigin] = useState({
		label: '',
		geometry: null
	})
	const [destination, setDestination] = useState({
		label: '',
		geometry: null
	})
	const [time, setTime] = useState(day())
	const [seats, setSeats] = useState('')

	useEffect(() => {
		if (origin.geometry && destination.geometry) {
      submitEndpoints({
        origin: origin.geometry,
				destination: destination.geometry
      })
		}
	}, [origin, destination])

	const submit = (e) => {
    e.preventDefault()
    if (origin.geometry && destination.geometry) {
      search({
        origin: origin.geometry,
        destination: destination.geometry,
        departureTime: time.format('YYYY-MM-DD HH:mm:ss'),
        range: [300]
      })
    }
	}

  

  return (
		<Form onSubmit={submit}>
			<GeocodeInput
				setLocation={setOrigin}
				formLabel="I'm leaving from"
        options={{
          markerColor: 'blue'
        }}
			/>
			<GeocodeInput
				setLocation={setDestination}
        formLabel="I'm going to"
        options={{
          markerColor: 'red'
        }}
			/>
			<TimeInput 
				time={time}
				format="HH:mm"
				onChange={setTime}
				label="When?"
			/>
      <Button
        type="submit"
        onClick={submit}
      >
        Search for Rides
      </Button>
    </Form>
	)
}

