"use server";

import { getDbConnection } from "@/app/action";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromAI } from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface PdfSummaryType {
  userId?: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}

export async function generatePdfSummary(uploadResponse: {
  userId: string;
  file: { ufsUrl: string; name: string };
}) {
  if (!uploadResponse) {
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }

  const {
    userId,
    file: { ufsUrl, name },
  } = uploadResponse;

  if (!ufsUrl) {
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }

  try {
    const pdfText = await fetchAndExtractPdfText(ufsUrl);

    let summary;
    try {
      summary = await generateSummaryFromAI(pdfText);
      console.log(summary);
    } catch (error) {
      //call gemini
      console.log(error);
    }

    if (!summary) {
      return {
        success: false,
        message: "Filed to generate summary",
        data: null,
      };
    }

    return {
      success: true,
      message: "File uploaded successfully",
      data: { summary },
    };
  } catch (error) {
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }
}

async function savePdfSummary({
  userId,
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryType) {
  // sql inserting pdf summary
  try {
    const sql = await getDbConnection();
    console.log("Connecting to DB", sql);
    await sql`INSERT INTO pdf_summaries (user_id, original_file_url, summary_text, title, file_name) VALUES (${userId}, ${fileUrl}, ${summary}, ${title}, ${fileName});`;
  } catch (error) {
    console.log("Error saving PDF summary");
    throw error;
  }
}

export async function storePdfSummaryAction({
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryType) {
  // user is logged in and has a userId
  // savePdfSummary function
  // savePdfSummary(userId, summary)

  let savedSummary: any;
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const data = {
      userId,
      fileUrl,
      summary,
      title,
      fileName,
    };
    savedSummary = await savePdfSummary(data);

    if (!savedSummary) {
      return {
        success: false,
        message: "Failed to save PDF summary, please try again...",
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error saving PDF summary",
    };
  }

  // revalidate our cache
  revalidatePath(`/summaries/${savedSummary.id}`);

  return {
    success: true,
    message: "PDF summary saved successfully",
    data: {
      id: savedSummary.id,
    },
  };
}
