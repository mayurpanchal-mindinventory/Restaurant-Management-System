import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BillList from "../components/Restaurant-Panal/BillList";
// import BillList from "../components/Restaurant-Panal/BillList";

const Bills = () => {
  const { user } = useSelector((state) => state.auth);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (user) {
      setUserId(user._id || user.id);
    }
  }, [user]);

  if (!userId) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <p className="text-gray-600">Loading user information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {user?.role === "restaurant"
            ? "Restaurant Bills"
            : "Bills Management"}
        </h1>
        <p className="text-gray-600">
          {user?.role === "restaurant"
            ? "Manage billing for your restaurant bookings"
            : "View and manage all restaurant bills"}
        </p>
      </div>
      <BillList userId={userId} />
    </div>
  );
};

export default Bills;
