const baseurl = process.env.REACT_APP_API_URL

export const getUser = async id => {}
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
