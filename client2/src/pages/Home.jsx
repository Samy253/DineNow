import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";
import Hero from "../components/home/Hero.jsx";
import CuisineBrowse from "../components/home/CuisineBrowse.jsx";
import TrendingRow from "../components/home/TrendingRow.jsx";
import MembershipSection from "../components/home/MembershipSection.jsx";
import NewsletterCTA from "../components/home/NewsletterCTA.jsx";
import { dummyFeaturedRestaurants } from "../assets/assets.js";

export default function Home() {
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            setTrending(dummyFeaturedRestaurants);
            setLoading(false);
        };
        fetchTrending();
    }, []);

    return (
        <div className="min-h-screen bg-surface flex flex-col pt-0">
            <Navbar />
            <AuthModal />
            <main className="flex-1">
                <Hero />
                <CuisineBrowse />
                <TrendingRow trending={trending} loading={loading} />
                <MembershipSection />
                <NewsletterCTA />
            </main>
            <Footer />
        </div>
    );
}