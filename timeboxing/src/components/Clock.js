import React from 'react'

function Clock ({hours = 0, minutes = 18, seconds = 29, className}) {
  const convertTime = element => element < 0 ? `00` : element < 10 ? `0${element}` : `${element}`
  const convertMiliseconds = element => element < 0 ? `00` : element < 10 ? `00${element}` : element < 100 ? `0${element}` : `${element}`
  return <h2
    className={`Clock ${className}`}>Pozostalo {convertTime(hours)}:{convertTime(minutes)}:{convertTime(seconds)}</h2>
}

export default Clock
