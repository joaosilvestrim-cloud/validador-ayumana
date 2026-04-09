"use client";
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ChecklistItem, TaskStatus } from '../data/mockChecklists';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
// Singleton client
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

interface TaskCardProps {
  task: ChecklistItem;
  onStatusChange: (id: string, status: TaskStatus, evidence?: string, comment?: string) => void;
  isFocused?: boolean;
}

export function TaskCard({ task, onStatusChange, isFocused = false }: TaskCardProps) {
  const [showTutorial, setShowTutorial] = useState(isFocused);
  const [comment, setComment] = useState(task.comment || '');
  const [evidenceUrl, setEvidenceUrl] = useState(task.evidence || '');
  const [isUploading, setIsUploading] = useState(false);
  const [draftStatus, setDraftStatus] = useState<TaskStatus | null>(null);
  const [isAddingEvidence, setIsAddingEvidence] = useState(false);

  // Deriva o status visual (se estivermos draftando um erro, mostramos como falha localmente, mas não fechamos o card)
  const displayStatus = draftStatus || task.status;

  const handleStatusAndAdvance = (finalStatus: TaskStatus, urlOverride?: string) => {
    onStatusChange(task.id, finalStatus, urlOverride ?? evidenceUrl, comment);
    setDraftStatus(null);
    setIsAddingEvidence(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!supabase) {
      alert("⚠️ As chaves do banco não foram injetadas! Você precisa ir na Vercel > Settings > Environment Variables, conferir se as variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY estão certinhas (sem o sinal de = no nome), e DEPOIS apertar nos 3 pontinhos (...) do último deploy em 'Deployments' e dar Redeploy!");
      return;
    }

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${task.id}_${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('evidencias')
      .upload(filePath, file);

    if (uploadError) {
      console.error(uploadError);
      alert(`Erro no Supabase: ${uploadError.message}. \n\nDica: Se estiver dando erro de 'Policy' ou 'RLS', vá no Supabase > Storage > Policies, e adicione uma política permitindo 'INSERT' para todos.`);
      setIsUploading(false);
      return;
    }

    const { data } = supabase.storage.from('evidencias').getPublicUrl(filePath);
    setEvidenceUrl(data.publicUrl);
    // Don't auto-advance on upload, just save locally
    setIsUploading(false);
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

  // We are 'completed' computationally IF the real task was published, AND we are not draft-editing it
  const isCompleted = task.status !== 'pending' && !draftStatus;

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
        <div className={getBadgeClass(displayStatus)}>
          {getStatusText(displayStatus)}
        </div>
      </div>

      {/* Tutorial Area */}
      {task.tutorialSteps && task.status === 'pending' && !isCompleted && (
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
          style={{ width: '100%', borderColor: 'var(--success)', color: displayStatus === 'passed' ? 'var(--success)' : 'inherit', backgroundColor: displayStatus === 'passed' ? 'var(--surface-hover)' : 'transparent' }} 
          onClick={() => {
            if (isAddingEvidence) {
               setDraftStatus('passed');
            } else {
               handleStatusAndAdvance('passed');
            }
          }}
        >
          ✓ Deu Certo
        </button>
        <button 
          className="btn btn-outline" 
          style={{ width: '100%', borderColor: 'var(--danger)', color: displayStatus === 'failed' ? 'var(--danger)' : 'inherit', backgroundColor: displayStatus === 'failed' ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }} 
          onClick={() => {
            setDraftStatus('failed');
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
            style={{ backgroundColor: 'var(--surface)' }}
          ></textarea>

          <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1rem', display: 'block' }}>Anexar Captura de Tela (Print)</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <label className="btn btn-primary" style={{ cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.875rem', margin: 0, opacity: isUploading ? 0.7 : 1 }}>
              {isUploading ? 'Enviando...' : '📎 Escolher Imagem'}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} disabled={isUploading} />
            </label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ou cole a URL..."
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              style={{ marginTop: 0, backgroundColor: 'var(--surface)' }}
            />
          </div>
          
          {evidenceUrl && (
            <div style={{ marginTop: '0.5rem' }}>
              <a href={evidenceUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontSize: '0.875rem', textDecoration: 'underline' }}>
                Ver Imagem Anexada
              </a>
            </div>
          )}

          <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
            <button 
              className="btn btn-primary" 
              onClick={() => handleStatusAndAdvance(displayStatus === 'pending' ? 'failed' : displayStatus)}
            >
              Confirmar e Avançar 🎯
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
