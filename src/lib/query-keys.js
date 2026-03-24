/**
 * Centralized Query Key Factory for RideVendor
 * Helps in maintaining consistency and easier cache invalidation.
 */
export const QUERY_KEYS = {
  auth: {
    all: ['auth'],
    me: () => [...QUERY_KEYS.auth.all, 'me'],
  },
  cars: {
    all: ['cars'],
    lists: () => [...QUERY_KEYS.cars.all, 'list'],
    list: (filters) => [...QUERY_KEYS.cars.lists(), { ...filters }],
    details: () => [...QUERY_KEYS.cars.all, 'detail'],
    detail: (id, ...extra) => [...QUERY_KEYS.cars.details(), id, ...extra],
  },
  services: {
    all: ['services'],
    list: (category) => [...QUERY_KEYS.services.all, { category }],
  },
  bookings: {
    all: ['bookings'],
    lists: () => [...QUERY_KEYS.bookings.all, 'list'],
    list: (filters) => [...QUERY_KEYS.bookings.lists(), { ...filters }],
  },
  orders: {
    all: ['orders'],
    lists: () => [...QUERY_KEYS.orders.all, 'list'],
    list: (filters) => [...QUERY_KEYS.orders.lists(), { ...filters }],
  },
  admin: {
    all: ['admin'],
    stats: () => [...QUERY_KEYS.admin.all, 'stats'],
    users: () => [...QUERY_KEYS.admin.all, 'users'],
  }
};
