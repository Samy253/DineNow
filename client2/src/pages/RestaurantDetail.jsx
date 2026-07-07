import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";
import toast from "react-hot-toast";
import Loader from "../components/Loader.jsx";
import RestaurantHero from "../components/restaurant/RestaurantHero.jsx";
import RestaurantInfo from "../components/restaurant/RestaurantInfo.jsx";
import RestaurantReviews from "../components/restaurant/RestaurantReviews.jsx";
import BookingWidget from "../components/restaurant/BookingWidget.jsx";
import { dummyAvailability, dummyRestaurant } from "../assets/assets.js";

export default function RestaurantDetail() {
    const { slug } = useParams();
    const { isAuthenticated, setAuthModalOpen } = useAppContext();
    const navigate = useNavigate();

    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);

    // Booking Widget states
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedGuests, setSelectedGuests] = useState("2");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [slotsAvailability, setSlotsAvailability] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    useEffect(() => {
        const fetchRestaurant = async () => {
            setRestaurant(dummyRestaurant.find((r) => r.slug === slug));
            setLoading(false);
        };

        if (slug) {
            fetchRestaurant();
        }
    }, [slug, navigate]);

    useEffect(() => {
        const fetchAvailability = async () => {
            setSlotsAvailability(dummyAvailability);
            setLoadingSlots(false);
        };
        fetchAvailability();
    }, [restaurant?._id, selectedDate]);

    if (loading) {
        return <Loader text="Loading Restaurant Details..." />;
    }

    if (!restaurant) return null;

    const handleReserveClick = () => {
        if (!selectedSlot) {
            toast.error("Please select a dining time slot.");
            return;
        }

        if (!isAuthenticated) {
            setAuthModalOpen(true);
            return;
        }

        // Redirect to confirmation page with query params
        navigate(`/booking/${restaurant.slug}?slot=${selectedSlot}&date=${selectedDate}&guests=${selectedGuests}`);
    };

    return (
        <div className="min-h-screen bg-surface flex flex-col pt-20">
            <Navbar />
            <AuthModal />

            {/* Hero Image Section */}
            <RestaurantHero restaurant={restaurant} />

            {/* Split Content Section */}
            <main className="grow max-w-7xl w-full mx-auto px-6 md:px-10 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Column (Details, Menu, Reviews) */}
                    <div className="lg:col-span-8 space-y-12">
                        <RestaurantInfo restaurant={restaurant} />
                        <RestaurantReviews />
                    </div>

                    {/* Right Column (Sticky Reservation Widget) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-36">
                        <BookingWidget
                            restaurant={restaurant}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            selectedGuests={selectedGuests}
                            setSelectedGuests={setSelectedGuests}
                            selectedSlot={selectedSlot}
                            setSelectedSlot={setSelectedSlot}
                            slotsAvailability={slotsAvailability}
                            loadingSlots={loadingSlots}
                            isAuthenticated={isAuthenticated}
                            handleReserveClick={handleReserveClick}
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}