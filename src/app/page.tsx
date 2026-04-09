import Link from "next/link";

export default function Home() {
  return (
    <main className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="title">Plataforma de Validação</h1>
        <p className="subtitle">
          Bem-vindo ao portal de testes da nossa plataforma. Sua colaboração é fundamental para garantirmos a melhor experiência.
          Selecione seu perfil abaixo para iniciar o checklist.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        <Link href="/psychologist" className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', textDecoration: 'none' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👩‍⚕️</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Sou Psicólogo</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Valide ferramentas como gestão de agenda, prontuários, videochamadas e área de faturamento.
          </p>
          <div className="btn btn-primary" style={{ width: '100%' }}> Iniciar Testes de Psicólogo </div>
        </Link>

        <Link href="/patient" className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', textDecoration: 'none' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Sou Paciente</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Valide ferramentas como pesquisa de profissionais, agendamento de consultas, pagamentos e chat.
          </p>
          <div className="btn btn-outline" style={{ width: '100%', borderColor: 'var(--secondary)', color: 'var(--secondary)' }}> Iniciar Testes de Paciente </div>
        </Link>
        
      </div>
    </main>
  );
}
