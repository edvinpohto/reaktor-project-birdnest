const getDrones = (url) => {
  return new Promise(resolve => {
      fetch(url, {
        // mode: 'cors',
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