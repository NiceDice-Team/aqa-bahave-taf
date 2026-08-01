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

  @critical @stock
  Scenario: Can add product with exact stock quantity on product page
    Given I navigate to a product detail page
    When I set the quantity to the exact available stock amount
    And I click the add-to-cart button
    Then the UI should remain functional

  @regression @stock
  Scenario: UI remains functional after stock validation error
    Given I navigate to a product detail page
    When I attempt to exceed the available stock
    And an error message appears
    Then I should still be able to navigate
    And I should still be able to interact with other page elements
    And the page should not break or reload unexpectedly
