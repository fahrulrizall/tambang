import { useEffect, useState } from "react";
import {
  UpdateTranshipment,
  ReadTranshipment,
  PagedSearchBargingGroup,
  ReadBarging,
  CreateTranshipment,
  DeleteTranshipment,
} from "../../API";
import { ModalPopUp, Input } from "../../Components";
import { useApplicationStoreContext } from "../../Hook/UserHook";
import { useFormik } from "formik";
import { Action } from "../../Constant";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "react-bootstrap";
import moment from "moment";
import { convertUtc } from "../../helpers";

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
        bargingUuid: values.vessel?.value,
      };
      if (action === Action.CREATE) {
        CreateTranshipment(model)
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
        UpdateTranshipment(uuid, model)
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

  const deleteData = () => {
    DeleteTranshipment(uuid)
      .then(() => {
        setToastInfo({
          message: "Barging successfully deleted",
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
              : "Barging failed deleted",
          background: "danger",
        });
        setIsShowToast(true);
      });
  };

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
      ReadTranshipment(uuid)
        .then((response) =>
          formik.setValues({
            ...response.data,
            norTendered: convertUtc(response.data.norTendered),
            vessel: {
              value: response.data.bargingUuid,
              label: response.data.no,
            },
          })
        )
        .catch((err) => console.log(err));
    } else {
      setAction(Action.CREATE);
    }
  }, [isOpen, uuid]);

  const component = () => {
    return (
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Delete Barging</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">Are you sure delete this Barging?</div>
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
      <Modal show={isOpen} onHide={onCloseModal} size="lg">
        <ModalHeader closeButton={true}>Transhipment</ModalHeader>
        <ModalBody>
          <Input
            label="No Shipment"
            type="select-api"
            name="vessel"
            onChange={async (e) => {
              formik.setFieldValue("vessel", e.target.value);
              formik.setFieldValue("mv", e.target.value?.mv);
              formik.setFieldValue("company", e.target.value?.company);
              const bargingDetail = await ReadBarging(e.target.value.value);
              const detail = bargingDetail.data.detail.map((item) => ({
                ...item,
                tugBoat: item.name,
                arrivedatJetty: convertUtc(item.arrivedatJetty),
                alongside: convertUtc(item.alongside),
                commanced: convertUtc(item.commanced),
                completed: convertUtc(item.completed),
                castedOff: convertUtc(item.castedOff),
              }));

              formik.setFieldValue("detail", detail);
            }}
            value={formik.values.vessel}
            errorMessage={formik.errors?.vessel}
            isError={formik.errors.vessel && formik.touched.vessel}
            api={PagedSearchBargingGroup}
            handleSetOptions={(item) => ({
              company: item.company,
              value: item.uuid,
              label: `${item.no} - ${item.mv}`,
              mv: item.mv,
            })}
          />
          <Input
            label="Supply to MV"
            type="text"
            name="mv"
            onChange={formik.handleChange}
            value={formik.values.mv}
            errorMessage={formik.errors?.mv}
            isError={formik.errors.mv && formik.touched.mv}
            disabled={true}
          />
          <Input
            label="Stowage Plan"
            type="number"
            name="stowagePlan"
            onChange={formik.handleChange}
            value={formik.values.stowagePlan}
            errorMessage={formik.errors?.stowagePlan}
            isError={formik.errors.stowagePlan && formik.touched.stowagePlan}
          />
          <Input
            label="Loading Port"
            type="text"
            name="loadingPort"
            onChange={formik.handleChange}
            value={formik.values.loadingPort}
            errorMessage={formik.errors?.loadingPort}
            isError={formik.errors.loadingPort && formik.touched.loadingPort}
          />
          <Input
            label="Discharging Port"
            type="text"
            name="dischargingPort"
            onChange={formik.handleChange}
            value={formik.values.dischargingPort}
            errorMessage={formik.errors?.dischargingPort}
            isError={
              formik.errors.dischargingPort && formik.touched.dischargingPort
            }
          />
          <Input
            label="Consignee"
            type="text"
            name="consigne"
            onChange={formik.handleChange}
            value={formik.values.consigne}
            errorMessage={formik.errors?.consigne}
            isError={formik.errors.consigne && formik.touched.consigne}
          />
          <Input
            label="Buyer"
            type="text"
            name="client"
            onChange={formik.handleChange}
            value={formik.values.client}
            errorMessage={formik.errors?.client}
            isError={formik.errors.client && formik.touched.client}
          />
          <Input
            label="Surveyor"
            type="text"
            name="surveyor"
            onChange={formik.handleChange}
            value={formik.values.surveyor}
            errorMessage={formik.errors?.surveyor}
            isError={formik.errors.surveyor && formik.touched.surveyor}
          />
          <Input
            label="Notify"
            type="text"
            name="notify"
            onChange={formik.handleChange}
            value={formik.values.notify}
            errorMessage={formik.errors?.notify}
            isError={formik.errors.notify && formik.touched.notify}
          />
          <Input
            label="NOR Re-Tendered"
            type="datetime-local"
            name="norTendered"
            onChange={formik.handleChange}
            value={formik.values.norTendered}
            errorMessage={formik.errors?.norTendered}
            isError={formik.errors.norTendered && formik.touched.norTendered}
          />
          <Input
            label="Blending"
            type="checkbox"
            name="blending"
            onChange={formik.handleChange}
            value={formik.values.blending}
            errorMessage={formik.errors?.blending}
            isError={formik.errors.blending && formik.touched.blending}
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
          {/* <CopySummaryButton data={formik.values} /> */}
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
