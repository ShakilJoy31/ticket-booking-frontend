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

export interface EventsResponse {
  success: boolean;
  data: Event[];
}

export interface EventResponse {
  success: boolean;
  data: Event;
}

export interface CreateEventRequest {
  name: string;
  date: string;
  total_seats: number;
  price: number;
}

export interface UpdateEventRequest {
  id: number;
  name?: string;
  date?: string;
  total_seats?: number;
  price?: number;
}

export const eventApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all events
    getAllEvents: builder.query<EventsResponse, void>({
      query: () => ({
        url: "/api/events",
        method: "GET",
      }),
      providesTags: ["Events"],
    }),

    // Get single event by ID
    getEventById: builder.query<EventResponse, number>({
      query: (id) => ({
        url: `/api/events/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: 'Events', id }],
    }),

    // Create a new event
    createEvent: builder.mutation<EventResponse, CreateEventRequest>({
      query: (data) => ({
        url: "/api/events",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Events"],
    }),

    // Update an event
    updateEvent: builder.mutation<EventResponse, UpdateEventRequest>({
      query: ({ id, ...data }) => ({
        url: `/api/events/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Events', id },
        "Events",
      ],
    }),

    // Delete an event
    deleteEvent: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/api/events/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Events"],
    }),
  }),
});

export const {
  useGetAllEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApi;