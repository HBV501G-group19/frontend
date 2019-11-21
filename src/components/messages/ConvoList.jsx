import React, { useState, useEffect, useCallback } from 'react'
import { useAsync } from 'react-async'
import { Grid, ListItem, LinearProgress } from '@material-ui/core'

import { getUser } from '../../api/user'
import { getConversationList } from '../../api/messages'
import { useInterval } from '../../hooks/useInterval'

import { List } from '../styles'

const useConvoList = ({user, ride, token}) => {
  const [convos, setConvos] = useState([])

  const getConversations = useCallback(async () => {
    const cb = ride 
      ? getConversationList({
          user: user.id,
          ride: ride.id,
        }, token)
      : getConversationList({
          user: user.id
      }, token)
    return cb()
  }, [user, ride, token])

  const {
    data,
    error,
    isPending,
    run
  } = useAsync({
    deferFn: getConversations
  })

  useInterval(() => {
    if (!isPending)
      run()
  }, 3000)

  useEffect(() => {
    run()
  }, [user, ride, token])

  useEffect(() => {
    if (data)
      setConvos(data)
  }, [data])

  return convos
}

const ConversationBox = ({talkingTo, ride, driving, message, token}) => {
  const cb = useCallback(async () => {
    const data = await getUser(talkingTo, token)()
    return data
  }, [talkingTo, token])

  const {
    data,
    isPending,
    error,
    run
  } = useAsync({
    deferFn: cb
  })

  useEffect(() => {
    run()
  }, [])

  return (
    <ListItem>
      <Grid>
        {data
            ? (
              <>
                <p><strong>{data.username}</strong></p>
                <p>{ message ? message.body : 'No messages'}</p>
              </>
            )
            : <LinearProgress />
          }
      </Grid>
    </ListItem>
  )
}

export const ConvoList = ({ride, user, token}) => {
  const convos = useConvoList({ride, user, token})
  return (
    <List>
      {
        convos.map(convo => (
          <ConversationBox
            talkingTo={convo.userId}
            ride={convo.rideId}
            driving={convo.driver}
            message={convo.messages[convo.messages.length - 1]}
            token={token}
            key={`r${convo.rideId}u${convo.userId}`}
          />
        ))
      }
    </List>
  )
}
