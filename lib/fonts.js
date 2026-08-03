import { Oswald, Karla } from 'next/font/google'

/**
 * next/font downloads and self-hosts these at build time — no runtime request to
 * Google, no third-party connection on a Lebanese mobile connection.
 */

export const display = Oswald({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-display',
  display: 'swap',
})

export const body = Karla({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body',
  display: 'swap',
})
