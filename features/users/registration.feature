@registration
Feature: User Registration
  The registration feature allows new users to create accounts.
  As a visitor
  I want to register with my email and password
  So that I can manage my orders and access discounts

  @smoke @critical @ui
  Scenario: Registration form is interactable
    Given I navigate to the registration page
    Then the registration form should be visible
    And the first name input should be visible and interactable
    And the last name input should be visible and interactable
    And the email input should be visible and interactable
    And the password input should be visible and interactable
    And the confirm password input should be visible and interactable
    And the privacy policy checkbox should be visible and clickable
    And the "Create Account" button should be visible and clickable

  @smoke @critical @ui
  Scenario: User can submit registration form
    Given I navigate to the registration page
    When I fill the first name with "Test"
    And I fill the last name with "User"
    And I fill the email with a unique email address
    And I fill the password with "TestPass123"
    And I fill the confirm password with "TestPass123"
    And I check the privacy policy checkbox
    And I click the "Create Account" button
    Then the page navigates away from the registration page

  Scenario: Registration with invalid email format
    Given I navigate to the registration page
    When I fill the first name with "John"
    And I fill the last name with "Doe"
    And I fill the email with a unique email address
    And I fill the password with "Secret123"
    And I fill the confirm password with "Secret123"
    And I check the privacy policy checkbox
    And I click the "Create Account" button
    Then the system shows an error "Email"

  Scenario: Registration with password mismatch
    Given I navigate to the registration page
    When I fill the first name with "Jane"
    And I fill the last name with "Smith"
    And I fill the email with a unique email address
    And I fill the password with "Secret123"
    And I fill the confirm password with "WrongPass"
    And I check the privacy policy checkbox
    And I click the "Create Account" button
    Then the system shows an error "Passwords do not match"

  Scenario: Registration without accepting Privacy Policy
    Given I navigate to the registration page
    When I fill the first name with "Bob"
    And I fill the last name with "Jones"
    And I fill the email with a unique email address
    And I fill the password with "TestPass123"
    And I fill the confirm password with "TestPass123"
    And I click the "Create Account" button
    Then the system shows an error "Privacy Policy"