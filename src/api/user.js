import { postRequest, getRequest } from './utils'
const baseurl = process.env.REACT_APP_API_URL

// should switch to use React Async if I have time
// export const registerUser = ('/users/register')

export const getUser = getRequest('/users')

// export const registerUser = postRequest('users/register')

export const registerUser = async ({username, email, password}) => {
    const url = new URL('users/register', baseurl)
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            email,
            password
        })
    })
    return response.json()
}
