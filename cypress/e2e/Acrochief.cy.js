import { ElementCollection } from "../../public/js/ElementCollection.mjs";
import { runAsyncTest } from "../helpers/TestHelpers.mjs";
import { Endpoints } from "../../public/js/Endpoints.mjs";

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

    // Reset the database so that we have a known set of members and gym programs
    cy.request("PUT", Endpoints.DATABASE_RESET_ENDPOINT);
  });

  // This is paramount, as inputting while the modal is playing its opening animation
  // may cause the input to be interrupted when the animation completes.
  const waitForModalOpenAnimation = () =>
  {
    ElementCollection.getMemberUpdateModalCypress()
        // Wait for modal animation to complete ( https://imgur.com/a/vSxoCKY )
        .should("have.css", "opacity", "1");
  }

  const showModal = async () =>
  {
    await setBaseURLPromise;

    cy.visit(`${baseUrl}/pages/ManageMembers.html`);

    assertModalVisible(true, () =>
    {
      // Get first button with "Edit" as its text
      cy.get("button").contains("Edit").click();

      waitForModalOpenAnimation();
    });
  }

  const submitUpdateModal = () =>
  {
    ElementCollection
        .getMemberUpdateModalSubmitButtonCypress()
        .click();
  }

  /**
   * @param { boolean } isVisible
   * @param { function() } transitionAction
   */
  const assertModalVisible = (isVisible, transitionAction) =>
  {
    const getChainer = (isVisible) => isVisible ? "be.visible" : "not.be.visible";

    ElementCollection
        .getMemberUpdateModalCypress()
        .should(getChainer(!isVisible));

    transitionAction();

    ElementCollection
        .getMemberUpdateModalCypress()
        .should(getChainer(isVisible));
  }

  const submitUpdateModalAndEnsureSuccess = () =>
  {
    assertModalVisible(false, submitUpdateModal);
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

      submitUpdateModalAndEnsureSuccess();
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

      submitUpdateModalAndEnsureSuccess();
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

      submitUpdateModalAndEnsureSuccess();
    });
  });

  it("ManageMembers - Inputting and submitting with valid member name, admin number and gym programs work", () =>
  {
    runAsyncTest(async () =>
    {
      await showModal();

      const UPDATED_NAME = "Updated Name II";
      const UPDATED_ADMIN_NUMBER = "3333333I";

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

      submitUpdateModalAndEnsureSuccess();
    });
  });
});
