import { useState } from "react";

export const useModal = (configuration) => {
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);
  const backdrop = configuration?.backdrop ?? "static";
  const keyboard = configuration?.keyboard ?? true;
  const unMountOnClose = configuration?.unMountOnClose ?? true;
  const size = configuration?.size ?? "md";

  return { modal, toggleModal, backdrop, keyboard, unMountOnClose, size };
};
