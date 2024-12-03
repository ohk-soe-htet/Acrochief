import { ElementCollection } from "../../public/js/ElementCollection.mjs";
import { runAsyncTest } from "../helpers/TestHelpers.mjs";

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

  it("ManageMembers - Clicking on \"Edit\" button in the member list should cause edit member modal to pop-up.", () =>
  {
    runAsyncTest(showModal);
  });

  it("ManageMembers - Inputting and submitting with valid member name works", () =>
  {
    runAsyncTest(async () =>
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
    });
  });

  it("ManageMembers - Inputting and submitting with valid member admin number works", () =>
  {
    runAsyncTest(async () =>
    {
      await showModal();

      const UPDATED_ADMIN_NUMBER = "2222222I";

      ElementCollection
          .getMemberUpdateModalAdminNumberFieldCypress()
          .clear()
          .type(UPDATED_ADMIN_NUMBER)
          .should('have.value', UPDATED_ADMIN_NUMBER);

      submitUpdateModal();
    });
  });

  it(`ManageMembers - 
  Inputting and submitting with blank gym programs should result in the gym program field being removed 
  from the particular member in the member list`, () =>
  {
    runAsyncTest(async () =>
    {
      await showModal();

      ElementCollection
          .getMemberUpdateModalGymProgramsFieldCypress()
          .clear();

      submitUpdateModal();
    });
  });

  it("ManageMembers - Inputting and submitting with valid member name, admin number and gym programs work", () =>
  {
    runAsyncTest(async () =>
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
    });
  });
});
