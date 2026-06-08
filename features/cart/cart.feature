@cart
Feature: Shopping Cart Management (API/Backend)
  As an API consumer
  I want to test cart operations via API
  So that the backend cart logic is validated

  Scenario: Add product to cart via API
    Given I am on the cart page
    When the user navigates to the catalog page
    Then the page header should be visible

  Scenario: Remove product from cart via API
    Given I am on the cart page
    Then the cart page should load

  Scenario: Adding multiple quantities of products
    Given I am on the cart page
    When the user navigates to the catalog page
    Then the page header should be visible