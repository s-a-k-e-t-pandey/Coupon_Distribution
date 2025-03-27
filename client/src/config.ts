export const BACKEND_URL="http://localhost:3000"

export function extractNameFromEmail(email: string): string | null {
    const regex = /[A-Za-z]+(?=\d*@)/;
    const match = email.match(regex);
    return match ? match[0] : null;
}