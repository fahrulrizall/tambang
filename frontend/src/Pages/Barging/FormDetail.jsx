import { useEffect, useState } from "react";
import {
  CreateBargingDetail,
  UpdateBargingDetail,
  PagedSearchTugBoat,
  ReadBargingDetail,
} from "../../API";
import { Input } from "../../Components";
import { useApplicationStoreContext } from "../../Hook/UserHook";
import { useFormik } from "formik";
import { Action } from "../../Constant";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { convertUtc } from "../../helpers";

export default function TugBoatForm({ isOpen, toggle, selected }) {
  const { setLastDataModificationTimestamp, setToastInfo, setIsShowToast } =
    useApplicationStoreContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const bargingUuid = searchParams.get("uuid");
  const uuid = selected?.uuid;
  const [action, setAction] = useState(Action.CREATE);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      uuid: "",
      no: "",
      company: "",
      mv: "",
      createdDateTime: null,
      createdBy: null,
      lastModifiedDateTime: null,
      lastModifiedBy: null,
    },
    onSubmit: (values) => {
      const model = {
        ...values,
        bargingUuid: bargingUuid,
        tugBoatUuid: values.tugBoat?.value,
      };
      if (action === Action.CREATE) {
        CreateBargingDetail(model)
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
        UpdateBargingDetail(uuid, model)
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

  useEffect(() => {
    if (uuid && isOpen) {
      setAction(Action.VIEW);
      ReadBargingDetail(uuid)
        .then((response) =>
          formik.setValues({
            ...response.data,
            tugBoat: {
              value: response.data.tugBoatUuid,
              label: response.data.name,
            },
            arrivedatJetty: convertUtc(response.data.arrivedatJetty),
            alongside: convertUtc(response.data.alongside),
            commanced: convertUtc(response.data.commanced),
            completed: convertUtc(response.data.completed),
            castedOff: convertUtc(response.data.castedOff),
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
            type="datetime-local"
            name="arrivedatJetty"
            onChange={formik.handleChange}
            value={formik.values.arrivedatJetty}
            errorMessage={formik.errors?.arrivedatJetty}
            isError={
              formik.errors.arrivedatJetty && formik.touched.arrivedatJetty
            }
          />

          <Input
            label="Alongside"
            type="datetime-local"
            name="alongside"
            onChange={formik.handleChange}
            value={formik.values.alongside}
            errorMessage={formik.errors?.alongside}
            isError={formik.errors.alongside && formik.touched.alongside}
          />

          <Input
            label="Commanced"
            type="datetime-local"
            name="commanced"
            onChange={formik.handleChange}
            value={formik.values.commanced}
            errorMessage={formik.errors?.commanced}
            isError={formik.errors.commanced && formik.touched.commanced}
          />

          <Input
            label="Completed"
            type="datetime-local"
            name="completed"
            onChange={formik.handleChange}
            value={formik.values.completed}
            errorMessage={formik.errors?.completed}
            isError={formik.errors.completed && formik.touched.completed}
          />

          <Input
            label="Casted Off"
            type="datetime-local"
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
