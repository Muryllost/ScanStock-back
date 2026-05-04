-- Criação dos tipos ENUM (Seguindo o teu modelo de status e funções específicas)
CREATE TYPE t_movimento AS ENUM ('ENTRADA', 'SAIDA');
CREATE TYPE s_geral AS ENUM ('0', '1'); -- 0 = inativo/deletado, 1 = ativo

-- Tabela de Operadores (Adaptada da tua tabela 'usuarios')
CREATE TABLE operadores (
    id_operador SERIAL PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL,
    status s_geral NOT NULL
);

select * from operadores;


-- Tabela de Movimentos de Estoque (Adaptada da tua tabela 'perguntas')
CREATE TABLE movimentos(
    id_movimento SERIAL PRIMARY KEY,
    codigo VARCHAR(255) NOT NULL,
    nome_produto VARCHAR(255) NOT NULL,
    origem VARCHAR(255) NOT NULL,
    destino VARCHAR(255) NOT NULL,
    tipo t_movimento NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0), -- Garante que a quantidade não seja zero ou negativa
    operador VARCHAR(100) NOT NULL,
    data_movimento VARCHAR(100) NOT NULL,
    status s_geral NOT NULL
);

select * from movimentos;
