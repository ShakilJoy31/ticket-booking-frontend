import { apiSlice } from "../apiSlice";

// Types
export interface Event {
  id: number;
  name: string;
  date: string;
  totalSeats: number;
  seatsRemaining: number;
  price: number;
}

export interface Booking {
  id: number;
  bookingReference: string;
  eventId: number;
  eventName: string;
  customerName: string;
  customerEmail: string;
  seats: number;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventsResponse {
  success: boolean;
  data: Event[];
}

export interface BookingsResponse {
  success: boolean;
  data: Booking[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateBookingRequest {
  requestId: string;
  eventId: number;
  customerName: string;
  customerEmail: string;
  seats: number;
}

export interface CreateBookingResponse {
  success: boolean;
  message: string;
  data: {
    bookingReference: string;
    status: string;
    requestId: string;
  };
}

export const bookingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all events
    getAllEvents: builder.query<EventsResponse, void>({
      query: () => ({
        url: "/api/events",  // ✅ Removed hardcoded URL
        method: "GET",
      }),
      providesTags: ["Events"],
    }),

    // Get all bookings with pagination and filters
    getAllBookings: builder.query<BookingsResponse, {
      page?: number;
      limit?: number;
      eventId?: number;
      status?: string;
    }>({
      query: ({ page = 1, limit = 10, eventId, status }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (eventId) {
          params.append("eventId", eventId.toString());
        }
        if (status) {
          params.append("status", status);
        }
        
        return {
          url: `/api/bookings?${params.toString()}`,  // ✅ Removed hardcoded URL
          method: "GET",
        };
      },
      providesTags: (result) => {
        if (result?.data) {
          return [
            ...result.data.map(({ id }) => ({ type: 'Booking' as const, id })),
            { type: 'Booking', id: 'LIST' },
          ];
        }
        return [{ type: 'Booking', id: 'LIST' }];
      },
    }),

    // Create a new booking
    createBooking: builder.mutation<CreateBookingResponse, CreateBookingRequest>({
      query: (data) => ({
        url: "/api/bookings",  // ✅ Removed hardcoded URL
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: 'Booking', id: 'LIST' },
        'Events',
      ],
    }),
  }),
});

export const {
  useGetAllEventsQuery,
  useGetAllBookingsQuery,
  useCreateBookingMutation,
} = bookingApi;