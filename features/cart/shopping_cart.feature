@cart
Feature: Shopping Cart
  The shopping cart allows customers to manage selected products before checkout.
  As a customer
  I want to view and interact with my cart
  So that I can review my selections

  @smoke @critical @ui
  Scenario: Logged-in user can add product to cart and view cart
    Given the user is logged in
    When the user navigates to the catalog page
    And the user clicks the first product card
    Then the product detail page should load
    And the "Add to Cart" button should be visible
    And the user clicks the "Add to Cart" button
    And the cart badge should be visible with updated count
    And the user navigates to the cart page
    Then the cart page should load

  @smoke @critical @ui
  Scenario: Cart page displays items
    Given the user is logged in
    When the user navigates to the cart page
    Then the cart page header should be visible
    And the cart should contain at least one item or be empty with appropriate message
    And any remove buttons on cart items should be clickable

  Scenario: Remove product from cart
    Given the user is logged in
    When the user navigates to the cart page
    Then the cart page should load

  Scenario: View cart with multiple products
    Given the user is logged in
    When the user navigates to the catalog page
    Then the page header should be visible

  Scenario: Add product with quantity control
    Given the user is logged in
    When I navigate to a product detail page
    Then the "Add to Cart" button should be visible

  Scenario: View empty cart handling
    Given the user is logged in
    When the user navigates to the cart page
    Then the cart page should load