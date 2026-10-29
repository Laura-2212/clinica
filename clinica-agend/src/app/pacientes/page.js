'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/main.module.scss';

const emptyForm = { nome: '', telefone: '' };

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarPacientes();
  }, []);

  async function carregarPacientes() {
    setCarregando(true);
    try {
      const resposta = await fetch('/api/pacientes');
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.error || 'Não foi possível carregar os pacientes.');
      setPacientes(dados);
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
      const resposta = await fetch('/api/pacientes', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ...(editingId ? { id: editingId } : {}) })
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.error || 'Não foi possível salvar o paciente.');
      setForm(emptyForm);
      setEditingId('');
      await carregarPacientes();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  }

  function editarPaciente(paciente) {
    setForm({ nome: paciente.nome, telefone: paciente.telefone });
    setEditingId(paciente._id);
    setErro('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function removerPaciente(id) {
    if (!window.confirm('Deseja remover este paciente?')) return;
    setErro('');
    try {
      const resposta = await fetch('/api/pacientes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.error || 'Não foi possível remover o paciente.');
      await carregarPacientes();
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
      <h1>Pacientes</h1>
      {erro && <p className={styles.error} role="alert">{erro}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>{editingId ? 'Editar paciente' : 'Novo paciente'}</h2>
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
          Telefone
          <input
            type="tel"
            value={form.telefone}
            onChange={(event) => setForm({ ...form, telefone: event.target.value })}
            autoComplete="tel"
            required
          />
        </label>
        <button type="submit" disabled={salvando}>
          {salvando ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Cadastrar paciente'}
        </button>
        {editingId && <button type="button" onClick={cancelarEdicao}>Cancelar edição</button>}
      </form>

      <h2>Pacientes cadastrados</h2>
      {carregando ? <p>Carregando pacientes...</p> : (
        <table className={styles.table}>
          <thead>
            <tr><th>Nome</th><th>Telefone</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {pacientes.length === 0 ? (
              <tr><td className={styles.empty} colSpan="3">Nenhum paciente cadastrado.</td></tr>
            ) : pacientes.map((paciente) => (
              <tr key={paciente._id}>
                <td>{paciente.nome}</td>
                <td>{paciente.telefone}</td>
                <td>
                  <button type="button" onClick={() => editarPaciente(paciente)}>Editar</button>{' '}
                  <button type="button" onClick={() => removerPaciente(paciente._id)}>Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}