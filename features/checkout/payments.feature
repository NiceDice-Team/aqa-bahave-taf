Feature: Payment
  The payment feature allows customers to securely pay for their orders.
  As a customer
  I want to choose a payment method and complete a transaction
  So that I can finalize my purchase and receive my products

  Background:
    Given the user is logged in
    And the user has an existing order with status "new"

  Scenario: Pay with LiqPay successfully
    Given the user selected "LiqPay" as payment method
    When the user completed a successful LiqPay transaction
    Then the order status is updated to "paid"
    And a payment record is stored in the database

  Scenario: Pay with credit card successfully
    Given the user selected "Credit Card" as payment method
    When the user entered card number "4242424242424242"
    And the user entered expiry date "12/29"
    And the user entered CVV "123"
    And the user clicked the "Pay" button
    Then the order status is updated to "paid"
    And a payment record is stored in the database

  Scenario: Pay with invalid card number
    Given the user selected "Credit Card" as payment method
    When the user entered card number "123456"
    And the user entered expiry date "12/29"
    And the user entered CVV "123"
    And the user clicked the "Pay" button
    Then the system shows an error "Invalid card number"
    And the order status remains "new"

  Scenario: Pay with expired card
    Given the user selected "Credit Card" as payment method
    When the user entered card number "4242424242424242"
    And the user entered expiry date "01/20"
    And the user entered CVV "123"
    And the user clicked the "Pay" button
    Then the system shows an error "Card expired"
    And the order status remains "new"

  Scenario: Pay with invalid CVV
    Given the user selected "Credit Card" as payment method
    When the user entered card number "4242424242424242"
    And the user entered expiry date "12/29"
    And the user entered CVV "12"
    And the user clicked the "Pay" button
    Then the system shows an error "Invalid CVV"
    And the order status remains "new"

  Scenario: Pay with declined transaction
    Given the user selected "Credit Card" as payment method
    When the user entered valid card details
    And the payment provider declined the transaction
    Then the system shows an error "Payment declined"
    And the order status remains "new"

  Scenario: Attempt payment on an already paid order
    Given the user has an order with status "paid"
    When the user tried to perform another payment
    Then the system shows an error "Order already paid"
    And no new transaction is created