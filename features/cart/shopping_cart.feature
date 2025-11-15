Feature: Shopping Cart
  The shopping cart allows customers to manage selected products before checkout.
  As a customer
  I want to add, update, and remove products in my cart
  So that I can prepare my order before purchasing

  Background:
    Given the user is logged in

  Scenario: Add product to cart successfully
    Given the product "Catan" exists with stock = 10
    When the user opened the product page
    And the user clicked "Add to Cart"
    And the user set quantity to "2"
    Then the product "Catan" is added to the cart with quantity = 2
    And the subtotal is calculated correctly

  Scenario: Increase product quantity in cart
    Given the cart contains product "Catan" with quantity = 2
    When the user increased quantity to "5"
    Then the cart updates product "Catan" quantity to "5"
    And the subtotal is recalculated

  Scenario: Decrease product quantity in cart
    Given the cart contains product "Catan" with quantity = 3
    When the user decreased quantity to "1"
    Then the cart updates product "Catan" quantity to "1"
    And the subtotal is recalculated

  Scenario: Remove product from cart
    Given the cart contains product "Catan" with quantity = 2
    When the user clicked "Remove"
    Then the product "Catan" is removed from the cart
    And the subtotal is updated accordingly

  Scenario: View cart with multiple products
    Given the cart contains product "Catan" with quantity = 2 and price = 40
    And the cart contains product "Carcassonne" with quantity = 1 and price = 30
    When the user opened the cart page "/cart"
    Then the cart shows "Catan" with total = 80
    And the cart shows "Carcassonne" with total = 30
    And the subtotal is "110"

  Scenario: Add product with quantity 0
    Given the product "Catan" exists with stock = 10
    When the user clicked "Add to Cart"
    And the user set quantity to "0"
    Then the system shows an error "Quantity must be at least 1"
    And the product is not added to the cart

  Scenario: Add product more than stock
    Given the product "Catan" exists with stock = 5
    When the user clicked "Add to Cart"
    And the user set quantity to "10"
    Then the system shows an error "Not enough stock available"
    And the product is not added to the cart

  Scenario: Add product that is out of stock
    Given the product "Catan" exists with stock = 0
    When the user clicked "Add to Cart"
    Then the system shows an error "Product is out of stock"
    And the product is not added to the cart

  Scenario: View empty cart
    Given the cart is empty
    When the user opened the cart page "/cart"
    Then the system shows message "Your cart is empty"
    And the subtotal is "0"