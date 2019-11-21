import { getRequest, postRequest } from './utils'

export const sendMessage = postRequest('/messages/create')

// get conversation by conversation id
export const getConversation = getRequest('/messages/conversation')

// get all of users conversations
export const getConversationList = getRequest('/messages/user')
