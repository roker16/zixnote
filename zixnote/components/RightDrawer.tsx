"use client";
import { User } from "@supabase/supabase-js";
import React from "react";
import Avatar from "./Avatar";
import { FaMotorcycle } from "react-icons/fa";
import GoogleSignin from "./GoogleSignin";
import MyDropdown from "./Mydropdown";

const RightDrawer = ({ user }: { user: User | null }) => (
  <div className="drawer drawer-end rounded-full p-0 ">
  
    <input id="my-drawer-4" type="checkbox" className="drawer-toggle " />
    <div className="drawer-content">
      {/* Page content here */}
      <label
        htmlFor="my-drawer-4"
        className="drawer-button btn btn-circle p-0"
      >
        <Avatar avatar_url={user?.user_metadata.avatar_url} />
        {/* <FaMotorcycle/> */}
        {/* <img className="btn btn-circle " src={user?.user_metadata.avatar_url} /> */}
      </label>
    </div>

    <div className="drawer-side">
      <label
        htmlFor="my-drawer-4"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <ul className="menu p-4 w-80 min-h-full bg-base-200 ">
        {/* Sidebar content here */}
        <li>
          <h2 className="menu-title">Title</h2>
          <ul>
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </li>
        <li>
          <h2 className="menu-title">Title</h2>
          <ul>
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </li>
      </ul>
      <MyDropdown />
    </div>
  </div>
);

export default RightDrawer;
