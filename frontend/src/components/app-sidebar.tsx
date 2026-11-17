import type * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"
import { SidebarOptInForm } from "./sidebar-opt-in-form"
import { AnimatedTooltipPreview, type TooltipMember } from "./animated-tooltip-demo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({
  roomId,
  members = [],
  onLeaveRoom,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  roomId?: string
  members?: TooltipMember[]
  onLeaveRoom?: () => void
}) {
  return (
    <Sidebar className="border-r border-zinc-800 bg-[#09090b] text-white" {...props}>
      <SidebarHeader className="border-b border-zinc-800/80 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-zinc-800/60">
              <a href="#" className="flex items-center gap-3">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white text-black font-bold">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-white tracking-tight">&lt;CodeSync/&gt;</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <div className="p-4">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">Team Members</h3>
          <AnimatedTooltipPreview members={members} />
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t border-zinc-800/80 p-2">
        <SidebarOptInForm roomId={roomId} onLeaveRoom={onLeaveRoom} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
