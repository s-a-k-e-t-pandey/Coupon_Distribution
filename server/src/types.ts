import { z } from 'zod';


export const AdminSignIn = z.object({
    email: z.string().email(),
    password: z.string().min(6),
}) 

export type AdminSignIn = z.infer<typeof AdminSignIn>