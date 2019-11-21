import React, {useState, useContext, useEffect, useRef} from 'react'
import L from 'leaflet'
import styled from 'styled-components'
import Async, { useAsync } from 'react-async'

import {AuthenticationContext} from '../../context/Authentication'
import { useLocationCoords } from '../../hooks/useLocationCoords'

import {MapContext} from '../../context/Map'
import { Input } from '../forms/input'
import { List } from '../styles'
import { ListItem } from '@material-ui/core'

import { Marker } from './Marker'
import { BASEURL } from '../../api/utils'
import { getGeocode } from '../../api/ors'
import { useGeocode } from '../../hooks/useData'

const $Li = styled.li`
	font-weight: ${({hover}) => hover ? 'bold' : 'normal'};
`
const ListMarker = ({
  feature,
	options, 
	onClick = () => {},
  markerColor
}) => {
	const [hover, setHover] = useState(false)
	const onClickLi = e => {
		e.preventDefault()
		onClick()
	}

	const onClickMarker = e => {
		onClick()
	}

  const {
	  properties: {id, label},
		geometry
	} = feature

	const { coordinates } = geometry

	return (
		<>
			<Marker
				hover={hover}
				onClick={onClickMarker}
				onHover={setHover}
				coordinates={coordinates.slice().reverse()}
				tooltip={label}
				options={options}
        color={markerColor}
			/>
			<ListItem
				onClick={onClickLi}
				onMouseOver={e => {setHover(true)}}
				onMouseOut={e => {setHover(false)}}
				hover={hover}
			>
				<p
          style={{
            fontWeight: hover ? 'bold' : 'normal'
          }}
        >
          {label}
        </p>
			</ListItem>
		</>
	)
}

const getGeocodes = async ([geocode, focus, token]) => {
  const res = await fetch('http://localhost:8080/ors/geocode',{
    method: 'POST',
    headers: {
      'content-type':'application/json',
      'accepts':'application/json, application/geo+json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({geocode, focus})
  })

  if (!res.ok) throw new Error(res.statusText)
  return res.json()
}

export const GeocodeInput = ({setLocation, formLabel, options}) => {
	const {token} = useContext(AuthenticationContext)
	const ref = useRef(null)

	const [features, setFeatures] = useState([])
	const [value, setValue] = useState('')

  const _setFeatures = (featureCollection) => {
    setFeatures(featureCollection.features)
  }

	const coords = useLocationCoords()
  const {
    isPending,
    error,
    run
  } = useGeocode(
        _setFeatures,
        true,
        token, 
        {geocode: value, focus: coords}
  )

	const removeOtherMarkers = features => id => {
		const feature = features.find(f => f.properties.id === id)
		setFeatures([feature])
	}

  const removeOthers = removeOtherMarkers(features)
	
  const submit = e => {
		e.preventDefault()
    run()
	}

	const focus = () => {
		if (ref.current) ref.current.focus()
	}
  console.log(features)
  return (
    <>
      <Input 
        focusRef={ref}
        onChange={setValue}
        value={value}
        onKeyEnter={submit}
        label={formLabel}
        disabled={isPending}
      />
      { error && <p>error.message</p> }
          <List>
            {features.map(({geometry, properties}) => (
              <ListMarker
                key={properties.id}
                feature={{geometry, properties}}
                options={options}
                markerColor={options.markerColor}
                onClick={e => {
                  focus()
                  setValue(properties.label)
                  setLocation({
                    label: properties.label,
                    geometry
                  })
                  removeOthers(properties.id)
                }}
              />
            ))}
          </List>
    </>
  )
}
