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
  const data = await res.json()
  if (res.status === 400 || res.status === 403) {
    throw new Error(data.message)
  } else if (!res.ok) {
    throw new Error('An unexpected error occured')
  } else {
    return data
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

export const powerOf2 = (n) => {
  return (n > 1) && !(n & (n - 1));
}

export const capitalizeFirstLetter = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
