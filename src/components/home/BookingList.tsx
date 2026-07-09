"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Search,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Mail,
  Ticket,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  X,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Booking, Event, useCreateBookingMutation, useGetAllBookingsQuery, useGetAllEventsQuery } from "@/redux/api/bookings/bookingApi";
import BackButton from "../reusable-components/BackButton";

export default function BookingList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    requestId: "",
    eventId: "",
    customerName: "",
    customerEmail: "",
    seats: 0,
  });

  // Queries
  const { data, isLoading, refetch } = useGetAllBookingsQuery({
    page: currentPage,
    limit: itemsPerPage,
    eventId: selectedEvent ? parseInt(selectedEvent) : undefined,
    status: selectedStatus || undefined,
  });

  const { data: eventsData, isLoading: eventsLoading, refetch: refetchEvents } = useGetAllEventsQuery();

  // Mutations
  const [createBooking, { isLoading: isCreating }] = useCreateBookingMutation();

  const bookings = data?.data || [];
  const pagination = data?.pagination;
  const events = eventsData?.data || [];

  // Generate unique requestId
  const generateRequestId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `booking-${timestamp}-${random}`;
  };

  // Handle search with debounce
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    refetch();
  }, [debouncedSearchTerm, currentPage, selectedEvent, selectedStatus, refetch]);

  const handleAdd = () => {
    setFormData({
      requestId: generateRequestId(),
      eventId: "",
      customerName: "",
      customerEmail: "",
      seats: 0,
    });
    setFormModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Validate
      if (!formData.eventId) {
        toast.error("Please select an event");
        return;
      }
      if (!formData.customerName.trim()) {
        toast.error("Please enter customer name");
        return;
      }
      if (!formData.customerEmail.trim()) {
        toast.error("Please enter customer email");
        return;
      }
      if (formData.seats < 1) {
        toast.error("Seats must be at least 1");
        return;
      }
       if (formData.seats > 10) {
        toast.error("Seats must be at most 10");
        return;
      }

      await createBooking({
        requestId: formData.requestId,
        eventId: parseInt(formData.eventId),
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        seats: formData.seats,
      }).unwrap();

      toast.success("Booking request accepted! Status will update shortly.");
      setFormModalOpen(false);
      
      // Refetch both bookings and events to update seat counts
      refetch();
      refetchEvents();

      // Refresh again after 3 seconds to show updated status
      setTimeout(() => {
        refetch();
        refetchEvents();
      }, 3000);

    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/20">
            <CheckCircle className="w-3.5 h-3.5" />
            Confirmed
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/20">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            Pending
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get available seats for selected event
  const getAvailableSeats = () => {
    if (!formData.eventId) return null;
    const event = events.find((e: Event) => e.id === parseInt(formData.eventId));
    return event?.seatsRemaining || 0;
  };

  if (isLoading && !bookings.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-950">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4 relative" />
          </div>
          <p className="text-gray-400">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <BackButton />
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Bookings Dashboard
                </h1>
              </div>

              <p className="text-gray-400 mt-2 flex items-center gap-2">
                <span className="h-2 w-2 bg-blue-400 rounded-full animate-pulse"></span>
                Manage and track all event bookings
              </p>
            </div>
            <button
              onClick={handleAdd}
              className="relative cursor-pointer overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              New Booking
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-4 mb-6 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-colors duration-200 group-focus-within:text-blue-400" />
              <input
                type="text"
                placeholder="Search by customer name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800/50 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <select
              value={selectedEvent}
              onChange={(e) => {
                setSelectedEvent(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800/50 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 min-w-[150px]"
            >
              <option value="">All Events</option>
              {events.map((event: Event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800/50 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 min-w-[150px]"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="FAILED">Failed</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedEvent("");
                setSelectedStatus("");
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 transition-colors flex items-center gap-2 text-gray-300"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {searchTerm && bookings.length > 0 && (
            <div className="mt-2 text-sm text-gray-400">
              Found {pagination?.total || bookings.length} result(s) for "{searchTerm}"
            </div>
          )}
          {searchTerm && bookings.length === 0 && !isLoading && (
            <div className="mt-2 text-sm text-yellow-500">
              No results found for "{searchTerm}"
            </div>
          )}
        </div>

        {/* Bookings Table */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50 border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">#</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Booking Ref</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Event</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Seats</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Ticket className="w-12 h-12 text-gray-600" />
                        <p className="text-gray-400">
                          {searchTerm ? `No bookings found for "${searchTerm}"` : "No bookings found"}
                        </p>
                        {!searchTerm && (
                          <button
                            onClick={handleAdd}
                            className="mt-2 text-blue-400 hover:text-blue-300 font-medium"
                          >
                            Create your first booking
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking: Booking, index: number) => (
                    <tr key={booking.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-400">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-blue-400 font-medium">
                          {booking.bookingReference}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-200">{booking.eventName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-200">{booking.customerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-400">{booking.customerEmail}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-200">
                          {booking.seats}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-400">
                          {formatDate(booking.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Showing {((pagination.page - 1) * itemsPerPage) + 1} to{" "}
                {Math.min(pagination.page * itemsPerPage, pagination.total)} of {pagination.total} bookings
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors text-gray-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 rounded-lg border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors text-gray-300"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Create Booking Modal - FIXED */}
        {formModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/20">
                    <Ticket className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">New Booking</h3>
                </div>
                <button
                  onClick={() => setFormModalOpen(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Event */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event *
                  </label>
                  <select
                    value={formData.eventId}
                    onChange={(e) => {
                      setFormData({ ...formData, eventId: e.target.value });
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800/50 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                    disabled={eventsLoading}
                  >
                    <option value="">Select an event</option>
                    {events.map((event: Event) => (
                      <option key={event.id} value={event.id}>
                        {event.name} - {event.seatsRemaining} seats left (${event.price})
                      </option>
                    ))}
                  </select>
                  {formData.eventId && (
                    <p className="mt-1 text-xs text-green-400">
                      ✅ Available seats: {getAvailableSeats()}
                    </p>
                  )}
                </div>

                {/* Customer Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Customer Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="Enter customer name"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800/50 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Customer Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Customer Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      placeholder="Enter customer email"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800/50 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Seats */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Seats *
                  </label>
                  <div className="relative">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="number"
                      value={formData.seats === 0 ? "" : formData.seats}
                      onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) || 1 })}
                      min={1}
                      max={getAvailableSeats() || 10}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800/50 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Maximum {Math.min(10, getAvailableSeats() || 10)} seats available
                  </p>
                </div>

                {/* Request ID (auto-generated) */}
                <div className="p-3 rounded-xl bg-gray-800/50 border border-gray-700">
                  <p className="text-xs text-gray-500">Request ID</p>
                  <p className="text-sm text-gray-300 font-mono truncate">{formData.requestId}</p>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-400">
                    Booking will be processed in the background. Status will update automatically.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setFormModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isCreating}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
                >
                  {(isSubmitting || isCreating) && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  Create Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.1); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

