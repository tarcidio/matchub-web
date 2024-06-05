import { Component, OnInit } from '@angular/core';
import { HubUserService } from '../../../../main/shared/services/hub-user/hub-user.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss',
})
export class ConfirmComponent implements OnInit {
  title: string | undefined;
  message: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private hubUserService: HubUserService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) =>
          this.hubUserService.confirmEmail(params.get('token')!)
        )
      )
      .subscribe({
        next: () => {
          this.title = 'Email Verification Successful!';
          this.message =
            'Your email has been successfully verified. You can now access all the features of your account.';
        },
        error: (err) => {
          this.title = 'Email Verification Failed';
          this.message =
            'Unfortunately, we were unable to verify your email. ' +
            'This might be due to an expired or invalid verification link.';
        },
      });
  }
}

/*
1. Criar atributo no backend para HubUser se a conta está ou não confirmada
2. Criar Classe para código e configurar uma tabela para ela
3. Criar service para gerar código
4. Alterar AuthService para cadastrar como não confirmado, não gerar token e enviar um email
5. Criar rota para confirmar código enviado e atualizar o cadastro da pessoa, gerando token
6. Gerar erro 409 ao logar caso o usuário tenha cadastro, mas não é confirmado 
6. Alterar login para pedir para confirmar email caso ainda não tenha (erro 409)
7. Gerar script para limpar a BD de não confirmados a cada 48 horas
*/
/*
AMBOS
1) Jogar o código no Boost e pedir para comentar ou sugestões de melhoria
2) Dockerizar todo mundo e criar docker compose
3) Fazer os arquivos de testes
4) Pegar as pesquisas que fiz no Boost e jogar no notion para fazer caderninho

BACKEND
1) Alterar backend para que possa integrar com a tela de confirmação de e-mail
2) Adicionar API Google Drive para selecionar da onde vai vim as imagens
2) Criar Handler Excetion
4) Passar em cada arquivo do Backende e verificar como tratar os erros no Hangle Exception
5) Criar procedure no banco para adicionar novo champion
6) Criar script sql, criar indices procedures etc.
7) Colocar tudo que é siligiloso no properties em algum outro JSON
8) No domain, colocar dto separados por tipo de domain
9) Retirar o atributo img do champion
10) Padronizar o tipo de DTO que os endpoints retornam
11) Upar o projeto e pedir para usar API do LoL
12) Olhar as issues do git hub
13) Melhorar a documentação do Swagger
14) Corrigir os id para naturais (string se for caso)
15) Granular os erros na BD para registro: usuario já existe? email? etc.

>> FAZENDO AGORA:
>> Fazer script para limpar que não está checkado a cada 24 hroas
>> FAzer script para limpar a tabela de tokens a cada 24 horas



FRONTEND
1) Fazer as imagens dos campeões no Home seja um carrossel que gira na horizontal
2) Alterar os guardas e as telas para que o usuários possa acessar o Home e o Screen ser estar logado
3) Fazer paginação de comentário e descobrir se precisa alterar algo no back
4) Adicionar um telinha dizendo que tá carregando quando estiver carregando comentárious enviar email para
resetar senha
5) Quebrar o componente profile em componentes menores
6) Quebrar o componente screen em area de comentários e não comentarios
7) NO home, quebrar componente no que tem hoje e mais que é a explicação do programa
8) Excluir comentários que o usuário é dono
9) Tratar cada tipo de erro que foi elaborado no back poós construção do handler

9) MOstrar todos os ocmentários e likes
10) Admind moderador
11) conexao de riot
12) Update de comentario
13) Decidir o que fazer com fama

GIT
1) Alterar a Licença de MIT para Apache
2) Fazer Readme do back e do front

EXTRA)
1) Ver como tá o código dos meninos para ver onde posso melhorar

6h 
2h
*/
