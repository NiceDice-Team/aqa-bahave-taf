@catalog
Feature: Product Catalog Browsing
  As a customer
  I want to browse the product catalog
  So that I can find products I'm interested in

  Background:
    Given I am on the product catalog page

  @smoke
  Scenario: Filter products by category
    When I filter by category "board-games"
    Then I should see products in the "board-games" category
    And I should see the category filter is active

  @smoke
  Scenario: Sort products by price
    When I sort products by "price-asc"
    Then I should see products sorted by price in ascending order

  @regression
  Scenario Outline: Filter and sort products
    When I filter by category "<category>"
    And I sort products by "<sort_option>"
    Then I should see products in the "<category>" category
    And they should be sorted by "<sort_option>"

    Examples:
      | category     | sort_option |
      | board-games  | price-asc   |
      | card-games   | price-desc  |
      | accessories  | name-asc    |