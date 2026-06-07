@product-detail
Feature: Product Detail Page
  As a customer
  I want to view a product detail page
  So that I can make an informed purchase decision

  Background:
    Given I navigate to the first available product detail page

  # ─── 1. General Page Display ───────────────────────────────────────────────

  @smoke @critical
  Scenario: Product page loads without errors
    Then the page should load without errors

  @smoke @critical
  Scenario: All required product elements are visible
    Then the product title should be visible
    And the product main image should be visible
    And the product price should be visible
    And the product description should be visible
    And the add-to-cart button should be visible

  # ─── 2. Image Gallery ──────────────────────────────────────────────────────

  @smoke
  Scenario: Main product image is displayed
    Then the main product image should be visible

  @regression
  Scenario: Clicking a thumbnail changes the main product image
    When I click product thumbnail at index 2
    Then the main product image should have changed

  @regression
  Scenario: No broken images exist on the product page
    Then all product images should be loaded successfully

  # ─── 3. Add to Cart Block ──────────────────────────────────────────────────

  @smoke @critical
  Scenario: Incrementing quantity increases the counter
    When I click the quantity increment button
    Then the quantity should be "2"

  @smoke @critical
  Scenario: Decrementing below minimum keeps quantity at 1
    When I click the quantity decrement button
    Then the quantity should be "1"

  @smoke @critical
  Scenario: Clicking Add to Cart shows a confirmation
    When I click the add-to-cart button
    Then a cart confirmation should appear

  @regression
  Scenario: Low stock warning is visible when stock is low
    Then the low stock warning should be visible

  @regression
  Scenario: Add to Cart button is disabled for an out-of-stock product
    Given I navigate to an out-of-stock product detail page
    Then the add-to-cart button should be disabled

  # ─── 4. Accordion Tabs ─────────────────────────────────────────────────────

  @smoke
  Scenario: Three required accordion tabs are present
    Then the "Description" accordion tab should be present
    And the "Game Information" accordion tab should be present
    And the "Delivery and Payment" accordion tab should be present

  @regression
  Scenario: Clicking an accordion tab expands its content
    When I click the "Game Information" accordion tab
    Then the "Game Information" section should be expanded

  @regression
  Scenario: Opening another accordion tab collapses the current one
    When I click the "Description" accordion tab
    And I click the "Game Information" accordion tab
    Then the "Description" section should be collapsed

  # ─── 5. Reviews ────────────────────────────────────────────────────────────

  @smoke
  Scenario: Review count and average rating are visible
    Then the review count should be visible
    And the average rating should be visible

  @smoke
  Scenario: Reviews display reviewer name, text, and stars
    Then each review should show a name, text content, and star rating

  @regression
  Scenario: Clicking the next review page updates the review list
    When I go to review page 2
    Then the review list content should update

  @regression
  Scenario: Write a Review button is hidden for guests
    Given I am not logged in
    Then the write-a-review button should not be visible

  @regression
  Scenario: Write a Review button is visible for logged-in users
    Given I am logged in as "standard_user"
    Then the write-a-review button should be visible

  @regression
  Scenario: Clicking Write a Review opens the review form
    Given I am logged in as "standard_user"
    When I click the write-a-review button
    Then the review form should be visible

  # ─── 6. Newsletter Block ───────────────────────────────────────────────────

  @smoke
  Scenario: Newsletter email field accepts input
    Then the newsletter email field should be editable

  @regression
  Scenario: Invalid email format triggers a validation error
    When I enter "invalid-email" into the newsletter email field
    And I submit the newsletter form
    Then a newsletter email validation error should be displayed

  @regression
  Scenario: Valid email subscription shows a success message
    When I enter "user@example.com" into the newsletter email field
    And I submit the newsletter form
    Then a newsletter subscription success message should be displayed

  @regression
  Scenario: Newsletter submit button is disabled when email field is empty
    Then the newsletter submit button should be disabled

  # ─── 7. Behavior and Integration ──────────────────────────────────────────

  @smoke @critical
  Scenario: Product appears in cart after Add to Cart
    When I click the add-to-cart button
    And I navigate to the cart page
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
