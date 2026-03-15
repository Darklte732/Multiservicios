'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Filter, Grid, List, Search, ChevronDown, Zap, Home, Building, Wrench, AlertTriangle, Lightbulb, Settings, ZoomIn } from 'lucide-react';
import { ImageLightbox } from '@/components/ui/ImageLightbox';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';

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
    color: 'from-electric to-electric-bright',
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories = ['Todos', ...Object.keys(galleryData)];

  const allImages = Object.entries(galleryData).flatMap(([category, data]) =>
    data.images.map(image => ({ ...image, category, ...data }))
  );

  const filteredImages = allImages.filter(image => {
    const matchesCategory = selectedCategory === 'Todos' || image.category === selectedCategory;
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openLightbox = (index: number) => { setCurrentImageIndex(index); setIsLightboxOpen(true); };
  const closeLightbox = () => setIsLightboxOpen(false);
  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex(prev => prev === 0 ? filteredImages.length - 1 : prev - 1);
    } else {
      setCurrentImageIndex(prev => prev === filteredImages.length - 1 ? 0 : prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-50 dark-nav"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <motion.button
                  className="flex items-center space-x-2 text-gray-400 hover:text-electric transition-colors"
                  whileHover={{ x: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span className="font-medium">Volver</span>
                </motion.button>
              </Link>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <h1
                  className="text-2xl font-black gradient-text-electric leading-none"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Galería de Trabajos
                </h1>
                <p className="text-sm text-gray-500">MultiServicios El Seibo</p>
              </div>
            </div>

            <motion.button
              onClick={() => setViewMode(viewMode === 'grid' ? 'masonry' : 'grid')}
              className="p-2 rounded-lg bg-navy-700 text-electric hover:bg-navy-600 transition-colors border border-electric/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar proyectos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-dark pl-10"
              />
            </div>

            {/* Category tabs (desktop) */}
            <div className="hidden md:flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${
                    selectedCategory === cat
                      ? 'electric-badge'
                      : 'text-gray-400 hover:text-white bg-navy-700 hover:bg-navy-600 border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Filter dropdown (mobile) */}
            <div className="relative md:hidden">
              <motion.button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-navy-700 border border-white/10 rounded-xl hover:bg-navy-600 transition-all text-gray-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Filter className="h-4 w-4 text-electric" />
                <span>{selectedCategory}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-navy-800 border border-white/10 rounded-xl shadow-card z-20"
                  >
                    {categories.map((category) => {
                      const categoryData = galleryData[category as keyof typeof galleryData];
                      const Icon = category === 'Todos' ? Zap : categoryData?.icon;
                      return (
                        <motion.button
                          key={category}
                          onClick={() => { setSelectedCategory(category); setIsFilterOpen(false); }}
                          className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors first:rounded-t-xl last:rounded-b-xl ${
                            selectedCategory === category ? 'bg-electric/10 text-electric' : 'text-gray-300 hover:bg-navy-700'
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

          <div className="flex items-center space-x-2 mt-4">
            <span className="text-sm text-gray-500">
              Mostrando {filteredImages.length} de {allImages.length} proyectos
            </span>
            {selectedCategory !== 'Todos' && (
              <motion.button
                onClick={() => setSelectedCategory('Todos')}
                className="electric-badge text-xs cursor-pointer"
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
          className={`grid gap-4 ${
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
                className={`group relative overflow-hidden rounded-2xl bg-navy-700 border border-white/5 hover:border-electric/30 shadow-card hover:shadow-card-hover transition-all duration-500 ${
                  viewMode === 'masonry' ? 'break-inside-avoid mb-4' : 'aspect-[4/3]'
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                layout
              >
                {/* Category badge */}
                <div className={`absolute top-3 left-3 z-10 px-2 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${image.color}`}>
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

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Zoom icon */}
                  <div className="absolute top-3 right-3 p-2 rounded-full bg-electric/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                    <ZoomIn className="h-4 w-4 text-electric" />
                  </div>

                  {/* Content overlay */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  >
                    <h3 className="font-bold text-base mb-1">{image.title}</h3>
                    <p className="text-sm text-gray-300 opacity-90">{image.description}</p>
                    <button
                      className="mt-3 btn-electric text-xs !py-1.5 !px-3 !rounded-lg"
                      onClick={(e) => { e.stopPropagation(); openLightbox(index); }}
                    >
                      Ver Detalles
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredImages.length === 0 && (
          <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No se encontraron proyectos</h3>
            <p className="text-gray-600 mb-6">Intenta cambiar los filtros o el término de búsqueda</p>
            <motion.button
              onClick={() => { setSelectedCategory('Todos'); setSearchTerm(''); }}
              className="btn-electric"
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
          <div className="bg-navy-800 border border-electric/20 rounded-2xl p-8 relative overflow-hidden">
            {/* Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-32 bg-electric/10 blur-3xl rounded-full" />
            </div>
            <div className="relative z-10">
              <h2
                className="text-5xl font-black mb-3 leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                ¿Tienes un proyecto en mente?
              </h2>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Contáctanos para una consulta gratuita. Evaluación sin compromiso en El Seibo y alrededores.
              </p>
              <Link href="/booking">
                <motion.button
                  className="btn-electric text-base !py-3 !px-8"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Solicitar Presupuesto Gratis
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
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

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
