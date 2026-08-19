import { useState } from 'react'

export function useDragReorder(onReorder: (from: number, to: number) => void) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    // Firefox requires setData to start a drag.
    e.dataTransfer.setData('text/plain', String(index))
  }

  const handleDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault() // required to allow drop
    e.dataTransfer.dropEffect = 'move'
    if (index !== overIndex) setOverIndex(index)
  }

  const handleDrop = (index: number) => (e: React.DragEvent) => {
    e.preventDefault()
    if (dragIndex !== null && dragIndex !== index) onReorder(dragIndex, index)
    setDragIndex(null)
    setOverIndex(null)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
    setOverIndex(null)
  }

  return { dragIndex, overIndex, handleDragStart, handleDragOver, handleDrop, handleDragEnd }
}
