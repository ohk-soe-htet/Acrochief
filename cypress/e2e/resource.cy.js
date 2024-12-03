import { ElementCollection } from "../../public/js/ElementCollection.mjs";

let setBaseURLPromise;

describe("AcroChief", () => {
  let baseUrl;

  before(() =>
  {
    // const shutdownServer = async () =>
    // {
    //   try
    //   {
    //     await fetch('http://localhost:5050/api/kill', { method: 'GET' });
    //   }
    //
    //   catch(err) { }
    // }

    cy.task("startServer").then((url) =>
    {
      setBaseURLPromise = async () =>
      {
        baseUrl = url;
      };

      setBaseURLPromise();
    });
  });

  after(() =>
  {
    return cy.task("stopServer"); // Stop the server after the report is done

    // const shutdownServer = async () =>
    // {
    //   try
    //   {
    //     await fetch('http://localhost:5050/api/kill', { method: 'GET' });
    //   }
    //
    //   catch(err) { }
    // }
    //
    // shutdownServer();
  });

  it('ManageMembers - Clicking on "Edit" button in the member list should cause edit member modal to pop-up.', () =>
  {
    const body = async () =>
    {
      await setBaseURLPromise;

      cy.visit(`${baseUrl}/pages/ManageMembers.html`);

      // Get first button with "Edit" as its text
      cy.get("button").contains("Edit").click();

      // Apparently, reordering this before the statements above causes the type() to be incomplete
      ElementCollection.getMemberUpdateModalCypress()
          .should("be.visible")
          // Wait for modal animation to complete ( https://imgur.com/a/vSxoCKY )
          .should("have.css", "opacity", "1");

      const UPDATED_NAME = "Updated Name";
      const UPDATED_ADMIN_NUMBER = "2222222I";

      ElementCollection
          .getMemberUpdateModalNameFieldCypress()
          .clear()
          .type(UPDATED_NAME)
          .should('have.value', UPDATED_NAME);

      ElementCollection
          .getMemberUpdateModalAdminNumberFieldCypress()
          .clear()
          .type(UPDATED_ADMIN_NUMBER)
          .should('have.value', UPDATED_ADMIN_NUMBER);

      ElementCollection
          .getMemberUpdateModalGymProgramsFieldCypress()
          .clear();

      ElementCollection
          .getMemberUpdateModalSubmitButtonCypress()
          .click();
    }

    cy.wrap(null).then(body);
  });
});
