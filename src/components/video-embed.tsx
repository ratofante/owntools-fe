import { VideoOff } from 'lucide-react'

type EmbedInfo =
  | { type: 'iframe'; src: string }
  | { type: 'html5'; src: string }

const getEmbedInfo = (url: string | null | undefined): EmbedInfo | null => {
  if (!url) return null

  // YouTube: watch?v=, youtu.be/, shorts/
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )
  if (youtubeMatch) {
    return {
      type: 'iframe',
      src: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
    }
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return {
      type: 'iframe',
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    }
  }

  // Loom
  const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/)
  if (loomMatch) {
    return {
      type: 'iframe',
      src: `https://www.loom.com/embed/${loomMatch[1]}`,
    }
  }

  // Direct video files (mp4, webm, etc.)
  if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
    return { type: 'html5', src: url }
  }

  return null
}

interface VideoEmbedProps {
  url: string | null | undefined
  title?: string
  className?: string
}

export const VideoEmbed = ({
  url,
  title = 'Video player',
  className = '',
}: VideoEmbedProps) => {
  const embedInfo = getEmbedInfo(url)

  if (!url) {
    return (
      <div className="flex items-center gap-2">
        <VideoOff size={16} className="text-red-500" />
        <p className="text-sm text-muted-foreground">No video available</p>
      </div>
    )
  }

  if (!embedInfo) {
    return (
      <div className={className}>
        <a href={url} target="_blank" rel="noopener noreferrer">
          Watch Video ↗
        </a>
      </div>
    )
  }

  if (embedInfo.type === 'html5') {
    return (
      <video controls className={className}>
        <source src={embedInfo.src} />
      </video>
    )
  }

  return (
    <iframe
      src={embedInfo.src}
      title={title}
      className={`border-none w-full aspect-video ${className}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  )
}
