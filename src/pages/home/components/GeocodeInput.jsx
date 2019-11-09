import React, {useState, useContext, useEffect, useRef} from 'react'
import L from 'leaflet'
import styled from 'styled-components'

import {AuthenticationContext} from '../../../context/Authentication'
import {MapContext} from '../../../context/Map'
import { Input } from '../../../components/forms/input'
import { Marker } from '../../../components/map_components/Marker'
import { BASEURL } from '../../../api/utils'
import { getGeocode } from '../../../api/ors'

const $Li = styled.li`
	font-weight: ${({hover}) => hover ? 'bold' : 'normal'};
`

const ListMarker = ({coordinates, options, content, onClick = () => {}}) => {
	const [hover, setHover] = useState(false)
	const onClickLi = e => {
		e.preventDefault()
		onClick(e)
	}

	const onClickMarker = e => {
		onClick(e)
	}
	return (
		<>
			<Marker
				hover={hover}
				onClick={onClickMarker}
				onHover={setHover}
				coordinates={coordinates.reverse()}
				tooltip={content}
				options={options}
			/>
			<$Li
				onClick={onClickLi}
				onMouseOver={e => {setHover(true)}}
				onMouseOut={e => {setHover(false)}}
				hover={hover}
			>
				{content}
			</$Li>
		</>
	)
}



export const GeocodeInput = ({setLocation, formLabel, markerColor}) => {
	const {token} = useContext(AuthenticationContext)
	const ref = useRef(null)
	const [features, setFeatures] = useState([])
	const [value, setValue] = useState('')
	const removeOtherMarkers = features => id => {
		const feature = features.find(f => f.properties.id === id)
		setFeatures([feature])
	}

	const removeOthers = removeOtherMarkers(features)
	const submit = async e => {
		e.preventDefault()
		const response = await getGeocode(value, token)
		if (response.status === 200) {
			const { payload: {features} } = response
			setFeatures(features)
		}
	}
	const focus = () => {
		if (ref.current) ref.current.focus()
	}
	return (
		<>
			<Input
				focusRef={ref}
				onChange={setValue}
				value={value}
				onKeyEnter={submit}
				label={formLabel}/>
			{
				features.length > 0
					? (
						<ul>
							{features.map(feature => {
								const {
									properties: {id, label},
									geometry
								} = feature
								let { coordinates } = geometry
								// The geocode api does not return
								// coordinates in lat/long long/lat format
								// consistantly :(
								if (coordinates[0] > 60)
									coordinates = coordinates.reverse()
								return (
									<ListMarker
										key={id}
										onClick={e => {
											focus()
											setValue(label)
											setLocation({
												label,
												geometry
											})
											removeOthers(id)
										}}
										coordinates={coordinates}
										content={label}
										options={{blue: markerColor}}
									/>
								)
							})}
						</ul>
					)
					: null
			}
		</>
	)
}
