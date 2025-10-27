import React from "react";
import { Modal } from "react-bootstrap";

export default function ModalPopUp({ component, isOpen, setIsOpen, backdrop }) {
  return (
    <Modal
      show={isOpen}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={() => setIsOpen(!isOpen)}
      backdrop={backdrop}
    >
      {component && component()}
    </Modal>
  );
}
