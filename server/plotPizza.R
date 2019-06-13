args = commandArgs(trailingOnly=TRUE)
input_file = args[1]
output_file = args[2]

df = read.csv(file(input_file), header=TRUE, sep=",", check.names=FALSE)
png(output_file, width = 1000, height = 1000, units = 'px', res=200)

a <- sum(df$QUANT_A)
b <- sum(df$QUANT_B)
c <- sum(df$QUANT_C)
d <- sum(df$QUANT_D)
ff <- sum(df$QUANT_FF)

grades <- c(a, b, c, d, ff)
lbls <- c("A", "B", "C", "D", "FF")

pct <- round(grades/sum(grades)*100)

lbls <- paste(lbls, "-")
lbls <- paste(lbls, pct)
lbls <- paste(lbls,"%",sep="")

par(mai=c(0.1, 0.1, 0.5, 0.1))

pie(grades, labels=lbls, main="Porcentagem de conceitos", col=rainbow(length(lbls)))
