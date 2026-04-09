import React from 'react';
import Link from 'next/link';
import Checklist from '@/components/Checklist';
import { psychologistChecklist } from '@/data/mockChecklists';

export default function PsychologistPage() {
  return (
    <>
      <nav className="navbar">
        <Link href="/" className="back-link">
          <span>←</span> Voltar para Seleção
        </Link>
        <span className="badge badge-success" style={{ padding: '0.5rem 1rem' }}>Perfil: Psicólogo</span>
      </nav>
      
      <main style={{ padding: '2rem 0' }}>
        <Checklist initialTasks={psychologistChecklist} profileName="Psicólogo" />
      </main>
    </>
  );
}
