"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Download, AlertCircle } from "lucide-react"
import type { Video } from "@/types/course"
import Hls from "hls.js"

interface VideoPlayerProps {
  video: Video
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const [showTranscript, setShowTranscript] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const videoUrl = video?.url || ""

  useEffect(() => {
    if (!videoUrl || !videoRef.current) return

    const hls = new Hls()

    try {
      if (Hls.isSupported()) {
      
        hls.loadSource(videoUrl)
        hls.attachMedia(videoRef.current)

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            hls.destroy()
            setVideoError(true)
          }
        })
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = videoUrl
      } else {
        setVideoError(true)
      }
    } catch (error) {
      console.warn("HLS setup failed:", error)
      setVideoError(true)
    }

    return () => {
      try {
        hls?.destroy?.()
      } catch {}
    }

  }, [videoUrl])

  const renderFallback = () => (
    <div className="w-full aspect-video bg-light-100 rounded-lg flex flex-col items-center justify-center border border-gray-200">
    <AlertCircle className="h-12 w-12 text-red mb-2" />
    <p className="text-sm text-primary/70">{videoError ? "Error loading video" : "Video format not supported."}</p>
    {videoUrl && (
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 text-primary hover:text-primary/80 hover:underline font-medium"
      >
        Open video in new tab
      </a>
    )}
  </div>
  )

  return (
    <div className="mb-6">
      <div className="relative rounded-lg overflow-hidden aspect-video">
        {!videoError ? (
          <video
            ref={videoRef}
            controls
            className="w-full h-full rounded-lg bg-black"
          />
        ) : (
          renderFallback()
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
        {videoUrl && (
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
