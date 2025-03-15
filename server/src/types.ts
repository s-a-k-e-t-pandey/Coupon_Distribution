import { z } from 'zod';

export const AdminSignIn = z.object({
    email: z.string().email(),
    password: z.string()
});

export interface AdminJwtPayload {
    id: number;
    email: string;
}

export type AdminSignIn = z.infer<typeof AdminSignIn>