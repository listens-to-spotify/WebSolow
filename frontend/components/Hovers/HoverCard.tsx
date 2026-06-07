export function HoverCard( { text, card } : { text : React.ReactNode, card : React.ReactNode}) {
    return (
        <div className="relative inline-block group">
            <span className="cursor-pointer text-blue-800 italic">
                {text}
            </span>

            <div className="absolute left-0 top-10 p-4 shadow-lg min-w-120
                bg-white border-2 border-blue-300 rounded-xl opacity-0 invisible
                group-hover:opacity-100 group-hover:visible
                transition duration-400 z-50">
                {card}
            </div>
        </div>
    );
}