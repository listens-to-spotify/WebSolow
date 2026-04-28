import '../../styles/global.css'

export function Header({ text } : { text: string }) {
    return (
        <h1 className='text-5xl font-bold text-blue-600'>
            {text}
        </h1>
    )
}

export function Paragraph({ text } : { text: string }) {
    return (
        <h1 className='text-3xl font-bold text-blue-450'>
            {text}
        </h1>
    )
}
