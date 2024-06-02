import { Component } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss'
})
export class ConfirmComponent {

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
