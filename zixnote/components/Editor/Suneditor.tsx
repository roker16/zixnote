"use client";
import React, {
  FormEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import { options } from "./options";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";

import "katex/dist/katex.min.css"; // import here not in suneditor file
import {
  useInsertMutation,
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-swr";
import styled from "styled-components";
import { Button, Group, Radio, SegmentedControl } from "@mantine/core";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

export const EditorStyle = styled.div`
  .sun-editor {
    border: ${(props) => (props.title === "edit" ? undefined : "none")};
  }
`;
function SunEditorTest({
  notesId,
  notesContent,
 
}: {
  notesId: number;
  notesContent: string | undefined | null;

}) {
  const [id, setId] = useState<number | undefined>(notesId);
  useEffect(() => {
    setId(notesId);
  }, [notesId]);

  const searchParams = useSearchParams();
  const headingId = searchParams.get("headingid");
  const supabase = createClient();

  const [value, setValue] = useState("read");
  const { data, count } = useQuery(
    id
      ? supabase.from("notes").select("id,notes_english").eq("id", id).single()
      : null,

    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // const updateArticleInDatabase = async (newcontent: string | undefined) => {
  // const { data, error } = await supabase
  //   .from("notes")
  //   .update(
  //     language === "ENGLISH"
  //       ? { notes_english: newcontent }
  //       : { notes_hindi: newcontent }
  //   )
  //   .eq("id", 7);
  const { trigger: update } = useUpdateMutation(
    supabase.from("notes"),
    ["id"],
    null,
    {
      onSuccess: () => console.log("Success!"),
      onError: (e) => console.log("error", e),
    }
  );

  const onSubmitHandler = async (e: string) =>
    await update({
      id: notesId,
      notes_english: e,
      // // order: 1,
      // owner_fk: "44ea6393-ec00-4a4e-bec5-144eb86f8ed7",
      // index_id_fk: Number(headingId),
    });
  return (
    <div>
      <Radio.Group
        value={value}
        onChange={setValue}
        py={"xs"}

        // defaultValue="read"
        // name="favoriteFramework"
      >
        <Group mt="xs">
          <Radio value="read" label="Read" />
          <Radio value="edit" label="Edit" />
        </Group>
      </Radio.Group>

      <EditorStyle title={value}>
        {/* {notesContent} */}
        <SunEditor
          // width="auto"
          // setContents={notesContent || "hello"}
          defaultValue={notesContent || "Hello"}
          setOptions={{
            ...options,
            callBackSave: (contents) => {
              onSubmitHandler(contents);
            },
          }}
          hideToolbar={value !== "edit"}
          setDefaultStyle="font-family: arial; font-size: 12px;"
          disable={false}
          readOnly={value !== "edit"}
        />
      </EditorStyle>
    </div>
  );
}
export default SunEditorTest;
