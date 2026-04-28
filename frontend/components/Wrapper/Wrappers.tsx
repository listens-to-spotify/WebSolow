import '../../styles/global.css'

export function MainLayout({ children } : {children : any}) {
    return (
        <div>
            <main>{children}</main>
        </div>
    )
}