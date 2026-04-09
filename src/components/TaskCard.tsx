"use client";
import React, { useState } from 'react';
import { ChecklistItem, TaskStatus } from '../data/mockChecklists';

interface TaskCardProps {
  task: ChecklistItem;
  onStatusChange: (id: string, status: TaskStatus, evidence?: string, comment?: string) => void;
  isFocused?: boolean;
}

export function TaskCard({ task, onStatusChange, isFocused = false }: TaskCardProps) {
  const [isAddingEvidence, setIsAddingEvidence] = useState(false);
  const [showTutorial, setShowTutorial] = useState(isFocused);
  const [comment, setComment] = useState(task.comment || '');
  const [evidenceUrl, setEvidenceUrl] = useState(task.evidence || '');

  const handleStatus = (status: TaskStatus) => {
    onStatusChange(task.id, status, evidenceUrl, comment);
  };

  const getBadgeClass = (status: TaskStatus) => {
    switch(status) {
      case 'passed': return 'badge badge-success';
      case 'failed': return 'badge badge-danger';
      default: return 'badge badge-pending';
    }
  };

  const getStatusText = (status: TaskStatus) => {
    switch(status) {
      case 'passed': return 'Aprovado ✓';
      case 'failed': return 'Com Problema ✗';
      default: return 'Pendente';
    }
  };

  if (!isFocused && task.status === 'pending') {
    // Hidden future tasks (to keep focus clean)
    return null;
  }

  const isCompleted = task.status !== 'pending';

  return (
    <div 
      className="task-item" 
      data-status={task.status} 
      style={{ 
        opacity: isCompleted && !isFocused ? 0.6 : 1, 
        transform: isFocused ? 'scale(1.02)' : 'scale(1)',
        borderWidth: isFocused ? '2px' : '1px',
        borderColor: isFocused ? 'var(--primary)' : undefined,
        boxShadow: isFocused ? '0 10px 25px -5px rgba(99, 102, 241, 0.2)' : undefined,
        transition: 'all 0.3s ease'
      }}
    >
      <div className="task-header">
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', display: 'block' }}>
            {task.category}
          </span>
          <h3 className="task-title" style={{ color: isFocused ? 'var(--text-main)' : 'var(--text-muted)' }}>{task.title}</h3>
          <p className="task-desc" style={{ display: isCompleted && !isFocused ? 'none' : 'block' }}>{task.description}</p>
        </div>
        <div className={getBadgeClass(task.status)}>
          {getStatusText(task.status)}
        </div>
      </div>

      {/* Tutorial Area */}
      {task.tutorialSteps && task.status === 'pending' && (!isCompleted || isFocused) && (
        <div style={{ marginTop: '1rem' }}>
          <button 
            onClick={() => setShowTutorial(!showTutorial)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600, padding: '0.5rem 0' }}
          >
            💡 {showTutorial ? 'Ocultar Tutorial Passo-a-passo' : 'Como realizar esse teste?'}
          </button>
          
          {showTutorial && (
            <div style={{ background: 'rgba(99, 102, 241, 0.05)', borderRadius: '8px', padding: '1rem', marginTop: '0.5rem', borderLeft: '3px solid var(--primary)' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-main)' }}>Siga estes passos na plataforma:</p>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {task.tutorialSteps.map((step, idx) => (
                  <li key={idx} style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="task-actions" style={{ display: isCompleted && !isFocused ? 'none' : 'flex' }}>
        <button 
          className="btn btn-outline" 
          style={{ width: '100%', borderColor: 'var(--success)', color: task.status === 'passed' ? 'var(--success)' : 'inherit', backgroundColor: task.status === 'passed' ? 'rgba(16, 185, 129, 0.1)' : 'transparent' }} 
          onClick={() => handleStatus('passed')}
        >
          ✓ Deu Certo
        </button>
        <button 
          className="btn btn-outline" 
          style={{ width: '100%', borderColor: 'var(--danger)', color: task.status === 'failed' ? 'var(--danger)' : 'inherit', backgroundColor: task.status === 'failed' ? 'rgba(239, 68, 68, 0.1)' : 'transparent' }} 
          onClick={() => {
            handleStatus('failed');
            setIsAddingEvidence(true);
          }}
        >
          ✗ Reportar Erro / Problema
        </button>
        <button 
          className="btn btn-outline"
          style={{ padding: '0.75rem' }}
          onClick={() => setIsAddingEvidence(!isAddingEvidence)}
          title="Adicionar Evidência/Comentário"
        >
          📝
        </button>
      </div>

      {(isAddingEvidence || task.comment || task.evidence) && (!isCompleted || isFocused || isAddingEvidence) && (
        <div className="evidence-box">
          <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Descreva o que aconteceu / Notas Adicionais</label>
          <textarea 
            className="input-field" 
            rows={2} 
            placeholder="Ex: O botão não ficou clicável após preencher os dados..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onBlur={() => handleStatus(task.status)}
          ></textarea>

          <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1rem', display: 'block' }}>Link da Evidência (URL de Imagem / Vídeo Loom)</label>
          <input 
            type="text" 
            className="input-field" 
            placeholder="https://..."
            value={evidenceUrl}
            onChange={(e) => setEvidenceUrl(e.target.value)}
            onBlur={() => handleStatus(task.status)}
          />
        </div>
      )}
    </div>
  );
}
