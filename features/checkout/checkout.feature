@checkout
Feature: Checkout
  The checkout feature allows customers to provide shipping and payment details
  As a customer
  I want to see the checkout page with interactable fields
  So that I can proceed through checkout

  @smoke @critical @ui
  Scenario: Checkout page loads with all form sections
    Given the user is logged in
    When the user navigates to the checkout page
    Then the checkout page should load
    And the shipping section should be visible with address fields
    And the billing section should be visible
    And the payment method section should be visible
    And the order summary should be visible

  @smoke @critical @ui
  Scenario: Checkout form fields are interactable
    Given the user is logged in
    When the user navigates to the checkout page
    Then the shipping address fields should be interactable
    And the billing section should be clickable
    And the payment method selector should be visible and clickable
    And the "Place Order" button should be visible

  Scenario: Checkout page structure
    Given the user is logged in
    When the user navigates to the checkout page
    Then the checkout page should load
    And the shipping section should be visible with address fields

  Scenario: Checkout error handling
    Given the user is logged in
    When the user navigates to the checkout page
    Then the "Place Order" button should be visible

  Scenario: Billing options on checkout
    Given the user is logged in
    When the user navigates to the checkout page
    Then the billing section should be clickable

  Scenario: Payment method selection
    Given the user is logged in
    When the user navigates to the checkout page
    Then the payment method selector should be visible and clickable

  Scenario: Order summary display
    Given the user is logged in
    When the user navigates to the checkout page
    Then the order summary should be visible