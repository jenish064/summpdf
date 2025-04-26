"use server";

import { getDbConnection } from "@/app/action";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteSummaryAction({
  summaryId,
}: {
  summaryId: string;
}) {
  try {
    const user = await currentUser();
    const userId = user?.id;
    if (!userId) {
      throw new Error("User not found");
    }

    const sql = await getDbConnection();
    const result =
      await sql`DELETE FROM pdf_summaries WHERE id = ${summaryId} AND user_id = ${userId};`;

    if (result?.length >= 0) {
      revalidatePath("/dashboard");
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    return { success: false };
  }
}

export async function getSummaryDetailAction(id: string) {
  try {
    const sql = await getDbConnection();
    const [summary] = await sql`SELECT
      id,
      user_id,
      title,
      original_file_url,
      summary_text,
      status,
      created_at,
      updated_at,
      file_name,
      LENGTH(summary_text) - LENGTH(REPLACE(summary_text, ' ', '')) + 1 as word_count
      FROM pdf_summaries WHERE id = ${id} ORDER BY created_at DESC`;
    return summary;
  } catch (error) {
    return null;
  }
}
