'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Filter, Grid, List, Search, ChevronDown, Zap, Home, Building, Wrench, AlertTriangle, Lightbulb, Settings, ZoomIn } from 'lucide-react';
import { ImageLightbox } from '@/components/ui/ImageLightbox';

// Gallery data organized by categories
const galleryData = {
  'Instalaciones Residenciales': {
    icon: Home,
    color: 'from-blue-500 to-blue-600',
    images: [
      { src: '/41a4fd06-d34c-42a6-b234-46fa1debd1df.jpeg', title: 'Instalación Residencial Moderna', description: 'Sistema eléctrico completo para hogar moderno' },
      { src: '/43a0a5cf-6fea-49e8-b174-7382d6ebfa5d.jpeg', title: 'Instalación LED Residencial', description: 'Iluminación LED eficiente y moderna' },
      { src: '/7c810f87-294b-4352-a3f6-7b9ace4d39c3.jpeg', title: 'Cableado Residencial', description: 'Instalación de cableado eléctrico seguro' }
    ]
  },
  'Sistemas Comerciales': {
    icon: Building,
    color: 'from-purple-500 to-purple-600',
    images: [
      { src: '/4ca1b64b-7b5f-4145-b7de-099d7806492f.jpeg', title: 'Panel Eléctrico Comercial', description: 'Instalación de panel para edificio comercial' },
      { src: '/ae496ec7-f200-41db-9e1d-54aa3de8fccd.jpeg', title: 'Cableado Industrial', description: 'Sistema eléctrico industrial de alta capacidad' },
      { src: '/b420cfaa-cec4-47a5-a363-d8bebabcef4d.jpeg', title: 'Sistema Domótico Comercial', description: 'Automatización para espacios comerciales' }
    ]
  },
  'Paneles y Tableros': {
    icon: Settings,
    color: 'from-green-500 to-green-600',
    images: [
      { src: '/cf629f37-1d13-4d7b-8774-7a5ce95bf946.jpeg', title: 'Tablero Principal', description: 'Instalación de tablero eléctrico principal' },
      { src: '/cf856cdc-a1e1-40ef-b079-eeab55418c17.jpeg', title: 'Conexiones Seguras', description: 'Conexiones eléctricas profesionales y seguras' },
      { src: '/db2d6452-ebcc-4f8a-8588-9df01d849b74.jpeg', title: 'Trabajo Profesional', description: 'Instalación eléctrica con acabados perfectos' }
    ]
  },
  'Mantenimiento': {
    icon: Wrench,
    color: 'from-orange-500 to-orange-600',
    images: [
      { src: '/6bb20545-9b5b-43f9-b5f8-d7bbb4bcbd5b.jpeg', title: 'Mantenimiento Preventivo', description: 'Revisión y mantenimiento de sistemas eléctricos' },
      { src: '/7108a911-e716-4416-a620-97be93f4c140.jpeg', title: 'Reparación Especializada', description: 'Reparación de fallas eléctricas complejas' }
    ]
  },
  'Sistemas de Emergencia': {
    icon: AlertTriangle,
    color: 'from-red-500 to-red-600',
    images: [
      { src: '/2394664b-563a-48aa-900e-7ff62152b422.jpeg', title: 'Sistema de Emergencia', description: 'Instalación de sistemas de respaldo de emergencia' }
    ]
  },
  'Proyectos Especiales': {
    icon: Lightbulb,
    color: 'from-yellow-500 to-yellow-600',
    images: [
      { src: '/e2f858db-6d50-48ad-b286-36a67483dfe5.jpeg', title: 'Proyecto Integral', description: 'Instalación eléctrica completa y moderna' }
    ]
  }
};

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories = ['Todos', ...Object.keys(galleryData)];
  
  // Get all images with category info
  const allImages = Object.entries(galleryData).flatMap(([category, data]) =>
    data.images.map(image => ({ ...image, category, ...data }))
  );

  // Filter images based on selected category and search term
  const filteredImages = allImages.filter(image => {
    const matchesCategory = selectedCategory === 'Todos' || image.category === selectedCategory;
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Lightbox functions
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex((prev) => 
        prev === 0 ? filteredImages.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === filteredImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-white/20 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back button and title */}
            <div className="flex items-center space-x-4">
              <Link href="/">
                <motion.button
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                  whileHover={{ x: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span className="font-medium">Volver</span>
                </motion.button>
              </Link>
              <div className="h-8 w-px bg-gray-300" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Galería de Trabajos
                </h1>
                <p className="text-sm text-gray-500">MultiServicios El Seibo</p>
              </div>
            </div>

            {/* View mode toggle */}
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={() => setViewMode(viewMode === 'grid' ? 'masonry' : 'grid')}
                className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar proyectos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Filter className="h-4 w-4" />
                <span>{selectedCategory}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl z-10"
                  >
                    {categories.map((category) => {
                      const categoryData = galleryData[category as keyof typeof galleryData];
                      const Icon = category === 'Todos' ? Zap : categoryData?.icon;
                      
                      return (
                        <motion.button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-blue-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                            selectedCategory === category ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                          }`}
                          whileHover={{ x: 5 }}
                        >
                          {Icon && <Icon className="h-4 w-4" />}
                          <span className="font-medium">{category}</span>
                          <span className="text-xs text-gray-500 ml-auto">
                            {category === 'Todos' ? allImages.length : categoryData?.images.length || 0}
                          </span>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Active filters */}
          <div className="flex items-center space-x-2 mt-4">
            <span className="text-sm text-gray-500">
              Mostrando {filteredImages.length} de {allImages.length} proyectos
            </span>
            {selectedCategory !== 'Todos' && (
              <motion.button
                onClick={() => setSelectedCategory('Todos')}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {selectedCategory} ✕
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div 
          className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'columns-1 md:columns-2 lg:columns-3 xl:columns-4'
          }`}
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={`${image.src}-${image.category}`}
                className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 ${
                  viewMode === 'masonry' ? 'break-inside-avoid mb-6' : 'aspect-[4/3]'
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                layout
              >
                {/* Category Badge */}
                <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${image.color} backdrop-blur-sm`}>
                  <image.icon className="inline h-3 w-3 mr-1" />
                  {image.category}
                </div>

                {/* Image */}
                <div 
                  className="relative h-full overflow-hidden cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={image.src}
                    alt={image.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Zoom Icon Indicator */}
                  <div className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                    <ZoomIn className="h-4 w-4 text-white" />
                  </div>
                  
                  {/* Content Overlay */}
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                    initial={{ y: "100%" }}
                    whileHover={{ y: 0 }}
                  >
                    <h3 className="font-bold text-lg mb-2">{image.title}</h3>
                    <p className="text-sm opacity-90 leading-relaxed">{image.description}</p>
                    
                    {/* View Details Button */}
                    <motion.button
                      className="mt-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the image click
                        openLightbox(index);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Ver Detalles
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No se encontraron proyectos</h3>
            <p className="text-gray-400 mb-6">Intenta cambiar los filtros o el término de búsqueda</p>
            <motion.button
              onClick={() => {
                setSelectedCategory('Todos');
                setSearchTerm('');
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Mostrar Todos
            </motion.button>
          </motion.div>
        )}

        {/* Footer CTA */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">¿Tienes un proyecto en mente?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Nuestro equipo de expertos está listo para convertir tu visión en realidad. 
              Contáctanos para una consulta gratuita.
            </p>
            <Link href="/booking">
              <motion.button
                className="px-8 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Solicitar Presupuesto
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        isOpen={isLightboxOpen}
        onClose={closeLightbox}
        imageSrc={filteredImages[currentImageIndex]?.src || ''}
        imageTitle={filteredImages[currentImageIndex]?.title || ''}
        imageCategory={filteredImages[currentImageIndex]?.category || ''}
        images={filteredImages}
        currentIndex={currentImageIndex}
        onNavigate={navigateImage}
      />
    </div>
  );
} 