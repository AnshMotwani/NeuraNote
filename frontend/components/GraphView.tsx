'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { api } from '@/lib/api'
import { toast } from 'react-hot-toast'

interface Note {
  id: number
  title: string
  content?: string
  created_at: string
  updated_at?: string
  tags: any[]
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: number
  title: string
  group: number
}

interface GraphLink {
  source: number
  target: number
}

export default function GraphView() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchNotes()
  }, [])

  useEffect(() => {
    if (notes.length > 0 && svgRef.current) {
      renderGraph()
    }
  }, [notes])

  const fetchNotes = async () => {
    try {
      const response = await api.get('/notes/')
      setNotes(response.data)
    } catch (error) {
      toast.error('Failed to fetch notes for graph')
    } finally {
      setIsLoading(false)
    }
  }

  const renderGraph = () => {
    if (!svgRef.current) return

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove()

    // Create nodes from notes
    const nodes: GraphNode[] = notes.map((note, index) => ({
      id: note.id,
      title: note.title,
      group: index % 3, // Simple grouping for colors
    }))

    // Create links based on content analysis (simplified)
    const links: GraphLink[] = []
    notes.forEach((note, i) => {
      notes.slice(i + 1).forEach((otherNote, j) => {
        // Simple similarity check (in real app, use more sophisticated analysis)
        const similarity = calculateSimilarity(note, otherNote)
        if (similarity > 0.3) {
          links.push({
            source: note.id,
            target: otherNote.id,
          })
        }
      })
    })

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    // Create simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50))

    // Create SVG
    const svg = d3.select(svgRef.current)
    const g = svg.append('g')

    // Create links
    const link = g
      .append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)

    // Create nodes
    const node = g
      .append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .call(d3.drag<any, GraphNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))

    // Add circles to nodes
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
    node
      .append('circle')
      .attr('r', 20)
      .attr('fill', (d) => colors[d.group % colors.length])
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

    // Add labels to nodes
    node
      .append('text')
      .text((d) => d.title.length > 10 ? d.title.substring(0, 10) + '...' : d.title)
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('fill', '#fff')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
    })

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: any, d: any) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }
  }

  const calculateSimilarity = (note1: Note, note2: Note): number => {
    // Simple similarity calculation based on common words
    const words1 = (note1.title + ' ' + (note1.content || '')).toLowerCase().split(/\s+/)
    const words2 = (note2.title + ' ' + (note2.content || '')).toLowerCase().split(/\s+/)
    
    const commonWords = words1.filter(word => words2.includes(word))
    const totalWords = new Set([...words1, ...words2]).size
    
    return totalWords > 0 ? commonWords.length / totalWords : 0
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ background: 'hsl(var(--background))' }}
      />
    </div>
  )
} 