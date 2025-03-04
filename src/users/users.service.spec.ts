/*Testes Unitarios
> AAA
> Configuração do test (Arrange)
> Algo que deseja fazer a ação (Act)
> Conferir se ação foi esperada (Assert)
*/

describe('UsersService', () => {
  it('desveria testar o modulo users', () => {
    const numero1 = 150;
    const numero2 = 100;

    const conta = numero1 - numero2;

    expect(conta).toBe(50);
    //espera que a conta seja igual a 50
  });
});
