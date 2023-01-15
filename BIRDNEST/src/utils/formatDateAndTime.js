export default function formatDateAndTime(captureTime) {
  let day = captureTime.slice(8,10)
  let month = captureTime.slice(5,7)
  let year = captureTime.slice(0,4)
  let time = captureTime.slice(11,19)

  let formattedDateAndTime = `${day}/${month}/${year} at ${time}`
  return formattedDateAndTime
}