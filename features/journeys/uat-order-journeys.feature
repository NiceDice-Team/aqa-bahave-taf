@uat @uat-order @ui
Feature: UAT order journeys
  The deployed UAT environment must let guests and activated customers create
  orders using the payment choices exposed by the checkout.

  @guest @cash-on-delivery
  Scenario: Anonymous visitor creates an order with payment on delivery
    Given a new visitor opens the UAT catalog
    When the visitor adds the first purchasable UAT product to the cart
    And completes the UAT shipping form
    And selects "Cash on Delivery" as the UAT payment method
    And places the UAT order
    Then the UAT order is accepted

  @registration @mailhog @cash-on-delivery
  Scenario: Newly registered customer creates an order with payment on delivery
    Given a newly registered and activated UAT customer
    When the customer adds the first purchasable UAT product to the cart
    And completes the UAT shipping form
    And selects "Cash on Delivery" as the UAT payment method
    And places the UAT order
    Then the UAT order is accepted

  @registration @mailhog @stripe
  Scenario: Newly registered customer creates and pays for an order with Stripe
    Given a newly registered and activated UAT customer
    When the customer adds the first purchasable UAT product to the cart
    And completes the UAT shipping form
    And completes a Stripe test payment
    And places the UAT order
    Then the UAT order is accepted
