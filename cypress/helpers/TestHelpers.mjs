export const runAsyncTest = (asyncTest) =>
{
    cy.wrap(null).then(asyncTest);
}