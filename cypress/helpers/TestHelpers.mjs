export const runTestAsync = (asyncTest) =>
{
    cy.wrap(null).then(asyncTest);
}