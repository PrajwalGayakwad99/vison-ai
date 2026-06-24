"use client";

import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

export default function AuthControls() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    // Render a placeholder to avoid layout shift
    return <div className="auth-placeholder" />;
  }

  if (isSignedIn) {
    return (
      <nav className="auth-controls">
        <UserButton afterSignOutUrl="/" />
      </nav>
    );
  }

  return (
    <nav className="auth-controls">
      <SignInButton mode="modal">
        <button className="auth-btn sign-in">Sign In</button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="auth-btn sign-up">Sign Up</button>
      </SignUpButton>
    </nav>
  );
}
