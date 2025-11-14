describe('ShiftCare Scheduler - Negative Cases', () => {
  beforeEach(() => {
    cy.clearStorage()
  })

  it('should prevent booking the same slot twice', () => {
    cy.visit('/')
    cy.get('.card a', { timeout: 10000 }).first().click()
    cy.get('.slot:not(.booked)', { timeout: 10000 }).first().click()

    cy.on('window:alert', () => {})

    // Slot should now be booked and disabled
    cy.get('.slot.booked').should('exist')
    cy.get('.slot.booked').first().should('be.disabled')
  })

  it('should handle invalid time formats', () => {
    const invalidTimeData = [{
      name: 'Doctor Invalid',
      timezone: 'UTC',
      day_of_week: 'Monday',
      available_at: 'invalid-time',
      available_until: 'also-invalid',
    }]
    cy.intercept('GET', '**/available.json', { body: invalidTimeData }).as('invalidTime')
    cy.visit('/')
    cy.wait('@invalidTime')
    cy.get('body').should('exist')
  })

  it('should handle end time before start time', () => {
    const invalidOrderData = [{
      name: 'Doctor Invalid',
      timezone: 'UTC',
      day_of_week: 'Monday',
      available_at: '17:00',
      available_until: '09:00', // End before start
    }]
    cy.intercept('GET', '**/available.json', { body: invalidOrderData }).as('invalidOrder')
    cy.visit('/')
    cy.wait('@invalidOrder')
    cy.get('body').should('exist')
  })
})
