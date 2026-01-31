import { useState, useEffect } from 'react'

export default function CountdownTimer({ targetDate }) {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date()
        let timeLeft = {}

        if (difference > 0) {
            timeLeft = {
                días: Math.floor(difference / (1000 * 60 * 60 * 24)),
                horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutos: Math.floor((difference / 1000 / 60) % 60),
                segundos: Math.floor((difference / 1000) % 60),
            }
        }

        return timeLeft
    }

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearTimeout(timer)
    })

    const timerComponents = []

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval]) {
            return
        }

        timerComponents.push(
            <div key={interval} className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-bold text-brand-accent">
                    {timeLeft[interval]}
                </span>
                <span className="text-xs md:text-sm text-gray-400 uppercase">{interval}</span>
            </div>
        )
    })

    return (
        <div className="flex gap-4 md:gap-6 justify-center items-center">
            {timerComponents.length ? timerComponents : <span className="text-white">¡Tiempo expirado!</span>}
        </div>
    )
}
