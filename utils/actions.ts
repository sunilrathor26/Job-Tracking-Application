"use server";

import { auth } from "@clerk/nextjs/server";
import {
  JobType,
  CreateAndEditJobType,
  createAndEditJobSchema,
  JobStatus,
} from "./types";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient();

async function authenticateAndRedirect(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }
  return userId;
}

export async function createJobAction(
  values: CreateAndEditJobType
): Promise<JobType | null> {
  const userId = await authenticateAndRedirect();
  try {
    createAndEditJobSchema.parse(values);
    const job: JobType = await prisma.job.create({
      data: {
        ...values,
        clerkId: userId,
      },
    });
    return job;
  } catch (error) {
    console.error("Error creating job:", error);
    return null;
  }
}

type GetAllJobsActionTypes = {
  search?: string;
  jobStatus?: string;
  page?: number;
  limit?: number;
};

// export async function getAllJobsAction({
//   search,
//   jobStatus,
//   page = 1,
//   limit = 10,
// }: GetAllJobsActionTypes): Promise<{
//   jobs: JobType[];
//   count: number;
//   page: number;
//   totalPages: number;
// }> {
//   const userId = await authenticateAndRedirect();
//   try {
//     let whereClause: Prisma.JobWhereInput = {
//       clerkId: userId,
//     };
//     if (search) {
//       whereClause = {
//         ...whereClause,
//         OR: [
//           {
//             position: {
//               contains: search,
//             },
//           },
//           {
//             company: {
//               contains: search,
//             },
//           },
//           {
//             location: {
//               contains: search,
//             },
//           },
//         ],
//       };
//     }
//     if (jobStatus && jobStatus !== "all") {
//       whereClause = {
//         ...whereClause,
//         status: jobStatus,
//       };
//     }

//     const skip = (page - 1) * limit;

//     const jobs: JobType[] = await prisma.job.findMany({
//       where: whereClause,
//       skip,
//       take: limit,
//       orderBy: {
//         createdAt: "desc",
//       },
//     });
//     const count: number = await prisma.job.count({
//       where: whereClause,
//     });
//     const totalPages = Math.ceil(count / limit);
//     return { jobs, count, page, totalPages };
//   } catch (error) {
//     console.error("Error fetching jobs:", error);
//     return { jobs: [], count: 0, page: 1, totalPages: 0 };
//   }
// }

export async function getAllJobsAction({
  search,
  jobStatus,
  page = 1,
  limit = 10,
}: GetAllJobsActionTypes): Promise<{
  jobs: JobType[];
  count: number;
  page: number;
  totalPages: number;
}> {
  const userId = await authenticateAndRedirect();
  try {
    // Use a plain object for the where clause
    const whereClause: any = {
      clerkId: userId,
      ...(search && {
        OR: [
          { position: { contains: search } },
          { company: { contains: search } },
          { location: { contains: search } },
        ],
      }),
      ...(jobStatus && jobStatus !== "all" && { status: jobStatus }),
    };

    const skip = (page - 1) * limit;

    const jobs: JobType[] = await prisma.job.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    const count: number = await prisma.job.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(count / limit);

    return { jobs, count, page, totalPages };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return { jobs: [], count: 0, page: 1, totalPages: 0 };
  }
}

export async function deleteJobAction(id: string) {
  const userId = await authenticateAndRedirect();
  try {
    const job: JobType | null = await prisma.job.delete({
      where: {
        id,
        clerkId: userId,
      },
    });
    return job;
  } catch (error) {
    return null;
  }
}

export async function getSingleJobAction(id: string): Promise<JobType | null> {
  let job: JobType | null = null;
  const userId = await authenticateAndRedirect();

  try {
    job = await prisma.job.findUnique({
      where: {
        id,
        clerkId: userId,
      },
    });
  } catch (error) {
    job = null;
  }
  if (!job) {
    redirect("/jobs");
  }
  return job;
}

export async function updateJobAction(
  id: string,
  values: CreateAndEditJobType
): Promise<JobType | null> {
  const userId = await authenticateAndRedirect();

  try {
    const job: JobType = await prisma.job.update({
      where: {
        id,
        clerkId: userId,
      },
      data: {
        ...values,
      },
    });
    return job;
  } catch (error) {
    return null;
  }
}

export async function getStatsAction(): Promise<{
  pending: number;
  interview: number;
  declined: number;
}> {
  const userId = await authenticateAndRedirect();
  // just to show Skeleton
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  try {
    const stats = await prisma.job.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
      where: {
        clerkId: userId, // replace userId with the actual clerkId
      },
    });
    const statsObject = stats.reduce((acc: Record<string, number>, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {} as Record<string, number>);

    const defaultStats = {
      pending: 0,
      declined: 0,
      interview: 0,
      ...statsObject,
    };
    return defaultStats;
  } catch (error) {
    redirect("/jobs");
  }
}

export async function getChartsDataAction(): Promise<
  Array<{ date: string; count: number }>
> {
  const userId = await authenticateAndRedirect();
  const sixMonthsAgo = dayjs().subtract(1, "year").toDate();
  try {
    const jobs = await prisma.job.findMany({
      where: {
        clerkId: userId,
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    const applicationsPerMonth = jobs.reduce((acc: {
      date: string;
      count: number;
  }[], job) => {
      const date = dayjs(job.createdAt).format("MMM YY");

      const existingEntry = acc.find((entry) => entry.date === date);

      if (existingEntry) {
        existingEntry.count += 1;
      } else {
        acc.push({ date, count: 1 });
      }

      return acc;
    }, [] as Array<{ date: string; count: number }>);

    return applicationsPerMonth;
  } catch (error) {
    redirect("/jobs");
  }
}
