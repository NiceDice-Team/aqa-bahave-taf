@product-detail @stock-validation
Feature: Stock Validation Before Adding to Cart
  As a customer
  I want to be prevented from adding more items than available in stock
  So that I only purchase what is actually available

  @critical @stock
  Scenario: Cannot increment quantity beyond available stock on product page
    Given I navigate to a product detail page
    When I check the available product stock
    And I increment the quantity multiple times to exceed the stock
    Then the quantity should not exceed the available stock
    And the UI should remain functional

  @critical @stock
  Scenario: Add to cart button is disabled when out of stock
    Given I navigate to a product detail page with low or no stock
    Then the add-to-cart button should be disabled or show error message
    And an out-of-stock message should be visible

  @critical @stock
  Scenario: Can add product with exact stock quantity on product page
    Given I navigate to a product detail page
    When I set the quantity to the exact available stock amount
    And I click the add-to-cart button
    Then the product should be added to the cart successfully

  @stock @cart
  Scenario: Cannot update cart quantity beyond available stock
    Given the user is logged in
    When the user navigates to the catalog page
    And the user clicks the first product card
    And the product detail page should load
    And the user clicks the "Add to Cart" button
    And the user navigates to the cart page
    Then the cart page should load
    When the user tries to increase the quantity beyond available stock
    Then the quantity should not exceed the available stock
    And an error message should appear

  @stock @cart
  Scenario: Update cart to maximum available quantity succeeds
    Given the user is logged in
    When the user navigates to the catalog page
    And the user clicks the first product card
    And the product detail page should load
    And the user clicks the "Add to Cart" button
    And the user navigates to the cart page
    Then the cart page should load
    When the user set quantity to the maximum available amount
    Then the quantity should be updated successfully

  @regression @stock
  Scenario: Error message is displayed when exceeding stock
    Given I navigate to a product detail page
    When I attempt to add more items than available stock
    Then an insufficient stock error message should appear
    And the product should not be added to the cart

  @regression @stock
  Scenario: UI remains functional after stock validation error
    Given I navigate to a product detail page
    When I attempt to exceed the available stock
    And an error message appears
    Then I should still be able to navigate
    And I should still be able to interact with other page elements
    And the page should not break or reload unexpectedly
