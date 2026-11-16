// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { EditorPage } from './Editor'

describe('EditorPage', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/editor/5baa3f4f']}>
        <Routes>
          <Route path="/editor/:roomId" element={<EditorPage />} />
        </Routes>
      </MemoryRouter>
    )
    expect(container).toBeDefined()
  })
})
