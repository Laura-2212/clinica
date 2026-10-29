'use client';
import { useState, useEffect } from 'react';
import styles from '@/styles/main.module.scss';

export default function ConsultasPage() {
  const [consultas, setConsultas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [form, setForm] = useState({ paciente: '', medico: '', dataHora: '' });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setCarregando(true);
    try {
      const respostas = await Promise.all([
        fetch('/api/consultas'),
        fetch('/api/pacientes'),
        fetch('/api/medicos')
      ]);
      const dados = await Promise.all(respostas.map((resposta) => resposta.json()));
      const falha = respostas.findIndex((resposta) => !resposta.ok);
      if (falha !== -1) throw new Error(dados[falha].error || 'Não foi possível carregar os dados.');
      setConsultas(dados[0]);
      setPacientes(dados[1]);
      setMedicos(dados[2]);
      setErro('');
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setSalvando(true);
    try {
      const res = await fetch('/api/consultas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Não foi possível agendar a consulta.');
      setForm({ paciente: '', medico: '', dataHora: '' });
      await carregarDados();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  }

  async function atualizarStatus(id, status) {
    setErro('');
    try {
      const resposta = await fetch('/api/consultas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.error || 'Não foi possível atualizar o status.');
      await carregarDados();
    } catch (error) {
      setErro(error.message);
    }
  }

  return (
    <div className={styles.container}>
      <h1>Agenda de consultas</h1>
      <p className={styles.intro}>Organize os atendimentos da Raiz &amp; Vida com praticidade.</p>

      {erro && <p className={styles.error} role="alert">{erro}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Nova consulta</h2>
        <select 
          value={form.paciente} 
          onChange={e => setForm({ ...form, paciente: e.target.value })}
          required
        >
          <option value="">Selecione o Paciente</option>
          {pacientes.map(p => <option key={p._id} value={p._id}>{p.nome}</option>)}
        </select>

        <select 
          value={form.medico} 
          onChange={e => setForm({ ...form, medico: e.target.value })}
          required
        >
          <option value="">Selecione o Médico</option>
          {medicos.map(m => <option key={m._id} value={m._id}>{m.nome} ({m.especialidade})</option>)}
        </select>

        <input 
          type="datetime-local" 
          value={form.dataHora} 
          onChange={e => setForm({ ...form, dataHora: e.target.value })}
          required 
        />

        <button type="submit" disabled={salvando || pacientes.length === 0 || medicos.length === 0}>
          {salvando ? 'Agendando...' : 'Agendar consulta'}
        </button>
        {(pacientes.length === 0 || medicos.length === 0) && !carregando && (
          <p>Cadastre ao menos um paciente e um médico antes de agendar.</p>
        )}
      </form>

      <h2>Consultas agendadas</h2>
      {carregando ? <p>Carregando consultas...</p> : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Data e Hora</th>
              <th>Paciente</th>
              <th>Médico</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {consultas.length === 0 ? (
              <tr><td className={styles.empty} colSpan="5">Nenhuma consulta cadastrada.</td></tr>
            ) : consultas.map((c) => (
              <tr key={c._id}>
                <td>{new Date(c.dataHora).toLocaleString('pt-BR')}</td>
                <td>{c.paciente?.nome || 'Paciente removido'}</td>
                <td>{c.medico ? `${c.medico.nome} (${c.medico.especialidade})` : 'Médico removido'}</td>
                <td className={styles[`status${c.status}`]}>{c.status}</td>
                <td>
                  <select
                    aria-label={`Status da consulta de ${c.paciente?.nome || 'paciente'}`}
                    value={c.status}
                    onChange={(e) => atualizarStatus(c._id, e.target.value)}
                  >
                    <option value="Agendada">Agendada</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="Realizada">Realizada</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}