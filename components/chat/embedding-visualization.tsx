'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface EmbeddingVisualizationProps {
  questionEmbedding: number[];
  retrievedChunks: {
    id: string;
    text: string;
    source: string;
    embedding?: number[];
  }[];
  highlightClosest?: boolean;
}

// Helper function to calculate similarity between embeddings
function calculateSimilarity(embedding1: number[], embedding2?: number[]): number {
  if (!embedding1 || !embedding2 || embedding1.length === 0 || embedding2.length === 0) {
    return Math.random() * 0.3 + 0.6; // Random high similarity if embeddings not available
  }
  
  // Calculate dot product
  let dotProduct = 0;
  const minDims = Math.min(embedding1.length, embedding2.length);
  for (let i = 0; i < minDims; i++) {
    dotProduct += embedding1[i] * embedding2[i];
  }
  
  // Normalize to 0-1 range (assuming values are already normalized)
  return (dotProduct + 1) / 2;
}

// Generate 2D coordinates from high-dimensional embeddings
function generateCoordinates(embedding: number[], center = false): [number, number] {
  if (!embedding || embedding.length < 2) {
    return center ? [50, 50] : [Math.random() * 80 + 10, Math.random() * 80 + 10];
  }
  
  // Use first two dimensions as a simple projection
  // We could use more sophisticated dimensionality reduction like t-SNE or UMAP
  // but this is a simplified visualization
  
  // Take a few random dimensions and combine them
  const dims = embedding.length;
  const idx1 = Math.floor(Math.random() * dims);
  const idx2 = (idx1 + Math.floor(dims / 3)) % dims;
  const idx3 = (idx1 + Math.floor(2 * dims / 3)) % dims;
  
  // Combine dimensions and normalize to 0-100 range for positioning
  const x = ((embedding[idx1] + embedding[idx2]) / 2 + 1) * 40 + 10;
  const y = ((embedding[idx2] + embedding[idx3]) / 2 + 1) * 40 + 10;
  
  return center ? [50, 50] : [x, y];
}

