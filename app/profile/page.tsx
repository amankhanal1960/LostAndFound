import React from "react";
import Header from "@/components/header";

const Profile = () => {
  return (
    <div>
      <Header />

      <div>
        <h1 className="text-2xl font-bold text-center mt-16">Profile Page</h1>
        <p className="text-center mt-4">
          This is the profile page where user details will be displayed.
        </p>
      </div>
    </div>
  );
};

export default Profile;
