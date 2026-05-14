Feature: Lift

  Scenario: no mise lockfile
    Given mise is not configured to create a lockfile
    When the project is lifted
    Then mise is configured to use a lockfile
    And the existing mise config is preserved
