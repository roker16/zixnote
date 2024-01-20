"use client";

import { useFormState } from "react-dom";
import createUser from "./action";
import { SubmitButton } from "./submit-button";

const initialState = {
  message: "",
};

export default function Signup() {
  const [state, formAction] = useFormState(createUser, initialState);

  return (

      <form action={formAction}>
        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            required
            className="input w-full input-bordered"
          />
          {/* ... */}
          <p aria-live="polite" className="text-error text-xs">
            {state?.message}
          </p>
          <SubmitButton />
        </div>
      </form>
 
  );
}
