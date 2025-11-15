Feature: User Registration
  The registration feature allows new users to create accounts.
  As a visitor
  I want to register with my email and password
  So that I can manage my orders and access discounts

  Background:
    Given the user opened the registration page "/register"

  Scenario: Successful registration
    When the user entered First Name "John"
    And the user entered Last Name "Doe"
    And the user entered Email "john.doe@example.com"
    And the user entered Password "Secret123"
    And the user entered Confirm Password "Secret123"
    And the user checked the Privacy Policy checkbox
    And the user clicked the "Create Account" button
    Then an account is created in the database with is_active = false
    And an activation email is sent with the activation link

  Scenario: Registration with already used email
    When the user entered First Name "John"
    And the user entered Last Name "Doe"
    And the user entered Email "existing@example.com"
    And the user entered Password "Secret123"
    And the user entered Confirm Password "Secret123"
    And the user checked the Privacy Policy checkbox
    And the user clicked the "Create Account" button
    Then the system shows an error "Email already registered"
    And the account is not created

  Scenario: Registration with invalid email
    When the user entered Email "invalid-email"
    And the user filled the other fields with valid data
    And the user clicked the "Create Account" button
    Then the system shows an error "Invalid email"
    And the account is not created

  Scenario: Registration with password mismatch
    When the user entered Password "Secret123"
    And the user entered Confirm Password "WrongPass"
    And the user filled the other fields with valid data
    And the user clicked the "Create Account" button
    Then the system shows an error "Passwords do not match"
    And the account is not created

  Scenario: Registration without accepting Privacy Policy
    When the user entered all required fields with valid data
    And the user did not check the Privacy Policy checkbox
    And the user clicked the "Create Account" button
    Then the system shows an error "You must agree to the Privacy Policy"
    And the account is not created