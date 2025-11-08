import { useEffect, useState } from "react";
import {
  PagedSearchBargingDetail,
  CreateTranshipmentDetail,
  UpdateTranshipmentDetail,
  ReadTranshipmentDetail,
} from "../../API";
import { Input } from "../../Components";
import { useApplicationStoreContext } from "../../Hook/UserHook";
import { useFormik } from "formik";
import { Action } from "../../Constant";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "react-bootstrap";
import moment from "moment";
import { useSearchParams } from "react-router-dom";

export default function TugBoatForm({ isOpen, toggle, selected }) {
  const { setLastDataModificationTimestamp, setToastInfo, setIsShowToast } =
    useApplicationStoreContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const bargingUuid = searchParams.get("bargingUuid");
  const transhipmentUuid = searchParams.get("uuid");
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
        transhipmentUuid: transhipmentUuid,
        bargingDetailUuid: values.tugBoat?.value,
      };
      if (action === Action.CREATE) {
        CreateTranshipmentDetail(model)
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
        UpdateTranshipmentDetail(uuid, model)
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
      ReadTranshipmentDetail(uuid)
        .then((response) =>
          formik.setValues({
            ...response.data,
            tugBoat: {
              value: response.data.tugBoatUuid,
              label: response.data.name,
            },
            arrivedatJetty:
              response.data.arrivedatJetty &&
              moment(response.data.arrivedatJetty).format("yyyy-MM-DDTHH:mm"),
            commanced:
              response.data.commanced &&
              moment(response.data.commanced).format("yyyy-MM-DDTHH:mm"),
            completed:
              response.data.completed &&
              moment(response.data.completed).format("yyyy-MM-DDTHH:mm"),
            castedOff:
              response.data.castedOff &&
              moment(response.data.castedOff).format("yyyy-MM-DDTHH:mm"),
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
            additionalParams={{
              bargingUuid: bargingUuid,
            }}
            api={PagedSearchBargingDetail}
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
            disabled={true}
          />

          <Input
            label="Arrived"
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
            label="Cargo"
            type="number"
            name="cargoOnb"
            onChange={formik.handleChange}
            value={formik.values.cargoOnb}
            errorMessage={formik.errors?.cargoOnb}
            isError={formik.errors.cargoOnb && formik.touched.cargoOnb}
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
