import React, { FC } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@nextui-org/react";

interface Props {
  children: React.ReactNode;
  submit: string;
  size: SizeType;
  title: string;
  isOpen: boolean;
  onOpen: Function;
  onClose: () => void;
}

type SizeType =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "full";

export const useModal: FC<Props> = ({
  onClose,
  isOpen,
  onOpen,
  ...props
}: Props) => {
  return (
    <>
      <Modal size={props.size} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {props.title}
              </ModalHeader>
              <ModalBody>{props.children}</ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
