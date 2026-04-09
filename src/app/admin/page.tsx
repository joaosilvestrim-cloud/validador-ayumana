'use client';

import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadReports() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; // Must use Anon key for client side!
        
        if (!supabaseUrl || !supabaseKey) {
          setErrorMsg('Chaves do Supabase ausentes. Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.');
          setLoading(false);
          return;
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase
          .from('test_reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          setErrorMsg(`O banco de dados bloqueou (Possível RLS): ${error.message}`);
        } else {
          setReports(data || []);
        }
      } catch (err: any) {
        setErrorMsg(`Erro Crítico na Execução: ${err.message || String(err)}`);
      } finally {
        setLoading(false);
      }
    }
    
    loadReports();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '20vh' }}>
        <h1 className="title">⏳ Carregando Analytics...</h1>
        <p className="subtitle">Conectando ao banco de dados Ayumana.</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="container" style={{ margin: '4rem auto' }}>
        <div style={{ backgroundColor: '#fee2e2', padding: '2rem', borderRadius: '12px', border: '1px solid #ef4444' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Alerta de Conexão</h2>
          <p>Não foi possível processar os relatórios. Motivo:</p>
          <pre style={{ marginTop: '1rem', whiteSpace: 'pre-wrap', color: '#000', fontSize: '12px' }}>{errorMsg}</pre>
          <br />
          <Link href="/" className="btn btn-danger">Voltar ao App</Link>
        </div>
      </div>
    );
  }

  const totalReports = reports.length;
  let totalBugs = 0;
  let perfectSessions = 0;
  const buggyTasksMap: Record<string, number> = {};

  reports.forEach(report => {
    const results = report.checklist_results || [];
    const failedTasks = results.filter((r: any) => r.status === 'failed');
    
    totalBugs += failedTasks.length;
    
    if (failedTasks.length === 0) perfectSessions++;

    failedTasks.forEach((task: any) => {
      buggyTasksMap[task.taskId] = (buggyTasksMap[task.taskId] || 0) + 1;
    });
  });

  const perfectSessionRate = totalReports > 0 ? Math.round((perfectSessions / totalReports) * 100) : 0;
  
  let topBugTask = "N/A";
  let topBugCount = 0;
  Object.entries(buggyTasksMap).forEach(([taskId, count]) => {
    if (count > topBugCount) {
      topBugCount = count;
      topBugTask = taskId;
    }
  });

  return (
    <div className="container" style={{ maxWidth: '1200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="title" style={{ margin: 0 }}>Ayumana QA Analytics</h1>
          <p className="subtitle">Painel executivo de indicadores de falha</p>
        </div>
        <Link href="/" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>← Voltar</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid #3B82F6', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Entregas Totais</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 800, color: '#3B82F6', margin: '0.5rem 0' }}>{totalReports}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cobrindo Pacientes e Psicos</p>
        </div>
        
        <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid var(--danger)', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Bugs Rastreados 🐞</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--danger)', margin: '0.5rem 0' }}>{totalBugs}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mapeados com evidências</p>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid #EAB308', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Gargalo Crítico 🚨</h3>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#EAB308', margin: '0.5rem 0', wordBreak: 'break-word', lineHeight: 1.1 }}>{topBugTask === 'N/A' ? 'Nenhuma falha' : topBugTask}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Falhou {topBugCount} vezes</p>
        </div>

        <div className="card" style={{ padding: '1.5rem', borderTop: '4px solid var(--success)', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Jornadas sem Erros ✨</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--success)', margin: '0.5rem 0' }}>{perfectSessionRate}%</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>De aprovação orgânica</p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Nenhum relatório foi submetido pelos testadores ainda.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {reports.map((report) => {
            const date = new Date(report.created_at).toLocaleString('pt-BR');
            const results = report.checklist_results || [];
            const failedTasks = results.filter((r: any) => r.status === 'failed');

            return (
              <div key={report.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ backgroundColor: 'var(--surface-hover)', padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {report.profile === 'Psicólogo' ? '👩‍⚕️' : '🧑'} {report.volunteer_name}
                    </h3>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {report.volunteer_email} • Perfil: {report.profile} • {date}
                    </p>
                  </div>
                  {failedTasks.length > 0 ? (
                    <span className="badge badge-danger" style={{ fontSize: '0.9rem' }}>Encontrou {failedTasks.length} bug(s)</span>
                  ) : (
                    <span className="badge badge-success" style={{ fontSize: '0.9rem' }}>Sessão Limpa ✓</span>
                  )}
                </div>

                <div style={{ padding: '1.5rem' }}>
                  {report.general_feedback && (
                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Comentário Final (Feedback Geral)</h4>
                      <p style={{ fontStyle: 'italic', backgroundColor: 'var(--surface)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--primary)', fontSize: '0.95rem' }}>
                        "{report.general_feedback}"
                      </p>
                    </div>
                  )}

                  {failedTasks.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--danger)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dossiê de Problemas Enfrentados</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                        {failedTasks.map((task: any, idx: number) => (
                          <div key={idx} style={{ padding: '1.25rem', border: '1px solid var(--border)', borderRadius: '12px', backgroundColor: '#fff', position: 'relative', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            <p style={{ fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--danger)', fontSize: '0.9rem' }}>Ref: {task.taskId}</p>
                            {task.comment && (
                              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: task.evidence ? '1rem' : 0, lineHeight: 1.5 }}>
                                {task.comment}
                              </p>
                            )}
                            {task.evidence && (
                              <div style={{ marginTop: '1rem' }}>
                                <a href={task.evidence} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ display: 'block', width: '100%', textAlign: 'center', padding: '0.5rem', fontSize: '0.85rem', margin: 0 }}>
                                  📎 Ver Evidência (Print)
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
