Feature: Password Recovery
  The password recovery feature allows users to reset their password if forgotten.
  As a registered user
  I want to reset my password via email
  So that I can regain access to my account

  Background:
    Given the user opened the password recovery page "/forgot-password"

  Scenario: Request password reset successfully
    Given the user entered Email "john.doe@example.com"
    When the user clicked the "Submit" button
    Then the system sends a reset link to "john.doe@example.com"
    And the system shows message "Reset link sent to your email"

  Scenario: Request password reset with unregistered email
    Given the user entered Email "notfound@example.com"
    When the user clicked the "Submit" button
    Then the system shows message "If this email exists, a reset link will be sent"
    And no email is sent

  Scenario: Request password reset with invalid email format
    Given the user entered Email "invalid-email"
    When the user clicked the "Submit" button
    Then the system shows an error "Invalid email format"
    And no email is sent

  Scenario: Reset password successfully
    Given the user followed the reset link with valid uid and token
    And the user opened the reset password page "/reset-password"
    When the user entered New Password "NewSecret123"
    And the user entered Confirm Password "NewSecret123"
    And the user clicked the "Reset Password" button
    Then the system updates the user password
    And the system shows message "Password has been successfully reset"

  Scenario: Reset password with mismatched confirmation
    Given the user followed the reset link with valid uid and token
    And the user opened the reset password page "/reset-password"
    When the user entered New Password "NewSecret123"
    And the user entered Confirm Password "WrongPass"
    And the user clicked the "Reset Password" button
    Then the system shows an error "Passwords do not match"
    And the password is not updated

  Scenario: Reset password with expired token
    Given the user followed the reset link with expired token
    When the user opened the reset password page "/reset-password"
    And the user entered New Password "NewSecret123"
    And the user entered Confirm Password "NewSecret123"
    And the user clicked the "Reset Password" button
    Then the system shows an error "Invalid or expired token"
    And the password is not updated

  Scenario: Reset password with invalid token
    Given the user followed the reset link with invalid token
    When the user opened the reset password page "/reset-password"
    And the user entered New Password "NewSecret123"
    And the user entered Confirm Password "NewSecret123"
    And the user clicked the "Reset Password" button
    Then the system shows an error "Invalid or expired token"
    And the password is not updated