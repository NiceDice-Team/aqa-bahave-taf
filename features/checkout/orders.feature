Feature: Orders
  The order feature allows customers to convert their shopping cart into a confirmed order.
  As a customer
  I want to place orders and view my past orders
  So that I can complete purchases and keep track of my shopping history

  Background:
    Given the user is logged in

  Scenario: Place an order successfully
    Given the cart contains 2 products
    And the user opened the checkout page "/checkout"
    And the user entered valid shipping details
    And the user entered valid payment details
    When the user clicked the "Place Order" button
    Then a new order is created with status "new"
    And products are moved from cart_items to order_items
    And the cart is emptied

  Scenario: View own orders
    Given the database contains 3 orders for the logged in user
    When the user requests GET /api/orders/
    Then the response returns 3 orders
    And each order contains items and total price

  Scenario: View another user's order
    Given the database contains an order owned by user "UserA"
    And the current logged in user is "UserB"
    When the user requests GET /api/orders/1/
    Then the system returns 403 Forbidden

  Scenario: Place an order with empty cart
    Given the cart is empty
    When the user clicked the "Place Order" button
    Then the system shows an error "Cart is empty"
    And the order is not created

  Scenario: Cancel an order
    Given the user has an existing order with status "new"
    When the user clicked the "Cancel Order" button
    Then the order status is updated to "canceled"

  Scenario: Cancel an already paid order
    Given the user has an existing order with status "paid"
    When the user clicked the "Cancel Order" button
    Then the system shows an error "Cannot cancel a paid order"
    And the order status remains "paid"