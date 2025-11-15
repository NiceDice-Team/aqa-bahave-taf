Feature: Checkout
  The checkout feature allows customers to provide shipping and payment details
  As a customer
  I want to complete the checkout process
  So that I can place my order successfully

  Background:
    Given the user is logged in
    And the cart contains 2 products with subtotal "100"

  Scenario: Successful checkout with shipping and payment
    Given the user opened the checkout page "/checkout"
    And the user entered valid shipping details
    And the user entered valid billing details
    And the user selected "Credit Card" as payment method
    And the user entered valid card details
    When the user clicked the "Place Order" button
    Then a new order is created with status "paid"
    And the cart is emptied
    And the confirmation email is sent to the user

  Scenario: Successful checkout using "Use shipping as billing address"
    Given the user opened the checkout page "/checkout"
    And the user entered valid shipping details
    And the user checked the "Use shipping as billing address" checkbox
    And the user selected "LiqPay" as payment method
    When the user clicked the "Place Order" button
    Then a new order is created with status "paid"
    And the cart is emptied

  Scenario: Checkout with missing shipping fields
    Given the user opened the checkout page "/checkout"
    And the user left the "Address" field empty
    When the user clicked the "Place Order" button
    Then the system shows an error "Address is required"
    And the order is not created

  Scenario: Checkout with invalid email format
    Given the user opened the checkout page "/checkout"
    And the user entered Email "invalid-email"
    When the user clicked the "Place Order" button
    Then the system shows an error "Invalid email format"
    And the order is not created

  Scenario: Checkout with invalid phone number
    Given the user opened the checkout page "/checkout"
    And the user entered Phone "abc123"
    When the user clicked the "Place Order" button
    Then the system shows an error "Invalid phone number"
    And the order is not created

  Scenario: Checkout with invalid ZIP code
    Given the user opened the checkout page "/checkout"
    And the user entered ZIP Code "1"
    When the user clicked the "Place Order" button
    Then the system shows an error "Invalid ZIP Code"
    And the order is not created

  Scenario: Checkout with credit card but missing payment details
    Given the user opened the checkout page "/checkout"
    And the user entered valid shipping details
    And the user selected "Credit Card" as payment method
    And the user left the card number empty
    When the user clicked the "Place Order" button
    Then the system shows an error "Card number is required"
    And the order is not created

  Scenario: Attempt checkout with empty cart
    Given the cart is empty
    When the user opened the checkout page "/checkout"
    And the user clicked the "Place Order" button
    Then the system shows an error "Cart is empty"
    And the order is not created