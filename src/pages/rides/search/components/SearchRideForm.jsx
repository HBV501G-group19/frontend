import React, { useState } from 'react'
import day from 'dayjs'
import styled from 'styled-components'

import { GeocodeInput } from '../../../home/components/GeocodeInput'
import { Button } from '../../../../components/styles'
import { TimeInput } from '../../../../components/forms/input'

const Search = styled.form`
    display: flex;
    flex-direction: column;
`

export const SearchRideForm = ({ submitData }) => {
  const [origin, setOrigin] = useState({
    label: '',
    geometry: null
  })
  const [destination, setDestination] = useState({
    label: '',
    geometry: null
  })
  const [time, setTime] = useState(day())

  const submit = (e) => {
    e.preventDefault()
    
    if (origin.geometry && destination.geometry) {
      submitData({
        origin: origin.geometry,
        destination: destination.geometry,
        departureTime: time.format('YYYY-MM-DD HH:mm:ss')
      })
    }
  }

  return (
    <Search onSubmit={submit}>
      <GeocodeInput
        setLocation={setOrigin}
        formLabel="I'm leaving from"
        markerColor
      />
      <GeocodeInput
        setLocation={setDestination}
        formLabel="I'm going to"
      />
      <TimeInput 
        time={time}
        format="HH:mm"
        onChange={setTime}
        label="When?"
      />
      <Button>Search for Rides</Button>
      </Search>
  )
}

