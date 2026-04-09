import React from 'react';
import Link from 'next/link';
import Checklist from '@/components/Checklist';
import { patientChecklist } from '@/data/mockChecklists';

export default function PatientPage() {
  return (
    <>
      <nav className="navbar">
        <Link href="/" className="back-link">
          <span>←</span> Voltar para Seleção
        </Link>
        <span className="badge badge-pending" style={{ padding: '0.5rem 1rem', borderColor: 'var(--secondary)', color: 'var(--secondary)' }}>Perfil: Paciente</span>
      </nav>

      <main style={{ padding: '2rem 0' }}>
        <Checklist initialTasks={patientChecklist} profileName="Paciente" />
      </main>
    </>
  );
}
