import { Component, OnInit } from '@angular/core';
import { HubUserService } from '../../../main/shared/services/hub-user/hub-user.service';
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
  token: string | undefined;

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
AMBOS
2) Dockerizar todo mundo e criar docker compose
1) Jogar o código no Boost e pedir para comentar ou sugestões de melhoria
3) Fazer os arquivos de testes
4) Pegar as pesquisas que fiz no Boost e jogar no notion para fazer caderninho

BACKEND
2) Adicionar API Google Drive para selecionar da onde vai vim as imagens
2) Criar Handler Excetion
4) Passar em cada arquivo do Backende e verificar como tratar os erros no Hangle Exception
5) Criar procedure no banco para adicionar novo champion
6) Criar script sql, criar indices procedures etc.
8) No domain, colocar dto separados por tipo de domain
9) Retirar o atributo img do champion
10) Padronizar o tipo de DTO que os endpoints retornam
11) Upar o projeto e pedir para usar API do LoL
12) Olhar as issues do git hub
13) Melhorar a documentação do Swagger
14) Corrigir os id para naturais (string se for caso)
15) Granular os erros na BD para registro: usuario já existe? email? etc.
16) Criptografar os cookies
17) Criar verbose para para toda chamada para mapear rquisições
19) Verificar o que pode ficar dentro do token service (muita manipulação de jwt etc)

22) Explicar como mexi na interface grafica da amazon para s3 e sqs
23) Mesma coisa para API do Google
24) Durante a elaboração da BD, checzar o que do back pode ser transformado em trigger.
Ex: setar numGoodEvaluation quando inserir um evaluation (não fazer no back)


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

14) No comentários, deixar o dono do comentário commo o primeiro mesmo que a curtida nao serja condizente
15) Não deixar dar like no proprio comentario

GIT
1) Alterar a Licença de MIT para Apache
2) Fazer Readme do back e do front
3) Falar dos id artificiais

EXTRA)
1) Ver como tá o código dos meninos para ver onde posso melhorar

6h 


>> AWS S3 e IAM
 >> Problemas com Cache


>> AWS SQS, Lambda, IAM e Secrets Manager
>> IAM para o lambda acessar o Sqs e o segredo
>> Layer (para google e de pois para urllskd colocar versao correta)
  >> tem um formato correto python/info
  >> colocar comando pip
  >> tive que upar 4 versoes pra dar cerrto
>> Formato do evento SQS
 >> records alguam ocisa e depois pega
>> Credenciais de serviço e nao de auth2.0 (segre tava errado e tive que criar outro na API do google)
>> Não dá apra envair da conta  de serviç o poruqe precisaria de meial corporadtiov e um workspace da empresa
>> tem que usar oauth2.0
>> Diferença de serviço e auth2.0
>> Colocar código python qque usei noi Lambda
>> Explicar o problema do SQS que ficou enviando mensagem a cada 3 minutos por umas 5 hrs
*/
