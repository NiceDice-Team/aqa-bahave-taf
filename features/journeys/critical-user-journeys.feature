@critical-journey @local-only
Feature: Critical customer journeys
  These journeys protect the paths that let a customer create or recover an
  account and move a purchasable product from discovery to order review.

  @registration @ui @broken
  Scenario: Visitor submits a valid registration
    Given a visitor is on the local registration page
    When the visitor submits a unique valid registration
    Then the registration is accepted
    When the visitor follows the activation link from local Mailcatcher
    Then the activated customer can sign in

  @password_recovery @ui @broken
  Scenario: Customer requests a password reset
    Given a visitor is on the local password recovery page
    When the visitor requests a reset for the local customer
    Then the reset request is accepted without revealing account state

  @login @ui @broken
  Scenario: Active customer signs in
    Given a visitor is on the local login page
    When the visitor signs in as the local customer
    Then the customer is authenticated

  @catalog @product-detail @ui
  Scenario: Visitor discovers and opens an available product
    Given a visitor opens the local catalog
    Then purchasable products are listed
    When the visitor opens the first listed product
    Then its product details and purchase action are visible

  @catalog @product-detail @cart @checkout @ui @broken
  Scenario: Customer takes a product from catalog to order review
    Given the local customer is signed in with an empty cart
    When the customer opens a product from the catalog
    And adds the selected product to the cart
    Then the selected product is shown in the cart with quantity 1
    When the customer increases the selected product quantity
    Then the selected product quantity is 2 and the subtotal is positive
    When the customer proceeds to checkout with a valid local shipping address
    Then the order review shows the selected product and allows order placement
