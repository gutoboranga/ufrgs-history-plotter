# copia o dataframe pra área de transferência
dataframe:
	@node scrapper.js > dataframe.txt
	@echo '> O dataframe está em dataframe.txt:'
	@echo
	@cat dataframe.txt
