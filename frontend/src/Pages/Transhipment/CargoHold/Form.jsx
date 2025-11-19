import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "react-bootstrap";
import { useFormik } from "formik";
import { Input } from "../../../Components";
import { CreateCargo, ReadCargo, UpdateCargo } from "../../../API";
import { Action } from "../../../Constant";

export default function FormRemarks({
  isOpen,
  toggle,
  transhipmentUuid,
  setSelected,
  selected,
  callback,
  length,
}) {
  const uuid = selected?.uuid;
  const [action, setAction] = useState(Action.CREATE);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      no: length + 1,
      kjb: "",
      haa: "",
    },
    onSubmit: (values) => {
      const model = {
        ...values,
        transhipmentUuid,
      };
      if (action === Action.CREATE)
        CreateCargo(model)
          .then((response) => {
            callback && callback();
            onCloseModal();
          })
          .catch((err) => {
            console.log(err);
          });
      else {
        UpdateCargo(selected.uuid, model)
          .then((response) => {
            callback && callback();
            onCloseModal();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  });

  useEffect(() => {
    if (uuid && isOpen) {
      setAction(Action.VIEW);
      ReadCargo(uuid)
        .then((response) => {
          formik.setValues({
            ...response.data,
          });
        })
        .catch((err) => console.log(err));
    } else {
      setAction(Action.CREATE);
    }
  }, [isOpen, uuid]);

  const onCloseModal = () => {
    formik.resetForm();
    setSelected();
    toggle(false);
  };

  return (
    <Modal show={isOpen} size="lg" onHide={onCloseModal}>
      <ModalHeader closeButton={true}>Cargo Per Hold</ModalHeader>
      <ModalBody>
        <Input
          type="number"
          label="No"
          name="no"
          onChange={formik.handleChange}
          value={formik.values.no}
          errorMessage={formik.errors?.no}
          isError={formik.errors.no && formik.touched.no}
        />
        <Input
          type="number"
          label="KJB"
          name="kjb"
          onChange={formik.handleChange}
          value={formik.values.kjb}
          errorMessage={formik.errors?.kjb}
          isError={formik.errors.kjb && formik.touched.kjb}
        />
        <Input
          type="number"
          label="HAA"
          name="haa"
          onChange={formik.handleChange}
          value={formik.values.haa}
          errorMessage={formik.errors?.haa}
          isError={formik.errors.haa && formik.touched.haa}
        />
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-secondary" onClick={onCloseModal}>
          Close
        </button>
        <button
          className="btn btn-primary"
          type="submit"
          onClick={formik.handleSubmit}
        >
          Save
        </button>
      </ModalFooter>
    </Modal>
  );
}
