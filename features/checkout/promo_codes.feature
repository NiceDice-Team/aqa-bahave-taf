@checkout @promo_codes
Feature: Promo Codes
  The promo code feature allows customers to apply discount codes to their orders.
  As a customer
  I want to use valid promo codes
  So that I can reduce the total price of my order

  Background:
    Given the user is logged in

  Scenario: Apply promo code
    When the user navigates to the checkout page
    Then the "Place Order" button should be visible

  Scenario: Apply different code type
    When the user navigates to the checkout page
    Then the "Place Order" button should be visible

  Scenario: Apply expired code
    When the user navigates to the checkout page
    Then the "Place Order" button should be visible

  Scenario: Apply disabled code
    When the user navigates to the checkout page
    Then the "Place Order" button should be visible

  Scenario: Apply missing code
    When the user navigates to the checkout page
    Then the "Place Order" button should be visible

  Scenario: Apply with minimum value
    When the user navigates to the checkout page
    Then the "Place Order" button should be visible

  Scenario: Apply to paid order
    When the user navigates to the checkout page
    Then the "Place Order" button should be visible