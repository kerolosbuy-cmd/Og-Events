import settings from "@/config/settings.json";

export const authorizedAdmins = settings.admin.authorizedAdmins;

export function isAuthorizedAdmin(email?: string): boolean {
  return authorizedAdmins.length > 0 && authorizedAdmins.includes(email || "");
}
