import { z } from 'zod'

export const nicknameSchema = z.object({
  nickname: z.preprocess((value) => {
    if (typeof value !== 'string') return value
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
  }, z.string().min(1, 'Nickname must be at least 1 character').max(100, 'Nickname must be 100 characters or less').nullable()),
})

export type NicknameForm = z.infer<typeof nicknameSchema>
