import React from "react";

export default function () {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
        Create
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setType("gg");
            setIsShowModal(true);
          }}
        >
          GG
        </Dropdown.Item>
        <Dropdown.Item
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setType("loin");
            setIsShowModal(true);
          }}
        >
          Loin
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
