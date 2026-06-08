@catalog
Feature: Product Catalog Browsing
  As a customer
  I want to browse the product catalog
  So that I can find products I'm interested in

  Background:
    Given I am on the product catalog page

  @smoke @critical
  Scenario: Catalog page loads with visible components
    Then the page header should be visible
    And product cards should be visible on the page
    And at least one product card should be clickable

  @smoke @critical
  Scenario: Filter button is clickable
    Then the category filter button should be visible
    And the category filter button should be clickable

  @smoke @critical
  Scenario: Sort control is clickable
    Then the sort control should be visible
    And the sort control should be clickable