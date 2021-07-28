describe('WeTalk Login Module Test', function(){
it("visit the URL", function(){
    cy.visit('http://localhost:3000/');
})

it("Performe Login", function(){
    cy.get('#username').type("amansingh95");
    cy.get('#room').type("Developer");
    cy.get('#btnSubmit').click();
});
it('Verify we are login', function (){
    cy.get('#users').contains('amansingh95');
})
});