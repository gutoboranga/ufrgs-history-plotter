# Gerador de gráficos do Histórico de curso da UFRGS

Este projeto tem o objetivo de criar um gráfico relacionando cada semestre cursado pelo aluno com a quantidade obtida de cada conceito possível.

Os dados para a criação de tal gráfico são extraídos do histórico de curso da UFRGS, que pode ser obtido no seguinte link:

```
https://www1.ufrgs.br/intranet/portal/public/index.php?cods=1,1,2,4
```

## Executar

Para a gerar o gráfico, é necessário salvar a página HTML do link citado no item acima com o nome `history.html` e movê-lo para dentro do diretório raiz deste projeto (`ufrgs-history-plotter/`).

Após, para criar o arquivo `.csv` usado para gerar o gráfico:

```
make dataframe
```

E para gerar o gráfico em si:

```
Rscript plot.R dataframe.csv image.png
```

## Cliente-Servidor

Uma implementação de cliente em html está disponível em [https://inf.ufrgs.br/~aboranga/grafico-historico/](https://inf.ufrgs.br/~aboranga/grafico-historico/).
