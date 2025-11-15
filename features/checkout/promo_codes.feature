Feature: Promo Codes
  The promo code feature allows customers to apply discount codes to their orders.
  As a customer
  I want to use valid promo codes
  So that I can reduce the total price of my order

  Background:
    Given the user is logged in
    And the user has an existing order in the cart with subtotal "100"

  Scenario: Apply a valid percentage promo code
    Given the promo code "DISCOUNT10" is active
    And the promo code gives a 10 percent discount
    And the promo code expiry date is in the future
    When the user entered the promo code "DISCOUNT10"
    And the user clicked the "Apply" button
    Then the order total is updated to "90"
    And the discount is displayed in the order summary

  Scenario: Apply a valid fixed amount promo code
    Given the promo code "SAVE20" is active
    And the promo code gives a fixed discount of "20"
    And the promo code expiry date is in the future
    When the user entered the promo code "SAVE20"
    And the user clicked the "Apply" button
    Then the order total is updated to "80"
    And the discount is displayed in the order summary

  Scenario: Apply expired promo code
    Given the promo code "SALE20" exists
    And the promo code expiry date is in the past
    When the user entered the promo code "SALE20"
    And the user clicked the "Apply" button
    Then the system shows an error "Promo code expired"
    And the discount is not applied
    And the order total remains "100"

  Scenario: Apply inactive promo code
    Given the promo code "VIP30" exists
    And the promo code is inactive
    When the user entered the promo code "VIP30"
    And the user clicked the "Apply" button
    Then the system shows an error "Promo code is not active"
    And the discount is not applied

  Scenario: Apply non-existent promo code
    When the user entered the promo code "FAKECODE"
    And the user clicked the "Apply" button
    Then the system shows an error "Invalid promo code"
    And the discount is not applied

  Scenario: Apply promo code with minimum order value requirement
    Given the promo code "BIGSALE50" is active
    And the promo code requires a minimum order value of "200"
    When the user entered the promo code "BIGSALE50"
    And the user clicked the "Apply" button
    Then the system shows an error "Order does not meet minimum value requirement"
    And the discount is not applied

  Scenario: Apply promo code to an already paid order
    Given the user has an order with status "paid"
    When the user tried to apply the promo code "DISCOUNT10"
    Then the system shows an error "Cannot apply promo code to paid order"
    And the discount is not applied