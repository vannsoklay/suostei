"use client";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  ModalBody,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Skeleton,
  User,
  cn,
  useDisclosure,
} from "@nextui-org/react";
import { useModal as Modal } from "@/components/Modal";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  RiPencilRuler2Line,
  RiPencilRuler2Fill,
  RiBookReadLine,
  RiBookReadFill,
  RiSpeakerLine,
  RiSpeakerFill,
} from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { VscGithub } from "react-icons/vsc";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useAuth } from "@/app/context/useAuth";

export default function TopBar() {
  const pathname = usePathname();
  const { user, auth, loading } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Navbar maxWidth="2xl">
        <NavbarBrand>
          <Link href="/">
            <p className="font-bold text-inherit">SUOSTEI</p>
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-0" justify="center">
          <NavbarItem>
            <Button
              href="/blogs"
              as={Link}
              isIconOnly
              className="h-16 w-24 bg-transparent"
              radius="none"
              aria-label="blog"
            >
              {pathname == "/blogs" ? (
                <RiPencilRuler2Fill fontSize={24} className="text-primary" />
              ) : (
                <RiPencilRuler2Line fontSize={24} />
              )}
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              as={Link}
              href="/books"
              isIconOnly
              className="h-16 w-24 bg-transparent"
              radius="none"
              aria-label="books"
            >
              {pathname == "/books" ? (
                <RiBookReadFill fontSize={24} className="text-primary" />
              ) : (
                <RiBookReadLine fontSize={24} />
              )}
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              as={Link}
              href="/audios"
              isIconOnly
              className="h-16 w-24 bg-transparent"
              radius="none"
              aria-label="audios"
            >
              {pathname == "/audios" ? (
                <RiSpeakerFill fontSize={24} className="text-primary" />
              ) : (
                <RiSpeakerLine fontSize={24} />
              )}
            </Button>
          </NavbarItem>
        </NavbarContent>
        {loading ? (
          <NavbarContent justify="end">
            <div className="max-w-full flex justify-end items-center gap-3">
              <div>
                <Skeleton className="flex rounded-full w-12 h-12" />
              </div>
              <div className="w-full flex flex-col gap-2">
                <Skeleton className="h-3 w-20 rounded-lg" />
                <Skeleton className="h-3 w-32 rounded-lg" />
              </div>
            </div>
          </NavbarContent>
        ) : auth ? (
          <NavbarContent justify="end">
            <NavbarItem>
              <Button
                as={Link}
                href="/writer"
                radius="full"
                startContent={<HiOutlinePencilAlt fontSize={24} />}
                className="bg-transparent font-semibold"
              >
                Write
              </Button>
            </NavbarItem>
            <NavbarItem>
              <div className="flex items-center">
                <Dropdown>
                  <DropdownTrigger>
                    <User
                      as="button"
                      avatarProps={{
                        isBordered: true,
                        src: user?.photo,
                      }}
                      className="transition-transform"
                      description={user?.name}
                      name={user?.name}
                    />
                  </DropdownTrigger>
                  <DropdownMenu aria-label="User Actions" variant="flat">
                    <DropdownItem key="profile" className="h-14 gap-2">
                      <p className="font-bold">Signed in as</p>
                      <p className="font-bold">{user.name}</p>
                    </DropdownItem>

                    <DropdownSection showDivider>
                      <DropdownItem key="dashboard">Dashboard</DropdownItem>
                    </DropdownSection>
                    <DropdownSection aria-label="Help & Feedback" className="mb-0">
                      <DropdownItem key="help_and_feedback">
                        Help & Feedback
                      </DropdownItem>
                      <DropdownItem key="logout">Log Out</DropdownItem>
                    </DropdownSection>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </NavbarItem>
          </NavbarContent>
        ) : (
          <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex">
              <a className="cursor-pointer" onClick={() => onOpen()}>
                Sign in
              </a>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                color="primary"
                href="#"
                radius="full"
                variant="flat"
              >
                Get started
              </Button>
            </NavbarItem>
          </NavbarContent>
        )}
      </Navbar>
      <Modal
        submit="Sign in"
        size="md"
        title="Welcome to Suostei"
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      >
        <ModalBody className="p-0 pb-6">
          <Button
            size="lg"
            className="bg-gray-100"
            startContent={<FcGoogle fontSize={20} />}
          >
            <span className="font-semibold text-gray-600">
              Sign in with Google
            </span>
          </Button>
          <Button
            as={Link}
            href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&state=`}
            size="lg"
            className="bg-gray-100"
            startContent={<VscGithub fontSize={20} />}
          >
            <span className="font-semibold text-gray-600">
              Sign in with Github
            </span>
          </Button>
        </ModalBody>
      </Modal>
    </>
  );
}
