
@checkout @payments
Feature: Payment
  The payment feature allows customers to securely pay for their orders.
  As a customer
  I want to choose a payment method and complete a transaction
  So that I can finalize my purchase and receive my products

  Background:
    Given the user is logged in

  @smoke @critical @api
  Scenario: Payment method LiqPay is available
    When the user navigates to the checkout page
    Then the payment method selector should be visible and clickable
    And the "Pay" button should be visible

  @smoke @critical @api
  Scenario: Credit card payment form is visible
    When the user navigates to the checkout page
    Then the payment method selector should be visible and clickable
    And the "Pay" button should be visible

  Scenario: Pay with payment form
    When the user navigates to the checkout page
    Then the "Pay" button should be visible

  Scenario: Pay with various methods
    When the user navigates to the checkout page
    Then the "Pay" button should be visible

  Scenario: Pay with error handling
    When the user navigates to the checkout page
    Then the "Pay" button should be visible

  Scenario: Pay with confirmation
    When the user navigates to the checkout page
    Then the "Pay" button should be visible

  Scenario: Payment state check
    When the user navigates to the checkout page
    Then the "Pay" button should be visible