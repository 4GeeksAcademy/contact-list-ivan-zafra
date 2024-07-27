import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

const AddContact = () => {
  const { actions, store } = useContext(Context);
  const [newContactInput, setNewContactInput] = useState(() => {
    return store.editedContact
      ? store.editedContact
      : {
          name: "",
          email: "",
          phone: "",
          address: "",
        };
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewContactInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (store.editedContact.name) {
      await actions.saveEditContact(newContactInput);
    } else {
      await actions.contactCreator(newContactInput);
    }

    actions.addContact(newContactInput);

    navigate("/");
  };

  return (
    <form className="container" onSubmit={handleSave}>
      <h1 className="text-center">Información del contacto</h1>

      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Nombre
        </label>
        <input
          placeholder="@github username"
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={newContactInput.name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          placeholder="Añade un correo electronico"
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={newContactInput.email}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="phone" className="form-label">
          Telefono
        </label>
        <input
          placeholder="Añade un numero de telefono"
          type="phone"
          className="form-control"
          id="phone"
          name="phone"
          value={newContactInput.phone}
          onChange={handleChange}
          maxLength={9}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="address" className="form-label">
          Direccion
        </label>
        <input
          placeholder="Enter address"
          type="text"
          className="form-control"
          id="address"
          name="address"
          value={newContactInput.address}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="btn btn-success">
        {store.editedContact.name ? "Edit" : "Save"}
      </button>

      <Link to={`/`}>
        <button
          onClick={actions.resetInput}
          type="button"
          className="btn btn-secondary ms-2"
        >
          Volver
        </button>
      </Link>
    </form>
  );
};

export default AddContact;
