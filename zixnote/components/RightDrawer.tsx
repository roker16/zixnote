"use client"
import { User } from "@supabase/supabase-js";
import React from "react";
import Avatar from "./Avatar";

const RightDrawer = ({ user }: { user: User | null }) => {
  return (
    <div className="drawer drawer-end rounded-full p-0 text-center">
      <input
        id="my-drawer-4"
        type="checkbox"
        className="drawer-toggle bg-yellow-500"
      />
      <div className="drawer-content">
        {/* Page content here */}
        <label htmlFor="my-drawer-4" className=" btn btn-xs btn-circle ">
          <Avatar avatar_url={user?.user_metadata.avatar_url} />
        </label>
        
      </div>
      
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
          <li>
            <a>Sidebar Item 1</a>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
          <li>
            <Avatar avatar_url={user?.user_metadata.picture} />
          </li>
        </ul>
      </div>
      
    </div>
  );
};

export default RightDrawer;
