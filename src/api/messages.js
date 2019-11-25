import { getRequest, postRequest, patchRequest } from "./utils";

export const sendMessage = postRequest("/messages/create");

// get conversation by conversation id
export const getConversation = getRequest("/messages/conversation");

export const getConversationPost = postRequest("/messages/conversation");
// get all of users conversations
export const getConversationList = getRequest("/messages/user");

export const approvePassenger = patchRequest("/rides/addpassenger");
