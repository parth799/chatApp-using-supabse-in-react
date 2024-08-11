import React, { useState, useRef } from "react";
import { useNavigate, redirect } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; /* prettier-ignore */
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import authService from "@/services/authService";

function Auth() {
  const [userExists, setUserExists] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const nameRef = useRef(null);
  const navigate = useNavigate();
  
  return (
    <>
      <div className="h-screen w-full flex items-center justify-center">
        <Card className="w-1/4 min-w-96">
          <CardHeader>
            <CardTitle> {userExists ? "Login" : "Sign Up"} </CardTitle>
            <CardDescription> {"Let's get started!"} </CardDescription>
          </CardHeader>
          <CardContent>
            {!userExists && <Label>Username</Label>}
            {!userExists && <Input type="text" placeholder="Username" ref={nameRef} />}
            <Label>Email</Label>
            <Input type="email" placeholder="Email" ref={emailRef} />
            <Label>Password</Label>
            <Input type="password" placeholder="Password" ref={passwordRef} />
          </CardContent>
          <CardFooter className="flex-col">
            <Button
              className="w-full"
              disabled={buttonDisabled}
              onClick={async () => {
                const email = emailRef.current.value;
                const password = passwordRef.current.value;
                const name = nameRef?.current?.value;
                try {
                  setButtonDisabled((prev) => !prev);
                  userExists
                    ? await authService.signIn({ email, password })
                    : await authService.signUp({ email, password }, name);
                  navigate("/home", { replace: true });
                } catch (error) {
                  setButtonDisabled((prev) => !prev);
                  toast.error(`${error.message}`);
                  console.log(error);
                }
              }}
            >
              {buttonDisabled && (
                <AiOutlineLoading3Quarters className="mr-2 animate-spin" />
              )}
              {userExists ? "Login" : "Sign Up"}
            </Button>
            <Button
              variant="link"
              className="text-sm font-light"
              onClick={() => setUserExists((prev) => !prev)}
            >
              {userExists
                ? "Don't have an Account? Sign up"
                : "Already have an Account? Sign In"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default Auth;

export const authLoader = async (authService) => {
  try {
    const user = await authService.getCurrentUser();
    if (user) return redirect("/home");
  } catch (error) {
    // console.log(error);
    return null;
  }
};