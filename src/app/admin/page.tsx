import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import React from 'react';

// Force dynamic rendering so it always fetches latest reports
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseKey) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '10vh' }}>
        <h1 className="title">Chaves Incompletas</h1>
        <p className="subtitle">Não foi possível carregar os relatórios. Verifique suas variáveis de ambiente na Vercel.</p>
        <Link href="/" className="btn btn-primary">Voltar para o Início</Link>
      </div>
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch all reports
  const { data: reports, error } = await supabase
    .from('test_reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="container" style={{ margin: '4rem auto' }}>
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--danger)' }}>
          <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Erro ao ler banco de dados</h2>
          <p>Se você estiver recebendo esse erro, provavelmente a tabela <code>test_reports</code> não está pública para leitura.</p>
          <pre style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>{error.message}</pre>
        </div>
      </div>
    );
  }

  // Calculate some stats
  const totalReports = reports?.length || 0;
  
  return (
    <div className="container" style={{ maxWidth: '1200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="title">Painel Geral de Avaliação QA</h1>
          <p className="subtitle">Relatórios oficiais submetidos pelos voluntários</p>
        </div>
        <Link href="/" className="btn btn-outline">← Voltar ao App</Link>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        <div className="card" style={{ flex: 1, textAlign: 'center', padding: '1.5rem', borderTop: '4px solid var(--primary)' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total de Entregas</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', margin: '0.5rem 0 0 0' }}>{totalReports}</p>
        </div>
      </div>

      <div className="card" style={{ padding: '0' }}>
        {reports?.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Nenhum relatório foi submetido ainda.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem' }}>
            {reports?.map((report) => {
              const date = new Date(report.created_at).toLocaleString('pt-BR');
              const results = report.checklist_results || [];
              const failedTasks = results.filter((r: any) => r.status === 'failed');

              return (
                <div key={report.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  {/* Header */}
                  <div style={{ backgroundColor: 'var(--surface-hover)', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {report.profile === 'Psicólogo' ? '👩‍⚕️' : '🧑'} {report.volunteer_name}
                      </h3>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {report.volunteer_email} • {date} • Perfil: {report.profile}
                      </p>
                    </div>
                    {failedTasks.length > 0 ? (
                      <span className="badge badge-danger">Encontrou {failedTasks.length} bug(s)</span>
                    ) : (
                      <span className="badge badge-success">Sessão Perfeita ✓</span>
                    )}
                  </div>

                  {/* Body */}
                  <div style={{ padding: '1.5rem' }}>
                    {report.general_feedback && (
                      <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Feedback Geral do Usuário</h4>
                        <p style={{ fontStyle: 'italic', backgroundColor: 'var(--surface)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                          "{report.general_feedback}"
                        </p>
                      </div>
                    )}

                    {failedTasks.length > 0 ? (
                      <div>
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--danger)', marginBottom: '1rem', textTransform: 'uppercase' }}>⚠ Relatório de Bugs Específicos</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {failedTasks.map((task: any, idx: number) => (
                            <div key={idx} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', position: 'relative' }}>
                              <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>ID da Tarefa: {task.taskId}</p>
                              
                              {task.comment && (
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: task.evidence ? '1rem' : 0 }}>
                                  <strong>Descrição do Erro:</strong> {task.comment}
                                </p>
                              )}
                              
                              {task.evidence && (
                                <div>
                                  <a href={task.evidence} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
                                    📎 Ver Evidência (Supabase Imagem)
                                  </a>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p style={{ color: 'var(--text-muted)' }}>O voluntário não encontrou nenhum erro nas tarefas. Tudo funcionou como esperado!</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
