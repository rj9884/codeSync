import { AnimatedTooltip } from "@/components/ui/animated-tooltip"

const profileImages = [
  "https://plus.unsplash.com/premium_photo-1731327688406-51dbb887c658?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1732757787135-ce2ad37bb72c?q=80&w=1354&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1722696650716-6ba24ffadce0?q=80&w=1347&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1731681926154-9fb4a306fe5a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
]

export interface TooltipMember {
  id?: number | string
  name: string
  avatarId?: number
  image?: string
}

export function AnimatedTooltipPreview({
  members = [],
}: {
  members?: TooltipMember[]
}) {
  const formattedMembers = members.map((member, index) => ({
    id: typeof member.id === "number" ? member.id : index + 1,
    name: member.name,
    image:
      member.image ||
      profileImages[
        (member.avatarId ? member.avatarId - 1 : index) % profileImages.length
      ],
  }))

  if (formattedMembers.length === 0) {
    return <div className="text-sm text-muted-foreground text-center">No team members yet</div>
  }

  return (
    <div className="flex flex-row items-center justify-center mb-10 w-full">
      <AnimatedTooltip items={formattedMembers} />
    </div>
  )
}

export default AnimatedTooltipPreview
