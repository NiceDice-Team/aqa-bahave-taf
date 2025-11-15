Feature: User Login
  The login feature allows registered users to access their accounts.
  As a registered user
  I want to log in with my credentials
  So that I can access my orders and profile

  Background:
    Given the user opened the login page "/login"

  Scenario: Successful login
    When the user entered Email "john.doe@example.com"
    And the user entered Password "Secret123"
    And the user clicked the "Sign In" button
    Then the system authenticates the user
    And the user is redirected to the account page "/account"

  Scenario: Login with incorrect password
    When the user entered Email "john.doe@example.com"
    And the user entered Password "WrongPass"
    And the user clicked the "Sign In" button
    Then the system shows an error "Invalid credentials"
    And the user is not logged in

  Scenario: Login with unregistered email
    When the user entered Email "newuser@example.com"
    And the user entered Password "Secret123"
    And the user clicked the "Sign In" button
    Then the system shows an error "No account found with this email"
    And the user is not logged in

  Scenario: Login without entering required fields
    When the user clicked the "Sign In" button
    Then the system shows errors "Email is required" and "Password is required"
    And the user is not logged in

  Scenario: Login with inactive account
    Given the user "inactive@example.com" exists in the database with is_active = false
    When the user entered Email "inactive@example.com"
    And the user entered Password "Secret123"
    And the user clicked the "Sign In" button
    Then the system shows an error "Account not activated. Please check your email."
    And the user is not logged in

  Scenario: Login with Google OAuth successfully
    When the user clicked "Sign in with Google"
    And the OAuth provider authenticated the user
    Then the system logs the user in
    And the user is redirected to the account page "/account"

  Scenario: Login with Facebook OAuth successfully
    When the user clicked "Sign in with Facebook"
    And the OAuth provider authenticated the user
    Then the system logs the user in
    And the user is redirected to the account page "/account"

  Scenario: Continue as guest
    When the user clicked "Continue as Guest"
    Then the system creates a guest session
    And the user is redirected to the home page "/"