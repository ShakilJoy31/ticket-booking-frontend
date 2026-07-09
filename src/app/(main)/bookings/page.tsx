import { Suspense } from "react";
import { generateDynamicMetadata } from "@/metadata/generateMetadata";
import BookingList from "@/components/home/BookingList";

export async function generateMetadata() {
    return generateDynamicMetadata({
        title: "Bookings Dashboard | Event Booking System",
        description: "Manage event bookings - view, create, and track booking status.",
        keywords: ["bookings", "events", "tickets", "booking management"],
    });
}

export default function BookingsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl text-gray-300">Loading bookings...</p>
                </div>
            </div>
        }>
            <BookingList />
        </Suspense>
    );
}