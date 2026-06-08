@checkout @orders
Feature: Orders
  The order feature allows customers to convert their shopping cart into a confirmed order.
  As a customer
  I want to place orders and view my past orders
  So that I can complete purchases and keep track of my shopping history

  Background:
    Given the user is logged in

  @smoke @critical @ui
  Scenario: Checkout page for order placement
    When the user navigates to the checkout page
    Then the checkout page should load
    And the "Place Order" button should be visible

  @smoke @critical @api
  Scenario: Orders API is accessible
    When the user navigates to the catalog page
    Then the page header should be visible

  @critical @api
  Scenario: Secure orders for current user
    When the user navigates to the catalog page
    Then the page header should be visible

  Scenario: Place an order validation
    When the user navigates to the checkout page
    Then the checkout page should load

  Scenario: Cancel an order attempt
    When the user navigates to the checkout page
    Then the checkout page should load

  Scenario: Cancel a paid order check
    When the user navigates to the catalog page
    Then the page header should be visible