import React from "react";
import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";

const Topbar = () => {
  const isAdmin = false; // Replace with dynamic logic if needed

  return (
    <div className="topbar">
      {/* Logo Section */}
      <div className="logo">
        <Link to="/">Spotify</Link>
      </div>

      {/* Navigation Links */}
      <div className="links">
        {/* Admin Dashboard Link */}
        {isAdmin && (
          <Link to="/admin" className="admin-link">
            <LayoutDashboardIcon className="icon" />
            Admin Dashboard
          </Link>
        )}

        <SignedOut>
          <SignInOAuthButtons />
        </SignedOut>
        <UserButton/>
      </div>
    </div>
  );
};

export default Topbar;
