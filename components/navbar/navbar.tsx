import {
  Navbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";

import NextLink from "next/link";

import { useState } from "react";
// import { useRouter } from "next/router";

import styles from "./navbar.module.css";
import { ThemeSwitch } from "../themes/theme-switch";
import LogoutButton from "../buttons/LogoutButton";

export const NavbarComponent = () => {
  const [visible, setVisible] = useState(false);

  const closeHandler = () => {
    setVisible(false);
  };

  const handleLogout = () => {
    // Aquí manejas el cierre de sesión, por ejemplo, limpiando las cookies, tokens, etc.
    console.log("Cerrar sesión");
    // Después puedes redirigir al usuario o hacer cualquier otra acción necesaria
    closeHandler();
  };

  // const {asPath} = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const linkItems = [
    /* {
      name: "Home",
      href: "/"
    }, */
    {
      name: "About",
      href: "/about/",
    },
    {
      name: "Projects",
      href: "/projects/",
    },
    {
      name: "Contact",
      href: "/contact/",
    },
  ];

  return (
    <Navbar maxWidth="xl">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <span className="text-xl">To-do-list</span>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        <NavbarItem className="hidden sm:flex gap-8">
          <ThemeSwitch />
          <LogoutButton />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />

        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {linkItems.map((linkItem, index) => (
          <NavbarMenuItem>
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === linkItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              href={linkItem.href}
              size="lg"
            >
              {linkItem.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};
