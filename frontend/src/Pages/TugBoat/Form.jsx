import { useEffect, useState } from "react";
import {
  ReadTugBoat,
  CreateTugBoat,
  UpdateTugBoat,
  DeleteTugBoat,
} from "../../API";
import { ModalPopUp, Input } from "../../Components";
import { useApplicationStoreContext } from "../../Hook/UserHook";
import { useFormik } from "formik";
import { Action } from "../../Constant";
import * as Yup from "yup";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "react-bootstrap";

export default function TugBoatForm({ isOpen, toggle, selected }) {
  const {
    isShowModal,
    setIsShowModal,
    setLastDataModificationTimestamp,
    setToastInfo,
    setIsShowToast,
  } = useApplicationStoreContext();

  const uuid = selected?.uuid;
  const [action, setAction] = useState(Action.CREATE);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      uuid: "",
      no: "",
      name: "",
      gttb: null,
      ptb: null,
      barge: "",
      gtbg: null,
      pbg: null,
      feet: null,
      createdDateTime: null,
      createdBy: null,
      lastModifiedDateTime: null,
      lastModifiedBy: null,
    },
    validationSchema: Yup.object({
      // name: Yup.string().required("name is required"),
      // location: Yup.string().required("location is required"),
      // Tug BoatCode: Yup.string().required("Tug Boat code is required"),
      // batchCode: Yup.string().required("batch code is required"),
    }),
    onSubmit: () => {
      if (action === Action.CREATE) {
        CreateTugBoat(formik.values)
          .then((response) => {
            setToastInfo({
              message: "Tug Boat successfully created",
              background: "success",
            });
            onCloseModal();
            setIsShowToast(true);
            setLastDataModificationTimestamp(new Date().getTime());
          })
          .catch((err) => {
            setToastInfo({
              message:
                err.response.status === 403
                  ? err.response?.data?.message
                  : "Tug Boat failed created",
              background: "danger",
            });
            setIsShowToast(true);
          });
      } else {
        UpdateTugBoat(uuid, formik.values)
          .then((response) => {
            setToastInfo({
              message: "Tug Boat successfully update",
              background: "success",
            });
            setIsShowToast(true);
            setLastDataModificationTimestamp(new Date().getTime());
          })
          .catch((err) => {
            setToastInfo({
              message:
                err.response.status === 403
                  ? err.response?.data?.message
                  : "Tug Boat failed update",
              background: "danger",
            });
            setIsShowToast(true);
          });
      }
    },
  });

  const deleteData = () => {
    DeleteTugBoat(uuid)
      .then(() => {
        setToastInfo({
          message: "Tug Boat successfully deleted",
          background: "success",
        });
        setIsShowToast(true);
        setIsShowModal(false);
        onCloseModal();
        setLastDataModificationTimestamp(new Date().getTime());
      })
      .catch((err) => {
        setToastInfo({
          message:
            err.response.status === 403
              ? err.response?.data?.message
              : "Tug Boat failed deleted",
          background: "danger",
        });
        setIsShowToast(true);
      });
  };

  useEffect(() => {
    if (uuid && isOpen) {
      setAction(Action.VIEW);
      ReadTugBoat(uuid).then((response) => formik.setValues(response.data));
    } else {
      setAction(Action.CREATE);
    }
  }, [isOpen, uuid]);

  const component = () => {
    return (
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Delete Tug Boat</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">Are you sure delete this Tug Boat?</div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsShowModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => deleteData()}
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  const onCloseModal = () => {
    toggle(false);
    formik.resetForm();
  };

  return (
    <>
      <Modal show={isOpen} onHide={onCloseModal} centered>
        <ModalHeader closeButton={true}>Add New Tug Boat</ModalHeader>
        <ModalBody>
          <form>
            <Input
              label="Name"
              type="text"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
              errorMessage={formik.errors?.name}
              isError={formik.errors.name && formik.touched.name}
            />
            <Input
              label="GT"
              type="number"
              name="gttb"
              onChange={formik.handleChange}
              value={formik.values.gttb}
              errorMessage={formik.errors?.gttb}
              isError={formik.errors.gttb && formik.touched.gttb}
            />
            <Input
              label="P.TB"
              type="number"
              name="ptb"
              onChange={formik.handleChange}
              value={formik.values.ptb}
              errorMessage={formik.errors?.ptb}
              isError={formik.errors.ptb && formik.touched.ptb}
            />
            <Input
              label="Barge"
              type="text"
              name="barge"
              onChange={formik.handleChange}
              value={formik.values.barge}
              errorMessage={formik.errors?.barge}
              isError={formik.errors.barge && formik.touched.barge}
            />
            <Input
              label="GT"
              type="number"
              name="gtbg"
              onChange={formik.handleChange}
              value={formik.values.gtbg}
              errorMessage={formik.errors?.gtbg}
              isError={formik.errors.gtbg && formik.touched.gtbg}
            />
            <Input
              label="P.BG"
              type="number"
              name="pbg"
              onChange={formik.handleChange}
              value={formik.values.pbg}
              errorMessage={formik.errors?.pbg}
              isError={formik.errors.pbg && formik.touched.pbg}
            />
            <Input
              label="Feet"
              type="number"
              name="feet"
              onChange={formik.handleChange}
              value={formik.values.feet}
              errorMessage={formik.errors?.feet}
              isError={formik.errors.feet && formik.touched.feet}
            />
          </form>
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-secondary"
            onClick={(e) => {
              e.preventDefault();
              onCloseModal();
            }}
          >
            Close
          </button>
          {action === Action.VIEW && (
            <button
              className="ms-2 btn btn-danger"
              onClick={(e) => {
                e.preventDefault();
                setIsShowModal(true);
              }}
              data-bs-toggle="modal"
              data-bs-target="#verticalycentered"
            >
              Delete
            </button>
          )}
          <button
            type="submit"
            className="ms-2 btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
          >
            {action == Action.CREATE ? "Create" : "Update"}
          </button>
        </ModalFooter>
      </Modal>
      <ModalPopUp
        component={component}
        isOpen={isShowModal}
        setIsOpen={setIsShowModal}
      />
    </>
  );
}
