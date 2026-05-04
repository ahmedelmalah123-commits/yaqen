/**
 * src/utils/cn.js
 * Tailwind class merging utility (lightweight clsx + twMerge)
 * 
 * Install: npm install clsx tailwind-merge
 */

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
