import { MainLayout } from '../../components/Wrapper/Wrappers'
import { NavigationButton } from '../../components/Button/Buttons'

function HomePage() {
    return (
        <MainLayout>
            <div className="flex flex-col items-center justify-center">
                <div className="max-w-2xl text-center">
                    <h1 className="text-5xl font-bold text-blue-400 mb-4">WebSolow</h1>
                    <p className="text-xl text-blue-400">
                        Интерактивный симулятор модели Солоу. 
                    </p>
                    <p className="text-xl text-blue-400 mb-4">
                        Моделирование экономического роста с возможностью анализа шоковых сценариев
                    </p>
                    <div className="flex flex-col sm:flex-col gap-5 justify-center">
                        <NavigationButton text="Приложение" to="/app" />
                        <NavigationButton text="Математическая модель" to="/mathmodel" />
                        <NavigationButton text="Документация" to="https://github.com/listens-to-spotify/WebSolow/blob/main/README.md" />
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}

export default HomePage
