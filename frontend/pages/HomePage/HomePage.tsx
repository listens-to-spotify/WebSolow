import '../../styles/global.css'
import { Header, Paragraph } from "../../components/Text/Headers"
import { NavigationButton } from '../../components/Button/Buttons'
import { MainLayout } from '../../components/Wrapper/Wrappers'

function HomePage() {
    return (
        <div className="box-border size=32 border-8 p-4 min-h-screen grid bg-white">
            <div className='mt-10 text-center'>
                <Header text="That is the HomePage" />
                <br />
                <Paragraph text="This is the Paragraph" />
                <br />
                <NavigationButton text="This is a button" /> 
            </div>
        </div>
    )
}

export default HomePage;