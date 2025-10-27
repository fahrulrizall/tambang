import React from "react";
import { Toast, ToastHeader, ToastContainer } from "react-bootstrap";
import { useApplicationStoreContext } from "../Hook/UserHook";

export default function Toaster() {
  const { isShowToast, setIsShowToast, toastInfo } =
    useApplicationStoreContext();
  return (
    <ToastContainer position="top-end">
      <Toast
        show={isShowToast}
        onClose={() => setIsShowToast(false)}
        delay={5000}
        autohide
        bg={toastInfo?.background}
        className="sticky-bottom-toast"
      >
        <ToastHeader>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">Information</strong>
        </ToastHeader>
        <Toast.Body style={{ color: "white" }}>{toastInfo?.message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
