export type TaskStatus = 'pending' | 'passed' | 'failed';

export interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  status: TaskStatus;
  evidence?: string;
  comment?: string;
}

export const psychologistChecklist: ChecklistItem[] = [
  // Autenticação
  { id: 'PSI-01', category: 'Autenticação', title: 'Login com credenciais válidas', description: 'Acesse a URL, insira o email e senha fornecidos e verifique o redirecionamento para o Dashboard.', status: 'pending' },
  { id: 'PSI-02', category: 'Autenticação', title: 'Login com credenciais inválidas', description: 'Digite um email inexistente ou senha errada e observe se o sistema exibe mensagem de erro clara e bloqueia o acesso.', status: 'pending' },
  { id: 'PSI-03', category: 'Autenticação', title: 'Recuperação de senha por email', description: 'Use a opção "Esqueci minha senha" e verifique se o email de recuperação (pelo Mailsender) chega e o link funciona para redefinir.', status: 'pending' },
  // Perfil Completo
  { id: 'PSI-04', category: 'Perfil Completo', title: 'Configurar perfil completo', description: 'Preencha todos os dados no perfil (nome, CRP, especialidades, foto, apresentação) e salve.', status: 'pending' },
  { id: 'PSI-05', category: 'Perfil Completo', title: 'Ativar visibilidade no showcase', description: 'Ative a opção "Aparecer na busca" e acesse publicamente em uma aba anônima para verificar.', status: 'pending' },
  { id: 'PSI-06', category: 'Perfil Completo', title: 'Configurar disponibilidade de agenda', description: 'Configure dias e horários e confirme se aparecem corretamente como slots disponíveis na Agenda Livre.', status: 'pending' },
  // Loja Estratégica — Serviços de IA
  { id: 'PSI-07', category: 'Loja Estratégica - IA', title: 'Bio Profissional Magnética', description: 'Preencha especialidade e público e gere o conteúdo. Verifique se custou 10 AC e o resultado foi gerado e copiado.', status: 'pending' },
  { id: 'PSI-08', category: 'Loja Estratégica - IA', title: 'Plano de Tratamento', description: 'Insira abordagem e diagnóstico para gerar o plano. Verifique o custo de 15 AC e a estrutura do resultado.', status: 'pending' },
  { id: 'PSI-09', category: 'Loja Estratégica - IA', title: 'Análise de Sessão', description: 'Cole anotações de sessão, gere os insights e avalie a coerência cobrando 20 AC.', status: 'pending' },
  { id: 'PSI-10', category: 'Loja Estratégica - IA', title: 'Resumo Clínico', description: 'Gere um resumo estruturado baseado em queixa principal e histórico. Verifique débito de 12 AC.', status: 'pending' },
  { id: 'PSI-11', category: 'Loja Estratégica - IA', title: 'Prescrição de Técnicas', description: 'Solicite prescrição baseada em sintomas e verifique utilidade da resposta (custa 20 AC).', status: 'pending' },
  { id: 'PSI-12', category: 'Loja Estratégica - IA', title: 'Serviço com saldo insuficiente', description: 'Com o saldo vazio, tente gerar o conteúdo. Deve retornar erro sem debitar nada.', status: 'pending' },
  // Loja Estratégica — Alma Ayumana
  { id: 'PSI-13', category: 'Loja Estratégica - Alma', title: 'Solicitar serviço Alma Ayumana', description: 'Escolha um pacote e preencha o formulário de pedido. Confirme débito e se o status mudou para Pendente em "Meus Pedidos".', status: 'pending' },
  // Carteira
  { id: 'PSI-14', category: 'Carteira', title: 'Verificar débito correto', description: 'Avalie se após usar um serviço a carteira atualizou o saldo exatamente com a diferença.', status: 'pending' },
  { id: 'PSI-15', category: 'Carteira', title: 'Histórico de transações', description: 'Confirme se a descrição, tipo, data e valor constam corretamente e de forma decrescente.', status: 'pending' },
  { id: 'PSI-16', category: 'Carteira', title: 'Solicitar saque de AyuCoins', description: 'Tente sacar o saldo livre para uma chave PIX. Verifique a subtração e o status do pedido.', status: 'pending' },
  // Agenda e Sessões
  { id: 'PSI-17', category: 'Agenda e Sessões', title: 'Visualizar sessões agendadas', description: 'Verifique os dados da sessão (data, paciente, status) e se bloqueia slot em Agenda Livre.', status: 'pending' },
  { id: 'PSI-18', category: 'Agenda e Sessões', title: 'Acessar sala Whereby da sessão', description: 'Clique no link da sessão agendada e confirme se você entra como host com áudio/vídeo ok.', status: 'pending' },
];

