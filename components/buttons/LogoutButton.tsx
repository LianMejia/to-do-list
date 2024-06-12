"use client";

import { useRouter } from "next/navigation";
import {
  Button,
  User,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import { useUser } from "../../app/context/UserContext";

export default function LogoutButton() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <>
      {/* <div className="m-2">
        <User
          name={user?.name || "Guest"}
          description={user?.email || "Guest@guest.com"}
        />
        <Button
          className="mt-2"
          fullWidth
          size="sm"
          color="danger"
          variant="solid"
          onClick={onOpen}
        >
          Logout
        </Button>
      </div> */}
      <Dropdown>
        <DropdownTrigger>
          {/* <Avatar name={user?.name || "Guest"} /> */}
          <User
            as="button"
            className="transition-transform"
            description={user?.email || "Guest"}
            name={user?.name || "Guest"}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User menu actions" onAction={onOpen}>
          <DropdownItem key="logout" color="danger">
            Sign out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-2xl">
                Sign out
              </ModalHeader>
              {/* <ModalBody>
                <p>Esta seguro de cerrar sesion?</p>
              </ModalBody> */}
              <ModalFooter>
                <Button color="primary" size="sm" variant="solid" onPress={onClose}>
                  Close
                </Button>
                <Button color="danger" size="sm" variant="light" onPress={handleLogout}>
                  Sign out
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
