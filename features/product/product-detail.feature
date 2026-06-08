@product-detail
Feature: Product Detail Page
  As a customer
  I want to view a product detail page
  So that I can learn about a product

  @smoke @critical
  Scenario: Product detail page loads with all key components
    Given I navigate to a product detail page
    Then the product title should be visible
    And the product main image should be visible
    And the product price should be visible
    And the product description section should be visible

  @smoke @critical
  Scenario: Product detail page has interactable elements
    Given I navigate to a product detail page
    Then the "Add to Cart" button should be visible and clickable
    And the quantity control should be visible and clickable
    And any review-related buttons should be clickable if visible

  @smoke @critical
  Scenario: Anonymous user can view product detail
    Given I am an anonymous user
    When I navigate to a product detail page
    Then the product page should load completely
    And the "Add to Cart" button should be visible

  @smoke @critical
  Scenario: Incrementing quantity increases the counter
    Given I navigate to a product detail page
    When I click the quantity increment button
    Then the quantity should be "2"

  @smoke @critical
  Scenario: Decrementing quantity
    Given I navigate to a product detail page
    When I click the quantity decrement button
    Then the quantity should be "1"

  @smoke @critical
  Scenario: Clicking Add to Cart shows a confirmation
    Given I navigate to a product detail page
    When I click the add-to-cart button
    Then a cart confirmation should appear

  Scenario: Image gallery
    Given I navigate to a product detail page
    When I click product thumbnail at index 2
    Then the main product image should have changed

  Scenario: Product information sections
    Given I navigate to a product detail page
    When I click the "Description" accordion tab
    Then the "Description" section should be expanded

  Scenario: Reviews section
    Given I navigate to a product detail page
    Then the review count should be visible

  Scenario: Write review for logged in user
    Given I am logged in as "standard_user"
    And I navigate to a product detail page
    When I click the write-a-review button
    Then the review form should be visible

  Scenario: Product page for guests
    Given I am not logged in
    When I navigate to a product detail page
    Then the product page should load completely
    Then the product should be in the cart

  @regression
  Scenario: Cart state persists after page reload
    When I click the add-to-cart button
    And I reload the product page
    Then the cart icon count should be greater than zero

  @regression
  Scenario: Product API responds with 200 OK
    Then the product detail API request should return status 200

  @regression
  Scenario: No JavaScript console errors on product page
    Then there should be no console errors

  # ─── 8. Responsive Layout and UX ───────────────────────────────────────────

  @regression
  Scenario: Product page renders correctly on mobile viewport
    Given the viewport is set to "mobile"
    Then the product elements should be visible in mobile layout

  @regression
  Scenario: Product page renders correctly on tablet viewport
    Given the viewport is set to "tablet"
    Then the product elements should be visible in tablet layout

  @regression
  Scenario: Hover effect appears on the Add to Cart button
    When I hover over the add-to-cart button
    Then the add-to-cart button should have a hover state
