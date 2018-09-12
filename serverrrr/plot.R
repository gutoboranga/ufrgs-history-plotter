df = read.csv(file('dataframe.csv'), header=TRUE, sep=",", check.names=FALSE)
png("graph.png", width = 1500, height = 600, units = 'px', res=200)

semesters <- df[['SEMESTRE']]
a <- df[['QUANT_A']]
b <- df[['QUANT_B']]
c <- df[['QUANT_C']]
d <- df[['QUANT_D']]
ff <- df[['QUANT_FF']]
undefined <- df[['QUANT_UNDEFINED']]


# grades <- lapply(tail(colnames(df)), function(column) {
#   df[column]
# })
# grades <- unlist(grades, recursive=FALSE)

grades <- c(a,b,c,d,ff,undefined)

type <- c(rep("A", length(semesters)),
          rep("B", length(semesters)),
          rep("C", length(semesters)),
          rep("D", length(semesters)),
          rep("FF", length(semesters)),
          rep("Não terminado", length(semesters)))

semesters <- rep(semesters, length(df) - 1)
mydata <- data.frame(semesters, grades)

library(ggplot2)

ggplot(mydata, aes(semesters, grades)) +
  ggtitle("Histórico de Curso") +
  xlab("Semestre") + ylab("Quantidade") +

  geom_bar(stat = "identity", aes(fill = type), position = "dodge")  +
  
  scale_y_continuous() +
  
  theme_bw() +
  theme(plot.title = element_text(lineheight=.8, face="bold", hjust=0.5)) +
  theme(axis.title.x = element_text(margin = margin(t=15, r=0, b=0, l=0))) +
  theme(axis.title.y = element_text(margin = margin(t=0, r=15, b=0, l=0)))
  