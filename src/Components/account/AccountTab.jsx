// components/account/AccountTab.jsx
const AccountTab = ({ userData }) => {
    return (
      <div className="space-y-12">
        <section className="space-y-6">
          <h2 className="text-center text-sm">PERSONAL INFO</h2>
          <div className="space-y-6 text-center">
            <div className="space-y-1 px-2">
              <p className="text-xs text-black">Email: {userData?.email}</p>
            </div>
          </div>
        </section>
        <section className="space-y-6">
          <div className="space-y-6">
            <button className="w-full border text-white bg-black text-sm border-black py-3 hover:bg-white hover:text-black transition-colors">
              CHANGE PASSWORD
            </button>
          </div>
        </section>
      </div>
    );
  };
  
  export default AccountTab;