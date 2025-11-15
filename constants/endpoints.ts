export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/register',
    LOGIN: '/login',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  PRODUCTS: {
    CATALOG: '/catalog',
    DETAILS: (id: string) => `/products/${id}`,
  },
  CART: {
    MAIN: '/cart',
    ADD: '/api/cart/add',
    REMOVE: '/api/cart/remove',
    UPDATE: '/api/cart/update',
  },
  CHECKOUT: {
    MAIN: '/checkout',
    PLACE_ORDER: '/api/orders/create',
    PAYMENT: '/api/payments/process',
  },
  ORDERS: {
    LIST: '/api/orders',
    DETAILS: (id: string) => `/api/orders/${id}`,
    CANCEL: (id: string) => `/api/orders/${id}/cancel`,
  },
  PROMO: {
    VALIDATE: '/api/promo/validate',
    APPLY: '/api/promo/apply',
  },
  USER: {
    PROFILE: '/account',
    ORDERS: '/account/orders',
  },
} as const;