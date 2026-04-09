"use client";
import React from 'react';

interface BoardPathProps {
  totalCount: number;
  completedCount: number;
}

export function BoardPath({ totalCount, completedCount }: BoardPathProps) {
  const nodes = Array.from({ length: totalCount }, (_, i) => i);
  // The person is exactly at `completedCount` index (if total is 18 and completed is 0, they are at 0).
  const currentIndex = completedCount < totalCount ? completedCount : totalCount - 1;

  return (
    <div style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--secondary)', fontSize: '1.1rem' }}>Sua Trilha de Conquistas</h3>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', maxWidth: '100%' }}>
        {nodes.map((nodeIndex) => {
          const isPassed = nodeIndex < completedCount;
          const isCurrent = nodeIndex === currentIndex && completedCount < totalCount;
          const isCompletedBoard = completedCount === totalCount;

          let color = 'var(--border)';
          let bgColor = 'var(--surface)';
          let scale = 1;
          
          if (isPassed || isCompletedBoard) {
            bgColor = 'var(--success)';
            color = 'var(--success)';
          } else if (isCurrent) {
            bgColor = 'var(--surface)';
            color = 'var(--primary)';
            scale = 1.3;
          }

          return (
            <React.Fragment key={nodeIndex}>
              <div 
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  border: `3px solid ${color}`,
                  backgroundColor: bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${scale})`,
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  boxShadow: isCurrent ? '0 0 15px rgba(128, 171, 59, 0.6)' : 'none',
                  zIndex: isCurrent ? 10 : 1,
                  margin: '0.25rem'
                }}
                title={`Tarefa ${nodeIndex + 1}`}
              >
                {(isPassed || isCompletedBoard) && <span style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>✓</span>}
                {isCurrent && <span style={{ fontSize: '16px' }}>⭐</span>}
              </div>
              
              {nodeIndex < totalCount - 1 && (
                <div style={{ 
                  width: '12px', 
                  height: '4px', 
                  backgroundColor: isPassed ? 'var(--success)' : 'var(--border)',
                  transition: 'background-color 0.4s ease',
                  borderRadius: '2px'
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
