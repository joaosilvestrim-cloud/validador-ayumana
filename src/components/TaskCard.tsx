"use client";
import React, { useState } from 'react';
import { ChecklistItem, TaskStatus } from '../data/mockChecklists';

interface TaskCardProps {
  task: ChecklistItem;
  onStatusChange: (id: string, status: TaskStatus, evidence?: string, comment?: string) => void;
}

export function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const [isAddingEvidence, setIsAddingEvidence] = useState(false);
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

  return (
    <div className="task-item" data-status={task.status}>
      <div className="task-header">
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', display: 'block' }}>
            {task.category}
          </span>
          <h3 className="task-title">{task.title}</h3>
          <p className="task-desc">{task.description}</p>
        </div>
        <div className={getBadgeClass(task.status)}>
          {getStatusText(task.status)}
        </div>
      </div>

      <div className="task-actions">
        <button 
          className="btn btn-outline" 
          style={{ width: '100%', borderColor: 'var(--success)', color: task.status === 'passed' ? 'var(--success)' : 'inherit', backgroundColor: task.status === 'passed' ? 'rgba(16, 185, 129, 0.1)' : 'transparent' }} 
          onClick={() => handleStatus('passed')}
        >
          ✓ Aprovar
        </button>
        <button 
          className="btn btn-outline" 
          style={{ width: '100%', borderColor: 'var(--danger)', color: task.status === 'failed' ? 'var(--danger)' : 'inherit', backgroundColor: task.status === 'failed' ? 'rgba(239, 68, 68, 0.1)' : 'transparent' }} 
          onClick={() => {
            handleStatus('failed');
            setIsAddingEvidence(true);
          }}
        >
          ✗ Reportar Problema
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

      {(isAddingEvidence || task.comment || task.evidence) && (
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
