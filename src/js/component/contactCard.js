import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

const ContactCard = () => {
  const { store, actions } = useContext(Context);

  if (store.contact.length === 0) {
    return <p className="text-center">No hay contactos.</p>;
  }

  return (
    <div className="d-flex flex-column align-items-center">
      {store.contact.map((contact) => (
        <div
          key={contact.id ?? contact.name}
          className="d-flex justify-content-between px-3 border py-3 w-100"
        >
          <div className="d-flex">
            <div className="col-3 rounded-circle">
              <img
                src={`https://unavatar.io/${contact.name}`}
                alt={`${contact.name}'s photo`}
                className="img-fluid rounded-circle"
              />
            </div>
            <div className="ms-1 ms-md-3 ms-lg-5">
              <p className="fw-bold">{contact.name}</p>
              <ul className="list-unstyled">
                <li>
                  <i
                    className="fa-solid fa-location-dot me-2"
                    style={{ color: "#99a2b2" }}
                  ></i>
                  {contact.address}
                </li>
                <li className="my-1">
                  <i
                    className="fa-solid fa-phone-flip me-2"
                    style={{ color: "#99a2b2" }}
                  ></i>
                  {contact.phone}
                </li>
                <li>
                  <i
                    className="fa-solid fa-envelope me-2"
                    style={{ color: "#99a2b2" }}
                  ></i>
                  {contact.email}
                </li>
              </ul>
            </div>
          </div>
          <div className="d-flex align-items-start">
            <Link to="/addContact">
              <button
                onClick={() => actions.editContact(contact)}
                className="btn"
              >
                <i className="fa-solid fa-pencil"></i>
              </button>
            </Link>
            <button
              onClick={() => actions.deleteContact(contact.id)}
              className="btn"
            >
              <i className="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactCard;
