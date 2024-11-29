import React from "react";
import { useSignIn } from "@clerk/clerk-react";
import Button from "./ui/button.jsx";

const SignInOAuthButtons = () => {
  const { signIn, isLoaded } = useSignIn();

  if (!isLoaded) {
    return null;
  }

  const signInWithGoogle = () => {
    signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/auth-callback",
    });
  };

  return (
    <Button 
      onClick={signInWithGoogle} 
      variant="secondary"
      className="sign-in-button" // Use your own CSS class here
    >
      {/* <img 
        src="/google.png" 
        alt="Google" 
        style={{ width: "20px", height: "20px", marginRight: "0.5rem" }}
      /> */}
      Continue with Google
    </Button>
  );
};

export default SignInOAuthButtons;
