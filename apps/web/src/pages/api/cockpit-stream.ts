import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  // Deprecated pages-router SSE endpoint: please use App Router at `/api/cockpit/stream`.
  res.status(410).json({
    error: 'Deprecated - use /api/cockpit/stream (App Router)',
  })
}