export const patientChecklist: ChecklistItem[] = [
  // Autenticação
  { id: 'PAC-01', category: 'Autenticação', title: 'Cadastro de novo paciente', description: 'Preencha os dados em Criar Conta e verifique se o email de boas-vindas é recebido.', status: 'pending' },
  { id: 'PAC-02', category: 'Autenticação', title: 'Login com credenciais válidas', description: 'Realize login para acessar o Dashboard do paciente.', status: 'pending' },
  { id: 'PAC-03', category: 'Autenticação', title: 'Login com credenciais inválidas', description: 'Tente acessar com senha errada e verifique se a mensagem de erro é clara e não expõe dados.', status: 'pending' },
  { id: 'PAC-04', category: 'Autenticação', title: 'Recuperação de senha por email', description: 'Use a opção "Esqueci minha senha", abra o link recebido e crie uma nova senha.', status: 'pending' },
  // Busca de Profissionais
  { id: 'PAC-05', category: 'Busca de Profissionais', title: 'Buscar profissionais por nome', description: 'Busque o nome de um psicólogo de teste e confira se o card dele aparece corretamente.', status: 'pending' },
  { id: 'PAC-06', category: 'Busca de Profissionais', title: 'Filtrar profissionais por critérios', description: 'Aplique filtros (ex: TCC, Online) e verifique se apenas psicólogos que atendem aos padrões aparecem.', status: 'pending' },
  { id: 'PAC-07', category: 'Busca de Profissionais', title: 'Visualizar perfil do psicólogo', description: 'Abra um card e confira se as informações, como CRP, abordagens e botão de Agendar, estão visíveis.', status: 'pending' },
  { id: 'PAC-08', category: 'Busca de Profissionais', title: 'Favoritar e desfavoritar', description: 'Clique no botão de favoritar, confira a aba Favoritos e depois desfaça a ação.', status: 'pending' },
  // Agendamento de Sessão
  { id: 'PAC-09', category: 'Agendamento', title: 'Agendar com saldo suficiente', description: 'Escolha data e hora, revise o custo e confirme o agendamento da sessão.', status: 'pending' },
  { id: 'PAC-10', category: 'Agendamento', title: 'Tentar agendar sem saldo suficiente', description: 'Tente agendar um profissional com valor maior que o seu saldo e veja se o sistema te bloqueia.', status: 'pending' },
  { id: 'PAC-11', category: 'Agendamento', title: 'Verificar confirmação de agendamento', description: 'Vá em "Minhas Sessões" e cheque o status Agendada e se o link Whereby foi gerado.', status: 'pending' },
  { id: 'PAC-12', category: 'Agendamento', title: 'Cancelar sessão agendada', description: 'Cancele a sessão que você agendou e veja se as AyuCoins foram estornadas.', status: 'pending' },
  // Sessão
  { id: 'PAC-13', category: 'Sessão', title: 'Acessar sala Whereby', description: 'Em "Minhas Sessões", clique no link Whereby e tente entrar com áudio/vídeo liberados.', status: 'pending' },
  { id: 'PAC-14', category: 'Sessão', title: 'Verificar histórico de sessões', description: 'Acesse seu Histórico e veja se as sessões canceladas/concluídas listam corretamente.', status: 'pending' },
  // Carteira e AyuCoins
  { id: 'PAC-15', category: 'Carteira', title: 'Comprar AyuCoins via PIX', description: 'Escolha um pacote e veja se a carteira indica o método PIX corretamente, com QR code.', status: 'pending' },
  { id: 'PAC-16', category: 'Carteira', title: 'Verificar saldo após compra', description: 'Confirme que o saldo aumentou exatamente pelo valor pago e se refletiu no header da página.', status: 'pending' },
  { id: 'PAC-17', category: 'Carteira', title: 'Verificar histórico de transações', description: 'Veja se as compras constam como "crédito" e agendamentos como "débito" na listagem cronológica.', status: 'pending' },
  // Perfil Pessoal
  { id: 'PAC-18', category: 'Perfil Pessoal', title: 'Configurar perfil pessoal', description: 'Acesse Perfil Completo, preencha seus dados de queixa e preferências, verifique se salva tudo ok.', status: 'pending' },
];
