import Hero from './components/Hero'
import ThriveEngine from './components/ThriveEngine'
import PricingTable from './components/PricingTable'
import MarketplacePreview from './components/MarketplacePreview'
import OnboardingForm from './components/OnboardingForm'
import Footer from './components/Footer'

function App() {
    return (
        <div className="min-h-screen">
            <Hero />
            <ThriveEngine />
            <PricingTable />
            <MarketplacePreview />
            <OnboardingForm />
            <Footer />
        </div>
    )
}

export default App
