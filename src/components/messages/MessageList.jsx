import React, { useEffect, useState, useRef, useContext } from 'react'
import { useAsync } from 'react-async'
import { Grid, ListItem, makeStyles, LinearProgress } from '@material-ui/core'


import { AuthenticationContext } from '../../context/Authentication'
import { getConversation } from '../../api/messages'
import { useInterval } from '../../hooks/useInterval'
const useStyles = makeStyles({
  list: {
    width: '100%',
    ['overflow-y']: 'scroll',
  },
  message: {
    display: 'flex',
    ['justify-content']: ({recieved}) => (
      recieved
      ? 'flex-start'
      : 'flex-end'
    )
  },
  noMessage: {
    display: 'flex',
    ['justify-content']: 'center'
  }
})

const List = ({children}) => {
  const classes = useStyles()
  return (
  <Grid
    container
    component="ul"
    direction="column"
    className={classes.list}
  >
  </Grid>
  )
}

const Message = ({message, recieved, className}) => (
  <ListItem
    recieved={recieved}
    className={className}
  >
    {message.body}
  </ListItem>
)

export const MessageList = ({sender, recipient, ride}) => {
  const [messages, setMessages] = useState([])
  const classes = useStyles()

  const {
    data,
    error,
    isPending,
    run
  } = useAsync({
    deferFn: getConversation
  })

  useEffect(() => {
    run({
      senderId: sender.id,
      recipientId: recipient.id,
      rideId: ride.id
    }, sender.token)
  }, [])

  useEffect(() => {
    if (data)
      setMessages(data)
  }, [data])

  useInterval(() => {
    if (!isPending)
      run({
        senderId: sender.id,
        recipientId: recipient.id,
        rideId: ride.id
      }, sender.token)
  }, 3000)

  return (
    <List>
      { messages.length === 0
          ? isPending 
            ? <LinearProgress />
            : <ListItem
              className={classes.noMessage}
              >
                No messages
              </ListItem>
          : messages.map(message => (
            <Message
              className={classes.message}
              recieved={message.senderId === sender.id}
              key={message.id}
              message={message}
            />
          ))
      }
    
  </List>
  )
}
