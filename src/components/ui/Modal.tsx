'use client'

import { memo, useEffect, useCallback, useRef, ReactNode, useState } from 'react'
import { X, AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  className?: string
}

export const Modal = memo(function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = ''
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Handle escape key
  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && closeOnEscape) {
      onClose()
    }
  }, [onClose, closeOnEscape])

  // Handle backdrop click
  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget && closeOnBackdrop) {
      onClose()
    }
  }, [onClose, closeOnBackdrop])

  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl mx-4'
  }

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement
      
      // Focus the modal
      const timer = setTimeout(() => {
        modalRef.current?.focus()
      }, 100)

      // Add escape key listener
      document.addEventListener('keydown', handleEscape)
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden'

      return () => {
        clearTimeout(timer)
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = 'unset'
        
        // Restore focus to the previously focused element
        if (previousFocusRef.current) {
          previousFocusRef.current.focus()
        }
      }
    }
  }, [isOpen, handleEscape])

  // Don't render if not open
  if (!isOpen) return null

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={modalRef}
        className={`
          relative bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]}
          max-h-[90vh] overflow-hidden flex flex-col
          transform transition-all duration-200 ease-out
          ${className}
        `}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && (
              <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )

  // Use portal to render at document body level
  return typeof window !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null
})

// Higher-order component for modal confirmation
export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<{
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
    onConfirm?: () => void
    type?: 'info' | 'warning' | 'danger'
  }>({})

  const confirm = useCallback((options: typeof config) => {
    return new Promise<boolean>((resolve) => {
      setConfig({
        ...options,
        onConfirm: () => {
          options.onConfirm?.()
          resolve(true)
          setIsOpen(false)
        }
      })
      setIsOpen(true)
    })
  }, [])

  const handleCancel = useCallback(() => {
    setIsOpen(false)
  }, [])

  const ConfirmModal = memo(function ConfirmModal() {
    const typeStyles = {
      info: 'text-blue-600 bg-blue-100',
      warning: 'text-yellow-600 bg-yellow-100', 
      danger: 'text-red-600 bg-red-100'
    }

    return (
      <Modal
        isOpen={isOpen}
        onClose={handleCancel}
        title={config.title || 'Confirmar acción'}
        size="sm"
      >
        <div className="p-6">
          <div className={`inline-flex p-3 rounded-full ${typeStyles[config.type || 'info']} mb-4`}>
            {config.type === 'danger' && <AlertTriangle className="w-6 h-6" />}
            {config.type === 'warning' && <AlertCircle className="w-6 h-6" />}
            {config.type === 'info' && <Info className="w-6 h-6" />}
          </div>
          
          <p className="text-gray-700 mb-6">
            {config.message || '¿Estás seguro de que quieres continuar?'}
          </p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {config.cancelText || 'Cancelar'}
            </button>
            <button
              onClick={config.onConfirm}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                config.type === 'danger' 
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {config.confirmText || 'Confirmar'}
            </button>
          </div>
        </div>
      </Modal>
    )
  })

  return { confirm, ConfirmModal }
} 