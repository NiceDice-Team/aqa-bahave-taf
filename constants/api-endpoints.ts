// AUTO-GENERATED from OpenAPI schema — do not edit manually
// Source: https://bgshop.work.gd/api/schema/
// Generated: 2026-05-13T22:46:34.129Z

export const API_ENDPOINTS = {
  // AUDIENCES
  DELETE_API_AUDIENCES_ID: (id: string | number) => `/api/audiences/${id}/`,
  GET_API_AUDIENCES: '/api/audiences/',
  GET_API_AUDIENCES_ID: (id: string | number) => `/api/audiences/${id}/`,
  PATCH_API_AUDIENCES_ID: (id: string | number) => `/api/audiences/${id}/`,
  POST_API_AUDIENCES: '/api/audiences/',
  PUT_API_AUDIENCES_ID: (id: string | number) => `/api/audiences/${id}/`,

  // BRANDS
  DELETE_API_BRANDS_ID: (id: string | number) => `/api/brands/${id}/`,
  GET_API_BRANDS: '/api/brands/',
  GET_API_BRANDS_ID: (id: string | number) => `/api/brands/${id}/`,
  PATCH_API_BRANDS_ID: (id: string | number) => `/api/brands/${id}/`,
  POST_API_BRANDS: '/api/brands/',
  PUT_API_BRANDS_ID: (id: string | number) => `/api/brands/${id}/`,

  // CART_-_ADMIN
  GET_API_CART_GUEST_ALL: '/api/cart/guest/all/',

  // CART_-_AUTHENTICATED
  DELETE_API_CART_CLEAR: '/api/cart/clear/',
  DELETE_API_CART_ITEM: '/api/cart/item/',
  GET_API_CART: '/api/cart/',
  PATCH_API_CART_ITEM: '/api/cart/item/',
  POST_API_CART: '/api/cart/',
  POST_API_CART_ITEM: '/api/cart/item/',

  // CART_-_GUEST
  DELETE_API_CART_GUEST: '/api/cart/guest/',
  DELETE_API_CART_GUEST_CLEAR: '/api/cart/guest/clear/',
  DELETE_API_CART_GUEST_ITEM: '/api/cart/guest/item/',
  GET_API_CART_GUEST: '/api/cart/guest/',
  PATCH_API_CART_GUEST_ITEM: '/api/cart/guest/item/',
  POST_API_CART_GUEST: '/api/cart/guest/',
  POST_API_CART_GUEST_ITEM: '/api/cart/guest/item/',

  // CATEGORIES
  DELETE_API_CATEGORIES_ID: (id: string | number) => `/api/categories/${id}/`,
  GET_API_CATEGORIES: '/api/categories/',
  GET_API_CATEGORIES_ID: (id: string | number) => `/api/categories/${id}/`,
  PATCH_API_CATEGORIES_ID: (id: string | number) => `/api/categories/${id}/`,
  POST_API_CATEGORIES: '/api/categories/',
  PUT_API_CATEGORIES_ID: (id: string | number) => `/api/categories/${id}/`,

  // GAME_TYPES
  DELETE_API_GAME_TYPES_ID: (id: string | number) => `/api/game-types/${id}/`,
  GET_API_GAME_TYPES: '/api/game-types/',
  GET_API_GAME_TYPES_ID: (id: string | number) => `/api/game-types/${id}/`,
  PATCH_API_GAME_TYPES_ID: (id: string | number) => `/api/game-types/${id}/`,
  POST_API_GAME_TYPES: '/api/game-types/',
  PUT_API_GAME_TYPES_ID: (id: string | number) => `/api/game-types/${id}/`,

  // ORDERS
  GET_API_ORDERS: '/api/orders/',
  GET_API_ORDERS_ANONIM: '/api/orders/anonim/',
  GET_API_ORDERS_DELIVERY_OPTIONS: '/api/orders/delivery-options/',
  GET_API_ORDERS_PAYMENT_METHODS: '/api/orders/payment-methods/',
  POST_API_ORDERS: '/api/orders/',
  POST_API_ORDERS_CREATE_PAYMENT_INTENT: '/api/orders/create-payment-intent/',
  POST_API_ORDERS_START: '/api/orders/start/',

  // PHOTOS
  DELETE_API_PHOTOS_ID: (id: string | number) => `/api/photos/${id}/`,
  GET_API_PHOTOS: '/api/photos/',
  GET_API_PHOTOS_ID: (id: string | number) => `/api/photos/${id}/`,
  PATCH_API_PHOTOS_ID: (id: string | number) => `/api/photos/${id}/`,
  POST_API_PHOTOS: '/api/photos/',
  PUT_API_PHOTOS_ID: (id: string | number) => `/api/photos/${id}/`,

  // PRODUCTS
  DELETE_API_PRODUCTS_ID: (id: string | number) => `/api/products/${id}/`,
  GET_API_PRODUCTS: '/api/products/',
  GET_API_PRODUCTS_COUNT: '/api/products/count/',
  GET_API_PRODUCTS_ID: (id: string | number) => `/api/products/${id}/`,
  PATCH_API_PRODUCTS_ID: (id: string | number) => `/api/products/${id}/`,
  POST_API_PRODUCTS: '/api/products/',
  PUT_API_PRODUCTS_ID: (id: string | number) => `/api/products/${id}/`,

  // PRODUCTS_IMAGES
  DELETE_API_PRODUCTS_PRODUCT_ID_IMAGES_IMAGE_ID: (product_id: string | number) =>
    `/api/products/${product_id}/images/{image_id}/`,
  PATCH_API_PRODUCTS_PRODUCT_ID_IMAGES_ORDER: (product_id: string | number) =>
    `/api/products/${product_id}/images/order/`,
  POST_API_PRODUCTS_PRODUCT_ID_IMAGES: (product_id: string | number) => `/api/products/${product_id}/images/`,

  // REVIEWS
  DELETE_API_PRODUCTS_PRODUCTS_PRODUCT_ID_REVIEWS_REVIEW_ID: (product_id: string | number) =>
    `/api/products/products/${product_id}/reviews/{review_id}/`,
  DELETE_API_REVIEWS_ID: (id: string | number) => `/api/reviews/${id}/`,
  GET_API_PRODUCTS_PRODUCTS_PRODUCT_ID_REVIEWS: (product_id: string | number) =>
    `/api/products/products/${product_id}/reviews/`,
  GET_API_PRODUCTS_PRODUCTS_PRODUCT_ID_REVIEWS_REVIEW_ID: (product_id: string | number) =>
    `/api/products/products/${product_id}/reviews/{review_id}/`,
  GET_API_REVIEWS: '/api/reviews/',
  GET_API_REVIEWS_ID: (id: string | number) => `/api/reviews/${id}/`,
  PATCH_API_PRODUCTS_PRODUCTS_PRODUCT_ID_REVIEWS_REVIEW_ID: (product_id: string | number, review_id: string | number) =>
    `/api/products/products/${product_id}/reviews/${review_id}/`, 
  PATCH_API_REVIEWS_ID: (id: string | number) => `/api/reviews/${id}/`,
  POST_API_PRODUCTS_PRODUCTS_PRODUCT_ID_REVIEWS: (product_id: string | number) =>
    `/api/products/products/${product_id}/reviews/`,
  POST_API_REVIEWS: '/api/reviews/',
  PUT_API_PRODUCTS_PRODUCTS_PRODUCT_ID_REVIEWS_REVIEW_ID: (product_id: string | number, review_id: string | number) =>
    `/api/products/products/${product_id}/reviews/${review_id}/`, 
  PUT_API_REVIEWS_ID: (id: string | number) => `/api/reviews/${id}/`,

  // USERS
  DELETE_API_USERS_ID: (id: string | number) => `/api/users/${id}/`,
  GET_API_USERS: '/api/users/',
  GET_API_USERS_ACTIVATE_UIDB64_TOKEN: (uidb64: string | number) => `/api/users/activate/${uidb64}/{token}/`,
  GET_API_USERS_AUTH_USER_ID: '/api/users/auth/user-id/',
  GET_API_USERS_ID: (id: string | number) => `/api/users/${id}/`,
  GET_API_USERS_RESET_PASSWORD: '/api/users/reset-password/',
  PATCH_API_USERS_ID: (id: string | number) => `/api/users/${id}/`,
  POST_API_USERS: '/api/users/',
  POST_API_USERS_CHANGE_PASSWORD: '/api/users/change-password/',
  POST_API_USERS_FORGOT_PASSWORD: '/api/users/forgot-password/',
  POST_API_USERS_LOGOUT: '/api/users/logout/',
  POST_API_USERS_OAUTH: '/api/users/oauth/',
  POST_API_USERS_REGISTER: '/api/users/register/',
  POST_API_USERS_RESEND_ACTIVATION: '/api/users/resend-activation/',
  POST_API_USERS_RESET_PASSWORD: '/api/users/reset-password/',
  POST_API_USERS_TOKEN: '/api/users/token/',
  POST_API_USERS_TOKEN_REFRESH: '/api/users/token/refresh/',
  PUT_API_USERS_ID: (id: string | number) => `/api/users/${id}/`,
} as const;
