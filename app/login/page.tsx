"use client";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Card,
  CardBody,
  Spacer,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import { MailIcon } from "@/components/icons/MailIcon";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toggleVisibility = () => setIsVisible(!isVisible);
  const router = useRouter();

  const validateEmail = (value: String) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

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
      !isInvalidEmail && !isInvalidPassword && email !== "" && password !== ""
    );
  }, [isInvalidEmail, isInvalidPassword, email, password]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      console.log("Usuario autenticado:", token);
      router.push("/task");
      setIsLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.error("Credenciales incorrectas:", error);
        setIsLoading(false);
        onOpen();
      } else {
        console.error("Error en el inicio de sesión:", error);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/task");
    }
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <div className="w-full max-w-5xl">
        <Card className="w-full">
          <CardBody>
            <div className="grid grid-cols-2 gap-4 ">
              <div className="grid content-center text-center">
                <p className="p-1 text-5xl">Sign in</p>
                <Spacer y={6} />
                <p className="text-lg">to continue to email</p>
              </div>
              <div className="grid content-center">
                <div className="my-4">
                  <Input
                    isRequired
                    value={email}
                    isInvalid={isInvalidEmail}
                    color={isInvalidEmail ? "danger" : "default"}
                    errorMessage="Please enter a valid email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    type="email"
                    label="Email"
                    variant="bordered"
                    endContent={
                      <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                  />
                </div>
                <Input
                  isRequired
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  isInvalid={isInvalidPassword}
                  color={isInvalidPassword ? "danger" : "default"}
                  errorMessage="Please enter at least eight characters"
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
                <div className="my-4">
                  <Button
                    isDisabled={!isFormValid}
                    color="primary"
                    variant="solid"
                    fullWidth
                    isLoading={isLoading}
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    Sign In
                  </Button>
                </div>
                <Link className="flex justify-center" href="/register">
                  New in To Do List? Create an account
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      {/* Modal error */}
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Error Sign In
            </ModalHeader>
            <ModalBody>
              <p>Incorrect email or password, please try again</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </main>
  );
}
