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

  const showModal = () =>
  {
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

  /**
   * @param { boolean } exists
   */
  const assertGymProgramsFieldExistInMemberList = (exists) =>
  {
    ElementCollection.getMemberListContainerCypress(0)
        .contains(`#${ElementCollection.GYM_PROGRAMS_FIELD_TITLE_MEMBER_LIST_CLASS_NAME}`)
        .should(exists ? "exist" : "not.exist");
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

      setBaseURLPromise();
    });

    // Reset the database so that we have a known set of members and gym programs
    cy.request("PUT", Endpoints.DATABASE_RESET_ENDPOINT);
  });

  it("Resolve base URL promise", () =>
  {
    runTestAsync(async () =>
    {
      await setBaseURLPromise;
    });
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

    ElementCollection
        .getMemberUpdateModalGymProgramsFieldCypress()
        .clear()
        .type("Yannis");

    // Wait for request to complete, since UI will be updated by then
    cy.intercept("PUT", `${Endpoints.MEMBER_UPDATE_ENDPOINT}/*`).as("updateMember");

    submitUpdateModalAndEnsureSuccess();

    cy.wait("@updateMember");

    assertGymProgramsFieldExistInMemberList(false);
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

  it(`ManageMembers - Should there be 0 registered members, there should be a "No members found!" message displayed`, () =>
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
