@cart
Feature: Shopping Cart Management
  As a customer
  I want to manage items in my shopping cart
  So that I can purchase the right products

  Background:
    Given I am on the cart page

  @smoke @critical @api
  Scenario: Adding a product to cart
    When I add a first product to cart
    Then the cart should not be empty

  @smoke @critical @api
  Scenario: Removing a product from cart
    Given I add a first product to cart
    When I remove the first added product from cart
    Then the cart should be empty

  @regression
  Scenario Outline: Adding multiple quantities of products
    When I add product "<product_id>" to cart with quantity <quantity>
    Then the cart total should be <expected_total>

    Examples:
      | product_id      | quantity | expected_total |
      | board-game-123  | 2        | 59.98         |
      | card-game-456   | 3        | 44.97         |