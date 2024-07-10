import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function chatHrefConstructor(id: string) {
  const segments = [];

  for (let i = 0; i < id.length; i += 36) {
    segments.push(id.slice(i, i + 36));
  }

  const sortedSegments = segments.sort();

  return sortedSegments.join("--");
}

export function pusherKeyFormatter(key: string) {
  return key.replace(/:/g, "__");
}
