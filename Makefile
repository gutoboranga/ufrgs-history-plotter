all:	dataframe plot

# copia o dataframe pra área de transferência
dataframe:
	@node scrapper.js > dataframe.csv
	@echo '> O dataframe está em dataframe.csv:'
	@echo
	@cat dataframe.csv

plot:
	Rscript plotter.R

deploy_heroku:
	git subtree push --prefix server heroku master

force_deploy_heroku:
	git subtree split --prefix server -b gh-pages
	git push -f origin gh-pages:master
	git branch -D gh-pages

