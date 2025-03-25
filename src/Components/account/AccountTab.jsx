import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import CustomLoader from "../CustomLoader";
import { LOGOUT_MUTATION } from "../../graphql/queries";
import { useAuth } from "../../context/AuthContext";

const AccountTab = ({ userData }) => {
  const { isAuth, setIsAuth } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const [logout] = useMutation(LOGOUT_MUTATION, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
    onCompleted: () => {
      setIsAuth(false);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    },
    onError: (error) => {
      setStatus("Logout failed. Try again.");
      console.error(error);
    },
  });
  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 relative">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
          <CustomLoader />
        </div>
      )}
      <section className="space-y-6">
        <h2 className="text-center text-sm">PERSONAL INFO</h2>
        <div className="text-center">
          <p className="text-xs text-black">Email: {userData?.email}</p>
        </div>
      </section>
      <button
        onClick={handleLogout}
        className="w-full border text-white bg-black text-sm border-black py-3 hover:bg-white hover:text-black transition-colors"
        disabled={loading}
      >
        {loading ? "Logging out..." : "LOGOUT"}
      </button>
      {status && <p className="text-red-500 text-center">{status}</p>}
    </div>
  );
};

export default AccountTab;
