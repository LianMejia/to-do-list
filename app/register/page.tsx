"use client";
import {
  Button,
  Input,
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spacer,
} from "@nextui-org/react";
import Link from "next/link";
import React, { useState } from "react";
import { MailIcon } from "@/components/icons/MailIcon";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const { isOpen: isOpen, onOpen: onOpen, onClose: onClose } = useDisclosure();
  const {
    isOpen: isOpenErr,
    onOpen: onOpenErr,
    onClose: onCloseErr,
  } = useDisclosure();
  const validateEmail = (value: String) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
  const isInvalidName = React.useMemo(() => {
    if (name === "") return false;
    return name.length < 2;
  }, [name]);
  const isInvalidEmail = React.useMemo(() => {
    if (email === "") return false;

    return validateEmail(email) ? false : true;
  }, [email]);
  const isInvalidPassword = React.useMemo(() => {
    if (password === "") return false;
    return password.length < 8;
  }, [password]);

  const isFormValid = React.useMemo(() => {
    return (
      !isInvalidName &&
      !isInvalidEmail &&
      !isInvalidPassword &&
      name !== "" &&
      email !== "" &&
      password !== ""
    );
    !isInvalidName &&
      !isInvalidEmail &&
      !isInvalidPassword &&
      name !== "" &&
      email !== "" &&
      password !== "";
  }, [, isInvalidEmail, isInvalidPassword, name, email, password]);

  const createAccount = async (): Promise<void> => {
    setIsLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      name: name,
      email: email,
      password: password,
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/register",
        requestOptions
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (
          errorData.email &&
          errorData.email.includes("The email has already been taken.")
        ) {
          console.log("Error: El correo electrónico ya está en uso.");
          onOpenErr();
          setIsLoading(false);
          return;
        }
      }

      const result = await response.text();
      console.log(result);
      setIsLoading(false);
      onOpen();
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <div className="w-full max-w-5xl">
        <Card className="w-full">
          <CardBody>
            <div className="grid grid-cols-2 gap-4 ">
              <div className="grid content-center text-center">
                <p className="p-1 text-5xl">Create an Account</p>
                <Spacer y={6} />
                <p className="text-lg">Enter your details</p>
              </div>
              <div className="grid content-center">
                <div className="my-4">
                  <Input
                    isRequired
                    value={name}
                    isInvalid={isInvalidName}
                    color={isInvalidName ? "danger" : "default"}
                    errorMessage="Please enter at least two characters"
                    onValueChange={setName}
                    label="Name"
                    variant="bordered"
                  />
                </div>
                <Input
                  isRequired
                  value={email}
                  isInvalid={isInvalidEmail}
                  color={isInvalidEmail ? "danger" : "default"}
                  errorMessage="Please enter a valid email"
                  onValueChange={setEmail}
                  type="email"
                  label="Email"
                  variant="bordered"
                  endContent={
                    <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                />
                <div className="my-4">
                  <Input
                    isRequired
                    value={password}
                    isInvalid={isInvalidPassword}
                    color={isInvalidPassword ? "danger" : "default"}
                    errorMessage="Please enter at least eight characters"
                    onValueChange={setPassword}
                    label="Password"
                    variant="bordered"
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isVisible ? (
                          <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={isVisible ? "text" : "password"}
                  />
                </div>
                <Button
                  isDisabled={!isFormValid}
                  color="primary"
                  variant="solid"
                  fullWidth
                  isLoading={isLoading}
                  onClick={() => {
                    // onOpen();
                    createAccount();
                  }}
                >
                  Sign Up
                </Button>
                <div className="mt-4">
                  <Link className="flex justify-center" href="/login">
                    Do you already have an account? Sign in
                  </Link>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      {/* Modal successfull */}
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Register successfull
              </ModalHeader>
              <ModalBody>
                <p>You have successfully registered, please log in</p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* Modal error */}
      <Modal backdrop="blur" isOpen={isOpenErr} onClose={onCloseErr}>
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Error Register
            </ModalHeader>
            <ModalBody>
              <p>The email has already been taken.</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onCloseErr}>
                Close
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </main>
  );
}
