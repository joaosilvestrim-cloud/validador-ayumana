"use client";
import React, { useEffect, useState } from 'react';

interface BoardPathProps {
  totalCount: number;
  completedCount: number;
}

export function BoardPath({ totalCount, completedCount }: BoardPathProps) {
  const nodes = Array.from({ length: totalCount }, (_, i) => i);
  const currentIndex = completedCount < totalCount ? completedCount : totalCount - 1;

  const [cols, setCols] = useState(6);
  
  useEffect(() => {
    const handleResize = () => setCols(window.innerWidth < 768 ? 4 : 6);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const chunks = [];
  for (let i = 0; i < totalCount; i += cols) {
    chunks.push(nodes.slice(i, i + cols));
  }

  // Playful colors from the reference image
  const tileColors = ['#F472B6', '#FBBF24', '#38BDF8', '#FB923C', '#C084FC', '#A3E635'];

  return (
    <div style={{ padding: '2rem 1rem', marginBottom: '3rem', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '2px solid var(--border)', overflow: 'hidden', position: 'relative' }}>
      <h3 style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--secondary)', fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
        🚀 Tabuleiro de Testes
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%', position: 'relative', zIndex: 5 }}>
        {chunks.map((chunk, rowIndex) => {
          const isReverse = rowIndex % 2 === 1;
          
          return (
            <div key={rowIndex} style={{ display: 'flex', flexDirection: isReverse ? 'row-reverse' : 'row', gap: '0.5rem' }}>
              {chunk.map((nodeIndex) => {
                const isPassed = nodeIndex < completedCount;
                const isCurrent = nodeIndex === currentIndex && completedCount < totalCount;
                const isCompletedBoard = completedCount === totalCount;
                
                const baseColor = tileColors[nodeIndex % tileColors.length];
                
                let bgColor = baseColor;
                let color = '#fff';
                let scale = 1;
                let opacity = 1;

                if (isCurrent) {
                  scale = 1.3;
                } else if (!isPassed && !isCompletedBoard) {
                  // Future nodes slightly faded
                  opacity = 0.5;
                }

                return (
                  <div key={nodeIndex} style={{ display: 'flex', alignItems: 'center' }}>
                    <div 
                      style={{ 
                        width: '42px', 
                        height: '42px', 
                        borderRadius: '12px', // Slightly squared like board tiles
                        backgroundColor: bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: `scale(${scale})`,
                        transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        boxShadow: isCurrent ? `0 0 20px ${baseColor}, 0 0 0 4px #000` : '0 4px 6px rgba(0,0,0,0.1)',
                        zIndex: isCurrent ? 10 : 1,
                        opacity,
                        fontWeight: 'bold',
                        color: '#000',
                        fontSize: '1rem'
                      }}
                      title={`Tarefa ${nodeIndex + 1}`}
                    >
                      {isCurrent ? <span style={{ fontSize: '20px', animation: 'bounce 1s infinite' }}>🛸</span> : (nodeIndex + 1)}
                      
                      {/* Checkmark overlay for passed */}
                      {(isPassed || isCompletedBoard) && (
                        <div style={{ position: 'absolute', top: -5, right: -5, background: 'var(--success)', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}} />
    </div>
  );
}
