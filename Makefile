# copia o dataframe pra área de transferência
dataframe:
	@node scrapper.js > dataframe.txt
	@echo '> O dtataframe está em dataframe.txt:'
	@echo
	@cat dataframe.txt