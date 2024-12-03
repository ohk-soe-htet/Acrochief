export class ElementCollection
{
    static MEMBER_CREATE_BUTTON_ID = "member-create-button";

    static MEMBER_CREATE_MODAL_ID = "member-create-modal";

    static MEMBER_CREATE_MODAL_LABEL_ID = "member-create-modal-label";

    static MEMBER_CREATE_MODAL_NAME_FIELD_ID = "member-create-modal-name";

    static MEMBER_CREATE_MODAL_ADMIN_NUMBER_FIELD_ID = "member-create-modal-admin-number";

    static MEMBER_CREATE_MODAL_GYM_PROGRAMS_FIELD_ID = "member-create-modal-gym-programs";

    static MEMBER_CREATE_MODAL_MESSAGE_ID = "member-create-modal-message";

    static MEMBER_LIST_CONTAINER_ID = "member-list-container";

    static MEMBER_UDPATE_MODAL_ID = "member-update-modal";

    static MEMBER_UDPATE_MODAL_NAME_FIELD_ID = "update-member-name";

    static MEMBER_UDPATE_MODAL_ADMIN_NUMBER_FIELD_ID = "update-member-admin-number";

    static MEMBER_UDPATE_MODAL_GYM_PROGRAMS_FIELD_ID = "update-member-gym-programs";

    static MEMBER_UDPATE_MODAL_MESSAGE_ID = "update-member-message";

    static MEMBER_UDPATE_MODAL_SUBMIT_BUTTON_ID = "update-member-submit-button";

    static GYM_PROGRAMS_FIELD_TITLE_MEMBER_LIST_CLASS_NAME = "gym-programs-field-title-member-list-class";

    static MEMBER_LIST_ERROR_HEADING_ID = "member-list-error-heading";

    static getMemberCreateButton()
    {
        return document.getElementById(ElementCollection.MEMBER_CREATE_BUTTON_ID);
    }

    static getMemberCreateButtonCypress()
    {
        return cy.get(`#${ElementCollection.MEMBER_CREATE_BUTTON_ID}`);
    }

    static getMemberListContainer()
    {
        return document.getElementById(ElementCollection.MEMBER_LIST_CONTAINER_ID);
    }

    static getMemberListContainerCypress()
    {
        return cy.get(`#${ElementCollection.MEMBER_LIST_CONTAINER_ID}`);
    }

    static getMemberCreateModal()
    {
        return document.getElementById(ElementCollection.MEMBER_CREATE_MODAL_ID);
    }

    static getMemberCreateModalCypress()
    {
        return cy.get(`#${ElementCollection.MEMBER_CREATE_MODAL_ID}`);
    }

    static getMemberCreateModalLabel()
    {
        return document.getElementById(ElementCollection.MEMBER_CREATE_MODAL_LABEL_ID);
    }

    static getMemberCreateModalNameField()
    {
        return document.getElementById(ElementCollection.MEMBER_CREATE_MODAL_NAME_FIELD_ID);
    }

    static getMemberCreateModalAdminNumberField()
    {
        return document.getElementById(ElementCollection.MEMBER_CREATE_MODAL_ADMIN_NUMBER_FIELD_ID);
    }

    static getMemberCreateModalGymProgramsField()
    {
        return document.getElementById(ElementCollection.MEMBER_CREATE_MODAL_GYM_PROGRAMS_FIELD_ID);
    }

    static getMemberCreateModalMessage()
    {
        return document.getElementById(ElementCollection.MEMBER_CREATE_MODAL_MESSAGE_ID);
    }

    /**
     * @param { number | undefined } timeout
     */
    static getMemberUpdateModalCypress(timeout = undefined)
    {
        return cy.get(`#${ElementCollection.MEMBER_UDPATE_MODAL_ID}`, timeout === undefined ? {} : { timeout });
    }

    static getMemberUpdateModalNameFieldCypress()
    {
        return cy.get(`#${ElementCollection.MEMBER_UDPATE_MODAL_NAME_FIELD_ID}`);
    }

    static getMemberUpdateModalAdminNumberFieldCypress()
    {
        return cy.get(`#${ElementCollection.MEMBER_UDPATE_MODAL_ADMIN_NUMBER_FIELD_ID}`);
    }

    static getMemberUpdateModalGymProgramsFieldCypress()
    {
        return cy.get(`#${ElementCollection.MEMBER_UDPATE_MODAL_GYM_PROGRAMS_FIELD_ID}`);
    }

    static getMemberUpdateModalMessageCypress()
    {
        return cy.get(`#${ElementCollection.MEMBER_UDPATE_MODAL_MESSAGE_ID}`);
    }

    static getMemberUpdateModalSubmitButtonCypress()
    {
        return cy.get(`#${ElementCollection.MEMBER_UDPATE_MODAL_SUBMIT_BUTTON_ID}`);
    }

    static getFirstGymProgramsTitleElementCypress()
    {
        return cy.get(`.${ElementCollection.GYM_PROGRAMS_FIELD_TITLE_MEMBER_LIST_CLASS_NAME}`).first();
    }

    static getMemberListErrorHeadingCypress()
    {
        return cy.get(`#${ElementCollection.MEMBER_LIST_ERROR_HEADING_ID}`);
    }
}