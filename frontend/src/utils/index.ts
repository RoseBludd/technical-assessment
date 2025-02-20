// Utility functions, index file for all shared utility functions unless 
// they are specific to only one component

// Formats timestamp to a human-readable time string
export const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    })
}