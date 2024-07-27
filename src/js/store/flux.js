const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      newUserName: "",
      userName: "",
      contact: [],
      editedContact: { name: "", email: "", phone: "", address: "" },
    },
    actions: {
      addContact: (newContact) => {
        const store = getStore();
        setStore({ contact: [...store.contact, newContact] });
      },
      getContactList: async (newUser) => {
        try {
          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/${newUser}/contacts`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(
              `Hubo un problema con la solicitud: ${response.status}`
            );
          }

          const data = await response.json();
          console.log("GETdata", data.contacts);
          setStore({ contact: data.contacts });
          return data;
        } catch (error) {
          console.error("Hubo un problema con la solicitud:", error);
        }
      },
      deleteContact: (idToDelete) => {
        const store = getStore();
        const actions = getActions();
        const updatedContactList = store.contact.filter(
          (contact) => contact.id !== idToDelete
        );
        setStore({ contact: updatedContactList });
        actions.deleteContactAPI(idToDelete);
      },
      deleteContactAPI: async (idToDelete) => {
        const store = getStore();
        try {
          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/${store.userName}/contacts/${idToDelete}`,
            {
              method: "DELETE",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(
              `Error al eliminar el contacto: ${response.status}`
            );
          }

          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            return {};
          }

          const data = await response.json();
          console.log("DELETE", data);
          return data;
        } catch (error) {
          console.error("Hubo un problema con la solicitud:", error);
          throw error;
        }
      },
      userCreator: async () => {
        const store = getStore();
        const actions = getActions();
        try {
          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/${store.userName}`,
            {
              method: "POST",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();
          console.log("POST User", data);
          if (data.detail === `Agenda "${store.userName}" already exists.`) {
            alert(
              `El usuario ${store.userName} ya existe, cargando lista de contactos`
            );
            actions.getContactList(store.userName);
          }
        } catch (error) {
          console.error("Hubo un problema con la solicitud: ", error);
        }
      },
      inputUsername: (e) => {
        setStore({ newUserName: e.target.value });
      },
      createUserName: (e) => {
        console.log(e);
        if (e.key === "Enter" || e.type === "click") {
          const store = getStore();
          const actions = getActions();
          setStore({ userName: store.newUserName });
          actions.userCreator();
        }
      },
      contactCreator: async (newContactInput) => {
        const store = getStore();
        const actions = getActions();

        try {
          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/${store.userName}/contacts`,
            {
              method: "POST",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newContactInput),
            }
          );

          if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
          }

          const data = await response.json();
          console.log("POST Contact", data);
          actions.getContactList(store.userName);

          return data;
        } catch (error) {
          console.error("Hubo un problema con la solicitud: ", error);
        }
      },
      editContact: (contactToEdit) => {
        const store = getStore();

        setStore({ editedContact: contactToEdit });

        const newContactList = store.contact.map((contact) => {
          if (contact.id === contactToEdit.id) {
            return contactToEdit;
          } else return contact;
        });
      },
      saveEditContac: (e, contactToEdit) => {
        e.preventDefault();

        const store = getStore();
        const actions = getActions();

        setStore({ editedContact: contactToEdit });

        const newContactList = store.contact.map((contact) => {
          if (contact.id === contactToEdit.id) {
            return contactToEdit;
          } else return contact;
        });
        setStore({ contact: newContactList });
        actions.saveEditContact(store.editedContact);
      },

      resetInput: () => {
        setStore({
          editedContact: {
            name: "",
            email: "",
            phone: "",
            address: "",
          },
        });
      },
      saveEditContact: async (contactToEdit) => {
        const store = getStore();
        const actions = getActions();

        try {
          const response = await fetch(
            `https://playground.4geeks.com/contact/agendas/${store.userName}/contacts/${contactToEdit.id}`,
            {
              method: "PUT",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(contactToEdit),
            }
          );

          if (!response.ok) {
            throw new Error(`Error al actualizar el contacto.`);
          }

          const data = await response.json();
          console.log("PUT Contact", data);
          actions.getContactList(store.userName);

          const updatedContactList = store.contact.map((contact) =>
            contact.id === contactToEdit.id ? contactToEdit : contact
          );

          setStore({ contact: updatedContactList });

          return data;
        } catch (error) {
          console.error("Hubo un problema con la solicitud:", error);
          throw error;
        }
      },
    },
  };
};

export default getState;
