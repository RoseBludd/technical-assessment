"use client"

import { StatusUpdate } from "@/api/mock-data"
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface StatusUpdatesProps {
  updates: StatusUpdate[]
}

const StatusIcon = ({ status }: { status: StatusUpdate["status"] }) => {
  switch (status) {
    case "healthy":
      return <CheckCircle className="h-6 w-6 text-green-500" />
    case "warning":
      return <AlertTriangle className="h-6 w-6 text-yellow-500" />
    case "error":
      return <XCircle className="h-6 w-6 text-red-500" />
  }
}

const StatusUpdates: React.FC<StatusUpdatesProps> = ({ updates }) => {
  return (
    <div className="space-y-4">
      {updates.map((update) => (
        <div
          key={update.id}
          className="flex items-start gap-4 p-4 rounded-lg bg-card-secondary border transition-colors hover:bg-card-secondary/80"
        >
          <StatusIcon status={update.status} />
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="font-medium text-foreground truncate">
                {update.message}
              </p>
              <p className="text-sm text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(update.timestamp), { addSuffix: true })}
              </p>
            </div>
            
            <div className="mt-1">
              <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize">
                {update.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatusUpdates

