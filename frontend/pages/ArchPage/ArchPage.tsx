import { MainLayout, Quoted, CodeBlock } from '../../components/Wrapper/Wrappers';

function ArchPage() {
    return (
        <MainLayout>
            <h1 className="text-5xl font-bold text-blue-400 text-center p-10 border-b-4 border-blue-300">Архитектура</h1>
            <div className='grid grid-cols-2 divide-blue-300 divide-x-4 h-full '>
                <div className='p-6 h-full'>
                    <p className='text-3xl text-blue-400 font-bold text-center mb-8'>
                        Frontend
                    </p>
                    <CodeBlock>{`frontend/
    ├── api
    ├── app
    │   ├── App.css 
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── routes.ts
    ├── components
    │   ├── Button/Buttons.tsx
    │   ├── Chart
    │   ├── Input
    │   ├── Text
    │   └── Wrapper/Wrappers.tsx
    ├── features
    ├── hooks
    ├── pages
    │   ├── AppPage/AppPage.tsx
    │   ├── ArchPage/ArchPage.tsx
    │   ├── DocsPage/DocsPage.tsx
    │   ├── HomePage/HomePage.tsx
    │   └── MathModelPage/MathModelPage.tsx
    ├── public
    ├── styles
    ├── types
    └── utils`}</CodeBlock>

                    <p className=''>
                        Используемый стек: <Quoted>React + TailWindCSS + Vite</Quoted>
                    </p>
                </div>




                <div className='p-6 h-full'>
                    <p className='text-3xl text-blue-400 font-bold text-center mb-8'>
                        Backend 
                    </p>
                    <p>TBU</p>
                </div>
            </div>
        </MainLayout>
    )
}

export default ArchPage;