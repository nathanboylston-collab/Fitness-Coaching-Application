import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function getOwnedCheckIn(coachId: string, checkInId: string) {
  const checkIn = await prisma.checkIn.findFirst({
    where: { id: checkInId, client: { coachId } },
    include: {
      client: true,
      responses: { orderBy: { order: "asc" } },
    },
  });

  if (!checkIn) {
    notFound();
  }

  return checkIn;
}
