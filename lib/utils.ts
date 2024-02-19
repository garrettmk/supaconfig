import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function clamp(min: number, value: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
