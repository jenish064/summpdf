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
    console.log("Error deleting summary", error);
    return { success: false };
  }
}
