import React from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
} from "react-bootstrap";

export default function KonfirmasiModal({ isOpen, toggle, onSubmit, message }) {
  return (
    <Modal show={isOpen} onHide={toggle} centered backdrop="static">
      <ModalHeader>Confirmation</ModalHeader>
      <ModalBody>
        <p>{message}</p>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            onSubmit();
            toggle();
          }}
        >
          Yes
        </Button>
      </ModalFooter>
    </Modal>
  );
}
