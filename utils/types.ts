import * as z from "zod";

export type JobType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  clerkId: string;
  position: string;
  company: string;
  location: string;
  status: string;
  mode: string;
};

export enum JobStatus {
  Pending = "pending",
  Interview = "interview",
  Declined = "declined",
}

export enum JobMode {
  FullTime = "full-time",
  PartTime = "part-time",
  Internship = "internship",
}

export const createAndEditJobSchema = z.object({
  position: z
    .string()
    .min(3, {
      message: "Position must be at least 3 characters.",
    })
    .max(30, {
      message: "Position must be at most 30 characters.",
    }),
  company: z
    .string()
    .min(3, {
      message: "Company must be at least 3 characters.",
    })
    .max(30, {
      message: "Company must be at most 30 characters.",
    }),
  location: z
    .string()
    .min(3, {
      message: "Location must be at least 3 characters.",
    })
    .max(30, {
      message: "Location must be at most 30 characters.",
    }),
  status: z.nativeEnum(JobStatus),
  mode: z.nativeEnum(JobMode),
});

export type CreateAndEditJobType = z.infer<typeof createAndEditJobSchema>;
