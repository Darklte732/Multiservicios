'use client'

import { useCallback, useRef, useEffect, useMemo, useState } from 'react'

// Debounce hook for performance optimization
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }, [callback, delay]) as T
}

// Throttle hook for performance optimization
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastCallRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now()
    
    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now
      callback(...args)
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        lastCallRef.current = Date.now()
        callback(...args)
      }, delay - (now - lastCallRef.current))
    }
  }, [callback, delay]) as T
}

// Memoized computation hook
export const useMemoizedComputation = <T>(
  computation: () => T,
  dependencies: React.DependencyList
): T => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(computation, dependencies)
}

// Lazy loading hook for images
export const useLazyLoading = (
  threshold = 0.1,
  rootMargin = '0px'
) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return { ref, isIntersecting }
}

// Performance monitoring utility
export const performanceMonitor = {
  startTiming: (label: string) => {
    if (typeof window !== 'undefined' && performance.mark) {
      performance.mark(`${label}-start`)
    }
  },

  endTiming: (label: string) => {
    if (typeof window !== 'undefined' && performance.mark && performance.measure) {
      performance.mark(`${label}-end`)
      performance.measure(label, `${label}-start`, `${label}-end`)
      
      const measures = performance.getEntriesByName(label)
      const duration = measures[measures.length - 1]?.duration
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ ${label}: ${duration?.toFixed(2)}ms`)
      }
      
      return duration
    }
    return 0
  },

  clearMarks: (label?: string) => {
    if (typeof window !== 'undefined' && performance.clearMarks) {
      performance.clearMarks(label)
    }
  }
}

// Image optimization utility
export const optimizeImage = (
  src: string,
  width?: number,
  height?: number,
  quality = 80
): string => {
  // In a real app, this would integrate with Next.js Image or a CDN
  // For now, return the original src
  if (typeof window === 'undefined') return src
  
  // Mock optimization for demo
  const params = new URLSearchParams()
  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())
  params.set('q', quality.toString())
  
  const hasParams = params.toString()
  return hasParams ? `${src}?${params.toString()}` : src
}

// Bundle size analyzer (development only)
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    const scripts = Array.from(document.querySelectorAll('script[src]'))
    const totalSize = scripts.reduce((acc, script) => {
      const src = script.getAttribute('src')
      if (src && src.includes('/_next/')) {
        // Mock size calculation - in real app, you'd use webpack-bundle-analyzer
        return acc + Math.random() * 100000
      }
      return acc
    }, 0)
    
    console.log(`📦 Estimated bundle size: ${(totalSize / 1024).toFixed(2)} KB`)
    return totalSize
  }
  return 0
}

// Local storage with expiration
export const localStorage = {
  set: (key: string, value: any, expirationMinutes?: number) => {
    if (typeof window === 'undefined') return
    
    const item = {
      value,
      timestamp: Date.now(),
      expiration: expirationMinutes ? Date.now() + (expirationMinutes * 60 * 1000) : null
    }
    
    try {
      window.localStorage.setItem(key, JSON.stringify(item))
    } catch (error) {
      console.warn('Failed to set localStorage item:', error)
    }
  },

  get: (key: string) => {
    if (typeof window === 'undefined') return null
    
    try {
      const item = window.localStorage.getItem(key)
      if (!item) return null
      
      const parsed = JSON.parse(item)
      
      // Check if expired
      if (parsed.expiration && Date.now() > parsed.expiration) {
        window.localStorage.removeItem(key)
        return null
      }
      
      return parsed.value
    } catch (error) {
      console.warn('Failed to get localStorage item:', error)
      return null
    }
  },

  remove: (key: string) => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key)
    }
  },

  clear: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.clear()
    }
  }
}

// API request deduplication
const requestCache = new Map<string, Promise<any>>()

export const deduplicateRequest = <T>(
  key: string,
  requestFn: () => Promise<T>,
  ttl = 5000 // 5 seconds TTL
): Promise<T> => {
  if (requestCache.has(key)) {
    return requestCache.get(key)!
  }

  const request = requestFn().finally(() => {
    // Remove from cache after TTL
    setTimeout(() => {
      requestCache.delete(key)
    }, ttl)
  })

  requestCache.set(key, request)
  return request
} 