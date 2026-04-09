"use client";
import React, { useState, useEffect } from 'react';
import { TaskCard } from './TaskCard';
import { ProgressBar } from './ProgressBar';
import { BoardPath } from './BoardPath';
import { ChecklistItem, TaskStatus } from '../data/mockChecklists';

interface ChecklistProps {
  initialTasks: ChecklistItem[];
  profileName: string;
}

export default function Checklist({ initialTasks, profileName }: ChecklistProps) {
  const [tasks, setTasks] = useState<ChecklistItem[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerEmail, setVolunteerEmail] = useState('');
  
  const [feedbackNav, setFeedbackNav] = useState('sim');
  const [feedbackBugs, setFeedbackBugs] = useState('nao');
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleStatusChange = (id: string, status: TaskStatus, evidence?: string, comment?: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, status, evidence, comment } : task
      )
    );
  };

  const handleStart = () => {
    if (volunteerName.trim() && volunteerEmail.trim()) {
      setHasStarted(true);
    } else {
      alert("Por favor, preencha nome e email para iniciar os testes.");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        volunteer_name: volunteerName,
        volunteer_email: volunteerEmail,
        profile: profileName,
        checklist_results: tasks,
        feedback: {
          nav_easy: feedbackNav,
          found_bugs: feedbackBugs,
          suggestions: feedbackText
        }
      };
      
      const res = await fetch('/api/submit-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Falha ao enviar relatório.");
      setSubmitSuccess(true);
    } catch (err) {
      alert("Erro ao enviar relatório. Verifique as credenciais do banco.");
      console.error(err);
    }
    setIsSubmitting(false);
  };

  if (submitSuccess) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h1 className="title">Relatório Enviado! 🚀</h1>
        <p className="subtitle">Seu feedback e jornada foram salvos com sucesso. Obrigado por testar!</p>
        <button className="btn btn-primary" onClick={() => window.location.href = '/'}>Voltar para o Início</button>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="container">
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Identificação do Voluntário</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Antes de inciarmos o tutorial de validação ({profileName}), por favor identifique-se:</p>
          <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Nome Completo *</label>
            <input type="text" className="input-field" value={volunteerName} onChange={e => setVolunteerName(e.target.value)} placeholder="Seu nome" />
          </div>
          <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Email de Acesso *</label>
            <input type="email" className="input-field" value={volunteerEmail} onChange={e => setVolunteerEmail(e.target.value)} placeholder="Email usado no teste" />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleStart}>
            Iniciar Tutorial Passo-a-passo
          </button>
        </div>
      </div>
    );
  }

  const completedCount = tasks.filter(t => t.status === 'passed' || t.status === 'failed').length;
  const totalCount = tasks.length;
  const targetTaskIndex = tasks.findIndex(t => t.status === 'pending');

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="title">Guia de Validação: {profileName}</h1>
        <p className="subtitle">Olá <strong>{volunteerName}</strong>! Avance no tabuleiro seguindo as missões.</p>
      </div>

      <BoardPath totalCount={totalCount} completedCount={completedCount} />

      <div className="card" style={{ padding: '2rem 2rem 3rem 2rem', marginBottom: '3rem' }}>
        <ProgressBar total={totalCount} completed={completedCount} />
        
        {targetTaskIndex !== -1 && (
          <div style={{ margin: '2rem 0', padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid var(--success)', textAlign: 'center' }}>
            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>Sua tarefa atual ({completedCount + 1}/{totalCount}):</span>
            <p style={{ color: 'var(--text-main)', marginTop: '0.5rem' }}>Leia o guia abaixo, faça na plataforma e depois aprove ou reprove.</p>
          </div>
        )}

        <div className="task-list">
          {tasks.map((task, index) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onStatusChange={handleStatusChange}
              isFocused={index === targetTaskIndex}
            />
          ))}
        </div>
      </div>
      
      {completedCount === totalCount && totalCount > 0 && (
        <div className="card" style={{ borderColor: 'var(--success)' }}>
          <h2 style={{ color: 'var(--success)', marginBottom: '1rem' }}>🎉 Magnífico! Você concluiu tudo.</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Obrigado de verdade pelo esforço! Para encerrarmos, deixe um rápido feedback geral.</p>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>O sistema Ayumana é fácil de navegar e entender?</label>
            <select className="input-field" value={feedbackNav} onChange={e => setFeedbackNav(e.target.value)}>
              <option value="sim">Sim, muito fácil</option>
              <option value="parcialmente">Parcialmente</option>
              <option value="nao">Não, achei confusa</option>
            </select>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Existem muitos problemas técnicos (travamentos) inesperados?</label>
            <select className="input-field" value={feedbackBugs} onChange={e => setFeedbackBugs(e.target.value)}>
              <option value="nao">Não, o sistema é muito estável!</option>
              <option value="sim">Sim, encontrei falhas severas.</option>
            </select>
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Sugestões Abertas: O que você mudaria ou melhoraria?</label>
            <textarea className="input-field" rows={4} value={feedbackText} onChange={e => setFeedbackText(e.target.value)} placeholder="Sua opinião sincera..." />
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Finalizar Testes!'}
          </button>
        </div>
      )}
    </div>
  );
}
