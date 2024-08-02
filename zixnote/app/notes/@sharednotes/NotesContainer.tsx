"use client"
import { User } from "@supabase/supabase-js";
import Notes from "./notes";
import SharedUsersCombobox from "./SharedUsersCombobox";
import { SetStateAction, useState } from "react";
import { MyAlert } from "../@notes/MyAlert";

function NotesContainer({user, selectedTopicId}:{user: User, selectedTopicId: string}) {
  const [selectedUserId, setSelectedUserId] = useState<string>();
  return (
    <>
    {/* {selectedUserId} */}
      <SharedUsersCombobox userId={user.id} onUserSelected={setSelectedUserId} />
      {selectedUserId ? (
        <Notes topicId={selectedTopicId as string} userId={selectedUserId} />
      ) : (
        <MyAlert
          title={"Select User"}
          detail={"Select user to view their shared notes with you"}
        />
      )}
    </>
  );
}
export default NotesContainer;
