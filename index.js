const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());  // conversar entre protocolos diferentes exemplo (http e https);

const conexao = mysql.createConnection({
    host: '172.17.0.1',
    port: '6520',
    user: 'root',
    password: '123@senac',
    database: 'bancoloja'
});
conexao.connect((erro)=>{
    if(erro){
        return console.error(`Não conectou -> ${erro}`);
    }
    console.log(`Banco de dados online -> ${conexao.threadId}`);
});

app.get("/usuarios/listar/",(req,res)=>{
    conexao.query("select * from usuario",(erro, dados)=>{
        if(erro)return res.status(500).send({output:`Erro -> ${erro}`});
        res.status(200).send({output: dados });
    });
});

app.post("/usuario/cadastro/",(req,res)=>{
    if(req.body.nomeusuario == "" ||
    req.body.senha == "" ||
    req.body.email == "" ||
    req.body.nomecompleto == "" ||
    req.body.cpf == "" || 
    req.body.foto == ""
    ){
        return res.status(400).send({output:`Você deve colocar todos os dados`});
    }
    conexao.query("insert into usuario set ?", req.body,(error, data)=>{
        if(error) return res.status(500).send({output:`Erro ao tentar cadastrar -> ${error}`})
        res.status(201).send({output:`Usuario cadastrado`,dados:data})
    });
});

app.post("/usuarios/login/",(req,res)=>{
    if(req.body.usuario == "" ||
    req.body.senha == "" ){
        return res.status(400).send({output:`Você deve passar todos os dados`})
    };
    conexao.query("select * from usuario where nomeusuario=? and senha=?",[req.body.nomeusuario,req.body.senha],(error, data)=>{
        if(error) return res.status(500).send({output:`Erro ao tentar logar -> ${error}`})
        res.status(200).send({output:`Logado`,dados:data})
    });
});

app.put("/usuarios/atualizar/:id",(req,res)=>{
    conexao.query("update usuario set ? where id=?", [req.body,req.params.id], (error,data)=>{
        if(error) return res.status(500).send({output:`Erro ao tentar atualizar os dados -> ${error}`})

        res.status(200).send({output:`Atualizado`,dados:data})
    });
});


app.listen("3000", ()=> console.log("Servidor do F's online"));



