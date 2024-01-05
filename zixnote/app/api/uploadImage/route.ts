import { createClient } from "@/utils/supabase/server";
import { NextApiResponse } from "next";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(
  req: Request,
  res: NextApiResponse
  //   file: string
) {
  const formData = await req.formData();
  // Convert the iterable to an array

  const { file, fileName } = getFileDetail(formData);
  if (!file || !fileName) {
    return NextResponse.json(
      { message: "File not found" },
      {
        status: 405,
      }
    );
  }
  const supabase = createClient(cookies());

  const fileNameTobeUploaded = generateUniqueFileName(fileName);
  const { data, error } = await supabase.storage
    .from("suneditor")
    .upload(`public/${fileNameTobeUploaded}`, file, {
      cacheControl: "3600",
      upsert: false,
    });
  if (data) {
    const { data } = await supabase.storage
      .from("suneditor")
      .getPublicUrl(`public/${fileNameTobeUploaded}`);
    return NextResponse.json(
      {
        errorMessage: error,
        result: [
          {
            url: data.publicUrl,
            name: "name",
            // size: "561276",
          },
        ],
      },
      {
        status: 200,
      }
    );
  }
  return res.status(405).json({ message: "Method not allowed." });
}

function getFileDetail(formData: FormData) {
  const entriesArray = Array.from(formData.entries());
  // Iterate over the array
  let fileName, file;
  for (const [name, value] of entriesArray) {
    // Check if the value is a File object
    if (value instanceof File) {
      file = value;
      fileName = value.name;
      // You can break the loop if you only need the first file
      break;
    }
  }
  return { file, fileName };
}

function generateUniqueFileName(originalFileName: string) {
  const newUuid = uuid();
  const fileNameWithoutExtension =
    originalFileName.slice(0, originalFileName.lastIndexOf(".")) ||
    originalFileName;
  const lowercaseFileNameWithoutSpace = `${fileNameWithoutExtension
    .replace(/\s+/g, "-")
    .toLowerCase()}-${newUuid}`;
  return lowercaseFileNameWithoutSpace;
}
