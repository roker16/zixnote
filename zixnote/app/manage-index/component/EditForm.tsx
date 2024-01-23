"use client";
import { editIndex } from "@/app/action";
import { SubmitButton } from "@/app/submit-button";
import React from "react";
import { MdEdit } from "react-icons/md";

// export default function EditForm({
//   id,
//   name,
//   order,
// }: {
//   id: number;
//   name?: string;
//   order?: number;
// }) {
//   return (
//     <div>
//       {/* Open the modal using document.getElementById('ID').showModal() method */}
//       <button
//         className="btn btn-sm btn-ghost btn-circle opacity-70"
//         onClick={() => {
//           if (document) {
//             (
//               document.getElementById(`my_modal_${id}`) as HTMLFormElement
//             ).showModal();
//           }
//         }}
//       >
//         <MdEdit />
//       </button>
//       <dialog id={`my_modal_${id}`} className="modal">
//         <div className="modal-box">
//           <h3 className="font-bold text-lg">Edit Form</h3>
//           <form action={editIndex}>
//             <div className="flex flex-col">
//               <input type="hidden" name="id" value={id} />

//               <label htmlFor="index">Name</label>
//               <input
//                 type="text"
//                 id="index"
//                 name="index"
//                 defaultValue={name}
//                 required
//                 className="input w-full input-bordered"
//               />
//               {/* ... */}
//               <p aria-live="polite" className="text-error text-xs">
//                 {/* {state?.errors.index} */}
//               </p>
//               <label htmlFor="order">Order</label>
//               <input
//                 type="number"
//                 id="order"
//                 name="order"
//                 defaultValue={order}
//                 required
//                 className="input w-full input-bordered"
//               />
//               {/* ... */}
//               <p aria-live="polite" className="text-error text-xs">
//                 {/* {state?.errors.order} */}
//               </p>
//               <SubmitButton />
//             </div>
//           </form>
//           <div className="modal-action">
//             <form method="dialog">
//               {/* if there is a button in form, it will close the modal */}
//               <button className="btn">Close</button>
//             </form>
//           </div>
//         </div>
//       </dialog>
//     </div>
//   );
// }



import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

// export default function EditForm({
//   id,
//   name,
//   order,
// }: {
//   id: number;
//   name?: string;
//   order?: number;
// }) {
//   let [isOpen, setIsOpen] = useState(false);

//   function closeModal() {
//     setIsOpen(false);
//   }

//   function openModal() {
//     setIsOpen(true);
//   }

//   return (
//     <>
//       <div className=" inset-0 flex items-center justify-center">
//         <button
//           type="button"
//           onClick={openModal}
//           className="btn btn-sm btn-ghost btn-circle opacity-70"
//         >
//           <MdEdit />
//         </button>
//       </div>

//       <Transition appear show={isOpen} as={Fragment}>
//         <Dialog as="div" className="relative z-10" onClose={closeModal}>
         

//           <div className="fixed inset-0 overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center p-4 text-center">
//               <Transition.Child
//                 as={Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 scale-95"
//                 enterTo="opacity-100 scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 scale-100"
//                 leaveTo="opacity-0 scale-95"
//               >
//                 <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
//                   <Dialog.Title
//                     as="h3"
//                     className="text-lg font-medium leading-6 text-gray-900"
//                   >
//                     Edit form
//                   </Dialog.Title>
//                   <div className="mt-2">
//                     <form action={editIndex}>
//                       <div className="flex flex-col">
//                         <input type="hidden" name="id1" value={id} />

//                         <label htmlFor="index1">Name</label>
//                         <input
//                           type="text"
//                           id="index1"
//                           name="index1"
//                           defaultValue={name}
//                           required
//                           className="input w-full input-bordered"
//                         />
//                         {/* ... */}
//                         <p aria-live="polite" className="text-error text-xs">
//                           {/* {state?.errors.index} */}
//                         </p>
//                         <label htmlFor="order1">Order</label>
//                         <input
//                           type="number"
//                           id="order1"
//                           name="order1"
//                           defaultValue={order}
//                           required
//                           className="input w-full input-bordered"
//                         />
//                         {/* ... */}
//                         <p aria-live="polite" className="text-error text-xs">
//                           {/* {state?.errors.order} */}
//                         </p>
//                         <SubmitButton />
//                       </div>
//                     </form>
//                   </div>

//                   <div className="mt-4">
//                     <button
//                       type="button"
//                       className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
//                       onClick={closeModal}
//                     >
//                       Got it, thanks!
//                     </button>
//                   </div>
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>
//     </>
//   );
// }

// EditForm.jsx



export default function EditForm({ id, name, order }:{id:number,name:string,order:number})  {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

 

  return (
    <>
      <button className="btn btn-sm btn-ghost btn-circle opacity-70" onClick={openModal}>
        <MdEdit />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative z-50 bg-white p-6 rounded-lg">
            <button className="absolute top-0 right-0 p-4" onClick={closeModal}>
              &times;
            </button>
            <form action={editIndex} >
              <input type="hidden" name="id" value={id} />

              <label htmlFor="index">Name</label>
              <input
                type="text"
                id="index"
                name="index"
                defaultValue={name}
                required
                className="input w-full input-bordered mb-4"
              />

              <label htmlFor="order">Order</label>
              <input
                type="number"
                id="order"
                name="order"
                defaultValue={order}
                required
                className="input w-full input-bordered mb-4"
              />

              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};


