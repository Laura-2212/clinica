'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/main.module.scss';

const emptyForm = { nome: '', especialidade: '' };

export default function MedicosPage() {
  const [medicos, setMedicos] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarMedicos();
  }, []);

  async function carregarMedicos() {
    setCarregando(true);
    try {
      const resposta = await fetch('/api/medicos');
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.error || 'Não foi possível carregar os médicos.');
      setMedicos(dados);
      setErro('');
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSalvando(true);
    setErro('');
    try {
      const resposta = await fetch('/api/medicos', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ...(editingId ? { id: editingId } : {}) })
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.error || 'Não foi possível salvar o médico.');
      setForm(emptyForm);
      setEditingId('');
      await carregarMedicos();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  }

  function editarMedico(medico) {
    setForm({ nome: medico.nome, especialidade: medico.especialidade });
    setEditingId(medico._id);
    setErro('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function removerMedico(id) {
    if (!window.confirm('Deseja remover este médico?')) return;
    setErro('');
    try {
      const resposta = await fetch('/api/medicos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.error || 'Não foi possível remover o médico.');
      await carregarMedicos();
    } catch (error) {
      setErro(error.message);
    }
  }

  function cancelarEdicao() {
    setEditingId('');
    setForm(emptyForm);
    setErro('');
  }

  return (
    <div className={styles.container}>
      <h1>Médicos</h1>
      {erro && <p className={styles.error} role="alert">{erro}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>{editingId ? 'Editar médico' : 'Novo médico'}</h2>
        <label>
          Nome
          <input
            value={form.nome}
            onChange={(event) => setForm({ ...form, nome: event.target.value })}
            autoComplete="name"
            required
          />
        </label>
        <label>
          Especialidade
          <input
            value={form.especialidade}
            onChange={(event) => setForm({ ...form, especialidade: event.target.value })}
            required
          />
        </label>
        <button type="submit" disabled={salvando}>
          {salvando ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Cadastrar médico'}
        </button>
        {editingId && <button type="button" onClick={cancelarEdicao}>Cancelar edição</button>}
      </form>

      <h2>Médicos cadastrados</h2>
      {carregando ? <p>Carregando médicos...</p> : (
        <table className={styles.table}>
          <thead>
            <tr><th>Nome</th><th>Especialidade</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {medicos.length === 0 ? (
              <tr><td className={styles.empty} colSpan="3">Nenhum médico cadastrado.</td></tr>
            ) : medicos.map((medico) => (
              <tr key={medico._id}>
                <td>{medico.nome}</td>
                <td>{medico.especialidade}</td>
                <td>
                  <button type="button" onClick={() => editarMedico(medico)}>Editar</button>{' '}
                  <button type="button" onClick={() => removerMedico(medico._id)}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}