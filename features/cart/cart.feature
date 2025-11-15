@cart
Feature: Shopping Cart Management
  As a customer
  I want to manage items in my shopping cart
  So that I can purchase the right products

  Background:
    Given I am on the cart page

  @smoke
  Scenario: Adding a product to cart
    When I add product "board-game-123" to cart
    Then the cart total should be 29.99

  @smoke
  Scenario: Removing a product from cart
    Given I add product "board-game-123" to cart
    When I remove product "board-game-123" from cart
    Then the cart should be empty

  @regression
  Scenario Outline: Adding multiple quantities of products
    When I add product "<product_id>" to cart with quantity <quantity>
    Then the cart total should be <expected_total>

    Examples:
      | product_id      | quantity | expected_total |
      | board-game-123  | 2        | 59.98         |
      | card-game-456   | 3        | 44.97         |