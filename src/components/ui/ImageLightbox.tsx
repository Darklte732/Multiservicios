import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface ImageLightboxProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  imageTitle: string
  imageCategory: string
  images?: Array<{ src: string; title: string; category: string }>
  currentIndex?: number
  onNavigate?: (direction: 'prev' | 'next') => void
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  onClose,
  imageSrc,
  imageTitle,
  imageCategory,
  images,
  currentIndex,
  onNavigate
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  // Minimum distance for a swipe
  const minSwipeDistance = 50

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Handle arrow key navigation
  useEffect(() => {
    const handleArrowKeys = (e: KeyboardEvent) => {
      if (!onNavigate || !images) return
      
      if (e.key === 'ArrowLeft') {
        onNavigate('prev')
      } else if (e.key === 'ArrowRight') {
        onNavigate('next')
      }
    }

    if (isOpen && onNavigate) {
      document.addEventListener('keydown', handleArrowKeys)
    }

    return () => {
      document.removeEventListener('keydown', handleArrowKeys)
    }
  }, [isOpen, onNavigate, images])

  // Touch event handlers for swipe detection
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null) // Reset touch end
    setTouchStart(e.targetTouches[0].clientX)
    setSwipeDirection(null)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return
    
    const currentTouch = e.targetTouches[0].clientX
    const diff = touchStart - currentTouch
    
    // Determine swipe direction for visual feedback
    if (Math.abs(diff) > 20) { // Small threshold for direction detection
      setSwipeDirection(diff > 0 ? 'left' : 'right')
    }
    
    setTouchEnd(currentTouch)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || !onNavigate || !images || images.length <= 1) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      onNavigate('next')
    } else if (isRightSwipe) {
      onNavigate('prev')
    }

    // Reset touch states
    setTouchStart(null)
    setTouchEnd(null)
    setSwipeDirection(null)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Close Button */}
        <motion.button
          className="absolute top-4 right-4 z-60 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
          onClick={onClose}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="h-6 w-6" />
        </motion.button>

        {/* Navigation Arrows (if multiple images) */}
        {images && onNavigate && images.length > 1 && (
          <>
            <motion.button
              className="absolute left-4 z-60 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
              onClick={() => onNavigate('prev')}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.button>

            <motion.button
              className="absolute right-4 z-60 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
              onClick={() => onNavigate('next')}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="h-6 w-6" />
            </motion.button>
          </>
        )}

        {/* Image Container with Touch Support */}
        <motion.div
          ref={imageContainerRef}
          className="relative z-50 max-w-7xl max-h-[90vh] mx-4"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            x: swipeDirection === 'left' ? -10 : swipeDirection === 'right' ? 10 : 0
          }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ duration: 0.4, type: "spring", damping: 25 }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Image */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <Image
              src={imageSrc}
              alt={imageTitle}
              width={1200}
              height={800}
              className="max-w-full max-h-[80vh] w-auto h-auto object-contain"
              priority
            />
            
            {/* Image Info Overlay */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-2">{imageTitle}</h3>
                <p className="text-sm md:text-base opacity-80">{imageCategory}</p>
                
                {/* Image Counter */}
                {images && currentIndex !== undefined && (
                  <div className="mt-3 text-xs opacity-60">
                    {currentIndex + 1} de {images.length}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Mobile Touch Hint */}
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm md:hidden text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {images && images.length > 1 ? (
            <div>
              <div>Desliza para navegar</div>
              <div className="text-xs mt-1 opacity-40">Toca para cerrar</div>
            </div>
          ) : (
            'Toca para cerrar'
          )}
        </motion.div>

        {/* Swipe Direction Indicator */}
        {swipeDirection && images && images.length > 1 && (
          <motion.div
            className={`absolute top-1/2 transform -translate-y-1/2 z-60 p-4 rounded-full bg-white/20 backdrop-blur-md text-white ${
              swipeDirection === 'left' ? 'right-8' : 'left-8'
            }`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            {swipeDirection === 'left' ? (
              <ChevronRight className="h-8 w-8" />
            ) : (
              <ChevronLeft className="h-8 w-8" />
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
} 