import { GithubUser } from './GithubUser.js'

// Classe que vai conter a lógica dos dados
// Como os dados serão estruturados

//Aqui estou capturando o argumento passado (#app) em uma variável que será herdado pelo FavoritesView
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)

    //Aqui estamos executando a função load - para que sejam carregados os dados as entries na classe herdada - Ou seja foi passado o root (#app) o #app foi selecionado e armazenado - depois os dados foram carregador atráves do load() e o this.entries e foram herdados pela classe FavoriteView
    this.load()

    //Fazendo diretamento o GithubUsers - apenas passo como argumento no parametro o nome de usuário da pessoa e o fetch juntamente com a API do github iram fazer o trabalho para mim
    //Lembrando que isto é uma promessa sendo assim tenho que usar o then - teste no console (ATENÇÃO!!!)
    // GithubUser.search('maykbrito').then(user => console.log(user))
    // GithubUser.search('martinakbrehm').then(user => console.log(user))
  }

  load() {
    //localStorage é um método do JS dentro da DOM que serve para manipular o armazenamento local do browser - .getItem(key: string) (Serve para obter um item - e recebe como parametro UM argumento 1º é a chave que será utilizada em toda a aplicação)
    //Importante ressaltar que o localStorage.getItem (retorna um dado do tipo string - ou seja tudo o que for passada para ele será uma string) - Para corrigir isto UTILIZAMOS O JSON (Javascript object notation) que libera uma funcionalidade .parse (analisar) que converte o dado do tipo string em seu tipo de dado original (ATENÇÃO) - E ||(OU) caso não tenha nada na chave indicada e ARMAZENE UM ARRAY VAZIO
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []

    //console.log(this.entries)

    //Aqui estou declarando uma variável chamada entries (entrada) que está armazenando atráves de um array, objetos com dados que seram utilizados para construir as tr(linhas) do tbody - CONST FOI RETIRADO PARA SE TORNAR PÚBLICA A VARIÁVEL DIRETAMENTE PARA FORA DA CLASSE
    //Substituido pelo Local Storage (Armazenamento Local)
    // this.entries = [
    //   {
    //     login: 'maykbrito',
    //     name: 'Mayk Brito',
    //     public_repos: '76',
    //     followers: '9589'
    //   },
    //   {
    //     login: 'diego3g',
    //     name: 'Diego Fernandes',
    //     public_repos: '48',
    //     followers: '22503'
    //   }
    // ]
    //console.log(entries) E verificando no console estas entradas de usuários
  }
  //Função com objetivo de salvar todas as operações/interações/eventos no localstorage
  //Com a funcionalidade do localStorage .setItem(que significa definir item) - eu preciso de 2 argumento (O primeiro e a key(chave criada no getItem) e o segundo e o conteúdo em formato de string(texto) por isso é o utilizado o JSON.stringify(que está recebendo um array contendo objetos - this.entries) que será armazenado nesta chave na memória local do navegador)
  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  //Função que irá deletar usuário do entries (ou seja da entrada de dados)
  delete(user) {
    //entradas filtradas
    // Higher-order function (Funções de alta ordem): map, filter, find, reduce.
    //Ao se utilizar o filter e retornar um valor false (ele retirada o dado atráves da função) - pórem ele não retira o dado e sim constroi um dado vazio - ou seja ele não exclui os dados do array entries - sim cria um outro entries pórem vazio e deixa de usar o antigo - Principío da IMUTABILIDADE - MUITO IMPORTANTE

    //Aqui estou resumindo o código abaixo
    // this.entries = this.entries.filter(entry => entry.login !== user.login)
    //E por conta do filter - literalmente estamos retirando tudo do entries e repondo com o novo filtro (ATENÇÃO)

    const filteredEntries = this.entries.filter(
      entry => entry.login !== user.login
    )

    //Se for diferente - retorna true - se forem iguais retorna false
    //Sendo assim ao clicar no X e a função delete(user) for executada toda vez irá retornar que são iguais - pois ao .filter - fazer um novo filtro por conta do principio da imutabilidade - ele irá comparar se o entry que é o dado sendo gerado pelo .filter (O NOVO ARRAY) é igual ao user que é o dado do array antigo - E COMO OS DOIS SERAM IGUAIS - NO NOVO FILTRO ELE NÃO IRÁ FAZER PARTE - POIS O DADO IRÁ RETORNAR FALSE (POIS OS DOIS SÃO IGUAIS E NÃO DIFERENTES - SENDO ASSIM ELE SERÁ REMOVIDO DO NOVO FILTRO POR CONTA DA CONDIÇÃO !==)

    //ATENÇÃO - A CADA VEZ QUE ESTÁ FUNÇÃO RETORNAR FALSE - O ELEMENTO PELO QUAL RETORNOU FALSE - NÃO FARÁ PARTE DO NOVO FILTRO/ARRAY (Retornando true - o elemento será repetido no novo filtro/array)
    //( Ela executa uma função para cada entrada - Serve para filtrar um dado do tipo array - ou equivalente - ele pega todo os dados e faz outro filtro baseado no anterior - e o anterior deixa de valer (PRINCIPIO DA IMUTABILIDADE))

    //Bizu (Se a Arrow Function só tiver uma linha ele RETORNA (RETURN) AUTOMÁTICAMENTE) caso contrário é necessário o return
    // return true - Teste na arrow function

    //Aqui estou pegando o entries e atualizando de acordo com o filter que foi armazenado no filteredEntries - Resumido no código ativo acima
    this.entries = filteredEntries

    //Ou seja estou limpando o tbody da aplicação e substituindo pelo novo filtro de dados do entries (Ou seja reiniciando a aplicação com este novo banco de dados)
    this.update() //Isto é que torna a exclusão da tr possivel
    this.save() //Também se torna necessário ao utilizar o delete que o localStorage seja salvo - caso contrario resulta em um bug - porque ao recarregar a página ele voltará para o momento antes das exclusões

    //console.log(filteredEntries)
  }
}

