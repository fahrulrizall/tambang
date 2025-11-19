import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "react-bootstrap";
import { useFormik } from "formik";
import { Input } from "../../../Components";
import { CreateRemarks, ReadRemarks, UpdateRemarks } from "../../../API";
import { Action } from "../../../Constant";
import { convertUtc } from "../../../helpers";

export default function FormRemarks({
  isOpen,
  toggle,
  transhipmentUuid,
  setSelected,
  selected,
  callback,
}) {
  const uuid = selected?.uuid;
  const [action, setAction] = useState(Action.CREATE);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      descriptions: "",
      start: "",
      end: "",
    },
    onSubmit: (values) => {
      const model = {
        ...values,
        transhipmentUuid,
      };
      if (action === Action.CREATE)
        CreateRemarks(model)
          .then((response) => {
            callback && callback();
            onCloseModal();
          })
          .catch((err) => {
            console.log(err);
          });
      else {
        UpdateRemarks(selected.uuid, model)
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
      ReadRemarks(uuid)
        .then((response) => {
          formik.setValues({
            ...response.data,
            start: convertUtc(response.data.start),
            end: convertUtc(response.data.end),
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
      <ModalHeader closeButton={true}>Remarks</ModalHeader>
      <ModalBody>
        <Input
          type="textarea"
          label="Descriptions"
          name="descriptions"
          onChange={formik.handleChange}
          value={formik.values.descriptions}
          errorMessage={formik.errors?.descriptions}
          isError={formik.errors.descriptions && formik.touched.descriptions}
        />
        <Input
          type="datetime-local"
          label="Start"
          name="start"
          onChange={formik.handleChange}
          value={formik.values.start}
          errorMessage={formik.errors?.start}
          isError={formik.errors.start && formik.touched.start}
        />
        <Input
          type="datetime-local"
          label="End"
          name="end"
          onChange={formik.handleChange}
          value={formik.values.end}
          errorMessage={formik.errors?.end}
          isError={formik.errors.end && formik.touched.end}
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
