// import React from "react";

// const Account = (props) => {
//   return (
//     <div className="">
//       <div className="Card bg-slate-300 p-10 text-2xl rounded-xl flex flex-col flex-wrap gap-4 shadow-xl hover:shadow-2xl hover:text-3xl duration-300 bg-[url('/public/backGraundAccount.jpeg')] bg-cover bg-center">
//         <p>Account Number: {props.account}</p>
//         <p>Balance: ${props.balance.toLocaleString()},00</p>
//         <p>Opening Date: {props.openingDate}</p>
//       </div>
//     </div>
//   );
// };

// export default Account;

import React from "react";

const Account = (props) => {
  return (
    <div className="">
      <div className="Card bg-slate-200 p-10 text-xl lg:text-2xl border-blue-800 border-4  rounded-xl flex flex-col flex-wrap gap-4 shadow-xl hover:border-8 hover:shadow-2xl hover:text-3xl duration-300 bg-cover bg-center">
        <p>Account Number: {props.account}</p>
        <p>Balance: ${props.balance.toLocaleString()},00</p>
        <p>Opening Date: {props.openingDate}</p>
      </div>
    </div>
  );
};

export default Account;

