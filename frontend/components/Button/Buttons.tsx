import '../../styles/global.css'

import { Link } from 'react-router-dom'

export function NavigationButton({ text, to } : { text: string, to?: string }) {
    const className = 'min-w-120 px-6 py-4 bg-blue-300 hover:bg-blue-400 text-white font-bold text-lg rounded-lg transition-transform hover:scale-105 active:scale-95 shadow-md'
    if (to) {
        return <Link to={to} className={className}>{text}</Link>
    }
    return <button className={className}>{text}</button>
}