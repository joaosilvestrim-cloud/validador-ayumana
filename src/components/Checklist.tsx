"use client";
import React, { useState, useEffect } from 'react';
import { TaskCard } from './TaskCard';
import { ProgressBar } from './ProgressBar';
import { ChecklistItem, TaskStatus } from '../data/mockChecklists';

interface ChecklistProps {
  initialTasks: ChecklistItem[];
  profileName: string;
}

export default function Checklist({ initialTasks, profileName }: ChecklistProps) {
  // states
  const [tasks, setTasks] = useState<ChecklistItem[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Volunteer Info
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerEmail, setVolunteerEmail] = useState('');

  // Feedback Info
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
      alert("Erro ao enviar relatório. Verifique se as variáveis de ambiente do banco de dados (Supabase) estão configuradas.");
      console.error(err);
    }
    setIsSubmitting(false);
  };

  if (submitSuccess) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h1 className="title">Relatório Enviado! 🚀</h1>
        <p className="subtitle">Seu plano de testes foi salvo com sucesso no banco de dados.</p>
        <button className="btn btn-primary" onClick={() => window.location.href = '/'}>Voltar para o Início</button>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="container">
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Identificação do Voluntário</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Antes de iniciarmos as jornadas de {profileName}, por favor identifique-se:</p>
          
          <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Nome Completo *</label>
            <input type="text" className="input-field" value={volunteerName} onChange={e => setVolunteerName(e.target.value)} placeholder="Seu nome" />
          </div>
          
          <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Email de Acesso *</label>
            <input type="email" className="input-field" value={volunteerEmail} onChange={e => setVolunteerEmail(e.target.value)} placeholder="Email usado no teste" />
          </div>

          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleStart}>
            Iniciar Roteiro de Testes
          </button>
        </div>
      </div>
    );
  }

  const completedCount = tasks.filter(t => t.status === 'passed' || t.status === 'failed').length;
  const totalCount = tasks.length;

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="title">Validação: {profileName}</h1>
        <p className="subtitle">Executando os testes como: <strong>{volunteerName} ({volunteerEmail})</strong></p>
      </div>

      <div className="card" style={{ padding: '2rem 2rem 3rem 2rem', marginBottom: '3rem' }}>
        <ProgressBar total={totalCount} completed={completedCount} />
        
        <div className="task-list">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
          ))}
        </div>
      </div>
      
      {completedCount === totalCount && totalCount > 0 && (
        <div className="card" style={{ borderColor: 'var(--success)' }}>
          <h2 style={{ color: 'var(--success)', marginBottom: '1rem' }}>🎉 Bônus! Ficha de Feedback</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Você concluiu todas as validações! Por favor, dedique 1 minuto para o feedback geral final.</p>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>A plataforma foi fácil de navegar e entender?</label>
            <select className="input-field" value={feedbackNav} onChange={e => setFeedbackNav(e.target.value)}>
              <option value="sim">Sim, muito fácil</option>
              <option value="parcialmente">Parcialmente</option>
              <option value="nao">Não, achei confusa</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Você encontrou alguma funcionalidade travada ou comportamento inesperado?</label>
            <select className="input-field" value={feedbackBugs} onChange={e => setFeedbackBugs(e.target.value)}>
              <option value="nao">Não, tudo funcionou conforme listado</option>
              <option value="sim">Sim (já reportados nas tarefas acima)</option>
            </select>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Sugestões Abertas: O que você mudaria ou melhoraria na plataforma?</label>
            <textarea className="input-field" rows={4} value={feedbackText} onChange={e => setFeedbackText(e.target.value)} placeholder="Sua opinião sincera..." />
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Finalizar e Salvar Relatório no Banco de Dados'}
          </button>
        </div>
      )}
    </div>
  );
}
