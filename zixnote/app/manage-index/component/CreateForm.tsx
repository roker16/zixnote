"use client";
import { createIndex, editIndex } from "@/app/action";
import { SubmitButton } from "@/app/submit-button";
import React from "react";
import { MdAdd, MdEdit } from "react-icons/md";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Button, IconButton } from "@chakra-ui/react";
import { CheckIcon } from "@heroicons/react/20/solid";

export default function CreateForm({
  parentId,
  syllabusId,
  label,
}: {
  parentId: number | null | undefined;
  syllabusId?: number | null | undefined;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  const withIconStyles = "btn btn-sm btn-ghost btn-circle opacity-70";
  const withLabelStyles = "btn btn-md btn-neutral min-w-full";
  const buttonStyles = !label ? withIconStyles : withLabelStyles;

  return (
    <>
    
      <div className=" flex items-center justify-center">
        {/* <button type="button" onClick={openModal} className={buttonStyles}>
          {label ? label : <MdAdd />}
        </button> */} 
        <IconButton
        onClick={openModal}
        
          isRound={true}
          size="xs"
          color={"blue.00"}
          // variant="solid"
          // colorScheme="teal"
          aria-label="Done"
          fontSize="15px"
          icon={<MdAdd />}
        />
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 " />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create Index
                  </Dialog.Title>
                  <div className="mt-2">
                    <form action={createIndex}>
                      <div className="flex flex-col gap-2">
                        <input
                          type="hidden"
                          name="parentId"
                          value={parentId ? parentId : undefined}
                        />
                        <input
                          type="hidden"
                          name="syllabusId"
                          value={syllabusId!}
                        />

                        <input
                          type="text"
                          id="index"
                          name="index"
                          placeholder="Index Name"
                          required
                          className="input w-full input-bordered"
                        />
                        {/* ... */}
                        <p aria-live="polite" className="text-error text-xs">
                          {/* {state?.errors.index} */}
                        </p>
                        <input
                          type="number"
                          id="order"
                          name="order"
                          placeholder="Sequence"
                          required
                          className="input w-full input-bordered"
                        />
                        {/* ... */}
                        <p aria-live="polite" className="text-error text-xs">
                          {/* {state?.errors.order} */}
                        </p>
                        <SubmitButton />
                      </div>
                    </form>
                  </div>

                  <div className="flex w-full mt-4 justify-end">
                    <button
                      type="button"
                      className="btn btn-md btn-ghost"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
