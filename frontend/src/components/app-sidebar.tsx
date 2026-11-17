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
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">&lt;CodeSync/&gt;</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <div className="p-4">
          <h3 className="mb-4 text-sm font-medium">Team Members</h3>
          <AnimatedTooltipPreview members={members} />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-1">
          <SidebarOptInForm roomId={roomId} onLeaveRoom={onLeaveRoom} />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
