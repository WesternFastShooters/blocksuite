import { css } from 'lit';

import { INPUT_FONT_BASE, PANEL_BASE } from '../../../styles.js';

export const embedCardModalStyles = css`
  .embed-card-modal-mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    z-index: 1;
  }

  .embed-card-modal-wrapper {
    ${PANEL_BASE}
    flex-direction: column;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    z-index: 2;
    width: 305px;
    height: max-content;
    padding: 12px;
    gap: 12px;
    border-radius: 8px;
    font-size: var(--affine-font-xs);
    line-height: 20px;
  }

  .embed-card-modal-row {
    display: flex;
    flex-direction: column;
    align-self: stretch;
  }

  .embed-card-modal-row label {
    padding: 0px 2px;
    color: var(--affine-text-secondary-color);
    font-weight: 600;
  }
  .embed-card-modal-input {
    display: flex;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 8px;
    border: 1px solid var(--affine-border-color);
    background: var(--affine-white-10);
    ${INPUT_FONT_BASE}
  }
  input.embed-card-modal-input {
    padding-top: 4px;
    padding-bottom: 4px;
  }
  textarea.embed-card-modal-input {
    padding-top: 6px;
    padding-bottom: 6px;
    min-width: 100%;
    max-width: 100%;
  }
  .embed-card-modal-input:focus {
    border-color: var(--affine-blue-700);
    box-shadow: var(--affine-active-shadow);
    outline: none;
  }
  .embed-card-modal-input::placeholder {
    color: var(--affine-placeholder-color);
  }

  .embed-card-modal-row:has(.embed-card-modal-button) {
    flex-direction: row;
    gap: 4px;
    align-self: flex-end;
  }

  .embed-card-modal-button {
    padding: 4px 18px;
    border-radius: 8px;
    align-self: self-end;
    box-sizing: border-box;
  }
  .embed-card-modal-button.save {
    border: 1px solid var(--affine-black-10);
    background: var(--affine-primary-color);
    color: var(--affine-pure-white);
  }

  // .embed-card-modal-title {
  //   display: flex;
  //   align-items: flex-end;
  //   gap: var(--1, 0px);
  //   align-self: stretch;
  //   // padding: 20px 20px var(--1, 0px) 24px;
  //   border-radius: var(--1, 0px);
  //   opacity: var(--add, 1);
  //   font-family: var(--affine-font-family);
  //   font-size: 18px;
  //   font-style: normal;
  //   font-weight: 600;
  //   line-height: 26px;
  //   user-select: none;
  // }

  // .embed-card-modal-content {
  //   display: flex;
  //   min-height: 80px;
  //   // padding: 12px 24px;
  //   flex-direction: column;
  //   align-items: flex-start;
  //   gap: 12px;
  //   align-self: stretch;
  //   border-radius: var(--1, 0px);
  //   opacity: var(--add, 1);
  // }

  // .embed-card-modal-content-text {
  //   color: var(--affine-text-primary-color);
  //   font-family: var(--affine-font-family);
  //   font-size: 15px;
  //   font-style: normal;
  //   font-weight: 500;
  //   line-height: 24px;
  // }

  // .embed-card-modal-input {
  //   display: flex;
  //   padding: 4px 10px;
  //   align-items: center;
  //   gap: 8px;
  //   align-self: stretch;
  //   border-radius: 8px;
  //   border: 1px solid var(--affine-border-color);
  //   background: var(--affine-white-10);
  //   opacity: var(--add, 1);
  //   outline: none;
  //   resize: none;
  //   color: var(--affine-text-primary-color);
  //   font-family: var(--affine-font-family);
  //   font-size: 15px;
  //   font-style: normal;
  //   font-weight: 500;
  //   line-height: 24px;
  //   caret-color: var(--affine-brand-color);
  //   transition: border-color 150ms;
  // }

  // .embed-card-modal-input:focus {
  //   border-color: var(--affine-brand-color);
  //   box-shadow: 0px 0px 0px 2px rgba(30, 150, 235, 0.3);
  // }

  // .embed-card-modal-input::placeholder {
  //   color: var(--affine-placeholder-color);
  //   font-family: var(--affine-font-family);
  //   font-size: 15px;
  //   font-style: normal;
  //   font-weight: 500;
  //   line-height: 24px;
  // }

  // .embed-card-modal-input.description {
  //   height: 112px;
  // }

  // .embed-card-modal-input.caption {
  //   height: 112px;
  // }

  // .embed-card-modal-action {
  //   display: flex;
  //   padding: 20px 24px;
  //   justify-content: flex-end;
  //   align-items: center;
  //   gap: 20px;
  //   align-self: stretch;
  //   border-radius: var(--1, 0px);
  //   opacity: var(--add, 1);
  //   user-select: none;
  // }

  // .embed-card-modal-button {
  //   display: flex;
  //   padding: 4px 18px;
  //   justify-content: center;
  //   align-items: center;
  //   gap: 4px;
  //   border-radius: 8px;
  //   font-family: var(--affine-font-family);
  //   font-size: 12px;
  //   font-style: normal;
  //   font-weight: 500;
  //   line-height: 20px;
  //   opacity: var(--add, 1);
  //   cursor: pointer;
  // }

  // .embed-card-modal-button.cancel {
  //   border: 1px solid var(--affine-border-color);
  //   background: var(--affine-white-10);
  //   color: var(--affine-text-primary-color);
  // }

  // .embed-card-modal-button.save,
  // .embed-card-modal-button.confirm {
  //   border: 1px solid var(--affine-black-10);
  //   background: var(--affine-primary-color);
  //   color: var(--affine-pure-white);
  // }

  // .embed-card-modal-button.save.disabled,
  // .embed-card-modal-button.confirm.disabled {
  //   background: rgba(30, 150, 235, 0.4);
  // }
`;
