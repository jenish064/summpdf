"use client";

import { toast } from "sonner";
// import { z } from "zod";
import UploadFormInput from "./UploadFormInput";
import { ClientUploadedFileData } from "uploadthing/types";
import {
  generatePdfSummary,
  storePdfSummaryAction,
} from "../../actions/upload-action";
import { useRouter } from "next/navigation";
// import { any } from "zod";

// const schema = z.object({
//   file: z
//     .instanceof(File, { message: "Invalid file" })
//     .refine(
//       (file) => file.size <= 20 * 1024 * 1024,
//       "File size must be less than 20MB"
//     )
//     .refine(
//       (file) => file.type.startsWith("application/pdf"),
//       "File type must be pdf"
//     ),
// });

function UploadForm() {
  const router = useRouter();

  const handleSubmit = async (response: ClientUploadedFileData<any>[]) => {
    // upload the file to 'uploadthing' service
    if (!response) {
      toast.error("Something went wrong");
      return;
    }
    toast.info("Hang tight! Our AI is analyzing your document");

    // parse the PDF using 'langchain' & summarize the pdf using AI
    const serverData = response?.[0]?.serverData;
    const result = await generatePdfSummary({
      fileUrl: serverData.fileUrl,
      fileName: serverData.name,
    });
    const { data = null, message = null } = result || {};
    // save summary to database
    if (data) {
      let storeResult: any;

      toast.success("Hang tight! We are saving your summary!");
      if (data.summary) {
        const payload = {
          summary: data.summary,
          fileUrl: serverData.fileUrl,
          title: serverData.name,
          fileName: `summarized_${serverData.name?.trim()}`,
        };
        storeResult = await storePdfSummaryAction(payload);
        toast.success("Your PDF has been successfully summarized and saved");
        // redirect to the [id] summary page
        router.push(`/summaries/${storeResult.data.id}`);
      }
    }
  };

  const beforeUpload = (files: File[]) => {
    // validating the file
    // schema with 'zod'
    // if (!files?.length) {
    //   // display toast here
    //   return files;
    // }
    // // for single pdf support
    // const validatedFields = schema.safeParse({ file: files[0] });
    // if (!validatedFields.success) return files;
    return files;
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto py-10">
      <UploadFormInput
        beforeUpload={beforeUpload}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default UploadForm;