// Classe que vai criar a visualização e eventos do HTML

//Aqui estou herdando a classe Favorites (que basicamente capturou o argumento #app em uma variável)
export class FavoritesView extends Favorites {
  constructor(root) {
    //Necessário para herdar o Favorites e com isso o dado armazenado (#app)
    super(root)

    //console.log(this.root) //Para exibir o elemento #app instanciado no main.js

    //Aqui estou armazenando através do root(#app) a parte do tbody da tabela
    this.tbody = this.root.querySelector('table tbody')
    // console.log(tbody) //Mostra o tbody capturado

    //Executar o a função update(atualizar)
    this.update()
    //Executar o a função onadd(para localizar o usuário na API)
    this.onadd()
  }

  //Aqui é a função que foi chamada acima
  //Ela é uma função assincrona (e fica especificado por conta da palavra reservada async antes do nome da função)
  //E esta palavra async libera uma propriedade chamada await (await = aguardando - que significa esperar pela promessa) (lembrando que promessa como fetch são assincronos))
  //Lembrando que este username de parametro é o value que esta sendo passado no onadd()
  async add(username) {
    //try(tentar)-catch(capturar)-throw(jogar-jogar fora)
    //Então tentamos seguir o fluxo normalmento
    try {
      //Estou criando uma variável para verificar se o usuário adicionado já esxiste = dai estou pegando o meu database (this.entries) .find(achar/encontrar) - que é uma high-order function (Ou seja uma função de alta order - por ser um função que o seu argument é necessário que seja uma função) - DAI ESTOU VERIFICANDO QUE SE DENTRO DO MEU DATABASE(ARRAY) TIVER UM LOGIN (NOME DE USUÁRIO) === (IGUALDADE) COM O USERNAME INSERIDO NO INPUT (ELE IRÁ RETORNAR UM VALOR TRUE - SE RETORNAR FALSO ELE CONTINUA A APLICAÇÃO NORMALMENTE)
      //ATENÇÃO - ERRO DE CASE SENSITIVE (MAIÚSCULAS E MINÚSCULAS)
      const userExist = this.entries.find(entry => entry.login === username)

      //Então se userExist for verdadeiro - vomite o seguintes erro
      if (userExist) {
        throw new Error('Usuário já cadastrado')
      }

      const user = await GithubUser.search(username)

      //console.log(user)

      //Pórem caso user.login (ou qualquer outra propriedade do user) seja igual a undefined (o que significa um erro)
      //Faça o throw (vomite) um instancia de Error (Que gera um objeto com a seguinte mensagem)
      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      //Principio da imutabilidade novamente
      //Pois estou pegando o entries e criando um novo array = Ou seja estou criando um novo array e o primeiro objeto com dado (usuário) a ser inserido será este novo usuário adcionado e logo em seguindo com a virgula e ...(reticencias) this.entries (Eu pego do antigo array todos os outros usuário que faziam parte do antigo array) formando assim um novo array - que ficará impresso na tela
      this.entries = [user, ...this.entries]

      //Atualizar a página toda
      this.update()

      //Depois salva tudo no localStorage (memória do local do navegador)
      this.save()

      //Sendo assim o catch (capturar) irá capturar este erro que irá receber o erro como parametro - irá mandar uma alert (com o propriedade message desse objeto de Error instanciado)
    } catch (error) {
      alert(error.message)
    }

    //Forma sem utilizar o async
    // const user = GithubUser.search(username).then(user => console.log(user))
  }

