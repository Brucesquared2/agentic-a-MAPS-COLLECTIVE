"use client"

import React, { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"

export default function CockpitDiagram() {
  const [diagram, setDiagram] = useState<string>("")
  const [assignments, setAssignments] = useState<any[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let mounted = true

    function renderMermaid(text: string) {
      try {
        mermaid.initialize({ startOnLoad: false })
        mermaid.render("cockpitDiagram", text, (svgCode) => {
          if (containerRef.current) containerRef.current.innerHTML = svgCode
        })
      } catch (err) {
        if (containerRef.current) containerRef.current.textContent = text
      }
    }

    const es = new EventSource("/api/cockpit/stream")
    es.addEventListener("diagram", (evt: MessageEvent) => {
      try {
        const payload = JSON.parse(evt.data) as { mermaid: string }
        if (!mounted) return
        setDiagram(payload.mermaid)
        renderMermaid(payload.mermaid)
      } catch (e) {
        console.error("Failed to parse diagram event:", e)
      }
    })

    es.addEventListener('suggestion', (evt: MessageEvent) => {
      try {
        const s = JSON.parse(evt.data) as { id: string; timestamp: string; agent: string; notes: string }
        // simple UI: prepend suggestion note to the container
        const el = document.createElement('div')
        el.className = 'cockpit-suggestion'
        el.textContent = `⚡ ${s.agent}: ${s.notes}`
        if (containerRef.current) containerRef.current.prepend(el)
      } catch (e) {
        console.error('Failed to parse suggestion event', e)
      }
    })

    es.addEventListener('assignment', (evt: MessageEvent) => {
      try {
        const a = JSON.parse(evt.data) as { timestamp: string; agent: string; action: string; notes: string }
        const el = document.createElement('div')
        el.className = 'cockpit-assignment'
        el.textContent = `📌 ${a.agent}: ${a.notes}`
        if (containerRef.current) containerRef.current.prepend(el)
        setAssignments((prev) => [a, ...prev].slice(0, 50))
      } catch (e) {
        console.error('Failed to parse assignment event', e)
      }
    })

    es.onerror = (err) => {
      console.warn("SSE error; will reconnect automatically.", err)
    }

    return () => {
      mounted = false
      es.close()
    }
  }, [])

  return (
    <div>
      <h2>🧭 Collective Cockpit Map</h2>
      <div ref={containerRef} className="mermaid">
        {!diagram && <p>Loading cockpit diagram...</p>}
      </div>
    </div>
  )
}
