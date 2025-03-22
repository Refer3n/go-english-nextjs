"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Download, Play, AlertCircle } from "lucide-react"
import type { Video } from "@/types/course"

interface VideoPlayerProps {
  video: Video
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const [showTranscript, setShowTranscript] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  const videoUrl = video?.url || ""
  const isUrlValid = isValidUrl(videoUrl)

  const renderVideoPlayer = () => {
    if (!isUrlValid) {
      return (
        <div className="w-full aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
          <p className="text-sm text-gray-500">Invalid video URL</p>
        </div>
      )
    }

    return (
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          src={videoUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onError={() => setVideoError(true)}
        />
      </div>
    )
  }

  const renderFallback = () => (
    <div className="w-full aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center">
      <Play className="h-12 w-12 text-primary opacity-50 mb-2" />
      <p className="text-sm text-gray-500">{videoError ? "Error loading video" : "Video player not available"}</p>
      {videoUrl && (
        <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="mt-2 text-primary hover:underline">
          Open video in new tab
        </a>
      )}
    </div>
  )

  return (
    <div className="mb-6">
      <div className="relative rounded-lg overflow-hidden aspect-video">
        {isClient ? (
          isUrlValid && !videoError ? (
            renderVideoPlayer()
          ) : (
            renderFallback()
          )
        ) : (
          <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            <Play className="h-12 w-12 text-primary opacity-50" />
          </div>
        )}
      </div>

      <div className="flex mt-4 space-x-4">
        <Button
          variant="outline"
          className="flex items-center gap-2 text-primary border-primary hover:bg-primary/10"
          onClick={() => setShowTranscript(!showTranscript)}
        >
          <FileText size={16} />
          Transcript
        </Button>
        {isUrlValid && (
          <Button
            variant="outline"
            className="flex items-center gap-2 text-primary border-primary hover:bg-primary/10"
            onClick={() => window.open(videoUrl, "_blank")}
          >
            <Download size={16} />
            Download
          </Button>
        )}
      </div>

      {showTranscript && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <h3 className="font-bold mb-2">Transcript</h3>
            <p className="text-light-300">
              This is a placeholder for the transcript content.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

