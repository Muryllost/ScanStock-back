import express, { Router } from "express";
import sql from "./bd.js";
import { CompararHash, CriarHash } from "./utils.js";

const routes = express.Router();

//* Login de Operadores
routes.post("/login", async (req, res) => {
  const { nome } = req.body;
  try {
    const consulta = await sql`
            SELECT id_operador, nome, status
            FROM operadores
            WHERE nome = ${nome} AND status = '1'
        `;

    if (consulta.length == 0) {
      return res
        .status(401)
        .json("Operador não encontrado. Por favor, efetua o registo.");
    }

    const operador = consulta[0];
    return res.status(200).json({
      id_operador: operador.id_operador,
      nome: operador.nome,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Um erro inesperado ocorreu");
  }
});

//* Cadastro de Operadores
routes.post("/operador", async (req, res) => {
  try {
    const { nome } = req.body;

    if (!nome || nome.trim() === "") {
      return res.status(400).json({ mensagem: "O nome é obrigatório" });
    }

    const consulta =
      await sql`SELECT id_operador FROM operadores WHERE nome = ${nome}`;

    if (consulta.length > 0) {
      return res.status(401).json({ mensagem: "Operador já cadastrado" });
    }

    await sql`
            INSERT INTO operadores(nome, status)
            VALUES (${nome}, '1')
        `;

    return res.status(201).json({ mensagem: "Operador criado com sucesso" });
  } catch (error) {
    if (error.code === "23502" || error.code === "23505") {
      return res.status(409).json({ mensagem: "Violação de regra do bd" });
    } else {
      console.error(error);
      return res.status(500).json({ mensagem: "Erro inesperado" });
    }
  }
});

//* Registar novo movimento
routes.post("/movimento", async (req, res) => {
  try {
    const { codigo, nomeProduto, origem, destino, tipo, quantidade, operador } =
      req.body;

    if (
      !codigo ||
      codigo === "" ||
      !nomeProduto ||
      nomeProduto === "" ||
      !origem ||
      origem === "" ||
      !destino ||
      destino === "" ||
      !tipo ||
      tipo === "" ||
      !quantidade ||
      !operador ||
      operador === ""
    ) {
      return res.status(400).json("Todos os campos são obrigatórios");
    }

    const data_atual = new Date().toLocaleString("pt-PT");

    await sql`
            INSERT INTO movimentos (codigo, nome_produto, origem, destino, tipo, quantidade, operador, data_movimento) 
            VALUES (${codigo}, ${nomeProduto}, ${origem}, ${destino}, ${tipo}, ${quantidade}, ${operador}, ${data_atual});
        `;
    return res.status(201).json("Movimento registado com sucesso");
  } catch (error) {
    if (error.code === "23502" || error.code === "23505") {
      return res.status(409).json("Violação de regra do bd");
    } else {
      console.error(error);
      return res.status(500).json("Erro inesperado");
    }
  }
});

// Busca histórico
routes.get("/movimentos", async (req, res) => {
  try {
    // Traz os movimentos mais recentes primeiro
    const consulta =
      await sql`SELECT * FROM movimentos ORDER BY id_movimento DESC`;
    return res.status(200).json(consulta);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Ocorreu um erro inesperado");
  }
});

// deletar Histórico
routes.delete("/movimentos", async (req, res) => {
  try {
    await sql`DELETE FROM movimentos;`;
    return res.status(204).send(); // 204 = No Content
  } catch (error) {
    console.error("Erro ao limpar histórico:", error);
    return res.status(500).json("Ocorreu um erro ao limpar os dados");
  }
});

export default routes;
