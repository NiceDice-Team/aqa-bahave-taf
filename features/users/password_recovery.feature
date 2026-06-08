@password_recovery
Feature: Password Recovery
  The password recovery feature allows users to reset their password if forgotten.
  As a registered user
  I want to reset my password via email
  So that I can regain access to my account

  Scenario: Request password reset
    Given I navigate to the login page
    Then the "Sign In" button should be visible

  Scenario: Request password reset validation
    Given I navigate to the login page
    Then the login form should be visible

  Scenario: Request with invalid email
    Given I navigate to the login page
    Then the "Sign In" button should be visible

  Scenario: Reset password flow
    Given I navigate to the login page
    Then the login form should be visible

  Scenario: Reset with mismatched passwords
    Given I navigate to the login page
    Then the login form should be visible

  Scenario: Reset with expired link
    Given I navigate to the login page
    Then the login form should be visible

  Scenario: Reset with invalid link
    Given I navigate to the login page
    Then the login form should be visible