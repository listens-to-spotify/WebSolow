import '../../styles/global.css'

export function NavigationButton({ text } : { text: string }) {
    return (
        <button className='min-w-60 min-h-15 mt-2 px-6 py-4 bg-blue-300 text-white font-bold text-lg rounded-md transition-transform active:scale-95'>
            {text}
        </button>
    )
}