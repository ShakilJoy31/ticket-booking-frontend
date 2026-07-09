import { Suspense } from "react";
import { generateDynamicMetadata } from "@/metadata/generateMetadata";
import EventList from "@/components/home/EventList";

export async function generateMetadata() {
  return generateDynamicMetadata({
    title: "Events Management | Event Booking System",
    description: "Manage events - view, create, edit, and delete events.",
    keywords: ["events", "event management", "tickets", "booking"],
  });
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading events...</p>
        </div>
      </div>
    }>
      <EventList />
    </Suspense>
  );
}