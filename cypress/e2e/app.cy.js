describe('ShiftCare Scheduler - Main Flow', () => {
  beforeEach(() => {
    cy.clearStorage()
    cy.visit('/')
  })

  it('should load and display doctors', () => {
    cy.contains('Doctors').should('be.visible')
    cy.get('.card', { timeout: 10000 }).should('have.length.greaterThan', 0)
  })

  it('should navigate to doctor detail page', () => {
    cy.get('.card a', { timeout: 10000 }).first().click()
    cy.url().should('include', '/doctor/')
    cy.contains('Timezone').should('be.visible')
  })

  it('should book an appointment', () => {
    cy.get('.card a', { timeout: 10000 }).first().click()
    cy.get('.slot:not(.booked)', { timeout: 10000 }).first().click()
    cy.on('window:alert', (str) => {
      expect(str).to.include('Booked')
    })
    cy.get('.slot.booked').should('exist')
  })
})
