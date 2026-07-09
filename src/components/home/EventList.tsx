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
  Ticket,
  DollarSign,
  Users,
  Edit,
  Trash2,
  Loader2,
  X,
  AlertCircle,
  CheckCircle,
  Eye,
  Clock,
  Layers,
  MapPin,
} from "lucide-react";
import BackButton from "../reusable-components/BackButton";
import { Event, useCreateEventMutation, useDeleteEventMutation, useGetAllEventsQuery, useUpdateEventMutation } from "@/redux/api/bookings/eventApi";

export default function EventList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    total_seats: 100,
    price: 0,
  });

  // Queries
  const { data, isLoading, refetch } = useGetAllEventsQuery();

  // Mutations
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const events = data?.data || [];

  // Filter events based on search
  const filteredEvents = events.filter((event: Event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
  }, [refetch]);

  const handleAdd = () => {
    setIsEditing(false);
    setSelectedEvent(null);
    setFormData({
      name: "",
      date: "",
      total_seats: 100,
      price: 0,
    });
    setFormModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    setIsEditing(true);
    setSelectedEvent(event);
    setFormData({
      name: event.name,
      date: event.date.split("T")[0],
      total_seats: event.totalSeats,
      price: event.price,
    });
    setFormModalOpen(true);
  };

  const handleDelete = (event: Event) => {
    setSelectedEvent(event);
    setDeleteModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Validate
      if (!formData.name.trim()) {
        toast.error("Please enter event name");
        return;
      }
      if (!formData.date) {
        toast.error("Please select event date");
        return;
      }
      if (formData.total_seats < 1) {
        toast.error("Total seats must be at least 1");
        return;
      }
      if (formData.price < 0) {
        toast.error("Price cannot be negative");
        return;
      }

      if (isEditing && selectedEvent) {
        await updateEvent({
          id: selectedEvent.id,
          name: formData.name,
          date: new Date(formData.date).toISOString(),
          total_seats: formData.total_seats,
          price: formData.price,
        }).unwrap();
        toast.success("Event updated successfully!");
      } else {
        await createEvent({
          name: formData.name,
          date: new Date(formData.date).toISOString(),
          total_seats: formData.total_seats,
          price: formData.price,
        }).unwrap();
        toast.success("Event created successfully!");
      }

      setFormModalOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEvent) return;

    try {
      await deleteEvent(selectedEvent.id).unwrap();
      toast.success("Event deleted successfully!");
      setDeleteModalOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete event");
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

  const getSeatsStatus = (event: Event) => {
    const percentage = (event.seatsRemaining / event.totalSeats) * 100;
    if (percentage === 0) {
      return {
        color: "text-red-400",
        bg: "bg-red-500/20",
        border: "border-red-500/20",
        label: "Sold Out",
      };
    } else if (percentage <= 20) {
      return {
        color: "text-orange-400",
        bg: "bg-orange-500/20",
        border: "border-orange-500/20",
        label: "Few Left",
      };
    } else if (percentage <= 50) {
      return {
        color: "text-yellow-400",
        bg: "bg-yellow-500/20",
        border: "border-yellow-500/20",
        label: "Half Sold",
      };
    } else {
      return {
        color: "text-green-400",
        bg: "bg-green-500/20",
        border: "border-green-500/20",
        label: "Available",
      };
    }
  };

  if (isLoading && !events.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-950">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
            <Loader2 className="w-12 h-12 animate-spin text-green-500 mx-auto mb-4 relative" />
          </div>
          <p className="text-gray-400">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-float-delayed"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <BackButton />
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  Events Management
                </h1>
              </div>
              <p className="text-gray-400 mt-2 flex items-center gap-2">
                <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></span>
                Create, manage, and track all your events
              </p>
            </div>
            <button
              onClick={handleAdd}
              className="relative cursor-pointer overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-medium flex items-center gap-2 shadow-lg shadow-green-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-green-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              New Event
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-4 mb-6 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-colors duration-200 group-focus-within:text-green-400" />
              <input
                type="text"
                placeholder="Search by event name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800/50 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200"
              />
            </div>

            <button
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 transition-colors flex items-center gap-2 text-gray-300"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {searchTerm && filteredEvents.length > 0 && (
            <div className="mt-2 text-sm text-gray-400">
              Found {filteredEvents.length} result(s) for &quot;{searchTerm}&quot;
            </div>
          )}
          {searchTerm && filteredEvents.length === 0 && !isLoading && (
            <div className="mt-2 text-sm text-yellow-500">
              No results found for &quot;{searchTerm}&quot;
            </div>
          )}
        </div>

        {/* Stats Cards */}
        {events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-xl border border-green-500/20">
                  <Layers className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total Events</p>
                  <p className="text-2xl font-bold text-white">{events.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-500/20 rounded-xl border border-teal-500/20">
                  <Users className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total Seats</p>
                  <p className="text-2xl font-bold text-white">
                    {events.reduce((acc, e) => acc + e.totalSeats, 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/20">
                  <Ticket className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Available Seats</p>
                  <p className="text-2xl font-bold text-white">
                    {events.reduce((acc, e) => acc + e.seatsRemaining, 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-xl border border-orange-500/20">
                  <DollarSign className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Avg. Ticket Price</p>
                  <p className="text-2xl font-bold text-white">
                    ${events.length > 0 ? (events.reduce((acc, e) => acc + e.price, 0) / events.length).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events Table */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50 border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">#</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Event Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Total Seats</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Available</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {paginatedEvents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Calendar className="w-12 h-12 text-gray-600" />
                        <p className="text-gray-400">
                          {searchTerm ? `No events found for "${searchTerm}"` : "No events found"}
                        </p>
                        {!searchTerm && (
                          <button
                            onClick={handleAdd}
                            className="mt-2 text-green-400 hover:text-green-300 font-medium"
                          >
                            Create your first event
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedEvents.map((event: Event, index: number) => {
                    const seatsStatus = getSeatsStatus(event);
                    return (
                      <tr key={event.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-400">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-200 font-medium">{event.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-400">{formatDate(event.date)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-200">{event.totalSeats}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-200">{event.seatsRemaining}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-green-400">
                            ${event.price.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${seatsStatus.bg} ${seatsStatus.color} border ${seatsStatus.border}`}>
                            {seatsStatus.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(event)}
                              className="p-2 cursor-pointer rounded-lg hover:bg-teal-500/20 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-teal-400" />
                            </button>
                            <button
                              onClick={() => handleDelete(event)}
                              disabled={isDeleting}
                              className="p-2 cursor-pointer rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredEvents.length)} of {filteredEvents.length} events
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
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors text-gray-300"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Create/Edit Event Modal */}
        {formModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-xl border border-green-500/20">
                    <Calendar className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {isEditing ? "Edit Event" : "Create New Event"}
                  </h3>
                </div>
                <button
                  onClick={() => setFormModalOpen(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Event Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Name *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter event name"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800/50 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Event Date *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="datetime-local"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800/50 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Total Seats */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Total Seats *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="number"
                      value={formData.total_seats}
                      onChange={(e) => setFormData({ ...formData, total_seats: parseInt(e.target.value) || 0 })}
                      min={1}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800/50 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Minimum 1 seat</p>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price per Seat *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      min={0}
                      step={0.01}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800/50 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Price cannot be negative</p>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <AlertCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-400">
                    {isEditing 
                      ? "Updating this event will not affect existing bookings." 
                      : "New event will be available for booking immediately."}
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
                  disabled={isSubmitting || isCreating || isUpdating}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-500/25"
                >
                  {(isSubmitting || isCreating || isUpdating) && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {isEditing ? "Update Event" : "Create Event"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && selectedEvent && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-md w-full p-6 border border-gray-700 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                  <Trash2 className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Delete Event
                </h3>
                <p className="text-gray-400 mb-6">
                  Are you sure you want to delete the event{" "}
                  <span className="font-semibold text-gray-200">
                    &quot;{selectedEvent.name}&quot;
                  </span>
                  ? This action cannot be undone.
                  {selectedEvent.seatsRemaining < selectedEvent.totalSeats && (
                    <span className="block mt-2 text-yellow-400 text-sm">
                      ⚠️ This event has {selectedEvent.totalSeats - selectedEvent.seatsRemaining} booked seats.
                    </span>
                  )}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteModalOpen(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Delete
                  </button>
                </div>
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