import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import Accounts from './pages/Accounts';
import AccountData from './components/AccountData';
import NewAccountForm from './components/NewAccountForm';
import { TransactionsProvider } from './context/TransactionsContext'; // Asegúrate de que la ruta sea correcta
import { LoanProvider } from './context/LoanContext'; // Importar LoanProvider
import NewTransaction from './pages/NewTransaction';
import Cards from './pages/Cards';
import NewCard from './pages/NewCard';
import Loans from './pages/Loans';
import NewLoan from './pages/NewLoan';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      {/* Envolver con ambos proveedores */}
      <TransactionsProvider>
        <LoanProvider> {/* Añadir LoanProvider aquí */}
          <Routes>
            <Route index element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route element={<MainLayout />}>
              <Route path='/accounts' element={<Accounts />} />
              <Route path="/account/:id" element={<AccountData />} />
              <Route path="/newAccount" element={<NewAccountForm />} />
              <Route path="/newTransaction" element={<NewTransaction />} />
              <Route path='/cards' element={<Cards />} />
              <Route path='/newCard' element={<NewCard />} />
              <Route path='/loans' element={<Loans />} />
              <Route path='/newLoan' element={<NewLoan />} />
            </Route>
          </Routes>
        </LoanProvider> {/* Cerrar LoanProvider */}
      </TransactionsProvider>
    </BrowserRouter>
  );
}

export default App;
