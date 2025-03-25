// import React, { useState } from "react";
// import { useMutation, gql } from "@apollo/client";
// import { useSearchParams } from "react-router-dom";

// const RESET_PASSWORD = gql`
//   mutation SetPassword($email: String!, $password: String!, $token: String!) {
//     setPassword(email: $email, password: $password, token: $token) {
//       user {
//         id
//         email
//       }
//       errors {
//         field
//         message
//       }
//     }
//   }
// `;

// function ResetPass() {
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get("token");
//   const email = searchParams.get("email");
//   const [password, setPassword] = useState("");
//   const [resetPassword, { data, loading, error }] = useMutation(RESET_PASSWORD);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!token || !email) return alert("Invalid or expired link.");
//     await resetPassword({ variables: { email, password, token } });
//   };

//   return (
//     <div className="flex flex-col items-center mt-80">
//       <h2>Reset Password</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="password"
//           placeholder="New Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? "Resetting..." : "Reset Password"}
//         </button>
//         {error && <p>Error: {error.message}</p>}
//         {data?.setPassword?.errors?.length > 0 &&
//           data.setPassword.errors.map((err, i) => (
//             <p key={i}>Error: {err.message}</p>
//           ))}
//         {data?.setPassword?.user && <p>Password reset successfully!</p>}
//       </form>
//     </div>
//   );
// }

// export default ResetPass;

import React from 'react'

function ResetPass() {
  return (
    <div>ResetPass</div>
  )
}

export default ResetPass