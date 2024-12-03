import { ElementCollection } from "../../public/js/ElementCollection.mjs";

let setBaseURLPromise;

describe("AcroChief", () =>
{
  let baseUrl;

  before(() =>
  {
    cy.task("startServer").then((url) =>
    {
      setBaseURLPromise = async () =>
      {
        baseUrl = url;
      };

      setBaseURLPromise();
    });
  });

  const showModal = async () =>
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
  }

  const submitUpdateModal = () =>
  {
    ElementCollection
        .getMemberUpdateModalSubmitButtonCypress()
        .click();
  }

  it('ManageMembers - Clicking on "Edit" button in the member list should cause edit member modal to pop-up.', () =>
  {
    cy.wrap(null).then(showModal);
  });

  it('ManageMembers - Inputting and submitting with valid member name works', () =>
  {
    const body = async () =>
    {
      await showModal();

      const UPDATED_NAME = "Updated Name";

      ElementCollection
          .getMemberUpdateModalNameFieldCypress()
          .clear()
          .type(UPDATED_NAME)
          .should('have.value', UPDATED_NAME);

      ElementCollection
          .getMemberUpdateModalSubmitButtonCypress()
          .click();
    }

    cy.wrap(null).then(body);
  });

  it('ManageMembers - Inputting and submitting with valid member name works', () =>
  {
    const body = async () =>
    {
      await showModal();

      const UPDATED_ADMIN_NUMBER = "2222222I";

      ElementCollection
          .getMemberUpdateModalAdminNumberFieldCypress()
          .clear()
          .type(UPDATED_ADMIN_NUMBER)
          .should('have.value', UPDATED_ADMIN_NUMBER);

      submitUpdateModal();
    }

    cy.wrap(null).then(body);
  });

  it('ManageMembers - Inputting and submitting with valid member name works', () =>
  {
    const body = async () =>
    {
      await showModal();

      ElementCollection
          .getMemberUpdateModalGymProgramsFieldCypress()
          .clear();

      submitUpdateModal();
    }

    cy.wrap(null).then(body);
  });

  it('ManageMembers - Inputting and submitting with valid member name, admin number and gym programs work', () =>
  {
    const body = async () =>
    {
      await showModal();

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

      submitUpdateModal();
    }

    cy.wrap(null).then(body);
  });
});
