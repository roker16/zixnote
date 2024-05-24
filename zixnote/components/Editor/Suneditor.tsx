"use client";
import { createClient } from "@/utils/supabase/client";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import { options } from "./options";

import { Group, Radio } from "@mantine/core";
import {
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-swr";
import "katex/dist/katex.min.css"; // import here not in suneditor file
import styled from "styled-components";

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
  canEdit = true,
}: {
  notesId: number;
  notesContent: string | undefined | null;
  canEdit?: boolean;
}) {
  const [id, setId] = useState<number | undefined>(notesId);
  useEffect(() => {
    setId(notesId);
  }, [notesId]);

  const searchParams = useSearchParams();
  const headingId = searchParams.get("headingid");
  const supabase = createClient();

  const [value, setValue] = useState("read");

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
      {canEdit && (
        <Radio.Group
          value={value}
          onChange={setValue}
          py={"xs"}

          // defaultValue="read"
          // name="favoriteFramework"
        >
          <Group px={6}>
            <Radio
              value="read"
              label="Read"
              size="xs"
              variant="outline"
              color="green"
            />
            <Radio
              value="edit"
              label="Edit"
              size="xs"
              variant="outline"
              color="red"
            />
          </Group>
        </Radio.Group>
      )}

      <EditorStyle title={value}>
        {/* {notesContent} */}
        <SunEditor
          // width="auto"
          // setContents={notesContent || "hello"}
          defaultValue={notesContent || "<p>No content available for this language, Start writing...<p/>"}
          setOptions={{
            ...options,
            callBackSave: (contents) => {
              onSubmitHandler(contents);
            },
          }}
          hideToolbar={value !== "edit"}
          setDefaultStyle="font-family: arial; font-size: 16px;"
          disable={false}
          readOnly={value !== "edit"}
        />
      </EditorStyle>
    </div>
  );
}
export default SunEditorTest;
