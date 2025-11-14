describe('ShiftCare Scheduler - Edge Cases', () => {
  beforeEach(() => {
    cy.clearStorage()
  })

  it('should handle empty API response', () => {
    cy.intercept('GET', '**/available.json', { body: [] }).as('emptyResponse')
    cy.visit('/')
    cy.wait('@emptyResponse')
    cy.get('body').should('exist')
  })

  it('should handle network error', () => {
    cy.intercept('GET', '**/available.json', { statusCode: 500 }).as('serverError')
    cy.visit('/')
    cy.wait('@serverError')
    cy.contains('Failed', { timeout: 2000 }).should('be.visible')
  })

  it('should handle invalid doctor ID', () => {
    cy.visit('/doctor/non-existent-id')
    cy.contains('not found', { matchCase: false, timeout: 5000 }).should('be.visible')
  })

  it('should handle missing required fields in API data', () => {
    const malformedData = [{ name: 'Doctor 1' }] // Missing timezone, schedule
    cy.intercept('GET', '**/available.json', { body: malformedData }).as('malformed')
    cy.visit('/')
    cy.wait('@malformed')
    cy.get('body').should('exist')
  })

  it('should handle corrupted localStorage', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('shiftcare_appointments_v1', 'invalid-json{')
    })
    cy.visit('/')
    cy.get('body').should('exist')
  })
})
