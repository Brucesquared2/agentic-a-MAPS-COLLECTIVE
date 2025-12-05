import { NextRequest } from 'next/server'
import { ensureWatcher } from '@/lib/watchCockpit'
import { ensureRecommendationWatcher, subscribeSuggestions } from '@/lib/recommendationEngine'
import { subscribeAssignments, getActiveAssignments } from '@/lib/sseBus'
import path from 'path'

export async function GET(req: NextRequest) {
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()

  ensureWatcher()
  ensureRecommendationWatcher()

  const send = async (event: string, data: any) => {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
    await writer.ready
    await writer.write(new TextEncoder().encode(payload))
  }

  // subscribe to diagram updates
  // import dynamically to avoid circular / SSR issues
  const { subscribe } = await import('@/lib/watchCockpit')
  const unsubDiagram = subscribe(({ mermaid }) => send('diagram', { mermaid }))

  // subscribe to suggestions
  const unsubSuggest = subscribeSuggestions((s) => send('suggestion', s))

  // subscribe to assignments
  const unsubAssign = subscribeAssignments((a) => {
    send('assignment', a)

    // rebuild mermaid diagram with active assignments using the root mermaid generator
    try {
      const mgPath = path.resolve(process.cwd(), 'lib', 'mermaidGenerator')
      // dynamic import of root lib
      import(mgPath).then((mod) => {
        try {
          const mermaid = mod.generateMermaid(getActiveAssignments())
          send('diagram', { mermaid })
        } catch (e) {}
      }).catch(() => {})
    } catch (e) {}
  })

  // keepalive
  const keep = setInterval(() => {
    writer.write(new TextEncoder().encode(': ping\n\n'))
  }, 15000)

  // close handling
  req.signal.addEventListener('abort', () => {
    clearInterval(keep)
    unsubDiagram()
    unsubSuggest()
    unsubAssign()
    try { writer.close() } catch (e) {}
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
