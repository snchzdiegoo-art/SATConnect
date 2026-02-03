import React from 'react';
import Navbar from '../components/Navbar';
import HeroHome from '../components/HeroHome';
import ThreeSteps from '../components/ThreeSteps';
import ProblemSolution from '../components/ProblemSolution';
import PricingTable from '../components/PricingTable';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div className="bg-gray-950 min-h-screen text-white font-sans selection:bg-teal-500 selection:text-white">
            <Navbar />
            <HeroHome />
            <ThreeSteps />

            {/* Marketplace Hook Section */}
            <section className="py-20 bg-gray-950 border-y border-gray-900">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        No solo es software, es <span className="text-blue-400">Crecimiento</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
                        "Además, te llevamos de la mano con agencias y hoteles para que nunca te falten clientes."
                    </p>
                    {/* Add a visual of the marketplace connection here if available, or just the Problem/Solution next */}
                </div>
            </section>

            <ProblemSolution />
            <PricingTable />
            <Footer />
        </div>
    );
};

export default Home;
