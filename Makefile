# copia o dataframe pra área de transferência
dataframe:
	@node scrapper.js > dataframe.csv
	@echo '> O dataframe está em dataframe.csv:'
	@echo
	@cat dataframe.csv

plot:
	Rscript plotter.R
	open graph.png