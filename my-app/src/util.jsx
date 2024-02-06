import config from './config.json'

export const makeid = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const handleRes = async (res) => {
  if (res.status === 400 || res.status === 403) {
    const errorObj = await res.json()
    throw new Error(errorObj.error)
  } else if (!res.ok) {
    throw new Error('An unexpected error occured')
  } else {
    const dataObj = await res.json()
    return dataObj
  }
}

export const apiFetch = async (route, method, data) => {
  if (route[0] !== '/') {
    route = `/${route}`
  }

  let res
  try {
    if (method === 'GET') {
      res = await fetch(`http://localhost:${config.BACKEND_PORT}${route}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      })
    } else {
      res = await fetch(`http://localhost:${config.BACKEND_PORT}${route}`, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: data ? JSON.stringify(data) : null
      })
    }
  } catch {
    throw new Error('An unexpected error occured.')
  }
  return handleRes(res)
}
