import type React from "react";
import { AiFillGithub } from "react-icons/ai";
import { BlockMath, InlineMath } from 'react-katex';

export function MainLayout({ children } : {children : React.ReactNode}) {
    return (
        <div className="h-screen bg-white flex flex-col">
            <header className="bg-blue-300 text-white shadow-lg">
                <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <a href="/" className="text-lg font-bold transition-transform hover:scale-105">WebSolow</a>
                </nav>
            </header>
            
            <main className="flex-1 flex items-center justify-center">
                <div className="container px-4">
                    {children}
                </div>
            </main>

            <footer className="bg-blue-300 text-white shadow-lg text-center py-3">
                <div className="container mx-auto flex items-center justify-center space-x-3 text-ms">
                    <a>
                        Web-приложение для моделирования экономических отношений, 2025
                    </a>
                    <a href="https://github.com/listens-to-spotify/WebSolow" target="_blank">
                        <AiFillGithub className="min-h-6 min-w-6 transition-transform hover:scale-110"></AiFillGithub>
                    </a>
                </div>
            </footer>
        </div>
    )
}

export function Quoted({ children } : { children : React.ReactNode}) {
    return (
        <code className="bg-gray-100 rounded-lg px-1 py-1">
            {children}
        </code>
    )
}

export function CodeBlock({ children } : { children : React.ReactNode}) {
    return (
        <pre className="bg-gray-100 rounded-2xl px-3 py-3 mb-5 mt-5">
            <code>
                {children}
            </code>
        </pre>
        
    )
}

export function Latex({ text } : { text : string}) {
    return (
        <div className="bg-gray-100 rounded-2xl px-3 py-3">
            <BlockMath math={text}/>
        </div>
    )
}

export function Inline({ text } : { text : string}) {
    return (
        <Quoted>
            <InlineMath math={text} />
        </Quoted>    
    )
}

