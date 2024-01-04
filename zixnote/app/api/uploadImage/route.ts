import { NextApiRequest, NextApiResponse } from "next";
import * as formidable from "formidable";
import { Files } from "formidable";
import { v4 as uuid } from "uuid";
// import error from "next/error";
// import { supabase } from "../../lib/supabaseClient";
// import { useUser } from "@supabase/auth-helpers-react";
import fs from "fs";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// import { supabaseServerClient } from "../../lib/supabaseClient";
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(
  req: Request,
  res: NextApiResponse
  //   file: string
) {
  // const supabase = await supabaseServerClient({ req })

  // let error1 = null;
  // let publicurl = null;
  // let name = null;

  // const { user } = await supabaseClient.auth.api.getUserByCookie(req);
  // if (user == null) {
  //   console.log("not user");
  // } else {
  //   console.log("user hai" + user);
  // }
  const formData = await req.formData();
  const file = formData.get("file-0");
  if (file instanceof File) {
    console.log("madarchod");
  } else {
    console.log("bahinchod");
  }
  const supabase = createClient(cookies());
  const { data, error } = await supabase.storage
    .from("suneditor")
    .upload("public/avatar1", file!, {
      cacheControl: "3600",
      upsert: false,
    });
  if (data) {
    const { data } = await supabase.storage
      .from("suneditor")
      .getPublicUrl("public/avatar1");
    console.log("public url is ", data.publicUrl);

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
  console.log("form data", typeof file);

  console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
  const form = new formidable.IncomingForm({ keepExtensions: true });
  console.log("kkkkkkkkkkkkkkkkkkkk", JSON.stringify(form));

  
  return res.status(405).json({ message: "Method not allowed." });
}
