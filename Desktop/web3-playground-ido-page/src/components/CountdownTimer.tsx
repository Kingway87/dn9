import React from 'react'
import Countdown from 'react-countdown'

function getComingSundayDate() {
  const today = new Date()
  const dayOfWeek = today.getDay()

  let nextSunday = new Date(today)
  nextSunday.setDate(today.getDate() + (7 - dayOfWeek))

  // Adjust the date to Hong Kong time (GMT+8)
  nextSunday.setHours(nextSunday.getHours() + 8)

  nextSunday = new Date(
    nextSunday.getFullYear(),
    nextSunday.getMonth(),
    nextSunday.getDate()
  )

  return nextSunday
}

export default function CountdownTimer() {
  const targetDate = getComingSundayDate()

  // Custom renderer function to display the countdown
  const renderer = ({ days, hours, minutes, seconds }: any) => {
    return (
      <span>
        {days} Days {hours} Hours {minutes} Minutes {seconds} Seconds
      </span>
    )
  }

  return <Countdown date={targetDate} renderer={renderer} />
}
