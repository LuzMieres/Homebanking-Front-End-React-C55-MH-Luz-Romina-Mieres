import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Accounts from "./pages/Accounts";
import Cards from "./pages/Cards";
import Loans from "./pages/Loans";
import Transactions from "./pages/Transactions";

import MainLayout from "./layouts/MainLayout";
import AccountDetails from "./pages/AccountDetails";
import AddCard from "./pages/AddCard";
import AddAccount from "./pages/AddAccount";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <>
      <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Redirige la ruta raíz a "/accounts" */}
        <Route index element={<Navigate to="login" replace />} />

        <Route path="accounts" element={<Accounts />} />
        <Route path="account/:id" element={<AccountDetails />} />
        <Route path="accounts/addAccount" element={<AddAccount />} />

        <Route path="cards" element={<Cards />} />
        <Route path="cards/addCard" element={<AddCard />} />

        <Route path="loans" element={<Loans />} />
        <Route path="transactions" element={<Transactions />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </BrowserRouter>
    </>
  );
}

export default App;