  //Função/Evento que irá capturar o valor do input e fazer a pesquisa na API do  Github apatir do nome inserido
  //Em adcionar
  onadd() {
    //Capturo o botão de adcionar usuário na página apartir do meu root e armazeno em uma variável
    const addButton = this.root.querySelector('.search button')
    //Crio um evento de click - Onde irei de forma desestruturada irei capturar apenas o valor do input que está no root (#app) - e apartir deste valor irei executar uma função this.add(value) com o value armazenado
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')

      this.add(value)
    }

    //console.dir(input) //Pega o input e transforma em um objeto e mostra todas as funcionalidades do input
  }

  //Função update (atualizar) que por enquanto executa a função Remove todos os tr
  update() {
    this.removeAllTr()

    //Aqui estou pegando os dados do entries que foram rodado na classe herdade e estou fazendo o forEach(para todos eles neste caso os objetos)
    this.entries.forEach(user => {
      //Aqui estou armazenando na row(linha) uma função createRow (que está criando um elemento tr no caso uma linha e está sendo retornado uma linha (tr), configurada com um padrão de html dentro deste elemento criado)
      const row = this.createRow()
      //Aqui estamos tornando os dados flexiveis - ou seja eles iram se alterando apartir dos dados armazenado no entries que estão na classe Favorites
      //console.log(row) //Aqui estou visualizando este elemento html tr (todo configurado)
      //console.log(user) //Para visualizar os dados dos objetos dentro de entries

      //Aqui alteramos a imagem de perfil
      row.querySelector(
        '.user img'
      ).src = `https://github.com/${user.login}.png`

      //Aqui alteramos o alt (descrição de acessibilidade) da imagem de perfil
      row.querySelector('.user img').alt = `Imagem de ${user.name}`

      //Aqui alteramos o nome do usuário
      row.querySelector('.user p').textContent = user.name

      //Aqui alteramos o login do Github do usuário
      row.querySelector('.user span').textContent = user.login

      //Aqui alteramos o redirecionamento do link para o Github do usuário
      row.querySelector('.user a').href = `https://github.com/${user.login}`

      //Aqui alteramos a quantidade de repositórios do Github do usuário
      row.querySelector('.repositories').textContent = user.public_repos

      //Aqui alteramos a quantidade de seguidores no Github do usuário
      row.querySelector('.followers').textContent = user.followers

      //Aqui faremos a remoção da linha atráves do botão de exclusão
      row.querySelector('.remove').onclick = () => {
        //Emite algo semelhante a um alert (para confirmar ação do tipo booleano)
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')

        //Ou seja se confirmar a ação do click - execute isto
        if (isOk) {
          //this use este método delete(user como argumento para deletar este dado)
          this.delete(user)
        }
      }

      //append() - é uma funcionalidade da DOM (Que recebe um elemento HTML) e o coloca em algum lugar - neste caso estou pegando a variável row e a passsando ele como argumento (ou seja estou passando seu dados para algum lugar) que neste caso é no tbody (ou seja estou pegando a row que está executando a função createRow que está sendo utilizada atráves do user que são os dados das entries e jogando todas no tbody dentro da tabela)
      this.tbody.append(row)
    })
  }

  //Função que irá criar uma linha(tr) do tbody
  createRow() {
    //Aqui estou criando um elemento diretamento com o JS (através do .createElement) neste caso o tr que irá armazenar toda o formato da variável content como padrão
    const tr = document.createElement('tr')

    //Aqui estou adcionando todo o content (conteúdo) ao elemento criado tr(linha) - com innerHTML (INNER significa interno)
    // DESCONSIDERAR POIS FOI RESUMIDA: Uma variável content (conteúdo) que irá armezanar todo o formato html de uma linha do body - Importante que usamos a template literals para isso ``
    tr.innerHTML = `
            <td class="user">
              <img
                src="https://github.com/maykbrito.png"
                alt="Imagem de maykbrito"
              />
              <a href="https://github.com/maykbrito" target="_blank">
                <p>Mayk Brito</p>
                <span>maykbrito</span>
              </a>
            </td>
            <!--table data (dados da tabela)-->
            <td class="repositories">76</td>
            <td class="followers">9589</td>
            <td>
              <button class="remove">&times;</button>
            </td>
    `
    //Aqui irei retornar todo o tr (no caso todo este padrão html para fora da função) - para que futuramente seja inserida dentro do código - e apresentada visualmente na tela
    return tr
  }

  //Função executada pelo update que serve para remover todos os tr da aplicação #app
  removeAllTr() {
    //Aqui estou selecionando todos os tr (linhas do tbody) e fazendo o forEach(para cada) (que significa PARA TODOS neste caso os tr do tbody) execute a função com tr(sendo o argumento) e remove() e remove todos eles ou seja os tr
    this.tbody.querySelectorAll('tr').forEach(tr => {
      // console.log(tr) //Mostra os tr(linhas) do tbody capturado
      tr.remove()
    })
  }
}