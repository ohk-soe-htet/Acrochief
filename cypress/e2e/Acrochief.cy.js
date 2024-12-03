import { ElementCollection } from "../../public/js/ElementCollection.mjs";
import { runTestAsync } from "../helpers/TestHelpers.mjs";
import { Endpoints } from "../../public/js/Endpoints.mjs";

let setBaseURLPromise;

describe("AcroChief", () =>
{
  const visitPage = () =>
  {
    cy.visit(`${baseUrl}/pages/ManageMembers.html`);
  }

  // This is paramount, as inputting while the modal is playing its opening animation
  // may cause the input to be interrupted when the animation completes.
  const waitForModalOpenAnimation = () =>
  {
    ElementCollection.getMemberUpdateModalCypress()
        // Wait for modal animation to complete ( https://imgur.com/a/vSxoCKY )
        .should("have.css", "opacity", "1");
  }

  // Same as above, extremely important.
  const waitForModalCloseAnimation = () =>
  {
    ElementCollection.getMemberUpdateModalCypress()
        // Wait for modal animation to complete ( https://imgur.com/a/vSxoCKY )
        .should("have.css", "opacity", "0");
  }

  const showModal = () =>
  {
    assertModalTransitionToVisible(true, () =>
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

  const assertModalVisible = (isVisible, action) =>
  {
    const getChainer = (isVisible) => isVisible ? "be.visible" : "not.be.visible";

    ElementCollection
        // Timeout 0 because we want to see its immediate value
        .getMemberUpdateModalCypress(0)
        .should(getChainer(isVisible));

    action();

    ElementCollection
        .getMemberUpdateModalCypress()
        .should(getChainer(isVisible));
  }

  /**
   * @param { boolean } isVisible
   * @param { function() } transitionAction
   */
  const assertModalTransitionToVisible = (isVisible, transitionAction) =>
  {
    const getChainer = (isVisible) => isVisible ? "be.visible" : "not.be.visible";

    ElementCollection
        // Timeout 0 because we want to see its immediate value
        .getMemberUpdateModalCypress(0)
        .should(getChainer(!isVisible));

    transitionAction();

    ElementCollection
        .getMemberUpdateModalCypress()
        .should(getChainer(isVisible));
  }

  const submitUpdateModalAndEnsureSuccess = () =>
  {
    // Wait for request to complete, since UI will be updated by then
    cy.intercept("PUT", `${Endpoints.MEMBER_UPDATE_ENDPOINT}/*`).as("updateMember");

    assertModalTransitionToVisible(false, submitUpdateModal);

    waitForModalCloseAnimation();

    cy.wait("@updateMember");
  }

  /**
   * @param { boolean } exists
   * @param { string } expectedGymProgramName
   */
  const assertGymProgramsFieldExistInMemberList = (exists, expectedGymProgramName = undefined) =>
  {
    ElementCollection
        .getGymProgramsTitleElementCypressFilter()
        .should(exists ? "exist" : "not.exist");

    if (exists)
    {
      ElementCollection
          .getGymProgramsTitleElementCypressFilter()
          .first()
          // They're siblings, so we see if its parent contains the expected gym program name
          // See: https://imgur.com/a/1rKfX9f
          .parent()
          .contains("ul", expectedGymProgramName.toLowerCase());
    }
  }

  let baseUrl;

  before(() =>
  {
    cy.task("startServer").then((url) =>
    {
      setBaseURLPromise = async () =>
      {
        baseUrl = url;
      };

      runTestAsync(setBaseURLPromise);
    });

    // Reset the database so that we have a known set of members and gym programs
    cy.request("PUT", Endpoints.DATABASE_RESET_ENDPOINT);
  });

  it("ManageMembers - Clicking on \"Edit\" button in the member list should cause edit member modal to pop-up.", () =>
  {
    visitPage();

    showModal();
  });

  it("ManageMembers - Inputting and submitting with valid member name works", () =>
  {
    visitPage();

    showModal();

    const UPDATED_NAME = "Updated Name";

    ElementCollection
        .getMemberUpdateModalNameFieldCypress()
        .clear()
        .type(UPDATED_NAME)
        .should('have.value', UPDATED_NAME);

    submitUpdateModalAndEnsureSuccess();
  });

  it(`ManageMembers - Inputting and submitting with valid member admin number should result in successful submission`, () =>
  {
    visitPage();

    showModal();

    const UPDATED_ADMIN_NUMBER = "2222222I";

    ElementCollection
        .getMemberUpdateModalAdminNumberFieldCypress()
        .clear()
        .type(UPDATED_ADMIN_NUMBER)
        .should('have.value', UPDATED_ADMIN_NUMBER);

    submitUpdateModalAndEnsureSuccess();
  });

  it(`ManageMembers - 
  Inputting and submitting with blank gym program field should result in the gym program field being removed 
  for the particular member in the member list`, () =>
  {
    visitPage();

    showModal();

    ElementCollection
        .getMemberUpdateModalGymProgramsFieldCypress()
        .clear();

    submitUpdateModalAndEnsureSuccess();

    assertGymProgramsFieldExistInMemberList(false);
  });

  it(`ManageMembers -
  Inputting and submitting with filled in gym program field should result in the gym program field being displayed
  for the particular member in the member list`, () =>
  {
    visitPage();

    showModal();

    const GYM_PROGRAM_NAME = "Yannis";

    ElementCollection
        .getMemberUpdateModalGymProgramsFieldCypress()
        .clear()
        .type(GYM_PROGRAM_NAME);

    submitUpdateModalAndEnsureSuccess();

    assertGymProgramsFieldExistInMemberList(true, GYM_PROGRAM_NAME);
  });

  it("ManageMembers - Inputting and submitting with valid member name, admin number and gym programs should work", () =>
  {
    visitPage();

    showModal();

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

  it("ManageMembers - Inputting and submitting non-alpha or space characters for member name will result in a form error", () =>
  {
    visitPage();

    showModal();

    const UPDATED_NAME = "Updated Name 2";

    ElementCollection
        .getMemberUpdateModalNameFieldCypress()
        .clear()
        .type(UPDATED_NAME)
        .should('have.value', UPDATED_NAME);

    assertModalVisible(true, submitUpdateModal);

    ElementCollection
        .getMemberUpdateModalMessageCypress()
        .should("have.text", "[ name ] Name must only contain letters and spaces!");
  });

  it("ManageMembers - Inputting and submitting blank or whitespace-only member name will result in a form error", () =>
  {
    visitPage();

    showModal();

    ElementCollection
        .getMemberUpdateModalNameFieldCypress()
        .clear();

    const validate = () =>
    {
      assertModalVisible(true, submitUpdateModal);

      ElementCollection
          .getMemberUpdateModalMessageCypress()
          .should("have.text", "[ name ] String must contain at least 1 character(s)");
    };

    validate();

    const WHITESPACE = ' ';

    ElementCollection
        .getMemberUpdateModalNameFieldCypress()
        .type(WHITESPACE)
        .should("have.value", WHITESPACE);

    validate();
  });


  it("ManageMembers - Invalid response on GET should result in error message being displayed in place of member list", () =>
  {
    cy.intercept("GET", `${Endpoints.MEMBER_GET_ENDPOINT}`,
    {
      statusCode: 500
    });

    visitPage();

    ElementCollection
        .getMemberListErrorHeadingCypress()
        .should("have.text", "Failed to fetch members!");
  });

  it("ManageMembers - Invalid response on GET members should result in error message being displayed in place of member list", () =>
  {
    cy.intercept("GET", `${Endpoints.MEMBER_GET_ENDPOINT}`,
    {
      members: []
    });

    visitPage();

    ElementCollection
        .getMemberListErrorHeadingCypress()
        .should("have.text", "No members found!");
  });

  it(`ManageMembers - Should there be no registered members, there should be a "No members found!" message displayed`, () =>
  {
    cy.intercept("GET", `${Endpoints.MEMBER_GET_ENDPOINT}`,
    {
      members: []
    });

    visitPage();

    ElementCollection
        .getMemberListErrorHeadingCypress()
        .should("have.text", "No members found!");
  });
});
