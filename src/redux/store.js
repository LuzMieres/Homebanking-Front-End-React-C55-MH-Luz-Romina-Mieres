// store.js
import { configureStore } from "@reduxjs/toolkit";
import clientReducer from "./reducers/clientReduce"; // Importa el clientReducer desde el archivo correcto

const store = configureStore({
  reducer: {
    client: clientReducer, // Asegúrate de registrar el clientReducer
  },
});

export default store;
