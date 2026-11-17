import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn utility', () => {
  it('merges class names correctly', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
  })

  it('handles conditional class names', () => {
    const isActive = true
    const isHidden = false
    expect(cn('base', isActive && 'is-active', isHidden && 'is-hidden')).toBe('base is-active')
  })

  it('resolves conflicting tailwind classes with precedence to the last', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('handles empty inputs and undefined/null', () => {
    expect(cn()).toBe('')
    expect(cn(undefined, null, false)).toBe('')
  })
})