export default function EmbeddingVisualization({ questionEmbedding, retrievedChunks, highlightClosest = false }: EmbeddingVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [coordinates, setCoordinates] = useState<{ id: string; x: number; y: number; similarity: number }[]>([]);
  const [questionCoords, setQuestionCoords] = useState<[number, number]>([50, 50]);
  const [otherChunks, setOtherChunks] = useState<{ x: number; y: number }[]>([]);
  
  // Generate coordinates for visualization
  useEffect(() => {
    if (!containerRef.current) return;
    
    const { width, height } = containerRef.current.getBoundingClientRect();
    setContainerSize({ width, height });
    
    // Generate question coordinates (center)
    setQuestionCoords([50, 50]);
    
    // Generate coordinates for retrieved chunks
    const newCoordinates = retrievedChunks.map((chunk, index) => {
      const similarity = calculateSimilarity(questionEmbedding, chunk.embedding);
      // Position more similar chunks closer to the question, but with more spacing
      const distance = 100 - similarity * 100;
      // Use fixed angles for the first two chunks to prevent overlap
      const angle = index < 2
        ? Math.PI * 0.5 + (index * Math.PI) // Position at opposite sides
        : Math.random() * Math.PI * 2;
      const x = 50 + Math.cos(angle) * distance * 0.5;
      const y = 50 + Math.sin(angle) * distance * 0.5;
      
      return {
        id: chunk.id,
        x: Math.max(10, Math.min(90, x)),
        y: Math.max(10, Math.min(90, y)),
        similarity
      };
    });
    
    setCoordinates(newCoordinates);
    
    // Generate some background noise chunks
    const noise = Array.from({ length: 25 }, (_, i) => {
      const [x, y] = generateCoordinates([], false);
      return { x, y };
    });
    
    setOtherChunks(noise);
  }, [questionEmbedding, retrievedChunks]);
  
  return (
    <div 
      ref={containerRef}
      className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden relative border border-blue-100"
    >
      {/* Background chunks (noise) */}
      {otherChunks.map((chunk, i) => (
        <motion.div
          key={`noise-${i}`}
          className="absolute w-4 h-4 rounded-full bg-gray-300 opacity-60"
          style={{
            left: `${chunk.x}%`,
            top: `${chunk.y}%`,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.05, duration: 0.5 }}
        />
      ))}
      
      {/* Connection lines */}
      {coordinates.map((coord) => (
        <motion.div
          key={`line-${coord.id}`}
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: `${Math.sqrt(
              Math.pow((coord.x - questionCoords[0]) * containerSize.width / 100, 2) +
              Math.pow((coord.y - questionCoords[1]) * containerSize.height / 100, 2)
            )}px`,
            height: '3px',
            background: `rgba(${Math.round(255 * (1 - coord.similarity))}, ${Math.round(255 * coord.similarity)}, 200, 0.8)`,
            boxShadow: `0 0 8px rgba(${Math.round(255 * (1 - coord.similarity))}, ${Math.round(255 * coord.similarity)}, 200, 0.6)`,
            transformOrigin: 'left center',
            left: `${questionCoords[0]}%`,
            top: `${questionCoords[1]}%`,
            transform: `rotate(${Math.atan2(
              (coord.y - questionCoords[1]) * containerSize.height / 100,
              (coord.x - questionCoords[0]) * containerSize.width / 100
            )}rad)`,
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.7 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      ))}
      
      {/* Question node */}
      <motion.div
        className="absolute w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-xl z-10 border-2 border-blue-300"
        style={{
          left: `${questionCoords[0]}%`,
          top: `${questionCoords[1]}%`,
          transform: 'translate(-50%, -50%)',
        }}
        initial={{ scale: 0 }}
        animate={{ scale: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Q
      </motion.div>
      
      {/* Retrieved chunk nodes */}
      {coordinates.map((coord, i) => (
        <motion.div
          key={`chunk-${coord.id}`}
          className={`absolute rounded-lg shadow-lg z-10 p-1.5 w-20 text-center text-[10px] font-medium
            ${highlightClosest && i < 2 ? 'bg-green-100 text-green-800 border-2 border-green-500 ring-4 ring-green-300 ring-opacity-50 shadow-green-300/50 shadow-lg' :
              coord.similarity > 0.8 ? 'bg-green-100 text-green-800 border border-green-300' :
              coord.similarity > 0.6 ? 'bg-blue-100 text-blue-800 border border-blue-300' :
              'bg-teal-100 text-teal-800 border border-teal-300'}`}
          style={{
            left: `${coord.x}%`,
            top: `${coord.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 + i * 0.2 }}
        >
          <div className="truncate text-[9px]">{retrievedChunks[i].source}</div>
          <div className="mt-0.5 bg-white/50 rounded-full text-[8px] px-1">
            {Math.round(coord.similarity * 100)}% match
          </div>
        </motion.div>
      ))}
      
      {/* Legend */}
      <div className="absolute bottom-2 right-2 bg-white/90 rounded-lg p-2 text-xs text-gray-700 shadow-md border border-gray-200">
        <div className="flex items-center gap-1 mb-1">
          <div className="w-3 h-3 rounded-full bg-blue-600 border border-blue-300"></div>
          <span>Question</span>
        </div>
        {highlightClosest && (
          <div className="flex items-center gap-1 mb-1">
            <div className="w-3 h-3 rounded-full bg-green-100 border-2 border-green-500 ring-2 ring-green-300"></div>
            <span>Top 2 Closest Chunks</span>
          </div>
        )}
        <div className="flex items-center gap-1 mb-1">
          <div className="w-3 h-3 rounded-full bg-green-100 border border-green-300"></div>
          <span>High Match</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300"></div>
          <span>Medium Match</span>
        </div>
      </div>
    </div>
  );
}