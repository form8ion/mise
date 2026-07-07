Feature: Lift

  Scenario: no mise lockfile
    Given mise is not configured to maintain a lockfile
    When the project is lifted
    Then mise is configured to use a lockfile
    And the existing mise config is preserved

  Scenario: existing mise lockfile
    Given mise is configured to maintain a lockfile
    When the project is lifted
    Then mise is configured to use a lockfile
    And the existing mise config is preserved
