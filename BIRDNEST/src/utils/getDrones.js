// Data fetching on the client side. URL parameter points at the server created for the task.
const getDrones = (url) => {
  return new Promise(resolve => {
      fetch(url, {
        headers: {
        'Access-Control-Allow-Origin':'*',
        'Content-Type': 'application/json'
      }
      })
      .then(response => response.json())
      .then(data  => {
        resolve(data)
        return data;
      })
      .catch(err => console.log("error", err));
  })
}

export default getDrones;