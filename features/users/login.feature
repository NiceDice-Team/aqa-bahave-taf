@login
Feature: User Login
  The login feature allows registered users to access their accounts.
  As a registered user
  I want to log in with my credentials
  So that I can access my orders and profile

  @smoke @critical @ui
  Scenario: Login form is interactable
    Given I navigate to the login page
    Then the login form should be visible
    And the email input field should be visible and interactable
    And the password input field should be visible and interactable
    And the "Sign In" button should be visible and clickable

  @smoke @critical @ui
  Scenario: User can successfully login
    Given I navigate to the login page
    When I fill the email field with "tchallengevasyalex+1@gmail.com"
    And I fill the password field with "secret123"
    And I click the "Sign In" button
    Then the page navigates away from the login page

  Scenario: Login with wrong password
    Given I navigate to the login page
    When I fill the email field with "tchallengevasyalex+1@gmail.com"
    And I fill the password field with "WrongPass"
    And I click the "Sign In" button
    Then the system shows an error "Invalid credentials"

  Scenario: Login with unregistered email
    Given I navigate to the login page
    When I fill the email field with "newuser@example.com"
    And I fill the password field with "Secret123"
    And I click the "Sign In" button
    Then the system shows an error "Invalid credentials"

  Scenario: Login without entering email
    Given I navigate to the login page
    When I fill the password field with "Secret123"
    And I click the "Sign In" button
    Then the system shows an error "Email is required"

  Scenario: Login without entering password
    Given I navigate to the login page
    When I fill the email field with "tchallengevasyalex+1@gmail.com"
    And I click the "Sign In" button
    Then the system shows an error "Password is required"

  Scenario: Alternative login methods
    Given I navigate to the login page
    Then the "Sign In" button should be visible

  Scenario: Guest access
    Given I navigate to the login page
    Then the login form should be visible