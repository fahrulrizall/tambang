import { useEffect, useState } from "react";
import {
  ReadBarging,
  CreateBarging,
  UpdateBarging,
  PagedSearchTugBoat,
} from "../../API";
import { Input } from "../../Components";
import { useApplicationStoreContext } from "../../Hook/UserHook";
import { useFormik } from "formik";
import { Action } from "../../Constant";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "react-bootstrap";
import moment from "moment";

export default function TugBoatForm({ isOpen, toggle, selected }) {
  const { setLastDataModificationTimestamp, setToastInfo, setIsShowToast } =
    useApplicationStoreContext();

  const uuid = selected?.uuid;
  const [action, setAction] = useState(Action.CREATE);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      uuid: "",
      no: "",
      date: moment().format("yyyy-MM-DD"),
      company: "",
      mv: "",
      detail: [],
      createdDateTime: null,
      createdBy: null,
      lastModifiedDateTime: null,
      lastModifiedBy: null,
    },
    onSubmit: (values) => {
      const model = {
        ...values,
        company: values.company?.value,
        detail: values.detail.map((item) => ({
          ...item,
          bargingUuid: values.uuid,
          tugBoatUuid: item.tugBoat?.value,
        })),
      };
      if (action === Action.CREATE) {
        CreateBarging(model)
          .then((response) => {
            setToastInfo({
              message: "Barging successfully created",
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
                  : "Barging failed created",
              background: "danger",
            });
            setIsShowToast(true);
          });
      } else {
        UpdateBarging(uuid, model)
          .then((response) => {
            setToastInfo({
              message: "Barging successfully update",
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
                  : "Barging failed update",
              background: "danger",
            });
            setIsShowToast(true);
          });
      }
    },
  });

  const options = [
    {
      value: "KJB",
      label: "PT. KALTIM JAYA BARA",
    },
    {
      value: "HAA",
      label: "PT. HAMPARAN ANUGRAH ABADI",
    },
  ];

  useEffect(() => {
    if (uuid && isOpen) {
      setAction(Action.VIEW);
      ReadBarging(uuid)
        .then((response) =>
          formik.setValues({
            ...response.data,
            date: moment(response.data.date).format("yyyy-MM-DD"),
            company: {
              value: response.data.company,
              label: options.find((a) => a.value == response.data.company)
                .label,
            },
            detail: response.data.detail.map((item) => ({
              ...item,
              tugBoat: {
                value: item.tugBoatUuid,
                label: item.name,
              },
              arrivedatJetty:
                item.arrivedatJetty &&
                moment(item.arrivedatJetty).format("yyyy-MM-DD HH:mm"),
              commanced:
                item.commanced &&
                moment(item.commanced).format("yyyy-MM-DD HH:mm"),
              completed:
                item.completed &&
                moment(item.completed).format("yyyy-MM-DD HH:mm"),
              castedOff:
                item.castedOff &&
                moment(item.castedOff).format("yyyy-MM-DD HH:mm"),
            })),
          })
        )
        .catch((err) => console.log(err));
    } else {
      setAction(Action.CREATE);
    }
  }, [isOpen, uuid]);

  const onCloseModal = () => {
    toggle(false);
    formik.resetForm();
  };

  return (
    <>
      <Modal show={isOpen} onHide={onCloseModal} size="md">
        <ModalHeader closeButton={true}>Barging Detail</ModalHeader>
        <ModalBody>
          <Input
            label="No"
            type="number"
            name="no"
            onChange={formik.handleChange}
            value={formik.values.no}
            errorMessage={formik.errors?.no}
            isError={formik.errors.no && formik.touched.no}
          />
          <Input
            type="select-api"
            name="tugBoat"
            label="TugBoat"
            value={formik.values.tugBoat}
            onChange={(e) => {
              formik.setFieldValue("tugBoat", e.target.value);
              formik.setFieldValue("barge", e.target.value?.barge);
            }}
            api={PagedSearchTugBoat}
            handleSetOptions={(pt) => ({
              value: pt.uuid,
              label: pt.name,
              barge: pt.barge,
            })}
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
            label="Cargo"
            type="number"
            name="cargo"
            onChange={formik.handleChange}
            value={formik.values.cargo}
            errorMessage={formik.errors?.cargo}
            isError={formik.errors.cargo && formik.touched.cargo}
          />

          <Input
            label="Arrived at Jetty"
            type="date"
            name="arrivedatJetty"
            onChange={formik.handleChange}
            value={formik.values.arrivedatJetty}
            errorMessage={formik.errors?.arrivedatJetty}
            isError={
              formik.errors.arrivedatJetty && formik.touched.arrivedatJetty
            }
          />

          <Input
            label="Commanced"
            type="date"
            name="commanced"
            onChange={formik.handleChange}
            value={formik.values.commanced}
            errorMessage={formik.errors?.commanced}
            isError={formik.errors.commanced && formik.touched.commanced}
          />

          <Input
            label="Completed"
            type="date"
            name="completed"
            onChange={formik.handleChange}
            value={formik.values.completed}
            errorMessage={formik.errors?.completed}
            isError={formik.errors.completed && formik.touched.completed}
          />

          <Input
            label="Casted Off"
            type="date"
            name="castedOff"
            onChange={formik.handleChange}
            value={formik.values.castedOff}
            errorMessage={formik.errors?.castedOff}
            isError={formik.errors.castedOff && formik.touched.castedOff}
          />

          <Input
            label="Remarks"
            type="text"
            name="remarks"
            onChange={formik.handleChange}
            value={formik.values.remarks}
            errorMessage={formik.errors?.remarks}
            isError={formik.errors.remarks && formik.touched.remarks}
          />
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
    </>
  );
}
