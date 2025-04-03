import type React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
        Home
      </Link>
      <Link href="/courts" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Courts
      </Link>
      <Link href="/bookings" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Bookings
      </Link>
      <Link href="/pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Pricing
      </Link>
      <Link href="/settings" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Settings
      </Link>
    </nav>
  )
}

