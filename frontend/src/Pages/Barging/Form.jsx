import { useEffect, useState } from "react";
import {
  ReadBarging,
  CreateBarging,
  UpdateBarging,
  DeleteBarging,
  PagedSearchTugBoat,
} from "../../API";
import { ModalPopUp, Input, DataTable } from "../../Components";
import { useApplicationStoreContext } from "../../Hook/UserHook";
import { useFormik } from "formik";
import { Action } from "../../Constant";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  FormControl,
} from "react-bootstrap";
import moment from "moment";

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

  const deleteData = () => {
    DeleteBarging(uuid)
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

  const tableHeaders = [
    {
      name: "No",
      style: {
        minWidth: 100,
      },
    },
    {
      name: "TugBoat",
      style: {
        minWidth: 200,
      },
    },
    {
      name: "Barge",
      style: {
        minWidth: 200,
      },
    },
    {
      name: "Cargo",
      style: {
        minWidth: 200,
      },
    },
    {
      name: "Arrived at Jetty",
    },
    {
      name: "Commanced",
    },
    {
      name: "Completed",
    },
    {
      name: "Casted Off",
    },
    {
      name: "Remarks",
      style: {
        minWidth: 200,
      },
    },
    {
      name: "Action",
      style: {
        width: 10,
      },
    },
  ];

  const tableBody = [
    {
      name: "no",
      view: (data) => (
        <FormControl
          type="number"
          value={data.no}
          onChange={(e) => {
            const prev = [...formik.values.detail];
            prev[data.index].no = e.target.value;
            formik.setFieldValue("detail", prev);
          }}
          style={{
            width: 100,
          }}
        />
      ),
    },
    {
      name: "tugBoat",
      view: (data) => (
        <Input
          type="select-api"
          name="tugBoat"
          useLabel={false}
          value={data.tugBoat}
          onChange={(e) => {
            const prev = [...formik.values.detail];
            prev[data.index].tugBoat = e.target.value;
            prev[data.index].barge = e.target.value.barge;
            formik.setFieldValue("detail", prev);
          }}
          api={PagedSearchTugBoat}
          handleSetOptions={(pt) => ({
            value: pt.uuid,
            label: pt.name,
            barge: pt.barge,
          })}
        />
      ),
    },
    {
      name: "barge",
    },
    {
      name: "cargo",
      view: (data) => (
        <FormControl
          type="number"
          value={data.cargo}
          onChange={(e) => {
            const prev = [...formik.values.detail];
            prev[data.index].cargo = e.target.value;
            formik.setFieldValue("detail", prev);
          }}
        />
      ),
    },
    {
      name: "arrivedatJetty",
      view: (data) => (
        <FormControl
          type="datetime-local"
          value={data.arrivedatJetty}
          onChange={(e) => {
            const prev = [...formik.values.detail];
            prev[data.index].arrivedatJetty = e.target.value;
            formik.setFieldValue("detail", prev);
          }}
        />
      ),
    },
    {
      name: "commanced",
      view: (data) => (
        <FormControl
          type="datetime-local"
          value={data.commanced}
          onChange={(e) => {
            const prev = [...formik.values.detail];
            prev[data.index].commanced = e.target.value;
            formik.setFieldValue("detail", prev);
          }}
        />
      ),
    },
    {
      name: "completed",
      view: (data) => (
        <FormControl
          type="datetime-local"
          value={data.completed}
          onChange={(e) => {
            const prev = [...formik.values.detail];
            prev[data.index].completed = e.target.value;
            formik.setFieldValue("detail", prev);
          }}
        />
      ),
    },
    {
      name: "castedOff",
      view: (data) => (
        <FormControl
          type="datetime-local"
          value={data.castedOff}
          onChange={(e) => {
            const prev = [...formik.values.detail];
            prev[data.index].castedOff = e.target.value;
            formik.setFieldValue("detail", prev);
          }}
        />
      ),
    },
    {
      name: "remarks",
      view: (data) => (
        <FormControl
          type="text"
          value={data.remarks}
          onChange={(e) => {
            const prev = [...formik.values.detail];
            prev[data.index].remarks = e.target.value;
            formik.setFieldValue("detail", prev);
          }}
        />
      ),
    },
    {
      view: (data) => (
        <button
          className="btn btn-sm btn-danger"
          onClick={() => {
            formik.setFieldValue(
              "detail",
              formik.values.detail.filter((_, index) => index !== data.index)
            );
          }}
          style={{
            fontSize: "10px",
          }}
        >
          <i className="bi bi-trash"></i>
        </button>
      ),
    },
  ];

  return (
    <>
      <Modal show={isOpen} onHide={onCloseModal} fullscreen>
        <ModalHeader closeButton={true}>Barging</ModalHeader>
        <ModalBody>
          <Input
            label="Date"
            type="date"
            name="date"
            onChange={formik.handleChange}
            value={formik.values.date}
            errorMessage={formik.errors?.date}
            isError={formik.errors.date && formik.touched.date}
          />
          <Input
            label="No Shipment"
            type="number"
            name="no"
            onChange={formik.handleChange}
            value={formik.values.no}
            errorMessage={formik.errors?.no}
            isError={formik.errors.no && formik.touched.no}
          />

          <Input
            label="Supply to MV"
            type="text"
            name="mv"
            onChange={formik.handleChange}
            value={formik.values.mv}
            errorMessage={formik.errors?.mv}
            isError={formik.errors.mv && formik.touched.mv}
          />

          <Input
            label="Company"
            type="select"
            name="company"
            onChange={formik.handleChange}
            value={formik.values.company}
            errorMessage={formik.errors?.company}
            isError={formik.errors.company && formik.touched.company}
            options={options}
          />

          <DataTable
            data={formik.values.detail}
            tableHeader={tableHeaders}
            tableBody={tableBody}
            usePagination={false}
          />

          <button
            className="btn btn-primary w-100"
            onClick={() => {
              formik.setFieldValue("detail", [
                ...formik.values.detail,
                {
                  no: "",
                  tugBoat: "",
                },
              ]);
            }}
          >
            +
          </button>
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
